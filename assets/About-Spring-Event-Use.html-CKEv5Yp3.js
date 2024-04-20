import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,a as t}from"./app-DloSc4CP.js";const e={},p=t(`<h2 id="问题描述" tabindex="-1"><a class="header-anchor" href="#问题描述"><span>问题描述</span></a></h2><blockquote><p>去年底在做项目的时候,我们有这样的一个需求,用户上传文档操作,首先将文档保存至服务器后再上传到ES数据库中解析文档.解析文档是一个很消耗时间的操作,我们不能等待解析完成后再对用户返回操作成功.</p></blockquote><blockquote></blockquote><p>今年初在做项目的时候,我们有这样的一个需求,用户接收消息后,需要根据是否节假日且用户是否设置节假日自动回复对消息进行自动回复处理.且自动回复操作的成功与否要影响到消息是否接收.我们在分析需求后觉得这必须是一个事务性的服务.自动回复失败将不接收消息.</p><h2 id="问题思考" tabindex="-1"><a class="header-anchor" href="#问题思考"><span>问题思考</span></a></h2><ol><li>这两个需求正好是两个极端,一个是服务细节影响最终结果,另一个是服务细节不影响最终结果;</li><li>另外,我们在讨论需求后发现.在以后项目的升级过程中,在这些服务节点很有可能再增加其他细节(<br> 比如,接收消息后,除自动回复外,还需要做别的操作).这个时候,如果我们在函数中再追加别的代码必定会增加测试的难度和耦合度;</li><li>Spring Event是Spring<br> Framework中一个很重要的功能之一.本质是依赖BeanFactory中声明的监听器,事件发布后在同一个线程中线性调用监听器的响应,既然在同一个线程中就可以实现异常的监控与控制.完美实现第二个业务场景;</li><li>而第一个业务场景相较于第二个,只需将监听器的响应放到新的线程中执行,即可实现.而scheduling也是Spring<br> Framework中一个很重要的功能之一.可以实现函数级异步操作;</li></ol><h2 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案"><span>解决方案</span></a></h2><p>事件与活动的包装</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 平台内对于应用事件的包装
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/8/31
 */</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Event</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">extends</span> <span class="token class-name">ApplicationEvent</span> <span class="token keyword">implements</span> <span class="token class-name">Model</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">905529385550550456L</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 构造器
     * <span class="token keyword">@param</span> <span class="token parameter">source</span> 元数据
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">Event</span><span class="token punctuation">(</span><span class="token class-name">T</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 事件名称
     * <span class="token keyword">@return</span> 事件名称
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 事件备注
     * <span class="token keyword">@return</span> 事件备注
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">description</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&quot;默认事件描述&quot;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 事件数据
     * <span class="token keyword">@return</span> 事件数据
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">getMeta</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">T</span><span class="token punctuation">)</span> <span class="token function">getSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 插件所依赖的活动
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/9/23
 */</span>
<span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Activity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">extends</span> <span class="token class-name">Event</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token number">6996847203171194108L</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 日志对象
     */</span>
    <span class="token keyword">protected</span> <span class="token keyword">final</span> <span class="token class-name">Logger</span> log <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 用于存储活动已执行的插件
     */</span>
    <span class="token annotation punctuation">@Getter</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Class</span><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Plugin</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> plugins <span class="token operator">=</span> <span class="token class-name">CollUtil</span><span class="token punctuation">.</span><span class="token function">newLinkedList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 构造器
     * <span class="token keyword">@param</span> <span class="token parameter">source</span> 元数据
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">Activity</span><span class="token punctuation">(</span><span class="token class-name">T</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 插件执行成功时的回调
     */</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">success</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;活动 {}, 执行成功!&quot;</span><span class="token punctuation">,</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 插件执行失败时的回调
     * <span class="token keyword">@param</span> <span class="token parameter">throwable</span> 异常信息
     */</span>
    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">failure</span><span class="token punctuation">(</span><span class="token class-name">Throwable</span> throwable<span class="token punctuation">)</span><span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;活动 {}, 执行错误!&quot;</span><span class="token punctuation">,</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>throwable<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> throwable<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 添加当前活动已执行成功的插件
     * <span class="token keyword">@param</span> <span class="token parameter">plugin</span> 已执行过的插件
     */</span>
    <span class="token keyword">protected</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">F</span> <span class="token keyword">extends</span> <span class="token class-name">Plugin</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">addPlugin</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">F</span><span class="token punctuation">&gt;</span></span> plugin<span class="token punctuation">)</span><span class="token punctuation">{</span>
        plugins<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>plugin<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 活动名称
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 活动备注
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">description</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 活动元数据
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">getMeta</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getMeta</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 事件监听的基类
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/9/27
 */</span>
<span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Listener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Event</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">extends</span> <span class="token class-name">ApplicationListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">,</span> <span class="token class-name">WithAssertions</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 事件执行函数
     * <span class="token keyword">@param</span> <span class="token parameter">event</span> 依赖对象
     */</span>
    <span class="token keyword">void</span> <span class="token function">action</span><span class="token punctuation">(</span><span class="token class-name">T</span> event<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 重写 ApplicationListener 的事件响应函数,用于执行action()
     * <span class="token keyword">@param</span> <span class="token parameter">event</span> 元数据
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">default</span> <span class="token keyword">void</span> <span class="token function">onApplicationEvent</span><span class="token punctuation">(</span><span class="token class-name">T</span> event<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token function">action</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 插件基类
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/9/23
 */</span>
<span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Plugin</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">extends</span> <span class="token class-name">Listener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 判断是否执行当前插件
     * <span class="token keyword">@param</span> <span class="token parameter">activity</span> 依赖对象
     * <span class="token keyword">@return</span> 操作与否
     */</span>
    <span class="token keyword">boolean</span> <span class="token function">support</span><span class="token punctuation">(</span><span class="token class-name">T</span> activity<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 执行 插件内 函数
     * <span class="token keyword">@param</span> <span class="token parameter">event</span> 活动数据
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">default</span> <span class="token keyword">void</span> <span class="token function">onApplicationEvent</span><span class="token punctuation">(</span><span class="token class-name">T</span> event<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token function">support</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token function">action</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
            event<span class="token punctuation">.</span><span class="token function">addPlugin</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Spring Event 操作工具类
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/8/31
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">EventCenter</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 发布事件至 Spring
     * <span class="token keyword">@param</span> <span class="token parameter">event</span> 事件对象
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">publish</span><span class="token punctuation">(</span><span class="token class-name">Event</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> event<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">var</span> element <span class="token operator">=</span> <span class="token class-name">ThreadUtil</span><span class="token punctuation">.</span><span class="token function">getStackTraceElement</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 发布了{}: {}, 内容为: {}&quot;</span><span class="token punctuation">,</span>
                <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;%s.%s()&quot;</span><span class="token punctuation">,</span>element<span class="token punctuation">.</span><span class="token function">getClassName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>element<span class="token punctuation">.</span><span class="token function">getMethodName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token class-name">Activity</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">isAssignableFrom</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token string">&quot;活动&quot;</span> <span class="token operator">:</span> <span class="token string">&quot;事件&quot;</span><span class="token punctuation">,</span>
                event<span class="token punctuation">.</span><span class="token function">description</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">JSONUtil</span><span class="token punctuation">.</span><span class="token function">toJsonStr</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">getSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">SpringUtil</span><span class="token punctuation">.</span><span class="token function">getApplicationContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">publishEvent</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 插件使用中心
 * <span class="token keyword">@author</span> GuoKai
 * <span class="token keyword">@date</span> 2021/9/23
 */</span>
<span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">PluginCenter</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 发布活动,执行插件.
     * <span class="token keyword">@param</span> <span class="token parameter">activity</span> 活动
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> 泛型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">script</span><span class="token punctuation">(</span><span class="token class-name">T</span> activity<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token function">script</span><span class="token punctuation">(</span>activity<span class="token punctuation">,</span> <span class="token class-name">Activity</span><span class="token operator">::</span><span class="token function">success</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>item<span class="token punctuation">,</span> throwable<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> item<span class="token punctuation">.</span><span class="token function">failure</span><span class="token punctuation">(</span>throwable<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * <span class="token keyword">@param</span> <span class="token parameter">activity</span> 活动
     * <span class="token keyword">@param</span> <span class="token parameter">success</span> 成功回调
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> 泛型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">script</span><span class="token punctuation">(</span><span class="token class-name">T</span> activity<span class="token punctuation">,</span> <span class="token class-name">Consumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> success<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token function">script</span><span class="token punctuation">(</span>activity<span class="token punctuation">,</span> <span class="token class-name">Activity</span><span class="token operator">::</span><span class="token function">success</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>item<span class="token punctuation">,</span><span class="token class-name">Throwable</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * <span class="token keyword">@param</span> <span class="token parameter">activity</span> 活动
     * <span class="token keyword">@param</span> <span class="token parameter">failure</span> 失败回调
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> 泛型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">script</span><span class="token punctuation">(</span><span class="token class-name">T</span> activity<span class="token punctuation">,</span> <span class="token class-name">BiConsumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">,</span> <span class="token class-name">Throwable</span><span class="token punctuation">&gt;</span></span> failure<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token function">script</span><span class="token punctuation">(</span>activity<span class="token punctuation">,</span> <span class="token punctuation">(</span>item<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> failure<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 发布活动,执行插件.回调的优先级高于activity中的定义.
     * <span class="token keyword">@param</span> <span class="token parameter">activity</span> 活动
     * <span class="token keyword">@param</span> <span class="token parameter">success</span> 成功回调
     * <span class="token keyword">@param</span> <span class="token parameter">failure</span> 失败回调
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>T<span class="token punctuation">&gt;</span></span> 泛型
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">void</span> <span class="token function">script</span><span class="token punctuation">(</span><span class="token class-name">T</span> activity<span class="token punctuation">,</span> <span class="token class-name">Consumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> success<span class="token punctuation">,</span> <span class="token class-name">BiConsumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">,</span> <span class="token class-name">Throwable</span><span class="token punctuation">&gt;</span></span> failure<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">EventCenter</span><span class="token punctuation">.</span><span class="token function">publish</span><span class="token punctuation">(</span>activity<span class="token punctuation">)</span><span class="token punctuation">;</span>
            success<span class="token punctuation">.</span><span class="token function">accept</span><span class="token punctuation">(</span>activity<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> throwable<span class="token punctuation">)</span><span class="token punctuation">{</span>
            failure<span class="token punctuation">.</span><span class="token function">accept</span><span class="token punctuation">(</span>activity<span class="token punctuation">,</span> throwable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取插件总数
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">Integer</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> activity<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getPlugins</span><span class="token punctuation">(</span>activity<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 判断是否包含某个活动的插件
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">boolean</span> <span class="token function">hasPlugin</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> activity<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">count</span><span class="token punctuation">(</span>activity<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取所有插件
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Plugin</span><span class="token punctuation">&gt;</span></span> <span class="token function">getPlugins</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> activity<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">SpringUtil</span><span class="token punctuation">.</span><span class="token function">getBeansOfType</span><span class="token punctuation">(</span><span class="token class-name">Plugin</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>plugin <span class="token operator">-&gt;</span> plugin<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>activity<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">collect</span><span class="token punctuation">(</span><span class="token class-name">Collectors</span><span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用例子</p><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 事件是个异步操作,本质上是在不同的线程中运行
 */</span>
<span class="token comment">// 创建事件描述</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CustomEvent</span> <span class="token keyword">extends</span> <span class="token class-name">Event</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomEvent</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token comment">// 异步事件发布</span>
<span class="token class-name">EventCenter</span><span class="token punctuation">.</span><span class="token function">publish</span><span class="token punctuation">(</span><span class="token class-name">CustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 异步事件响应</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CustomListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomEvent</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">implements</span> <span class="token class-name">Listener</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token annotation punctuation">@Async</span>
    <span class="token keyword">public</span> <span class="token function">action</span><span class="token punctuation">(</span><span class="token class-name">CustomEvent</span> event<span class="token punctuation">)</span><span class="token keyword">throws</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">{</span>
        <span class="token comment">// do something</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 事件是个同步操作,本质上是在同一线程中运行
 */</span>
<span class="token comment">// 创建活动描述</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CustomActivity</span> <span class="token keyword">extends</span> <span class="token class-name">Activity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomActivity</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token comment">// 同步活动发布</span>
<span class="token class-name">PluginCenter</span><span class="token punctuation">.</span><span class="token function">script</span><span class="token punctuation">(</span><span class="token class-name">CustomActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 同步活动响应</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CustomPlugin</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">CustomActivity</span><span class="token punctuation">&gt;</span></span> <span class="token keyword">implements</span> <span class="token class-name">Plugin</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token function">action</span><span class="token punctuation">(</span><span class="token class-name">CustomActivity</span> activity<span class="token punctuation">)</span><span class="token keyword">throws</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">{</span>
        <span class="token comment">// do something</span>
    <span class="token punctuation">}</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">support</span><span class="token punctuation">(</span><span class="token class-name">CustomActivity</span> activity<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 是否运行当前插件</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ps" tabindex="-1"><a class="header-anchor" href="#ps"><span>PS</span></a></h2><ol><li>本功能的实现参考了Spring Plugin的设计理念,熟悉这个包可以更好的理解这部分内容;</li></ol>`,19),c=[p];function o(l,i){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","About-Spring-Event-Use.html.vue"]]),r=JSON.parse('{"path":"/article/About-Spring-Event-Use.html","title":"基于事件机制的服务内削峰和低耦合(同步)操作的思考与实现","lang":"zh-CN","frontmatter":{"title":"基于事件机制的服务内削峰和低耦合(同步)操作的思考与实现","icon":"note","isOriginal":true,"date":"2021-10-27T13:57:00.000Z","tag":["Mekatok","开发笔记"],"category":"Mekatok","description":"问题描述 去年底在做项目的时候,我们有这样的一个需求,用户上传文档操作,首先将文档保存至服务器后再上传到ES数据库中解析文档.解析文档是一个很消耗时间的操作,我们不能等待解析完成后再对用户返回操作成功. 今年初在做项目的时候,我们有这样的一个需求,用户接收消息后,需要根据是否节假日且用户是否设置节假日自动回复对消息进行自动回复处理.且自动回复操作的成功...","head":[["meta",{"property":"og:url","content":"https://blog.guocay.com/article/About-Spring-Event-Use.html"}],["meta",{"property":"og:site_name","content":"GuoCay"}],["meta",{"property":"og:title","content":"基于事件机制的服务内削峰和低耦合(同步)操作的思考与实现"}],["meta",{"property":"og:description","content":"问题描述 去年底在做项目的时候,我们有这样的一个需求,用户上传文档操作,首先将文档保存至服务器后再上传到ES数据库中解析文档.解析文档是一个很消耗时间的操作,我们不能等待解析完成后再对用户返回操作成功. 今年初在做项目的时候,我们有这样的一个需求,用户接收消息后,需要根据是否节假日且用户是否设置节假日自动回复对消息进行自动回复处理.且自动回复操作的成功..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-05-18T11:09:04.000Z"}],["meta",{"property":"article:author","content":"GuoCay"}],["meta",{"property":"article:tag","content":"Mekatok"}],["meta",{"property":"article:tag","content":"开发笔记"}],["meta",{"property":"article:published_time","content":"2021-10-27T13:57:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-05-18T11:09:04.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"基于事件机制的服务内削峰和低耦合(同步)操作的思考与实现\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-10-27T13:57:00.000Z\\",\\"dateModified\\":\\"2023-05-18T11:09:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"GuoCay\\",\\"email\\":\\"guocay@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"问题描述","slug":"问题描述","link":"#问题描述","children":[]},{"level":2,"title":"问题思考","slug":"问题思考","link":"#问题思考","children":[]},{"level":2,"title":"解决方案","slug":"解决方案","link":"#解决方案","children":[]},{"level":2,"title":"PS","slug":"ps","link":"#ps","children":[]}],"git":{"createdTime":1684408144000,"updatedTime":1684408144000,"contributors":[{"name":"GuoCay","email":"guocay@gmail.com","commits":1}]},"readingTime":{"minutes":5.42,"words":1625},"localizedDate":"2021年10月27日","excerpt":"<h2>问题描述</h2>\\n<blockquote>\\n<p>去年底在做项目的时候,我们有这样的一个需求,用户上传文档操作,首先将文档保存至服务器后再上传到ES数据库中解析文档.解析文档是一个很消耗时间的操作,我们不能等待解析完成后再对用户返回操作成功.</p>\\n</blockquote>\\n<blockquote></blockquote>\\n<p>今年初在做项目的时候,我们有这样的一个需求,用户接收消息后,需要根据是否节假日且用户是否设置节假日自动回复对消息进行自动回复处理.且自动回复操作的成功与否要影响到消息是否接收.我们在分析需求后觉得这必须是一个事务性的服务.自动回复失败将不接收消息.</p>","autoDesc":true}');export{d as comp,r as data};
