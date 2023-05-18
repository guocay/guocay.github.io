---
title: 'Spring框架refresh()执行流程'
icon: note
isOriginal: true
date: 2023-04-26
tag:
  - Spring
  - 开发笔记
category: "Java"
---

![Spring框架refresh函数执行流程](/docs/images/20230426-002.png)

## prepareRefresh(): 准备刷新

> * 设置启动时间
> * 容器关闭标示符设置为false
> * 容器可用标示符设置为true
> * initPropertySources(): 钩子函数, 初始化属性资源,
> * getEnvironment().validateRequiredProperties(): 验证必要属性必须存在.
> * 清空已有的监听器(如果有的话),并重新从applicationListeners属性中加载

## obtainFreshBeanFactory(): 获取Bean工厂

### 如果上下文中已经存在Bean工厂,将先销毁.

### createBeanFactory(): 创建Bean工厂,使用DefaultListableBeanFactory对象;

### customizeBeanFactory(): 自定义设置Bean工厂

> * 是否允许Bean定义覆盖
> * 是否允许循环引用

### loadBeanDefinitions(): 加载Bean定义信息

> * 创建BeanDefinitionReader
> * 配置BeanDefinitionReader,关联上下文
> * initBeanDefinitionReader(): 初始化这个Reader对象
> * loadBeanDefinitions(): 加载Bean定义信息

## prepareBeanFactory(): 准备Bean工厂

### 设置Bean工厂的类加载器

### 如果不忽略SpEL表达式,则设置StandardBeanExpressionResolver对象用于解析SpEL表达式;

### 设置属性编辑注册器

### 添加一个用于Aware感知的PostProcessor

### 忽略一部分Aware的实现类, 因为这个时候还无法感知这部分动作

> * EnvironmentAware
> * EmbeddedValueResolverAware
> * ResourceLoaderAware
> * ApplicationEventPublisherAware
> * MessageSourceAware
> * ApplicationContextAware
> * ApplicationStartupAware

### 注册一批 可解析依赖项

> * BeanFactory
> * ResourceLoader
> * ApplicationEventPublisher
> * ApplicationContext

### 注册一个用于监听探测的PostProcessor类.

### 设置 LoadTimeWeaver

### 注册一批环境变量

> * ENVIRONMENT_BEAN_NAME
> * SYSTEM_PROPERTIES_BEAN_NAME
> * SYSTEM_ENVIRONMENT_BEAN_NAME
> * APPLICATION_STARTUP_BEAN_NAME

## postProcessBeanFactory(): 钩子函数.通知子容器BeanFactory准备好了

## invokeBeanFactoryPostProcessors(): 执行Bean工厂后置处理器

> * 添加LoadTimeWeaverAwareProcessor
> * 添加临时类加载器 ContextTypeMatchClassLoader

## registerBeanPostProcessors(): 注册Bean的后置处理器

> * 添加BeanPostProcessor处理器, 通过BeanPostProcessorChecker
> * 注册支持优先排序的后置处理器
> * 注册不支持排序的后置处理器(所有的)
> * 注册内部后置处理器
> * 添加(处理)内部的监听类型的后置处理器

## initMessageSource(): 初始化消息源

> 判断当前Bean工厂中是否存在 MESSAGE_SOURCE_BEAN_NAME 对象,如不存在则创建
> DelegatingMessageSource对象,并注册进容器.如存在则使用工厂中的消息源对象.

## initApplicationEventMulticaster(): 初始化事件传播器

> 判断当前Bean工厂中是否存在 APPLICATION_EVENT_MULTICASTER_BEAN_NAME 对象,如存在则使用,不存在则创建一个
> SimpleApplicationEventMulticaster 对象,并放入工厂

## onRefresh(): 钩子函数,支持子类对刷新的扩展

## registerListeners(): 注册监听

> * 将静态指定的事件监听器逐一添加到事件传播器中.
> * 将动态指定的事件监听器加入时间传播器中.
> * 发布应用早期事件, 这时应用的事件传播器已经就绪...

## finishBeanFactoryInitialization(): 结束BeanFactory初始化,并初始化一些特殊Bean对象.比如非懒加载的Bean.

### 初始化上下文转换服务.

### 如果没有指定 标签解析器, 就使用环境中的默认转换器进行转换 getEnvironment().resolvePlaceholders(strVal).

### 尽早初始化 LoadTimeWeaverAware bean，以便尽早注册其变压器。

### 设置临时类加载器为null, 停止使用临时类加载器.

### freezeConfiguration(): 冻结所有bean定义信息.

> * 设置 冻结 标示符 为true
> * 为 frozenBeanDefinitionNames 赋值

### preInstantiateSingletons(): 初始化非懒加载的bean

#### 重新包装 beanDefinitionNames 属性为一个ArrayList

#### 循环上一步包装的集合, 根据beanName创建bean

##### getMergedLocalBeanDefinition(): 根据beanName获取本地bean定义信息缓存.

##### 判断获取的BeanDefinition所代表的bean 非抽象类, 是单例, 非懒加载

##### 判断是否为FactoryBean的子类

###### 是则

> * 调用getBean() 获取这个工厂bean的实例, 获取时需要添加前缀 FACTORY_BEAN_PREFIX
> * 判断 上一步获取到的对象是否为FactoryBean的子类实例
> * 判断是否为SmartFactroyBean的子类实例
> * 获取当前FactoryBean是否希望初始化(isEagerInit());
> * 是则, 再次通过getBean加载此对象(本次不再添加前缀)

###### 非则, 调用 getBean() 创建bean实例

> * transformedBeanName(): 规范化beanName
> * getSingleton():  在单例池中获取当前对象

#### 循环上上一步创建的集合, 根据beanName获取已经创建好的bean, 并判断bean是否为 SmartInitializingSingleton的子类实例, 是则运行bean的afterSingletonsInstantiated函数.

## finishRefresh(): 结束刷新, 并发布结束刷新事件.

### clearResourceCaches(): 清空资源缓存

> 清空 DefaultResourceLoader 中的 resourceCaches 对象

### initLifecycleProcessor(): 初始化生命周期管理

> 判断Bean工厂中是否存在 LIFECYCLE_PROCESSOR_BEAN_NAME 对象, 不存在则创建一个 DefaultLifecycleProcessor对象;

### getLifecycleProcessor().onRefresh(): 刷新生命周期管理器

> * startBeans(): 启动bean的生命周期
> * 将 running 标识符设置为 true

### 发布上下文刷新事件

> 通过上下文的 publish函数 发布 ContextRefreshedEvent 对象

### 参与 LiveBeansView MBean（如果处于活动状态）
