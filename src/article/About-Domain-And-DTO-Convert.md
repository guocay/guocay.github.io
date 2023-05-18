---
title: '关于domain对象与DTO对象间的相互拷贝的思考与优化思路'
icon: note
isOriginal: true
date: 2021-10-27 13:51:07
tag:
  - Mekatok
  - 开发笔记
category: "Mekatok"
---

## 问题描述

> 我们后端在开发的过程中总是在domain(数据库映射对象)和dto(数据传输对象)之间进行数据互转.以匹配对象在各生命周期的运行.

> 在实际的开发中,我们发现大多数的domain对象和dto对象内的字段完全一致.创建两个内容完全一样的类.从大部分情况下考虑都显得多余.

> 代码中经常出现大量的代码如下
>
> ```java
> dto.setAttr(domain.getAttr());
> ...
> ```
>
> 冗长,且不优雅.

## 问题思考

1.
市面上有很多用于Bean对象之间拷贝的工具类如Apache和SpringFramework的BeanUtils,他的实现机制时通过运行时反射将同名属性之间进行拷贝,且这些工具最大的问题还在于为了适配更多的情况做了很多的其他工作.这对于我们只是需要简单的值拷贝不太友善;
2. MapStruct是一个通过定义转换接口,并基于JSR269在编译期实现对象互转的工具.但这种工具的弊端在于仅能实现一对一的转换(
   单向,一个接口仅能实现一个特定类转换到另一个特定类).
3. 我们现在的需求是,可以运行时动态的一对多转换,可以一个属性对多个属性(不同名)转换和可以不再写更多的相同类;

## 编码逻辑

1. 我们抽象出一个"拆装箱"的概念,domain是一个拆箱后的对象(可以理解为拆箱后存入数据库),dto是一个装箱后对象(
   可以理解为装箱后运走).
2. 在现实生活中很多货物是可以从仓库中拿出直接用于运输的.所以,当装箱后的对象和拆箱后的对象本质上是一个对象,拆箱后的对象也就是一个装箱后的对象;
3. 基于此,我们可以抽象出对象的集成关系:domain对象继承DTO对象;
4. 在对象间数据拷贝方面,我们可以通过自定义注解指定对象间互转的逻辑.并在对应对象的父类中定义函数在运行时动态的反射拷贝值;

## 实现方案

domain与DTO之间的关系; View 继承 Transport

```java
/**
 * DTO对象
 *
 * 数据传输对象基类
 * @author GuoKai
 * @date 2021/9/28
 */
public interface Transport extends Model {
    /**
     * 用于数据传输对象的拆箱
     * @param <T> 拆箱后的类型
     * @return 拆箱后的对象
     */
    default <T extends View> T unBoxing(Class<T> clazz){
        T view = ReflectUtil.newInstance(clazz);
        // todo 循环获取当前类的字段
        Arrays.stream(ReflectUtil.getFields(getClass())).parallel()
                // todo 过滤出需要拆箱的字段
                .filter(field -> AnnotationUtil.hasAnnotation(field,Unboxing.class))
                .forEach(field -> {
                    // todo 获取字段中所有 Unboxing 描述信息
                    Arrays.stream(field.getAnnotationsByType(Unboxing.class)).parallel()
                            // todo 过滤出需要转换的类
                            .filter(anno -> clazz.isAssignableFrom(anno.clazz()))
                            .forEach(anno -> {
                                var viewField = ReflectUtil.getField(clazz, anno.field());
                                // todo 设置字段反射,绕过权限校验
                                field.setAccessible(true);
                                viewField.setAccessible(true);
                                // todo 设置值
                                ReflectUtil.setFieldValue(view, viewField, ReflectUtil.getFieldValue(this, field));
                            });
                });
        return view;
    }
}
```

```java
/**
 * domain对象
 *
 * 上帝的归上帝,凯撒的归凯撒
 * 抽象出这个类是为了映射视图,从而尽可能的不在项目中书写SQL.
 * @author GuoKai
 * @date 2021/8/19
 */
@SuppressWarnings("all")
public abstract class View<T extends View> implements Transport {
    /**
     * 用于数据库对象装箱
     * @param clazz 装箱的类描述
     * @param <F> 装箱的类型
     * @return 装箱后的对象
     */
    public <F extends Transport> F boxing(Class<F> clazz){
        F tran = ReflectUtil.newInstance(clazz);
        // todo 循环获取当前类的字段
        Arrays.stream(ReflectUtil.getFields(getClass())).parallel()
                // todo 过滤出需要拆箱的字段
                .filter(field -> AnnotationUtil.hasAnnotation(field, Boxing.class))
                .forEach(field -> {
                    // todo 获取字段中所有 Boxing 描述信息
                    Arrays.stream(field.getAnnotationsByType(Boxing.class)).parallel()
                            // todo 过滤出需要转换的类
                            .filter(anno -> clazz.isAssignableFrom(anno.clazz()))
                            .forEach(anno -> {
                                var tranField = ReflectUtil.getField(clazz, anno.field());
                                // todo 设置字段反射,绕过权限校验
                                field.setAccessible(true);
                                tranField.setAccessible(true);
                                // todo 设置值
                                ReflectUtil.setFieldValue(tran, tranField, ReflectUtil.getFieldValue(this, field));
                            });
                });
        return tran;
    }

}
```

自定义注解,设置属性间关系

```java
/**
 * 数据库实体对象装箱时的属性指定
 * @author GuoKai
 * @date 2021/9/28
 */
@Documented
@Target(ElementType.FIELD)
@Repeatable(Boxing.List.class)
@Retention(RetentionPolicy.RUNTIME)
@SuppressWarnings("all")
public @interface Boxing {

    /**
     * 用于指定装箱的数据传输类
     * @return 装箱的类
     */
    Class<? extends Transport> clazz();

    /**
     * 用于指定类中的字段
     * @return 类中的字段名
     */
    String field();

    @Documented
    @Target(ElementType.FIELD)
    @Retention(RetentionPolicy.RUNTIME)
    @interface List{
        Boxing[] value();
    }
}
```

```java
/**
 * 数据传输对象拆箱时的属性指定
 * @author GuoKai
 * @date 2021/9/28
 */
@Documented
@Target(ElementType.FIELD)
@Repeatable(Unboxing.List.class)
@Retention(RetentionPolicy.RUNTIME)
@SuppressWarnings("all")
public @interface Unboxing {

    /**
     * 用于指定装箱的数据传输类
     * @return 装箱的类
     */
    Class<? extends View> clazz();

    /**
     * 用于指定类中的字段
     * @return 类中的字段名
     */
    String field();

    @Documented
    @Target(ElementType.FIELD)
    @Retention(RetentionPolicy.RUNTIME)
    @interface List{
        Unboxing[] value();
    }
}
```

使用例子

```java
// domain对象
public class Table extends View<Table>{

    @Boxing(clazz=TableDto.class,field="nameDto")
    @Boxing(clazz=TableDto1.class,field="nameDto1")
    private String name;
}

// DTO对象1
public class TableDto implements Transport{

    @Unboxing(clazz=Table.class,field="name")
    private String nameDto;
}

// DTO对象2
public class TableDto1 implements Transport{

    @Unboxing(clazz=Table.class,field="name")
    private String nameDto1;
}

// 拆箱
Table table = TableDto().unBoxing(Table.class);
Table table1 = TableDto1().unBoxing(Table.class);

// 装箱
TableDto tableDto = Table().boxing(TableDto.class);
TableDto1 tableDto1 = Table().boxing(TableDto1.class);

```

## PS

1. boxing函数和unboxing函数在转换时,可以基于"享元模式"做一些缓存以优化性能;
