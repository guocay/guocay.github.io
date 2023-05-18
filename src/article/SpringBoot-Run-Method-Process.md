---
title: 'SpringBoot框架run()执行流程'
icon: note
isOriginal: true
date: 2023-04-26
tag:
  - Spring Boot
  - 开发笔记
category: "Java"
---

![SpringBoot框架run函数执行流程](/docs/images/20230426-003.png)

## 记录启动时间

## createBootstrapContext(): 创建启动上下文

> * 创建一个 DefaultBootstrapContext 对象
> * 执行所有注册的 BootstrapRegistryInitializer 对象

## configureHeadlessProperty(): 配置属性

> 系统变量 java.awt.headless 如果不存在,则设置成 headless 变量的值. 默认为 true

## getRunListeners(): 获取运行的监听器

> 创建一个SpringApplicationRunListeners对象, 获取spring.factories中定义的 SpringApplicationRunListener 对象

## 监听器 Starting事件

> 触发运行 SpringApplicationRunListener中定义的 spring.boot.application.starting 事件(starting函数)

## 包装启动参数为 DefaultApplicationArguments对象

## prepareEnvironment(): 准备环境

### getOrCreateEnvironment(): 获取或创建环境

> * 判断当前环境是否为空, 不为空则返回当前环境
> * 判断应用类型, Servlet类型则创建并返回 ApplicationServletEnvironment 实例
> * 判断应用类型, Reactive类型则创建并返回 ApplicationReactiveWebEnvironment实例
> * 判断应用类型, 其他则创建并返回 ApplicationEnvironment实例

### configureEnvironment(): 配置环境

#### 判断 addConversionService 属性, 为真则创建一个 ApplicationConversionService 并加入 env 对象

#### configurePropertySources(): 配置属性源

> * 判断 defaultProperties 属性是否为空集合,是则将当前环境中的属性源添加合并到 defaultProperties属性中
> * 判断是否存在 启动参数 和 判断 属性源中 是否存在 CommandLinePropertySource.COMMAND_LINE_PROPERTY_SOURCE_NAME 的属性
> * 上一步判断如果已经存在命令行属性,就创建一个 CompositePropertySource 实例,合并已有的参数和新加的参数后, 替换原有的属性值.
> * 上一步如果不存在, 就新建一个 SimpleCommandLinePropertySource 实例封装启动参数, 并添加当当前环境的属性源的第一个位置.

#### configureProfiles(): 钩子函数, 例如用于通过命令行激活配置文件

### ConfigurationPropertySources.attach(): 为环境添加附加源

> * 断言 env 对象 是否是 ConfigurableEnvironment 的子类实现.
> * 从 env 对象中获取 属性源, 从属性源中获取 configurationProperties 的值.
> * 如果上一步获取到的值为空,或 属性源不是可用的数据源. 就通过 SpringConfigurationPropertySources 创建一个
	ConfigurationPropertySourcesPropertySource 实例
> * 删除属性源中原来的值,并将新值加进去(添加到第一个位置).

### environmentPrepared(): 监听器 环境就绪事件

### DefaultPropertiesPropertySource.moveToEnd(): 移动默认属性

> * 在属性源中获取并删除 defaultProperties 的值;
> * 将上一步获取到的值添加到属性源的末尾;

### 断言 是否包含 spring.main.environment-prefix

### bindToSpringApplication(): 将环境绑定到SpringApplication

> 将 属性源 以 spring.main 为name, 绑定到 Binder上

### 如果不是自定义的环境, 就创建一个 EnvironmentConverter 对象 将环境转换为 environmentStandardEnvironment, 如果必要

> 根据 webApplicationType 属性将 env 对象转化为 ApplicationServletEnvironment, ApplicationReactiveWebEnvironment,
> ApplicationEnvironment之一.

### ConfigurationPropertySources.attach(): 再次为环境添加附加源

> 同上

## configureIgnoreBeanInfo(): 配置忽略的bean信息

> 如果环境变量中不存在 spring.beaninfo.ignore 就将其设置为true

## printBanner(): 准备 Banner 信息

> * 判断是否开启了 Banner打印, 关闭则直接返回.
> * 判断是否存在 ResourceLoader 属性, 没有则创建一个 DefaultResourceLoader 实例
> * 创建一个 SpringApplicationBannerPrinter 对象, 根据SpringApplication类中设置banner属性.
> * 判断日志对象是否存在, 存在则使用日志对象打印. 否则通过 System.out 属性打印.

## createApplicationContext(): 创建应用上下文

> 通过 applicationContextFactory 属性 和 webApplicationType属性 创建 ApplicationContext, Servlet类型创建
> AnnotationConfigServletWebServerApplicationContext 实例, Reactive类型创建
> AnnotationConfigReactiveWebServerApplicationContext 实例

## 设置启动步骤

> 设置 ApplicationContext 的 applicationStartup 属性为 DefaultApplicationStartup 实例

## prepareContext(): 准备上下文

### 设置 context 的环境

### postProcessApplicationContext(): 应用上下文的后置处理;

> * 如果 beanNameGenerator 属性不为空, 以 org.springframework.context.annotation.internalConfigurationBeanNameGenerator
	为 key将其加入BeanFactory;
> * 如果 resourceLoader 属性不为空,且 context 对象为GenericApplicationContext的实例,则将其设置为context对象的ResourceLoader
> * 如果 resourceLoader 属性不为空,且 context 对象为DefaultResourceLoader的实例,则将其的ClassLoader设置为context对象的ClassLoader
> * 如果 addConversionService 属性为真, 则将env对象中的 ConversionService 设置为 BeanFactory的 ConversionService

### applyInitializers(): 执行 初始化回调

> 执行通过 SpringApplication类的 addInitializers(), setInitializers() 函数添加的 ApplicationContextInitializer实现类

### 监听器 上下文就绪事件

### DefaultBootstrapContext.close(): 关闭启动上下文

> 发布 启动上下文 关闭事件

### 判断是否打印启动信息, 是则打印 是否主容器 和 配置信息

### 在BeanFactory中注册 ApplicationArguments(启动参数的封装) 实例,

### 如果存在 Banner对象, 则注册到 BeanFactory中.

### 判断如果BeanFactory是AbstractAutowireCapableBeanFactory的实例,则设置允许循环引用为 allowCircularReferences 属性的值

### 判断如果BeanFactory是 DefaultListableBeanFactory 的实例, 则设置允许Bean定义覆盖为 allowBeanDefinitionOverriding属性的值

### 判断如果 lazyInitialization 属性的值为true, 为上下文设置一个 LazyInitializationBeanFactoryPostProcessor 实例

### 为上下文添加一个 PropertySourceOrderingBeanFactoryPostProcessor 实例

### getAllSources(): 获取所有资源

> * 获取 primarySources 属性中定义的资源
> * 获取 sources 属性中定义的资源

### 断言 上一步获取的资源不得为空.

### load(): 加载上上步中获取的资源

> * 创建一个 BeanDefinitionLoader 实例
> * 为 BeanDefinitionLoader 设置 BeanNameGenerator
> * 为 BeanDefinitionLoader 设置 ResourceLoader
> * 为 BeanDefinitionLoader 设置 Environment
> * load(): 执行加载Bean信息

### 监听器 上下文加载完成事件

## afterRefresh(): 钩子函数, 用于子类调用扩展

## 如果开启 打印启动日志.则创建一个 StartupInfoLogger 对象

## 监听器 启动完成事件

## callRunners(): 运行声明的 ApplicationRunner对象的run函数;

> * 获取BeanFactory中的 ApplicationRunner 接口实例
> * 获取BeanFactory中的 CommandLineRunner 接口实例
> * 通过 AnnotationAwareOrderComparator.sort() 函数对上两步中获取到的实例进行排序;

## 监听器 读事件
