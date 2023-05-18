---
title: 'Spring及SpringBoot开发扩展点'
icon: note
isOriginal: true
date: 2023-04-26
tag:
    - Spring
    - Spring Boot
    - 开发笔记
category: "Java"
---

![Spring及SpringBoot开发扩展点](/docs/images/20230426-001.png)

## ResourceLoader

> 资源加载器

## BeanDefinitionReader

> Bean定义信息读取者

## ClassPathBeanDefinitionScanner

> 用于扫描bean的定义信息

## ApplicationContextInitializer

> 用于在Context初始化前对其进行更改

## BeanFactoryPostProcessor

> 用于对BeanFactory进行修改

## BeanDefinitionRegisterPostProcessor

> 用于在Bean实例化之前,对BeanDefinition进行更改

## Aware

> 用于感知Spring中关于容器,对象等组件的行为或属性感知

## BeanPostProcessor

> 用于在bean初始化后修改bean的行为

## InstantiationAwareBeanPostProcessor

> BeanPostProcessor的一个子类,扩展了一些更细粒度的对象生命周期回调

## DisposableBean

> 扩展对象销毁时的行为

## InitializingBean

> 扩展对象初始化时的行为

## ApplicationListener

> 用于监听Spring容器启动和使用过程中产生的事件的监听

## ApplicationRunner(Spring Boot)

> Spring 应用启动后回调, 抛出错误会影响应用启动

## SpringApplicationRunListener(Spring Boot)

> Spring Application 启动上下文(非ApplicationContext上下文)

## EnvironmentPostProcessor(Spring Boot)

> 用于对环境变量初始化的后置处理器
