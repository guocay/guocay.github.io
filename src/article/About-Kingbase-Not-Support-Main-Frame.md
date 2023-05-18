---
title: '关于金仓数据库不被主流框架(如Activiti,Flowable)支持的思考与解决方案'
icon: note
isOriginal: true
date: 2021-10-27 13:41:42
tag:
  - Mekatok
  - 开发笔记
category: "Mekatok"
---

## 问题描述

> 去年底的时候,我们的项目中需要使用工作流实现业务.经过一些讨论,最终决定使用开源引擎Activiti进行集成.在现阶段大环境下,项目要求需要使用自主可控的国产数据库--KingBase.

>
用过Activiti,Flowable的同学应该都知道,这类工具是强依赖数据库的.特别是在项目启动的过程中就会创建一批数据表用于存储BMPN模型,工作流实例和历史数据等.这就导致在项目代码启动连接数据库的时候,就会报错显示 "
不支持KingBaseES的数据库".

## 问题思考

1. 通过查看Flowable的文档和源码,我们了解到这类工具在启动时会利用工具 LiquiBase 对数据库的数据表进行初始化(
   LiquiBase是一个方言无关的数据库版本管理工具).而LiquiBase在运行时会获取数据库产品类型后动态根据资源中的数据表定义生成符合当前数据库方言的建表语句.后运行初始化表;
2.
从网上公开的知识可以了解到,金仓的数据库KingBase是根据开源数据库PostgreSQL魔改而来,然后通过汇总得知,在KingBase对于pgSQL的差异中包括(
但不限于) 命令名,系统表和视图,函数的语法等等.从后端程序员的使用角度出发,能与我们产生兼容性联系的基本都在系统表和视图这部分的差异弥补;
3. 通过对JDBC标准的了解.我们得知每一个实现了JDBC标准的Driver都需要返回客户端一个字符串以表明自己的数据库名称(类型)
   .所以,如果我们在KingBase的数据库驱动中将产品类型从"KingBaseES"换为"postgresql".理论上就能骗过工具;

## 编码逻辑

1. 通过对现状的评估,得益于KingBase的魔改对于pgSQL的实现并不是破坏性的.我们觉得最小成本的修改应该是这样的,在关键节点中欺骗Activiti.让其始终认为自己连接的是pgSQL.而不是KingBase;
2. KingBase数据库对于pgSQL还修改了所有的系统表和视图,但也仅是修改了前缀(比如pg_tables修改成sys_tables)
   .而在一些开源框架中也会调用这些系统表来实现逻辑.基于此,我们觉得可以手动创建一批视图pg_tables去映射sys_tables;

## 实现方案

1. 反编译kingbase数据库连接驱动kingbase8-8.x.x.jar;找到实现了java.sql.DatabaseMetaData接口的类;

```java
// KingBase中实现了DatabaseMetaData的类在com.kingbase8.jdbc.KbDatabaseMetaData类中
// 找到如下的函数 将返回的 "KingbaseES" 修改为 "postgresql"
 public String getDatabaseProductName() throws SQLException {
     // return "KingbaseES";
     return "postgresql";
  }
```

2. 将修改过的KbDatabaseMetaData.class编译后重新打包入驱动中;
3. 手动到数据库创建视图 pg_tables(如有需要也可创建别的,这里仅作演示目的.);

```sql
create view pg_tables as select * from sys_tables;
```

## 其他方案

1. 依赖于java中的类加载器AppClassLoader中关于加载资源时定义的是个数组,且指向src目录的资源永远在下标零处.所以,只要在src中定义的类永远优先于其他地方的类加载;
2. 打开你需要集成的工具框架,找到用于解析数据库类型进行后续操作的类.在src下创建同名同路径的java文件;
3. 复制反编译后类中所有的代码至src目录下的文件后,增加对应的配置以在解析到"KingbaseES"进行自定义操作;

## PS

1. LiquiBase是一个方言无关的数据库版本管理工具,真心好用!!!
   会根据定义好的xml内容对数据库的初始化,数据表版本进行管理,Mekatok即是使用LiquiBase对数据库进行管理.再不需要在项目初次启动时先运行数据库建表脚本,也不需要再针对数据库加字段什么的汇总脚本各个环境先同步数据库.
