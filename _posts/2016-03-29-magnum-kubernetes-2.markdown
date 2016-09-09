---
layout:     post
title:      "Magnum Kuernetes源码分析(二)"
subtitle:   "Magnum Kuernetes Analysis, Part Two"
date:       2016-03-29 12:00:00
author:     "XuXinkun"
header-img: "img/post-bg-magnum-kubernetes-2.jpg"
tags:
    - openstack
    - magnum
    - kubernetes
---

# Kubernetes Master Stack

[kubernetes master的stack](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubemaster.yaml)的resources主要分为三个部分。

## master wait handle

wait handle主要用于在server全部执行完后，在heat进行回调，主要用以确保master server已经完成初始化，且网络已经通。heat会生成一个url等待master server的[master_wc_notify](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubemaster.yaml#L300)脚本去执行，或者说是回调。master_wc_notify会在server全部执行完毕后，再进行执行。

    master_wait_handle:
      type: OS::Heat::WaitConditionHandle
    
    master_wait_condition:
      type: OS::Heat::WaitCondition
      depends_on: kube_master
      properties:
        handle: {get_resource: master_wait_handle}
        timeout: {get_param: wait_condition_timeout}

## master server及其配置

    kube_master_init:             //包含了master初始化的各种脚本和配置等
      type: OS::Heat::MultipartMime
      properties:
        parts:
          - config: {get_resource: disable_selinux}
          - config: {get_resource: write_heat_params}
          - config: {get_resource: configure_etcd}
          - config: {get_resource: kube_user}
          - config: {get_resource: write_kube_os_config}
          - config: {get_resource: make_cert}
          - config: {get_resource: configure_docker_storage}
          - config: {get_resource: configure_kubernetes}
          - config: {get_resource: add_proxy}
          - config: {get_resource: enable_services}
          - config: {get_resource: write_network_config}
          - config: {get_resource: network_config_service}
          - config: {get_resource: network_service}
          - config: {get_resource: kube_system_namespace_service}
          - config: {get_resource: enable_kube_podmaster}
          - config: {get_resource: enable_kube_proxy}
          - config: {get_resource: kube_ui_service}
          - config: {get_resource: kube_examples}
          - config: {get_resource: master_wc_notify}
    
    kube_master:                  //待创建的master的KVM虚拟机
      type: OS::Nova::Server
      properties:
        image: {get_param: server_image}
        flavor: {get_param: master_flavor}
        key_name: {get_param: ssh_key_name}
        user_data_format: RAW
        user_data: {get_resource: kube_master_init}
        networks:
          - port: {get_resource: kube_master_eth0}

kube_master_init是一个完整的初始化master节点的脚本和文件。master server在启动的时候，通过cloud-init获取这些脚本和文件以便完成初始化。然后依序依次完成。

这些脚本大部分也可以使用ansible来完成。


## master server 网络配置

master server除了要为其分配内网网口外，还要为其设置floating IP以便从外网进行访问。

同时，由于master server中启动了etcd和kube-apiserver，因此需要将对应的服务端口加入到对应负载均衡的后端。

    kube_master_eth0:                     //master的内网网口
      type: OS::Neutron::Port
      properties:
        network: {get_param: fixed_network}
        security_groups:
          - {get_param: secgroup_base_id}
          - {get_param: secgroup_kube_master_id}
        fixed_ips:
          - subnet: {get_param: fixed_subnet}
        replacement_policy: AUTO
    
    kube_master_floating:                 //为master分配floatingIP
      type: OS::Neutron::FloatingIP
      properties:
        floating_network: {get_param: external_network}
        port_id: {get_resource: kube_master_eth0}
    
    api_pool_member:                      //将master添加到kube-api池中，作为其中的member
      type: OS::Neutron::PoolMember
      properties:
        pool_id: {get_param: api_pool_id}
        address: {get_attr: [kube_master_eth0, fixed_ips, 0, ip_address]}
        protocol_port: {get_param: kubernetes_port}
    
    etcd_pool_member:                     //将master添加到etcd池中，作为其中的membere
      type: OS::Neutron::PoolMember
      properties:
        pool_id: {get_param: etcd_pool_id}
        address: {get_attr: [kube_master_eth0, fixed_ips, 0, ip_address]}
        protocol_port: 2379
          
> 每个master都要消耗一个floatingIP，这种使用方式还是比较浪费的。
    
## master server存储配置
    
因为镜像本身的容量较小，根据配置，可以给master配置外挂的存储。
    
    docker_volume:                        //创建存储
      type: OS::Cinder::Volume
      properties:
        size: {get_param: docker_volume_size}
    
    docker_volume_attach:                 //挂载存储到指定挂载点
      type: OS::Cinder::VolumeAttachment
      properties:
        instance_uuid: {get_resource: kube_master}
        volume_id: {get_resource: docker_volume}
        mountpoint: /dev/vdb
        
# Kubernetes Minion Stack

[minion的stack](https://github.com/openstack/magnum/blob/stable/mitaka/magnum/templates/kubernetes/kubeminion.yaml)跟master大同小异。这里就不再一一分析了。