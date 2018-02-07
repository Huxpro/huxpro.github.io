---
layout:     post
title:      "JAVA Validation"
subtitle:   " \"Java Validation入门\""
date:       2018-02-06 05:22:00
author:     "WQ"
header-img: "img/blogImg/2018-02-06-2.jpg"
catalog: true
tags:
    - Java
---

# Java Validation

刚接触`JSR bean validation`规范，这里做一个简单的入门。

```
As of now Spring Boot by default comes with  Bean Validation 1.0 (JSR-303) and Bean Validation 1.1 (JSR-349)

Java Bean Validation (JSR 303) is a framework that has been approved by the JCP as of Nov 2009 and is accepted as part of the Java EE 6 specification.
Bean Validation 1.1 (JSR 349) was finished in 2013.It is part of Java EE 7.
Hibernate Validator 6.X on the other hand is the reference implementation Bean Validation 2.0 (JSR 380).

Support for the JSR 310 date/time types for @Pastand@Future

New built-in constraints:@Positive, @PositiveOrZero, @Negative, @NegativeOrZero, @PastOrPresent and @FutureOrPresent

Bean Validation 2.0 will also be part of the Java EE 8 platform.

```

该规范用于对bean对象进行参数校验，使用注解的方式进行规则设计，该规范可以参考`javax.validation.validation-api`,该jar中基本没有什么实现，`Hibernate Validator`是该规范的实现，使用的SPI进行动态拓展，具有很高的灵活性，
同时拓展了一些规范的注解。
在springMVC中也有很多运用。

## 例子

准备工作：

```java
@Data
@AllArgsConstructor
public class User {
    @NotNull(message = "用户的姓名不能为空")
    private String name;

    @NotNull(message = "年龄不能为空")
    @Min(value = 2, message = "年龄必须在2到14岁之间",groups = {GroupTest1.class})
    @Max(value = 14, message = "年龄必须在2到14岁之间",groups = {GroupTest1.class})
    private Integer age;

    @Valid
    @LocationValidation(message = "location 不ok", maxX = 12, maxY = 22,groups = {GroupTest2.class})
    private Location location;
}

@Data
@AllArgsConstructor
class Location {
    private int x;
    private int y;
}


/**
 * 校验的注解，Target的值都是可以的，不仅限于属性
 */
@Target({ElementType.FIELD})
@Constraint(validatedBy = {Temp.class})
@Documented
@Retention(RetentionPolicy.RUNTIME)
@interface LocationValidation {

    // 这3个属性是必须的，规范要求
    // 约束注解验证时的输出消息
    String message() default "";

    // 约束注解在验证时所属的组别
    Class<?>[] groups() default {};

    // 约束注解的有效负载
    Class<? extends Payload>[] payload() default {};

    int maxX() ;
    int maxY() ;

}

/**
 * 标记性接口，单纯的在分组时使用
 */
interface GroupTest1 {
}

interface GroupTest2 {
}


/**
 * 自己定义一些方法添加额外的拓展空间,这样在注解中传入参数，在验证时使用，代码中没有演示
 */
class MyRule implements Payload {

    public boolean isOk(){
        return true;
    }

}

```

```java
/**
 * 实际进行校验的类,必须是public方法
 */
public class Temp implements ConstraintValidator<LocationValidation, Location> {

    private LocationValidation locationValidation;
    @Override
    public void initialize(LocationValidation constraintAnnotation) {
        this.locationValidation = constraintAnnotation;
    }

    @Override
    public boolean isValid(Location value, ConstraintValidatorContext context) {

        if (value == null) {
            System.err.println("Default value :" + context.getDefaultConstraintMessageTemplate());

            //禁用默认的提示信息
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(locationValidation.message()).addConstraintViolation();
            return false;
        } else {
            //禁用默认的提示信息，不清楚原有的是什么样的，可以去掉看看结果
            context.disableDefaultConstraintViolation();
            if (value.getX() > locationValidation.maxX()) {
                context.buildConstraintViolationWithTemplate("x value is bigger than max"+locationValidation.message())
                        .addConstraintViolation();
                return false;
            }

            if (value.getY() > locationValidation.maxY()) {
                context.buildConstraintViolationWithTemplate("y value is bigger than max"+locationValidation.message
                        ()).addConstraintViolation();
                return false;
            }

        }
        return true;
    }
}

```

测试：

```java
public class Main {

    public static void main(String[] args) {
        ValidatorFactory validator = Validation.buildDefaultValidatorFactory();
        Validator vs = validator.getValidator();

        User user = new User(null, 44, new Location(33, 44));

        //groups分为三个组，其中一个为default
        //只会校验name
        go(Default.class, vs, user);

        //校验 age
        go(GroupTest1.class, vs, user);

        //校验Location
        go(GroupTest2.class, vs, user);
    }

    private static void go(Class c,Validator vs,User user) {
        Set<ConstraintViolation<User>> validate = vs.validate(user, c);
        if (validate.size() != 0) {
            validate.forEach(System.out::println);
        }
        System.out.println("-------------------------------------------");
    }
}

```

还有一些高级的使用方法，参考 [Bean Validation 技术规范特性概述](http://beanvalidation.org)。另外，在spring-boot中已经集成了hibernate-validation。