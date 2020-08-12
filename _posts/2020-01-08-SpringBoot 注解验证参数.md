SpringBoot 注解验证参数
=================

废话不多说，直接上表格说明：

<table border="0"><tbody><tr><td>注解</td><td>作用类型</td><td>解释</td></tr><tr><td>@NotNull</td><td>任何类型</td><td>属性不能为 null</td></tr><tr><td>@NotEmpty</td><td>集合</td><td>集合不能为 null，且 size 大于 0</td></tr><tr><td>@NotBlanck</td><td>字符串、字符</td><td>字符类不能为 null，且去掉空格之后长度大于 0</td></tr><tr align="center" valign="middle"><td>@AssertTrue</td><td align="center" valign="middle">Boolean、boolean</td><td>布尔属性必须是 true</td></tr><tr align="center" valign="middle"><td>@Min</td><td align="center" valign="middle">数字类型（原子和包装）</td><td>限定数字的最小值（整型）</td></tr><tr align="center" valign="middle"><td>@Max</td><td align="center" valign="middle">同 @Min</td><td>限定数字的最大值（整型）</td></tr><tr align="center" valign="middle"><td>@DecimalMin</td><td align="center" valign="middle">同 @Min</td><td>限定数字的最小值（字符串，可以是小数）</td></tr><tr align="center" valign="middle"><td>@DecimalMax</td><td align="center" valign="middle">同 @Min</td><td>限定数字的最大值（字符串，可以是小数）</td></tr><tr align="center" valign="middle"><td>@Range</td><td align="center" valign="middle">数字类型（原子和包装）</td><td>限定数字范围（长整型）</td></tr><tr align="center" valign="middle"><td>@Length</td><td align="center" valign="middle">字符串</td><td>限定字符串长度</td></tr><tr align="center" valign="middle"><td>@Size</td><td align="center" valign="middle">集合</td><td>限定集合大小</td></tr><tr align="center" valign="middle"><td>@Past</td><td align="center" valign="middle">时间、日期</td><td>必须是一个过去的时间或日期</td></tr><tr align="center" valign="middle"><td>@Future</td><td align="center" valign="middle">时期、时间</td><td>必须是一个未来的时间或日期</td></tr><tr align="center" valign="middle"><td>@Email</td><td align="center" valign="middle">字符串</td><td>必须是一个邮箱格式</td></tr><tr align="center" valign="middle"><td>@Pattern</td><td align="center" valign="middle">字符串、字符</td><td>正则匹配字符串</td></tr></tbody></table>
以上注解用到要验证参数的封装类中的属性上：

```
public class Test {

    @NotNull(message = "ID不能为空")
    @Range(min = 1, max = 100, message = "ID必须在1到100之间")
    private Integer id;

    @NotBlank(message = "姓名不能为空")
    @Length(min = 2, max = 6, message = "姓名必须在2到6位之间")
    private String name;

    @NotNull(message = "余额不能为空")
    @DecimalMax(value = "30.50", message = "余额不能超过30.5")
    @DecimalMin(value = "1.50", message = "余额不能低于1.5")
    private BigDecimal amount;

    @NotNull(message = "生日不能为空")
    @Past(message = "生日必须是过去")
    private Date birthday;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\\d{8})$", message = "手机号格式错误")
    private String phone;

}

```

然后在 controller 的每个接口中使用 @Validated 和 BindingResult 类

@Validated 注解用于验证一个入参，验证之后的消息绑定到 BindingResult 类中：

```
    @PostMapping("/test")
    @ApiOperation(value = "测试", notes = "", response = Result.class)
    public Result test(@ApiParam(name = "test", value = "参数", required = true) @Validated @RequestBody Test test, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            String errorMsg = bindingResult.getFieldError().getDefaultMessage();
            return Result.error(errorMsg);
        }
        return Result.ok("参数验证通过");
    }

```

这样使用注解来验证参数就很方便了，不用再写代码去验证入参了

但是有一个问题，@Pattern 注解中的正则只能写死到注解里面，没法提取出来，现在还不知道怎么解决

希望知道解决方法的大佬评论解答一下 O(∩_∩)O

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 https://www.cnblogs.com/javafucker/p/9935095.html