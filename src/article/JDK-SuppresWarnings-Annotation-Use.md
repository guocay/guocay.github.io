---
title: Java 中 @SuppressWarnings 注解用法详解
icon: note
isOriginal: true
date: 2023-05-20
tag:
  - JDK
category: "Java"
---
::: tip 说明
J2SE5.0 提供了一个注解 @SuppressWarnings。该注解的作用是给编译器一条指令，告诉它对被批注的代码元素内部的某些警告保持静默。
@SuppressWarnings 批注允许您选择性地取消特定代码段（即类或方法）中的警告。
其中的想法是当您看到警告时，您将调查它，如果您确定它不是问题，您就可以添加一个 @SuppressWarnings 批注，以使您不会再看到警告。

::: warning 警告
@SuppressWarnings 就像一粒 **止疼片**, 本质上并未解决任何问题. 只是在编译期间通过抑制不抛警告而已.
:::



## 源码
```java
/**
 * 指示应在带注释的元素（以及带注释的元素中包含的所有程序元素）中抑制命名的编译器警告。
 * 请注意，给定元素中抑制的警告集是所有包含元素中抑制的警告的超集。
 * 例如，如果您注释一个类以抑制一个警告并注释一个方法以抑制另一个，则两个警告都将在该方法中被抑制。
 * 但是，请注意，如果在模块信息文件中抑制了警告，则抑制适用于文件中的元素，而不适用于模块中包含的类型。
 * 作为一种风格，程序员应该总是在它有效的最深嵌套元素上使用这个注解。 如果你想在特定方法中抑制警告，你应该注释那个方法而不是它的类。
 */
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, MODULE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    /**
	 * 编译器在带注释的元素中禁止显示的一组警告。 允许重复名称。 名称的第二次和连续出现将被忽略。
	 * 无法识别的警告名称的存在不是错误：编译器必须忽略它们无法识别的任何警告名称。
	 * 但是，如果注释包含无法识别的警告名称，它们可以自由发出警告。
	 * 字符串“unchecked”用于抑制未经检查的警告。
	 * 编译器供应商应记录他们支持的附加警告名称以及此注释类型。
	 * 鼓励他们合作以确保相同的名称在多个编译器中工作。
     */
    String[] value();
}
```

## 可选值

|           关键字            |                  用途                  |
|:------------------------:|:------------------------------------:|
|           all            |                抑制所有警告                |
|          boxing          |           抑制与装箱/拆箱操作相关的警告            |
|           cast           |             抑制与转换操作相关的警告             |
|         dep-ann          |             抑制与弃用注释相关的警告             |
|       deprecation        |              抑制与弃用相关的警告              |
|       fallthrough        |       抑制与 switch 语句中缺少中断相关的警告        |
|         finally          |        抑制相对于 finally 块不返回的警告         |
|          hiding          |          抑制与隐藏变量的局部变量相关的警告           |
|    incomplete-switch     |    抑制与 switch 语句中缺失条目相关的警告（枚举大小写）    |
|           nls            |         抑制与非 nls 字符串文字相关的警告          |
|           null           |             抑制与空分析相关的警告              |
|         rawtypes         |       在类参数上使用泛型时抑制与非特定类型相关的警告        |
|       restriction        |         抑制与使用不鼓励或禁止的引用有关的警告          |
|          serial          | 抑制与可序列化类的缺少 serialVersionUID 字段相关的警告 |
|      static-access       |           抑制与不正确的静态访问相关的警告           |
|     synthetic-access     |         抑制与来自内部类的未优化访问相关的警告          |
|        unchecked         |           抑制与未经检查的操作相关的警告            |
| unqualified-field-access |           抑制与不合格的字段访问相关的警告           |
|          unused          |            抑制与未使用代码相关的警告             |
