---
layout:     post
title:      "Magnum Kuernetes源码分析(一)"
subtitle:   "Magnum Kuernetes Analysis, Part One"
date:       2016-03-15 12:00:00
author:     "XuXinkun"
header-img: "img/post-bg-magnum-kubernetes.jpg"
tags:
    - openstack
    - magnum
    - kubernetes
---

# Magnum版本说明
 
本文以[magnum的mitaka版本](https://github.com/openstack/magnum/tree/stable/mitaka)代码为基础进行分析。

# Magnum Kubernetes

Magnum主要支持的概念有bay，baymodel，node，pod，rc，service。其中Magnum可以创建kubernetes的bay，即kubernetes的集群。本文主要介绍的就是magnum中kubernetes bay的创建过程。

# Kubernetes Bay创建流程

首先通过magnum-api发起创建bay的请求，api的入口函数在[这里](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/api/controllers/v1/bay.py#L281)。

    @expose.expose(Bay, body=Bay, status_code=201)
    def post(self, bay):
        """Create a new bay.
        :param bay: a bay within the request body.
        """
        ...
        res_bay = pecan.request.rpcapi.bay_create(new_bay,
                                                  bay.bay_create_timeout)

        # Set the HTTP Location Header
        pecan.response.location = link.build_url('bays', res_bay.uuid)
        return Bay.convert_with_links(res_bay)

接着通过rpc调用，将创建请求发送给magnum-conductor，从而调用了[bay_conductor的bay_create函数](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/conductor/handlers/bay_conductor.py#L137)进行处理。

    def bay_create(self, context, bay, bay_create_timeout):
        ...
        try:
            # Generate certificate and set the cert reference to bay
            cert_manager.generate_certificates_to_bay(bay)  //为bay创建秘钥
            created_stack = _create_stack(context, osc, bay,    //驱动heat，为bay创建对应的stack
                                          bay_create_timeout)
        ...

接着我们来分析创建[stack的过程](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/conductor/handlers/bay_conductor.py#L77)。

    def _create_stack(context, osc, bay, bay_create_timeout):
        template_path, heat_params = _extract_template_definition(context, bay) //获取模板文件的地址和参数
    
        tpl_files, template = template_utils.get_template_contents(template_path) //获取模板文件内容和其他需要的文件
        # Make sure no duplicate stack name
        stack_name = '%s-%s' % (bay.name, short_id.generate_id())          //生成stack name
        if bay_create_timeout:
            heat_timeout = bay_create_timeout
        elif bay_create_timeout == 0:
            heat_timeout = None
        else:
            # no bay_create_timeout value was passed in to the request
            # so falling back on configuration file value
            heat_timeout = cfg.CONF.bay_heat.bay_create_timeout
        fields = {
            'stack_name': stack_name,
            'parameters': heat_params,
            'template': template,
            'files': tpl_files,
            'timeout_mins': heat_timeout
        }                                                                   //拼成heat的参数
        created_stack = osc.heat().stacks.create(**fields)                  //驱动heat创建stack
    
        return created_stack

kubernets的模板文件是[kubecluster.yaml](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubecluster.yaml)。这是一个heat的模板文件。下文主要对这个文件进行分析。

至此，一个bay就可以完整创建出来了。

# kubernetes bay stack

[kubecluster.yaml](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubecluster.yaml)是一个标准的heat模板。heat模板的说明可以参看[Heat Orchestration Template (HOT) Guide](http://docs.openstack.org/developer/heat/template_guide/hot_guide.html)。

kubernetes中节点分为master和minion两个。

- master部署有etcd，kube-apiserver，kube-scheduler，kube-controllermanager。master主要负责对于集群的管理和kubernetes的数据存储。master支持多节点部署，通过LB实现etcd和kubernetes服务的高可用。master的数量在baymodel中定义。
- minion部署有kubelet，kube-proxy，flannel，docker-io。minion是实际创建容器的节点，也就是k8s中的minion。minion节点同样可以有多个。初始的数量在baymodel中定义。

从这个文件，可以看到创建一个kubernetes集群需要的[资源](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubecluster.yaml#L277)。下文对各个resource进行一一分析。

    resources:
      fixed_network:            //kubernetes集群的内网，所有创建出来的node，都会在该内网中
        type: OS::Neutron::Net
        properties:
          name: private
    
      fixed_subnet:             //kubernetes集群的内网子网，所有创建出来的node，都会分配该子网的ip地址
        type: OS::Neutron::Subnet
        properties:
          cidr: {get_param: fixed_network_cidr}
          network: {get_resource: fixed_network}
          dns_nameservers:
            - {get_param: dns_nameserver}
    
      extrouter:               //对外的外网路由
        type: OS::Neutron::Router
        properties:
          external_gateway_info:
            network: {get_param: external_network}
    
      extrouter_inside:        //内网路由，连接外网
        type: OS::Neutron::RouterInterface
        properties:
          router_id: {get_resource: extrouter}
          subnet: {get_resource: fixed_subnet}
    
      secgroup_base:            //基础安全组
        type: OS::Neutron::SecurityGroup
        properties:
          rules:
            - protocol: icmp
            - protocol: tcp
              port_range_min: 22
              port_range_max: 22
    
      secgroup_kube_master:     //供master使用的安全组
        type: OS::Neutron::SecurityGroup
        properties:
          rules:
            - protocol: tcp
              port_range_min: 7080
              port_range_max: 7080
            - protocol: tcp
              port_range_min: 8080
              port_range_max: 8080
            - protocol: tcp
              port_range_min: 2379
              port_range_max: 2379
            - protocol: tcp
              port_range_min: 2380
              port_range_max: 2380
            - protocol: tcp
              port_range_min: 6443
              port_range_max: 6443
            - protocol: tcp
              port_range_min: 30000
              port_range_max: 32767
    
      secgroup_kube_minion:     //供minion使用的安全组
        type: OS::Neutron::SecurityGroup
        properties:
          rules:
            - protocol: icmp
            - protocol: tcp
            - protocol: udp
    
      ######################################################################
      #
      # load balancers.
      #
    
      api_monitor:              //kube-api的负载均衡监控
        type: OS::Neutron::HealthMonitor
        properties:
          type: TCP
          delay: 5
          max_retries: 5
          timeout: 5
    
      api_pool:                 //kube-api的负载均衡池
        type: OS::Neutron::Pool
        properties:
          protocol: {get_param: loadbalancing_protocol}
          monitors: [{get_resource: api_monitor}]
          subnet: {get_resource: fixed_subnet}
          lb_method: ROUND_ROBIN
          vip:
            protocol_port: {get_param: kubernetes_port}
    
      api_pool_floating:        //kube-api的浮动ip
        type: OS::Neutron::FloatingIP
        depends_on:
          - extrouter_inside
        properties:
          floating_network: {get_param: external_network}
          port_id: {get_attr: [api_pool, vip, port_id]}
    
      etcd_monitor:             //etcd的负载均衡监控
        type: OS::Neutron::HealthMonitor
        properties:
          type: TCP
          delay: 5
          max_retries: 5
          timeout: 5
    
      etcd_pool:                //etcd的负载均衡池
        type: OS::Neutron::Pool
        properties:
          protocol: HTTP
          monitors: [{get_resource: etcd_monitor}]
          subnet: {get_resource: fixed_subnet}
          lb_method: ROUND_ROBIN
          vip:
            protocol_port: 2379
    
      ######################################################################
      #
      # kubernetes masters. This is a resource group that will create
      # <number_of_masters> masters.
      #
    
      kube_masters:             //master资源组
        type: OS::Heat::ResourceGroup
        depends_on:
          - extrouter_inside
        properties:
          count: {get_param: number_of_masters}     //创建的master数量
          resource_def:
            type: kubemaster.yaml   //创建master的模板
            properties:
                ...
                
      ######################################################################
      #
      # kubernetes minions. This is an resource group that will initially
      # create <number_of_minions> minions, and needs to be manually scaled.
      #
    
      kube_minions:             //minion资源组
        type: OS::Heat::ResourceGroup
        depends_on:
          - extrouter_inside
          - kube_masters
        properties:
          count: {get_param: number_of_minions}         //创建的minion数量
          removal_policies: [{resource_list: {get_param: minions_to_remove}}]
          resource_def:
            type: kubeminion.yaml           //创建minion的模板
            properties:
              ...
              
每个master也是一个stack，它不仅仅包含一个虚拟机，还包括其他一些资源。master的模板在[kubemaster.yaml](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubemaster.yaml)进行了定义。同样，minion的模板在[kubeminion.yaml](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubeminion.yaml)进行了定义。后面再对这些文件进行分析。