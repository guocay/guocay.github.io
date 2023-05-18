---
title: '基于事件机制的服务内削峰和低耦合(同步)操作的思考与实现'
icon: note
isOriginal: true
date: 2021-10-27 13:57:00
tag:
  - Mekatok
  - 开发笔记
category: "Mekatok"
---

## 问题描述

> 去年底在做项目的时候,我们有这样的一个需求,用户上传文档操作,首先将文档保存至服务器后再上传到ES数据库中解析文档.解析文档是一个很消耗时间的操作,我们不能等待解析完成后再对用户返回操作成功.

>
今年初在做项目的时候,我们有这样的一个需求,用户接收消息后,需要根据是否节假日且用户是否设置节假日自动回复对消息进行自动回复处理.且自动回复操作的成功与否要影响到消息是否接收.我们在分析需求后觉得这必须是一个事务性的服务.自动回复失败将不接收消息.

## 问题思考

1. 这两个需求正好是两个极端,一个是服务细节影响最终结果,另一个是服务细节不影响最终结果;
2. 另外,我们在讨论需求后发现.在以后项目的升级过程中,在这些服务节点很有可能再增加其他细节(
   比如,接收消息后,除自动回复外,还需要做别的操作).这个时候,如果我们在函数中再追加别的代码必定会增加测试的难度和耦合度;
3. Spring Event是Spring
   Framework中一个很重要的功能之一.本质是依赖BeanFactory中声明的监听器,事件发布后在同一个线程中线性调用监听器的响应,既然在同一个线程中就可以实现异常的监控与控制.完美实现第二个业务场景;
4. 而第一个业务场景相较于第二个,只需将监听器的响应放到新的线程中执行,即可实现.而scheduling也是Spring
   Framework中一个很重要的功能之一.可以实现函数级异步操作;

## 解决方案

事件与活动的包装

```java
/**
 * 平台内对于应用事件的包装
 * @author GuoKai
 * @date 2021/8/31
 */
public abstract class Event<T> extends ApplicationEvent implements Model {

    private static final long serialVersionUID = 905529385550550456L;

    /**
     * 构造器
     * @param source 元数据
     */
    public Event(T source) {
        super(source);
    }

    /**
     * 事件名称
     * @return 事件名称
     */
    public String name(){
        return getClass().getName();
    };

    /**
     * 事件备注
     * @return 事件备注
     */
    public String description(){
        return "默认事件描述";
    }

    /**
     * 事件数据
     * @return 事件数据
     */
    public T getMeta() {
        return (T) getSource();
    }

}
```

```java
/**
 * 插件所依赖的活动
 * @author GuoKai
 * @date 2021/9/23
 */
@SuppressWarnings("all")
public abstract class Activity<T> extends Event<T> {

    private static final long serialVersionUID = 6996847203171194108L;

    /**
     * 日志对象
     */
    protected final Logger log = LoggerFactory.getLogger(getClass());

    /**
     * 用于存储活动已执行的插件
     */
    @Getter
    private List<Class<? extends Plugin>> plugins = CollUtil.newLinkedList();

    /**
     * 构造器
     * @param source 元数据
     */
    public Activity(T source) {
        super(source);
    }

    /**
     * 插件执行成功时的回调
     */
    protected void success(){
        log.info("活动 {}, 执行成功!", name());
    }

    /**
     * 插件执行失败时的回调
     * @param throwable 异常信息
     */
    protected void failure(Throwable throwable){
        log.error("活动 {}, 执行错误!", name());
        log.error(throwable.getMessage(), throwable);
    }

    /**
     * 添加当前活动已执行成功的插件
     * @param plugin 已执行过的插件
     */
    protected <F extends Plugin> void addPlugin(Class<F> plugin){
        plugins.add(plugin);
    }

    /**
     * 活动名称
     */
    @Override
    public String name() {
        return super.name();
    }

    /**
     * 活动备注
     */
    @Override
    public String description() {
        return super.description();
    }

    /**
     * 活动元数据
     */
    @Override
    public T getMeta() {
        return super.getMeta();
    }
}
```

```java
/**
 * 事件监听的基类
 * @author GuoKai
 * @date 2021/9/27
 */
@SuppressWarnings("all")
public interface Listener<T extends Event<?>> extends ApplicationListener<T>, WithAssertions {

    /**
     * 事件执行函数
     * @param event 依赖对象
     */
    void action(T event) throws RuntimeException;

    /**
     * 重写 ApplicationListener 的事件响应函数,用于执行action()
     * @param event 元数据
     */
    @Override
    default void onApplicationEvent(T event){
        action(event);
    }
}

```

```java
/**
 * 插件基类
 * @author GuoKai
 * @date 2021/9/23
 */
@SuppressWarnings("all")
public interface Plugin<T extends Activity<?>> extends Listener<T> {

    /**
     * 判断是否执行当前插件
     * @param activity 依赖对象
     * @return 操作与否
     */
    boolean support(T activity);

    /**
     * 执行 插件内 函数
     * @param event 活动数据
     */
    @Override
    default void onApplicationEvent(T event){
        if(support(event)){
            action(event);
            event.addPlugin(getClass());
        }
    }
}
```

```java
/**
 * Spring Event 操作工具类
 * @author GuoKai
 * @date 2021/8/31
 */
@Slf4j
public abstract class EventCenter {

    /**
     * 发布事件至 Spring
     * @param event 事件对象
     */
    public static void publish(Event<?> event){
        var element = ThreadUtil.getStackTraceElement(4);
        log.info("{} 发布了{}: {}, 内容为: {}",
                String.format("%s.%s()",element.getClassName(),element.getMethodName()),
                Activity.class.isAssignableFrom(event.getClass()) ? "活动" : "事件",
                event.description(), JSONUtil.toJsonStr(event.getSource()));
        SpringUtil.getApplicationContext().publishEvent(event);
    }
}
```

```java
/**
 * 插件使用中心
 * @author GuoKai
 * @date 2021/9/23
 */
@SuppressWarnings("all")
public abstract class PluginCenter {

    /**
     * 发布活动,执行插件.
     * @param activity 活动
     * @param <T> 泛型
     */
    public static <T extends Activity<?>> void script(T activity){
        script(activity, Activity::success, (item, throwable) -> item.failure(throwable));
    }

    /**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * @param activity 活动
     * @param success 成功回调
     * @param <T> 泛型
     */
    public static <T extends Activity<?>> void script(T activity, Consumer<T> success){
        script(activity, Activity::success, (item,Throwable) -> {});
    }

    /**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * @param activity 活动
     * @param failure 失败回调
     * @param <T> 泛型
     */
    public static <T extends Activity<?>> void script(T activity, BiConsumer<T, Throwable> failure){
        script(activity, (item) -> {}, failure);
    }

    /**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * @param activity 活动
     * @param success 成功回调
     * @param failure 失败回调
     * @param <T> 泛型
     */
    public static <T extends Activity<?>> void script(T activity, Consumer<T> success, BiConsumer<T, Throwable> failure){
        try {
            EventCenter.publish(activity);
            success.accept(activity);
        }catch (Throwable throwable){
            failure.accept(activity, throwable);
        }
    }

    /**
     * 获取插件总数
     */
    public static <T extends Activity<?>> Integer count(Class<T> activity){
        return getPlugins(activity).size();
    }

    /**
     * 判断是否包含某个活动的插件
     */
    public static <T extends Activity<?>> boolean hasPlugin(Class<T> activity){
        return count(activity) > 0;
    }

    /**
     * 获取所有插件
     */
    public static <T extends Activity<?>> List<Plugin> getPlugins(Class<T> activity){
        return SpringUtil.getBeansOfType(Plugin.class).values().stream()
                .filter(plugin -> plugin.getClass().equals(activity)).collect(Collectors.toList());
    }
}
```

使用例子

```java
/**
 * 事件是个异步操作,本质上是在不同的线程中运行
 */
// 创建事件描述
public class CustomEvent extends Event<CustomEvent>{}
// 异步事件发布
EventCenter.publish(CustomEvent());
// 异步事件响应
@Component
public class CustomListener<CustomEvent> implements Listener{
    @Override
    @Async
    public action(CustomEvent event)throws RuntimeException{
        // do something
    }
}
```

```java
/**
 * 事件是个同步操作,本质上是在同一线程中运行
 */
// 创建活动描述
public class CustomActivity extends Activity<CustomActivity>{}
// 同步活动发布
PluginCenter.script(CustomActivity());

// 同步活动响应
@Component
public class CustomPlugin<CustomActivity> implements Plugin{
    @Override
    public action(CustomActivity activity)throws RuntimeException{
        // do something
    }
    @Override
    public boolean support(CustomActivity activity){
        // 是否运行当前插件
        return true;
    }
}
```

## PS

1. 本功能的实现参考了Spring Plugin的设计理念,熟悉这个包可以更好的理解这部分内容;
