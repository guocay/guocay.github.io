import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as n,c as a,a as t}from"./app-DloSc4CP.js";const r="/docs/images/20230426-003.png",i={},o=t('<figure><img src="'+r+'" alt="SpringBoot框架run函数执行流程" tabindex="0" loading="lazy"><figcaption>SpringBoot框架run函数执行流程</figcaption></figure><h2 id="记录启动时间" tabindex="-1"><a class="header-anchor" href="#记录启动时间"><span>记录启动时间</span></a></h2><h2 id="createbootstrapcontext-创建启动上下文" tabindex="-1"><a class="header-anchor" href="#createbootstrapcontext-创建启动上下文"><span>createBootstrapContext(): 创建启动上下文</span></a></h2><blockquote><ul><li>创建一个 DefaultBootstrapContext 对象</li><li>执行所有注册的 BootstrapRegistryInitializer 对象</li></ul></blockquote><h2 id="configureheadlessproperty-配置属性" tabindex="-1"><a class="header-anchor" href="#configureheadlessproperty-配置属性"><span>configureHeadlessProperty(): 配置属性</span></a></h2><blockquote><p>系统变量 java.awt.headless 如果不存在,则设置成 headless 变量的值. 默认为 true</p></blockquote><h2 id="getrunlisteners-获取运行的监听器" tabindex="-1"><a class="header-anchor" href="#getrunlisteners-获取运行的监听器"><span>getRunListeners(): 获取运行的监听器</span></a></h2><blockquote><p>创建一个SpringApplicationRunListeners对象, 获取spring.factories中定义的 SpringApplicationRunListener 对象</p></blockquote><h2 id="监听器-starting事件" tabindex="-1"><a class="header-anchor" href="#监听器-starting事件"><span>监听器 Starting事件</span></a></h2><blockquote><p>触发运行 SpringApplicationRunListener中定义的 spring.boot.application.starting 事件(starting函数)</p></blockquote><h2 id="包装启动参数为-defaultapplicationarguments对象" tabindex="-1"><a class="header-anchor" href="#包装启动参数为-defaultapplicationarguments对象"><span>包装启动参数为 DefaultApplicationArguments对象</span></a></h2><h2 id="prepareenvironment-准备环境" tabindex="-1"><a class="header-anchor" href="#prepareenvironment-准备环境"><span>prepareEnvironment(): 准备环境</span></a></h2><h3 id="getorcreateenvironment-获取或创建环境" tabindex="-1"><a class="header-anchor" href="#getorcreateenvironment-获取或创建环境"><span>getOrCreateEnvironment(): 获取或创建环境</span></a></h3><blockquote><ul><li>判断当前环境是否为空, 不为空则返回当前环境</li><li>判断应用类型, Servlet类型则创建并返回 ApplicationServletEnvironment 实例</li><li>判断应用类型, Reactive类型则创建并返回 ApplicationReactiveWebEnvironment实例</li><li>判断应用类型, 其他则创建并返回 ApplicationEnvironment实例</li></ul></blockquote><h3 id="configureenvironment-配置环境" tabindex="-1"><a class="header-anchor" href="#configureenvironment-配置环境"><span>configureEnvironment(): 配置环境</span></a></h3><h4 id="判断-addconversionservice-属性-为真则创建一个-applicationconversionservice-并加入-env-对象" tabindex="-1"><a class="header-anchor" href="#判断-addconversionservice-属性-为真则创建一个-applicationconversionservice-并加入-env-对象"><span>判断 addConversionService 属性, 为真则创建一个 ApplicationConversionService 并加入 env 对象</span></a></h4><h4 id="configurepropertysources-配置属性源" tabindex="-1"><a class="header-anchor" href="#configurepropertysources-配置属性源"><span>configurePropertySources(): 配置属性源</span></a></h4><blockquote><ul><li>判断 defaultProperties 属性是否为空集合,是则将当前环境中的属性源添加合并到 defaultProperties属性中</li><li>判断是否存在 启动参数 和 判断 属性源中 是否存在 CommandLinePropertySource.COMMAND_LINE_PROPERTY_SOURCE_NAME 的属性</li><li>上一步判断如果已经存在命令行属性,就创建一个 CompositePropertySource 实例,合并已有的参数和新加的参数后, 替换原有的属性值.</li><li>上一步如果不存在, 就新建一个 SimpleCommandLinePropertySource 实例封装启动参数, 并添加当当前环境的属性源的第一个位置.</li></ul></blockquote><h4 id="configureprofiles-钩子函数-例如用于通过命令行激活配置文件" tabindex="-1"><a class="header-anchor" href="#configureprofiles-钩子函数-例如用于通过命令行激活配置文件"><span>configureProfiles(): 钩子函数, 例如用于通过命令行激活配置文件</span></a></h4><h3 id="configurationpropertysources-attach-为环境添加附加源" tabindex="-1"><a class="header-anchor" href="#configurationpropertysources-attach-为环境添加附加源"><span>ConfigurationPropertySources.attach(): 为环境添加附加源</span></a></h3><blockquote><ul><li>断言 env 对象 是否是 ConfigurableEnvironment 的子类实现.</li><li>从 env 对象中获取 属性源, 从属性源中获取 configurationProperties 的值.</li><li>如果上一步获取到的值为空,或 属性源不是可用的数据源. 就通过 SpringConfigurationPropertySources 创建一个<br> ConfigurationPropertySourcesPropertySource 实例</li><li>删除属性源中原来的值,并将新值加进去(添加到第一个位置).</li></ul></blockquote><h3 id="environmentprepared-监听器-环境就绪事件" tabindex="-1"><a class="header-anchor" href="#environmentprepared-监听器-环境就绪事件"><span>environmentPrepared(): 监听器 环境就绪事件</span></a></h3><h3 id="defaultpropertiespropertysource-movetoend-移动默认属性" tabindex="-1"><a class="header-anchor" href="#defaultpropertiespropertysource-movetoend-移动默认属性"><span>DefaultPropertiesPropertySource.moveToEnd(): 移动默认属性</span></a></h3><blockquote><ul><li>在属性源中获取并删除 defaultProperties 的值;</li><li>将上一步获取到的值添加到属性源的末尾;</li></ul></blockquote><h3 id="断言-是否包含-spring-main-environment-prefix" tabindex="-1"><a class="header-anchor" href="#断言-是否包含-spring-main-environment-prefix"><span>断言 是否包含 spring.main.environment-prefix</span></a></h3><h3 id="bindtospringapplication-将环境绑定到springapplication" tabindex="-1"><a class="header-anchor" href="#bindtospringapplication-将环境绑定到springapplication"><span>bindToSpringApplication(): 将环境绑定到SpringApplication</span></a></h3><blockquote><p>将 属性源 以 spring.main 为name, 绑定到 Binder上</p></blockquote><h3 id="如果不是自定义的环境-就创建一个-environmentconverter-对象-将环境转换为-environmentstandardenvironment-如果必要" tabindex="-1"><a class="header-anchor" href="#如果不是自定义的环境-就创建一个-environmentconverter-对象-将环境转换为-environmentstandardenvironment-如果必要"><span>如果不是自定义的环境, 就创建一个 EnvironmentConverter 对象 将环境转换为 environmentStandardEnvironment, 如果必要</span></a></h3><blockquote><p>根据 webApplicationType 属性将 env 对象转化为 ApplicationServletEnvironment, ApplicationReactiveWebEnvironment,<br> ApplicationEnvironment之一.</p></blockquote><h3 id="configurationpropertysources-attach-再次为环境添加附加源" tabindex="-1"><a class="header-anchor" href="#configurationpropertysources-attach-再次为环境添加附加源"><span>ConfigurationPropertySources.attach(): 再次为环境添加附加源</span></a></h3><blockquote><p>同上</p></blockquote><h2 id="configureignorebeaninfo-配置忽略的bean信息" tabindex="-1"><a class="header-anchor" href="#configureignorebeaninfo-配置忽略的bean信息"><span>configureIgnoreBeanInfo(): 配置忽略的bean信息</span></a></h2><blockquote><p>如果环境变量中不存在 spring.beaninfo.ignore 就将其设置为true</p></blockquote><h2 id="printbanner-准备-banner-信息" tabindex="-1"><a class="header-anchor" href="#printbanner-准备-banner-信息"><span>printBanner(): 准备 Banner 信息</span></a></h2><blockquote><ul><li>判断是否开启了 Banner打印, 关闭则直接返回.</li><li>判断是否存在 ResourceLoader 属性, 没有则创建一个 DefaultResourceLoader 实例</li><li>创建一个 SpringApplicationBannerPrinter 对象, 根据SpringApplication类中设置banner属性.</li><li>判断日志对象是否存在, 存在则使用日志对象打印. 否则通过 System.out 属性打印.</li></ul></blockquote><h2 id="createapplicationcontext-创建应用上下文" tabindex="-1"><a class="header-anchor" href="#createapplicationcontext-创建应用上下文"><span>createApplicationContext(): 创建应用上下文</span></a></h2><blockquote><p>通过 applicationContextFactory 属性 和 webApplicationType属性 创建 ApplicationContext, Servlet类型创建<br> AnnotationConfigServletWebServerApplicationContext 实例, Reactive类型创建<br> AnnotationConfigReactiveWebServerApplicationContext 实例</p></blockquote><h2 id="设置启动步骤" tabindex="-1"><a class="header-anchor" href="#设置启动步骤"><span>设置启动步骤</span></a></h2><blockquote><p>设置 ApplicationContext 的 applicationStartup 属性为 DefaultApplicationStartup 实例</p></blockquote><h2 id="preparecontext-准备上下文" tabindex="-1"><a class="header-anchor" href="#preparecontext-准备上下文"><span>prepareContext(): 准备上下文</span></a></h2><h3 id="设置-context-的环境" tabindex="-1"><a class="header-anchor" href="#设置-context-的环境"><span>设置 context 的环境</span></a></h3><h3 id="postprocessapplicationcontext-应用上下文的后置处理" tabindex="-1"><a class="header-anchor" href="#postprocessapplicationcontext-应用上下文的后置处理"><span>postProcessApplicationContext(): 应用上下文的后置处理;</span></a></h3><blockquote><ul><li>如果 beanNameGenerator 属性不为空, 以 org.springframework.context.annotation.internalConfigurationBeanNameGenerator<br> 为 key将其加入BeanFactory;</li><li>如果 resourceLoader 属性不为空,且 context 对象为GenericApplicationContext的实例,则将其设置为context对象的ResourceLoader</li><li>如果 resourceLoader 属性不为空,且 context 对象为DefaultResourceLoader的实例,则将其的ClassLoader设置为context对象的ClassLoader</li><li>如果 addConversionService 属性为真, 则将env对象中的 ConversionService 设置为 BeanFactory的 ConversionService</li></ul></blockquote><h3 id="applyinitializers-执行-初始化回调" tabindex="-1"><a class="header-anchor" href="#applyinitializers-执行-初始化回调"><span>applyInitializers(): 执行 初始化回调</span></a></h3><blockquote><p>执行通过 SpringApplication类的 addInitializers(), setInitializers() 函数添加的 ApplicationContextInitializer实现类</p></blockquote><h3 id="监听器-上下文就绪事件" tabindex="-1"><a class="header-anchor" href="#监听器-上下文就绪事件"><span>监听器 上下文就绪事件</span></a></h3><h3 id="defaultbootstrapcontext-close-关闭启动上下文" tabindex="-1"><a class="header-anchor" href="#defaultbootstrapcontext-close-关闭启动上下文"><span>DefaultBootstrapContext.close(): 关闭启动上下文</span></a></h3><blockquote><p>发布 启动上下文 关闭事件</p></blockquote><h3 id="判断是否打印启动信息-是则打印-是否主容器-和-配置信息" tabindex="-1"><a class="header-anchor" href="#判断是否打印启动信息-是则打印-是否主容器-和-配置信息"><span>判断是否打印启动信息, 是则打印 是否主容器 和 配置信息</span></a></h3><h3 id="在beanfactory中注册-applicationarguments-启动参数的封装-实例" tabindex="-1"><a class="header-anchor" href="#在beanfactory中注册-applicationarguments-启动参数的封装-实例"><span>在BeanFactory中注册 ApplicationArguments(启动参数的封装) 实例,</span></a></h3><h3 id="如果存在-banner对象-则注册到-beanfactory中" tabindex="-1"><a class="header-anchor" href="#如果存在-banner对象-则注册到-beanfactory中"><span>如果存在 Banner对象, 则注册到 BeanFactory中.</span></a></h3><h3 id="判断如果beanfactory是abstractautowirecapablebeanfactory的实例-则设置允许循环引用为-allowcircularreferences-属性的值" tabindex="-1"><a class="header-anchor" href="#判断如果beanfactory是abstractautowirecapablebeanfactory的实例-则设置允许循环引用为-allowcircularreferences-属性的值"><span>判断如果BeanFactory是AbstractAutowireCapableBeanFactory的实例,则设置允许循环引用为 allowCircularReferences 属性的值</span></a></h3><h3 id="判断如果beanfactory是-defaultlistablebeanfactory-的实例-则设置允许bean定义覆盖为-allowbeandefinitionoverriding属性的值" tabindex="-1"><a class="header-anchor" href="#判断如果beanfactory是-defaultlistablebeanfactory-的实例-则设置允许bean定义覆盖为-allowbeandefinitionoverriding属性的值"><span>判断如果BeanFactory是 DefaultListableBeanFactory 的实例, 则设置允许Bean定义覆盖为 allowBeanDefinitionOverriding属性的值</span></a></h3><h3 id="判断如果-lazyinitialization-属性的值为true-为上下文设置一个-lazyinitializationbeanfactorypostprocessor-实例" tabindex="-1"><a class="header-anchor" href="#判断如果-lazyinitialization-属性的值为true-为上下文设置一个-lazyinitializationbeanfactorypostprocessor-实例"><span>判断如果 lazyInitialization 属性的值为true, 为上下文设置一个 LazyInitializationBeanFactoryPostProcessor 实例</span></a></h3><h3 id="为上下文添加一个-propertysourceorderingbeanfactorypostprocessor-实例" tabindex="-1"><a class="header-anchor" href="#为上下文添加一个-propertysourceorderingbeanfactorypostprocessor-实例"><span>为上下文添加一个 PropertySourceOrderingBeanFactoryPostProcessor 实例</span></a></h3><h3 id="getallsources-获取所有资源" tabindex="-1"><a class="header-anchor" href="#getallsources-获取所有资源"><span>getAllSources(): 获取所有资源</span></a></h3><blockquote><ul><li>获取 primarySources 属性中定义的资源</li><li>获取 sources 属性中定义的资源</li></ul></blockquote><h3 id="断言-上一步获取的资源不得为空" tabindex="-1"><a class="header-anchor" href="#断言-上一步获取的资源不得为空"><span>断言 上一步获取的资源不得为空.</span></a></h3><h3 id="load-加载上上步中获取的资源" tabindex="-1"><a class="header-anchor" href="#load-加载上上步中获取的资源"><span>load(): 加载上上步中获取的资源</span></a></h3><blockquote><ul><li>创建一个 BeanDefinitionLoader 实例</li><li>为 BeanDefinitionLoader 设置 BeanNameGenerator</li><li>为 BeanDefinitionLoader 设置 ResourceLoader</li><li>为 BeanDefinitionLoader 设置 Environment</li><li>load(): 执行加载Bean信息</li></ul></blockquote><h3 id="监听器-上下文加载完成事件" tabindex="-1"><a class="header-anchor" href="#监听器-上下文加载完成事件"><span>监听器 上下文加载完成事件</span></a></h3><h2 id="afterrefresh-钩子函数-用于子类调用扩展" tabindex="-1"><a class="header-anchor" href="#afterrefresh-钩子函数-用于子类调用扩展"><span>afterRefresh(): 钩子函数, 用于子类调用扩展</span></a></h2><h2 id="如果开启-打印启动日志-则创建一个-startupinfologger-对象" tabindex="-1"><a class="header-anchor" href="#如果开启-打印启动日志-则创建一个-startupinfologger-对象"><span>如果开启 打印启动日志.则创建一个 StartupInfoLogger 对象</span></a></h2><h2 id="监听器-启动完成事件" tabindex="-1"><a class="header-anchor" href="#监听器-启动完成事件"><span>监听器 启动完成事件</span></a></h2><h2 id="callrunners-运行声明的-applicationrunner对象的run函数" tabindex="-1"><a class="header-anchor" href="#callrunners-运行声明的-applicationrunner对象的run函数"><span>callRunners(): 运行声明的 ApplicationRunner对象的run函数;</span></a></h2><blockquote><ul><li>获取BeanFactory中的 ApplicationRunner 接口实例</li><li>获取BeanFactory中的 CommandLineRunner 接口实例</li><li>通过 AnnotationAwareOrderComparator.sort() 函数对上两步中获取到的实例进行排序;</li></ul></blockquote><h2 id="监听器-读事件" tabindex="-1"><a class="header-anchor" href="#监听器-读事件"><span>监听器 读事件</span></a></h2>',67),l=[o];function c(s,p){return n(),a("div",null,l)}const h=e(i,[["render",c],["__file","SpringBoot-Run-Method-Process.html.vue"]]),g=JSON.parse('{"path":"/article/SpringBoot-Run-Method-Process.html","title":"SpringBoot框架run()执行流程","lang":"zh-CN","frontmatter":{"title":"SpringBoot框架run()执行流程","icon":"note","isOriginal":true,"date":"2023-04-26T00:00:00.000Z","tag":["Spring Boot","开发笔记"],"category":"Java","description":"SpringBoot框架run函数执行流程SpringBoot框架run函数执行流程 记录启动时间 createBootstrapContext(): 创建启动上下文 创建一个 DefaultBootstrapContext 对象 执行所有注册的 BootstrapRegistryInitializer 对象 configureHeadlessProp...","head":[["meta",{"property":"og:url","content":"https://blog.guocay.com/article/SpringBoot-Run-Method-Process.html"}],["meta",{"property":"og:site_name","content":"GuoCay"}],["meta",{"property":"og:title","content":"SpringBoot框架run()执行流程"}],["meta",{"property":"og:description","content":"SpringBoot框架run函数执行流程SpringBoot框架run函数执行流程 记录启动时间 createBootstrapContext(): 创建启动上下文 创建一个 DefaultBootstrapContext 对象 执行所有注册的 BootstrapRegistryInitializer 对象 configureHeadlessProp..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://blog.guocay.com/docs/images/20230426-003.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-05-18T11:09:04.000Z"}],["meta",{"property":"article:author","content":"GuoCay"}],["meta",{"property":"article:tag","content":"Spring Boot"}],["meta",{"property":"article:tag","content":"开发笔记"}],["meta",{"property":"article:published_time","content":"2023-04-26T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-05-18T11:09:04.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SpringBoot框架run()执行流程\\",\\"image\\":[\\"https://blog.guocay.com/docs/images/20230426-003.png\\"],\\"datePublished\\":\\"2023-04-26T00:00:00.000Z\\",\\"dateModified\\":\\"2023-05-18T11:09:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"GuoCay\\",\\"email\\":\\"guocay@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"记录启动时间","slug":"记录启动时间","link":"#记录启动时间","children":[]},{"level":2,"title":"createBootstrapContext(): 创建启动上下文","slug":"createbootstrapcontext-创建启动上下文","link":"#createbootstrapcontext-创建启动上下文","children":[]},{"level":2,"title":"configureHeadlessProperty(): 配置属性","slug":"configureheadlessproperty-配置属性","link":"#configureheadlessproperty-配置属性","children":[]},{"level":2,"title":"getRunListeners(): 获取运行的监听器","slug":"getrunlisteners-获取运行的监听器","link":"#getrunlisteners-获取运行的监听器","children":[]},{"level":2,"title":"监听器 Starting事件","slug":"监听器-starting事件","link":"#监听器-starting事件","children":[]},{"level":2,"title":"包装启动参数为 DefaultApplicationArguments对象","slug":"包装启动参数为-defaultapplicationarguments对象","link":"#包装启动参数为-defaultapplicationarguments对象","children":[]},{"level":2,"title":"prepareEnvironment(): 准备环境","slug":"prepareenvironment-准备环境","link":"#prepareenvironment-准备环境","children":[{"level":3,"title":"getOrCreateEnvironment(): 获取或创建环境","slug":"getorcreateenvironment-获取或创建环境","link":"#getorcreateenvironment-获取或创建环境","children":[]},{"level":3,"title":"configureEnvironment(): 配置环境","slug":"configureenvironment-配置环境","link":"#configureenvironment-配置环境","children":[]},{"level":3,"title":"ConfigurationPropertySources.attach(): 为环境添加附加源","slug":"configurationpropertysources-attach-为环境添加附加源","link":"#configurationpropertysources-attach-为环境添加附加源","children":[]},{"level":3,"title":"environmentPrepared(): 监听器 环境就绪事件","slug":"environmentprepared-监听器-环境就绪事件","link":"#environmentprepared-监听器-环境就绪事件","children":[]},{"level":3,"title":"DefaultPropertiesPropertySource.moveToEnd(): 移动默认属性","slug":"defaultpropertiespropertysource-movetoend-移动默认属性","link":"#defaultpropertiespropertysource-movetoend-移动默认属性","children":[]},{"level":3,"title":"断言 是否包含 spring.main.environment-prefix","slug":"断言-是否包含-spring-main-environment-prefix","link":"#断言-是否包含-spring-main-environment-prefix","children":[]},{"level":3,"title":"bindToSpringApplication(): 将环境绑定到SpringApplication","slug":"bindtospringapplication-将环境绑定到springapplication","link":"#bindtospringapplication-将环境绑定到springapplication","children":[]},{"level":3,"title":"如果不是自定义的环境, 就创建一个 EnvironmentConverter 对象 将环境转换为 environmentStandardEnvironment, 如果必要","slug":"如果不是自定义的环境-就创建一个-environmentconverter-对象-将环境转换为-environmentstandardenvironment-如果必要","link":"#如果不是自定义的环境-就创建一个-environmentconverter-对象-将环境转换为-environmentstandardenvironment-如果必要","children":[]},{"level":3,"title":"ConfigurationPropertySources.attach(): 再次为环境添加附加源","slug":"configurationpropertysources-attach-再次为环境添加附加源","link":"#configurationpropertysources-attach-再次为环境添加附加源","children":[]}]},{"level":2,"title":"configureIgnoreBeanInfo(): 配置忽略的bean信息","slug":"configureignorebeaninfo-配置忽略的bean信息","link":"#configureignorebeaninfo-配置忽略的bean信息","children":[]},{"level":2,"title":"printBanner(): 准备 Banner 信息","slug":"printbanner-准备-banner-信息","link":"#printbanner-准备-banner-信息","children":[]},{"level":2,"title":"createApplicationContext(): 创建应用上下文","slug":"createapplicationcontext-创建应用上下文","link":"#createapplicationcontext-创建应用上下文","children":[]},{"level":2,"title":"设置启动步骤","slug":"设置启动步骤","link":"#设置启动步骤","children":[]},{"level":2,"title":"prepareContext(): 准备上下文","slug":"preparecontext-准备上下文","link":"#preparecontext-准备上下文","children":[{"level":3,"title":"设置 context 的环境","slug":"设置-context-的环境","link":"#设置-context-的环境","children":[]},{"level":3,"title":"postProcessApplicationContext(): 应用上下文的后置处理;","slug":"postprocessapplicationcontext-应用上下文的后置处理","link":"#postprocessapplicationcontext-应用上下文的后置处理","children":[]},{"level":3,"title":"applyInitializers(): 执行 初始化回调","slug":"applyinitializers-执行-初始化回调","link":"#applyinitializers-执行-初始化回调","children":[]},{"level":3,"title":"监听器 上下文就绪事件","slug":"监听器-上下文就绪事件","link":"#监听器-上下文就绪事件","children":[]},{"level":3,"title":"DefaultBootstrapContext.close(): 关闭启动上下文","slug":"defaultbootstrapcontext-close-关闭启动上下文","link":"#defaultbootstrapcontext-close-关闭启动上下文","children":[]},{"level":3,"title":"判断是否打印启动信息, 是则打印 是否主容器 和 配置信息","slug":"判断是否打印启动信息-是则打印-是否主容器-和-配置信息","link":"#判断是否打印启动信息-是则打印-是否主容器-和-配置信息","children":[]},{"level":3,"title":"在BeanFactory中注册 ApplicationArguments(启动参数的封装) 实例,","slug":"在beanfactory中注册-applicationarguments-启动参数的封装-实例","link":"#在beanfactory中注册-applicationarguments-启动参数的封装-实例","children":[]},{"level":3,"title":"如果存在 Banner对象, 则注册到 BeanFactory中.","slug":"如果存在-banner对象-则注册到-beanfactory中","link":"#如果存在-banner对象-则注册到-beanfactory中","children":[]},{"level":3,"title":"判断如果BeanFactory是AbstractAutowireCapableBeanFactory的实例,则设置允许循环引用为 allowCircularReferences 属性的值","slug":"判断如果beanfactory是abstractautowirecapablebeanfactory的实例-则设置允许循环引用为-allowcircularreferences-属性的值","link":"#判断如果beanfactory是abstractautowirecapablebeanfactory的实例-则设置允许循环引用为-allowcircularreferences-属性的值","children":[]},{"level":3,"title":"判断如果BeanFactory是 DefaultListableBeanFactory 的实例, 则设置允许Bean定义覆盖为 allowBeanDefinitionOverriding属性的值","slug":"判断如果beanfactory是-defaultlistablebeanfactory-的实例-则设置允许bean定义覆盖为-allowbeandefinitionoverriding属性的值","link":"#判断如果beanfactory是-defaultlistablebeanfactory-的实例-则设置允许bean定义覆盖为-allowbeandefinitionoverriding属性的值","children":[]},{"level":3,"title":"判断如果 lazyInitialization 属性的值为true, 为上下文设置一个 LazyInitializationBeanFactoryPostProcessor 实例","slug":"判断如果-lazyinitialization-属性的值为true-为上下文设置一个-lazyinitializationbeanfactorypostprocessor-实例","link":"#判断如果-lazyinitialization-属性的值为true-为上下文设置一个-lazyinitializationbeanfactorypostprocessor-实例","children":[]},{"level":3,"title":"为上下文添加一个 PropertySourceOrderingBeanFactoryPostProcessor 实例","slug":"为上下文添加一个-propertysourceorderingbeanfactorypostprocessor-实例","link":"#为上下文添加一个-propertysourceorderingbeanfactorypostprocessor-实例","children":[]},{"level":3,"title":"getAllSources(): 获取所有资源","slug":"getallsources-获取所有资源","link":"#getallsources-获取所有资源","children":[]},{"level":3,"title":"断言 上一步获取的资源不得为空.","slug":"断言-上一步获取的资源不得为空","link":"#断言-上一步获取的资源不得为空","children":[]},{"level":3,"title":"load(): 加载上上步中获取的资源","slug":"load-加载上上步中获取的资源","link":"#load-加载上上步中获取的资源","children":[]},{"level":3,"title":"监听器 上下文加载完成事件","slug":"监听器-上下文加载完成事件","link":"#监听器-上下文加载完成事件","children":[]}]},{"level":2,"title":"afterRefresh(): 钩子函数, 用于子类调用扩展","slug":"afterrefresh-钩子函数-用于子类调用扩展","link":"#afterrefresh-钩子函数-用于子类调用扩展","children":[]},{"level":2,"title":"如果开启 打印启动日志.则创建一个 StartupInfoLogger 对象","slug":"如果开启-打印启动日志-则创建一个-startupinfologger-对象","link":"#如果开启-打印启动日志-则创建一个-startupinfologger-对象","children":[]},{"level":2,"title":"监听器 启动完成事件","slug":"监听器-启动完成事件","link":"#监听器-启动完成事件","children":[]},{"level":2,"title":"callRunners(): 运行声明的 ApplicationRunner对象的run函数;","slug":"callrunners-运行声明的-applicationrunner对象的run函数","link":"#callrunners-运行声明的-applicationrunner对象的run函数","children":[]},{"level":2,"title":"监听器 读事件","slug":"监听器-读事件","link":"#监听器-读事件","children":[]}],"git":{"createdTime":1684408144000,"updatedTime":1684408144000,"contributors":[{"name":"GuoCay","email":"guocay@gmail.com","commits":1}]},"readingTime":{"minutes":4.54,"words":1362},"localizedDate":"2023年4月26日","excerpt":"<figure><img src=\\"/docs/images/20230426-003.png\\" alt=\\"SpringBoot框架run函数执行流程\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption>SpringBoot框架run函数执行流程</figcaption></figure>\\n<h2>记录启动时间</h2>\\n<h2>createBootstrapContext(): 创建启动上下文</h2>\\n<blockquote>\\n<ul>\\n<li>创建一个 DefaultBootstrapContext 对象</li>\\n<li>执行所有注册的 BootstrapRegistryInitializer 对象</li>\\n</ul>\\n</blockquote>","autoDesc":true}');export{h as comp,g as data};