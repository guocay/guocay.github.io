---
title: JDK1.8的新特性及在项目中的一些应用
icon: note
isOriginal: true
date: 2019-04-02 18:43:56
tag:
  - JDK
  - 代码片段
category: "Java"
---

## *前言*

1. 从我们将项目的jdk版本更新至1.8后,到目前为止已经有很长时间了.但现在的编程思想还是基于jdk1.6的路子.其实,可以通过一些jdk8的新特性所折射出的思维和工具类来改变我们对编程方式的改变.
2.
衡量一个高级编程语言的实用性有很多方面.但最基本的无外乎这几点,编程思想,集合机制,垃圾回收机制,异常机制,多线程机制等等.在CPU多核化的当下,串并行流机制也成为衡量的指标之一.如何使用并行技术在多核CPU中来降低程序的执行时间,也将成为我们优化代码效率一个事倍功半的思路.
3.
就拿我们朝夕相处的Java来说,在对jdk5使用了这么多年以来.在编程的过程中,也发现了一些jdk5的局限性.就拿java引以为傲的OOP来说.它确实是一个很高级的思维方式,在应对业务场景复杂度提高和降低开发门槛上有很大的优越性.但他对某些业务场景简单的应用或单一功能上的表现却显得有点臃肿.举个例子,在我接触的大部分公司中都不是太热衷于使用Spring
JPA或Herbinate等OOP思维的ORM框架,反倒更喜欢用Mybatis这种需要直接操作过程语言SQL这样的ORM.他们大多数的理由是Herbinate对于优化的成本偏高.而直接操作SQL的成本低.其实,这就侧面说明了一个问题,在某些方面上我们还是愿意使用POP思维进行编程.当然,造成这个结果的还有一部分原因是使用的是关系数据库.函数式编程和面向对象编程有机的结合在一起才能更好的以敏捷开发的方式来实现业务逻辑.
4. NullPointException,程序员最亲切的异常.也是最头疼的异常.没有之一.相较于C语言,几乎所有的高级编程语言都对指针的概念进行尽可能的模糊.但基于堆栈式的存储结构来说,空指针是我们永远也绕不开的一个痛点.
5. 针对以上的这些问题,jdk8相较于jdk5给了我们一些不敢说完美的解决方案,但还是能说,尚可.

## *纲概*

1. **JDK8新特性**;
2. **OptionalAPI**;
3. **Date/TimeAPI**;
4. **StreamAPI**;
5. **Lambda表达式**;
6. **双冒号语法**;
7. **defalut关键字**;

## *内容*

* ### JDK8 部分新特性


* **Nashorn JavaScript引擎**
  Java 8提供了一个新的Nashorn JavaScript引擎，它允许我们在JVM上运行特定的JS应用。
* **default关键字**
  一直以来java的以"单继承多实现"
  的方式来诠释面向对象的.但在我们实际操作的过程中,单继承的局限性越来越大.举个例子,我们有如下业务结构,物体类中有一个已实现的getColor方法,车类中有一个已实现的run方法.而货车类要直接继承下这两个方法,但在之前的jdk中java不允许多继承.如果把物体类和车类写成接口的话,对于货车类而言就要自己去实现这两个方法.所以,这个结构在jdk8前是不可能实现的.现在jdk8提供了一个default关键字,支持我们在接口中定义实现.这样的话,就算我们把物体和车定义成接口.货车类也不需要关心这两个方法的实现.
* **Optional空值包装**
  空指针异常,一直以来都是程序员最头疼的一个点,总觉得它无处不在.在应用系统中空指针异常本应是业务缺陷的一种体现.但人非圣贤怎可能察觉所有的问题.但我们又不希望这种错误体现在用户层面,体验感极差.基于这样的诉求,我们尝试使用一种机制使程序在出现空指针的时候能够出现一个备选方案来解决这个问题.而jdk8中的Optional类就是这个机制的体现.首先,我们来看看这个类的定义:

  > A container object which may or may not contain a non-null value. If a value is present, isPresent() will return
  true and get() will return the value.Additional methods that depend on the presence or absence of a contained value
  are provided, such as orElse() (return a default value if value not present) and ifPresent() (execute a block of code
  if the value is present).
  > 翻译:可能包含或不包含非空值的容器对象。如果存在值，isPresent()将返回true，get()
  将返回该值。提供了依赖于包含值的存在或不存在的其他方法，例如orelse()(如果值不存在，则返回默认值)和ifPresent()(
  如果值存在，则执行代码块).
  >

  ```java
  // 创建容器,创建一个空容器
  Optional<SpBaseDto> opt = Optional.empty();

  // 创建容器,根据对象创建容器
  //of()和ofNullable()的功能一致,区别是当dto为空时,of()会抛出空指针
  SpBaseDto dto = new SpBaseDto();
  opt = Optional.of(dto);
  opt = Optional.ofNullable(dto);

  // 访问容器中的对象
  dto = opt.get();

  // get方法在容器类对象为空的时候,会抛出一个NoSuchElementException.
  //所以,我们可以在调用get前使用ifPresent()校验是否为空.
  boolean isP = opt.isPresent();

  // 当容器中数据不为空时执行代码(后续我们可以使用函数指针替代匿名内部类)
  opt.ifPresent(new Consumer<SpBaseDto>(){
	  @Override
	  public void accept(SpBaseDto dto){
		  //Do Something
	  }
  });

  // 数据过滤,当符合定义的过滤规则或容器内的数据为空时,返回当前对象.
  // 否则,返回一个空的容器.
  opt = opt.filter(new Predicate<SpBaseDto>(){
	  @Override
	  public boolean test(SpBaseDto dto){
		  //Do SomeThing
	  }
  });

  // 数据操作,返回值为你在内部类中返回的对象加工而成的容器
  opt = opt.map(new Function<SpBaseDto,SpBaseDto>(){
	  @Override
	  public apply(SpBaseDto dto){
		  //Do SomeThing
		  return dto;
	  }
  });

  // 当数据容器为空时,将调用orElse()覆盖容器内的对象
  dto = opt.orElse(new SpBaseDto());

  // orElseGet(),当容器内对象不为空时,返回对象.
  // 否则运行内部类并返回内部类的return.
  dto = opt.orElseGet(new Supplier<SpBaseDto>(){
	  @Override
	  public SpBaseDto get(){
		  //Do SomeThing
	  }
  });

  // orElseThrow,当容器内对象不为空时,返回对象.
  // 否则运行内部类并返回内部类的return.内部类必须返回异常或Error
  dto = opt.orElseThrow(new Supplier<Throwable>(){
	  @Override
	  public Throwable get(){
		  //Do SomeThing
	  }
  });

  // 场景模拟
  SpBaseDto dto = new SpBaseDto();
  Optional<SpBaseDto> opt = Optional.ofNullable(dto);
  //Demo1:断言空指针
  Optional.ofNullable(dto).orElseThrow(new Supplier<Throwable>(){
	  @Override
	  public Throwable get(){
		  //Do SomeThing
		  return new RunTimeException();
	  }
  });
  // Demo2:数据校验过滤
  opt = opt.filter(new Predicate<SpBaseDto>(){
	  @Override
	  public boolean test(SpBaseDto dto){
		  //Do SomeThing
		  return true;
	  }
  });
  // Demo3:数据加工
  opt = opt.map(new Function<SpBaseDto,SpBaseDto>(){
	  @Override
	  public apply(SpBaseDto dto){
		  //Do SomeThing
		  return new Object();
	  }
  });
  ```
* **Date/TimeAPI**
  jdk8在开始研究Java
  8日期/时间API之前，让我们先来看一下为什么我们需要这样一个新的API。在Java中，现有的与日期和时间相关的类存在诸多问题，其中包括如下这几个方面:

	* Java的日期/时间类的定义并不一致，在java.util和java.sql的包中都有日期类，此外用于格式化和解析的类在java.text包中定义。
	* java.util.Date同时包含日期和时间，而java.sql.Date仅包含日期，将其纳入java.sql包并不合理。另外这两个类都有相同的名字，这本身就是一个非常糟糕的设计。
	* 对于时间、时间戳、格式化以及解析，并没有一些明确定义的类。对于格式化和解析的需求，我们有java.text.DateFormat抽象类，但通常情况下，SimpleDateFormat类被用于此类需求。
	* 所有的日期类都是可变的，因此他们都不是线程安全的，这是Java日期类最大的问题之一。
	* 日期类并不提供国际化，没有时区支持，因此Java引入了java.util.Calendar和java.util.TimeZone类，但他们同样存在上述所有的问题
	* JDK8以后日期和时间类中包含了一些新的成员:
	  LocalDate,LocalTime,Instant,Dyration以及Period这些.他们均来源自java.time包下.JDK8中的日期API是JSR-310的实现,并且是工作在ISO-8601日历体系基础上的,当然我们也可以在非ISO的日历上.新的日期包如下所示:
	* **ava.time包**：JDK8中的基础包，所有常用的基础类都是这个包的一部分，如LocalDate，LocalTime，LocalDateTime等等，所有这些类都是不可变且线程安全的；
	* **java.time.chrono包**：这个包为非ISO的日历系统定义了一些API，我们可以在借助这个包中的一些类扩展我们自己的日历系统；
	* **java.time.format包**：这个包很明显了，格式化和解析日期时间对象，一般java.time包中的类都差不多能满足我们的需求了，如果有需要，可以调用这个包下的类自定义解析方式；
	* **java.time.temporal包**：这个包很有意思，封装了一些获取某个特定日期和时间的接口，比如某月的第一天或最后一天，并且这些方法都是属于特别好认的方法。
	* **java.time.zone包**：这个包就是时区相关的类了。

  ```java
  // 获取当前日期 now = "2018-01-01"
  String now = LocalDate.now().toString;

  // 根据年月日,构建时间对象
  LocalDate local = LocalDate.of(2018,1,1);
  local = LocalDate.parse(2018-01-01);

  // 获取本月第一天,本月第N天,本月最后一天,本年第N天,
  LocalDate local = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
  local = LocalDate.now().withDayOfMonth(n);
  local = LocalDate.now().with(TemporalAdjusters.lastDayOfMonth());
  local = localDate.withDayOfYear(n);

  // 后N天,前N天
  LocalDate local  = localDate.plusDays(n);
  local = localDate.minusDays(n);

  // 计算两个日期间的天数,周数,月数,年数
  LocalDate now = LocalDate.now();
  LocalDate local = LocalDate.of(2018,1,1);
  long a = now.until(local,ChronoUnit.DAYS);
  a = now.until(local,ChronoUnit.WEEKS);
  a = now.until(local,ChronoUnit.MONTHS);
  a = now.until(local,ChronoUnit.YEARS);

  // 获取当前时间 now = "18:01:01.001"
  String now = LocalTime.now().toString();

  // 构建时间
  LocalTime time = LocalTime.of(12, 15, 30);
  time = LocalTime.parse("12:15:30");
  //获取当前时间，不包含毫秒数
  time = time.withNano(0)

  // 获取当前日期与时间
  LocalDateTime localDateTime = LocalDateTime.now();
  localDateTime = LocalDateTime.of(LocalDate.now(), LocalTime.now());
  localDateTime = LocalDateTime.of(2018, 01, 29, 19, 23, 13);
  // 格式化打印
  String formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd").format(localDateTime);

  // 计算类,计算两个日期的差
  Period period = Period.between(localDate, localDate1);
  String days = period.getDays();
  String week = period.getWeeks();
  String month,year ...

  LocalDateTime oldDate = LocalDateTime.of(2017, Month.AUGUST, 31, 10, 20, 55);
  LocalDateTime newDate = LocalDateTime.of(2018, Month.NOVEMBER, 9, 10, 21, 56);
  long years = ChronoUnit.YEARS.between(oldDate, newDate);
  long months = ChronoUnit.MONTHS.between(oldDate, newDate);
  long weeks = ChronoUnit.WEEKS.between(oldDate, newDate);
  long days = ChronoUnit.DAYS.between(oldDate, newDate);
  long hours = ChronoUnit.HOURS.between(oldDate, newDate);
  long minutes = ChronoUnit.MINUTES.between(oldDate, newDate);
  long seconds = ChronoUnit.SECONDS.between(oldDate, newDate);
  long milis = ChronoUnit.MILLIS.between(oldDate, newDate);
  long nano = ChronoUnit.NANOS.between(oldDate, newDate);

  // 计算类,计算两个时间的秒数差 PS这个方法的两个参数中必须有秒,否则会UnsupportedTemporalTypeException
  LocalDateTime localDate1 = LocalDate.of(2018, 02, 28,0,0,0);
  LocalDateTime localDate2 = LocalDate.of(2018, 02, 27,0,0,0);
  Duration duration = Duration.between(localDate1, localDate2);
  String seconds = duration.getSeconds();

  // 时区,默认时区
  Clock systemDefaultClock = Clock.systemDefaultZone();
  String time = LocalDateTime.now(systemDefaultClock).toString();

  // 时区,芝加哥
  Clock systemDefaultClock = Clock.system(ZoneId.of(ZoneId.SHORT_IDS.get("CST")));
  String time = LocalDateTime.now(systemDefaultClock).toString();

  Date date = new Date();

  // Date -> LocalDateTime
  LocalDateTime localDateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
  localDateTime = LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());

  // Date -> LocalDate
  LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

  // Date -> LocalTime
  LocalTime localTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalTime();

  // LocalDate -> Date
  date = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
  date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

  // 其他
  Year.now();
  Month.now();
  ```
* **Lambda表达式**

1. 我们在学习C语言的时候,都听说过一个名词"函数指针"
   ,本质上就是内存中方法区内方法地址在栈中的一个指向.像java一样的高级编程语言都在尽可能的模糊指针的概念,就更别说方法区的指针了.当然,这也和OOP思想背道而驰.但是,在编程到达一定程度以后,我们其实还是比较喜欢用底层些的东西.虽然这样风险,成本都会提升会很大,只是他带来的便捷却终是让我们觉得值得铤而走险.而在java中,那帮写jdk的Coder就使用了一种别的途径来实现了这个我们朝思暮想的功能.
2.
虽然看起来很先进,其实Lambda表达式的本质还只是一颗语法糖,有编译器推断并帮助你转换包装为正常的代码.因此我们可以使用更少的代码来实现同样的功能.不过,对于程序员而言,这也带来了一个问题,那就是在逻辑相同的代码中越简洁也就意味着越难懂.这也许算是一个怪圈吧,每个程序员都希望自己的代码即简洁又易懂.
3. 言归正传.既然是语法糖,也就意味着在没改变虚拟机的情况下,编译器干了原来该我们干的活.那具体编译器帮我们干了什么呢?看下面的两端代码.

   ```java
   // 第一段,Lambda表达式.这是一个最简单的Lambda表达式
   Arrays.asList("1","2").forEach((a)->{
	   a.toString();
   });

   // 现在,我们来看看List的父类Iterable中看看forEach()源码是怎么定义的,居然可以传入一段代码块;
   default void forEach(Consumer<? super T> action) {
	   Objects.requireNonNull(action);
	   for (T t : this) {
		   action.accept(t);
	   }
   }

   // 很矛盾,形式参数明明是一个接口类型,为什么入参却是代码块.
   // 从这段代码中,我们看到了方法接收一个Consumer接口.
   // 并在类中调用了接口的accept()函数,那我们再看看Consumer接口.
   @FunctionalInterface
   public interface Consumer<T> {
	   void accept(T t);
	   default Consumer<T> andThen(Consumer<? super T> after) {
		   Objects.requireNonNull(after);
		   return (T t) -> { accept(t); after.accept(t); };
	   }
   }

   // 从Consumer接口的源码中我们看到了它也就定义了一个且只有一个抽象方法,
   // 有且只有一个抽象方法,这是这个接口的重点.
   // 等等,如果这只是一个接口的话,我们岂不是可以通过匿名内部类的方式实现调用?
   // 就像,下面这样.
   Arrays.asList("1","2").forEach(new Consumer<T>(){
	   public void accept(T a){
		   a.toString();
	   }
   });

   // 没错,这样也是可以的.
   // 现在,我们知道编译器在在见到Lambda后,帮助我们做了些什么吧!
   // 就是把Lambda代码块转换成了上面这段包含了匿名内部类的代码.
   // 我们都知道,接口中是定义多个抽象方法的.
   // 到这里,也许,有的人会问了.那编译器是怎么知道我的Lambda代码块是
   // 实现哪个抽象函数的?
   // 我们再回去看看这个接口的源码,发现他有一个标签修饰

   // @FunctionalInterface 我们看看它的源码
   @Documented
   @Retention(RetentionPolicy.RUNTIME)
   @Target(ElementType.TYPE)
   public @interface FunctionalInterface {}

   // 从上面的代码发现这是一个运行时标签,接口的介绍我就不粘贴了.
   // 大意是,这个标签的作用是告诉编译器,这个标签修饰的接口
   // 只能有一个抽象方法,否则报错.
   // 返回来,还记得我们上面说的吗?这个接口中有且只有一个抽象方法.
   // 编译器就是这么找到Lambda表达式要去实现哪个方法.

   // 好了,到这里.我们应该就知道了Lambda其实就这么简单.
   // 既然知道原理了,我们先来看看JDK为我们提供了哪些像Consumer一样的接口

   // Consumer 接收一个参数,无返回.
   // Function 接收一个参数,返回一个参数.
   // Predicate 接收一个参数,返回一个布尔.
   // Supplier 无接收参数,返回一个参数.

   // 上面列举出来的四个典型的接口均来自java.util.function包下
   // 这个包下还有很多定义好的接口,在这里就不一一列举了.
   // 接下来,我们就又要问了,这些定义好的接口.不都把入参和出参的个数都定义好了.
   // 举个例子,那如果我有一个需要六个入参,且返回一个Map出参的话,怎么办?
   // 那我们就自己写接口定义吧.

   // 第一部分,定义接口
   @FunctionalInterface
   public interface MyLambda<A,B,C,D,E,F,G> {
	   G run(A a,B b,C c,D d,E e,F f);
   }

   // 第二部分,定义生产者.类似于List中的forEach()函数
   public G go(MyLambda<A,B,C,D,E,F,G extends Map> tag){
	   //创建 a,b,c,d,e,f
	   G g = tag.run(a,b,c,d,e,f);
	   return g;
   }

   // 第三部分,定义消费者.
   obj.go((a,b,c,d,e,f)->{
	   //操作a,b,c,d,e,f,创建g
	   retrun g;
   });

   ```

* **双冒号语法及行为对象化**
  上面的内容,我们聊了聊jdk8新引入的函数指针(Lambda)相关操作,但这些都是基于代码块的.有时候,我们希望将我们已经在类中的定义好的函数做为Lambda式实参.难不成我还得再写一遍?

当然不用,这个时候就需要我们的::(双冒号语法)了.

  ```java
  // 很多时候,我们在工具类中写了工具方法.
  // 而在某些场景下我们可能需要使用这些工具类,
  // 想当然,咱们都会这么写吧?
  obj.stream().filter((e) -> StringUtils.isNull(e));

  // 这不相当于,我写了一个代码块实现后,又在代码块中调用工具类?
  // 如果,有一种方式能让我们直接将已经定义好的isNull()函数
  // 直接包装成代码块实现就好了. 看下面代码.
  obj.stream().filter(StringUtils::isNull);

  // 完美解决.
  // 那我们现在看看是什么原理吧.如果这么写,我们应该就看懂了.
  Function<String,boolean> function = StringUtils::isNull;
  obj.stream().filter(predicate);

  // Predicate接口,我们上面说过是一个接收一个参数,返回一个参数的接口.
  // 这就是将isNull()包装成了Predicate接口的匿名实现.
  // 而在filter中调用这个接口的实现.
  // java中有一种语法叫双冒号语法,他允许将我们把已经定义在类中的函数
  // 包装成Lambda式的匿名实现.

  // 接下来我们说说这个 :: 可以帮我们包装哪些函数

  // 构造器
  Supplier`<Object>` obj = Object::new;

  // 有参构造器 Bifunction 是一个接收两个参数,返回一个参数.
  BiFunction<String,String,Dic> dic = Dic::new;
  Dic d = dic.apply("key","value");

  // 静态方法,如上

  // 非静态方法
  BiFunction<Dic,String,String> function = Did::getValue;
  String value = function.apply(new Dic(),"key");

  // 从上面的代码,我们可以看出::冒号语法
  // 可以将我们常用的方法均包装成Lambda.
  // 我们看的可能有点闷,参数都是怎么对应的啊.
  // 现在我们一一说明.其实java中的方法本质上只有两种静态和非静态
  // 构造器本质上也是一个静态方法嘛,这我们都学过.

  // 我们想说静态方法,在定义用于Lambda的接口时,有一个不成文的规定
  // 这个规矩,及时不遵守也没事.但最好遵守.就比如驼峰命名法.
  // 言归正传,在官方定义在java.util.function包下的接口.
  // 但凡有返回值且是对象的,返回值的类型都是通过最后一个泛型来定义的.
  // 所以,我们在使用::定义静态方法时,
  // 第一步,将入参+出参个数想加.void表示0;
  // 第二步,找一个(或自己写一个)和加出的和一致的Lambda接口.
  // 第三步,在声明定义这个接口的泛型时,先将入参按顺序写入.
  // 第四步,如果有出参,就将出参写在最后.
  // 第五步,调用接口中唯一的方法.

  // 我们再来说说非静态方法,
  // 静态和非静态最大的区别就在于方法中有无this关键字.
  // 如果我们解决了this关键字的指向,那非静态方法也就不特殊了.
  // 第一步,将入参+出参个数想加.void表示0.之后再加1(this);
  // 第二步,找一个(或自己写一个)和加出的和一致的Lambda接口.
  // 第三步,在声明定义这个接口的泛型时,
  // 先将第一个参数写成一个实例对象(this),然后入参按顺序写入.
  // 第四步,如果有出参,就将出参写在最后.
  // 第五步,调用接口中唯一的方法.

  // 其实,非静态函数还可以这么包装,但都是大同小异.
  Dic dic = new Dic();
  Function<String,String> fx = dic::getValue;
  String value = fx.apply("key");
  ```

* **Stream数据流操作**

1. Stream是Java8的一大亮点,没有之一.它与java.io包里的InputStream和OutputStream是完全不同的概念。是对容器对象功能的增强，它专注于对容器对象进行各种非常便利、高效的
   聚合操作（aggregate operation）或者大批量数据操作。Stream
   API借助于同样新出现的Lambda表达式，极大的提高编程效率和程序可读性。同时，它提供串行和并行两种模式进行汇聚操作，并发模式能够充分利用多核处理器的优势，使用fork/join并行方式来拆分任务和加速处理过程。所以说，Java8中首次出现的
   java.util.stream是一个函数式语言+多核时代综合影响的产物。
2. 在当今这个数据大爆炸的时代，在数据来源多样化、数据海量化的今天，很多时候不得不脱离
   RDBMS，或者以底层返回的数据为基础进行更上层的数据统计。而Java的集合API中，仅仅有极少量的辅助型方法，更多的时候是程序员需要用Iterator来遍历集合，完成相关的聚合应用逻辑，这是一种远不够高效、且笨拙的方法。
3.
Stream不是集合元素，它不是数据结构并不保存数据，它是有关算法和计算的，它更像一个高级版本的Iterator。原始版本的Iterator，用户只能显式地一个一个遍历元素并对其执行某些操作；高级版本的Stream，用户只要给出需要对其包含的元素执行什么操作，比如，“过滤掉长度大于
10
的字符串”、“获取每个字符串的首字母”等，Stream会隐式地在内部进行遍历，做出相应的数据转换。Stream就如同一个迭代器（Iterator），单向，不可往复，数据只能遍历一次，遍历过一次后即用尽了，就好比流水从面前流过，一去不复返。
4.
而和迭代器又不同的是，Stream可以并行化操作，迭代器只能命令式地、串行化操作。顾名思义，当使用串行方式去遍历时，每个item读完后再读下一个item。而使用并行去遍历时，数据会被分成多个段，其中每一个都在不同的线程中处理，然后将结果一起输出。Stream的并行操作依赖于Java7中引入的Fork/Join框架（JSR166y）来拆分任务和加速处理过程。
5. 简单说，对Stream的使用就是实现一个filter-map-reduce过程，产生一个最终结果，或者导致一个副作用（side
   effect）.Stream的几大特点:
   ***Stream不会存储元素;Stream不会改变源对象，相反他们会返回一个持有结果的新的Stream;Stream操作是延迟执行的，这意味着他们等到需要结果的时候才会执行（惰性求值）;
   ***

   ```java
   // 串行流创建
   Stream<Integer> s = new ArrayList<Integer>().stream();

   Integer[] nums = new Integer[10];
   Stream<Integer> stream1 = Arrays.stream(nums);

   Stream<Integer> stream = Stream.of(1,2,3,4,5,6);

   // 无限流 generate不是一次对每个新生成的值应用函数
   Stream<Integer> stream3 = Stream.iterate(0, (x) -> x + 1);

   Stream<Integer> stream = Stream.generate(() -> 1);

   // 其他方式
   String str="1234645";
   IntStream stream = str.chars();

   // Stream流中的方法

   // 忽略流中的前几个元素
   stream.skip(long);

   // 忽略流中的后几个元素
   stream.limit(long);

   // 过滤流中的数据,生成一个新的流,新生成的流中的数据是
   // 原流中符合要求的.
   stream.filter(x -> x>0);

   // 转换集合中的每一个元素,根据Lambda返回的值.
   stream.map(x -> x++);

   // 将集合内元素进行聚合操作,返回一个值.
   stream.reduce();

   // 将流中的数据打包.
   stream.collect(Collectors.toList());

   ```

## 写在最后

从前几年开始,java的更新就已经进入了快车道. 每一个版本的更新都或多或少有一些新的编程思想在里面.就现状而言,咱们已经落伍了.
