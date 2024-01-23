const e=JSON.parse('{"key":"v-2c4448ea","path":"/article/JDK-SuppresWarnings-Annotation-Use.html","title":"Java 中 @SuppressWarnings 注解用法详解","lang":"zh-CN","frontmatter":{"title":"Java 中 @SuppressWarnings 注解用法详解","icon":"note","isOriginal":true,"date":"2023-05-20T00:00:00.000Z","tag":["JDK"],"category":"Java","description":"说明 J2SE5.0 提供了一个注解 @SuppressWarnings。该注解的作用是给编译器一条指令，告诉它对被批注的代码元素内部的某些警告保持静默。 @SuppressWarnings 批注允许您选择性地取消特定代码段（即类或方法）中的警告。 其中的想法是当您看到警告时，您将调查它，如果您确定它不是问题，您就可以添加一个 @SuppressWarnings 批注，以使您不会再看到警告。 警告 @SuppressWarnings 就像一粒 止疼片, 本质上并未解决任何问题. 只是在编译期间通过抑制不抛警告而已.","head":[["meta",{"property":"og:url","content":"https://guocay.github.io/article/JDK-SuppresWarnings-Annotation-Use.html"}],["meta",{"property":"og:site_name","content":"GuoCay"}],["meta",{"property":"og:title","content":"Java 中 @SuppressWarnings 注解用法详解"}],["meta",{"property":"og:description","content":"说明 J2SE5.0 提供了一个注解 @SuppressWarnings。该注解的作用是给编译器一条指令，告诉它对被批注的代码元素内部的某些警告保持静默。 @SuppressWarnings 批注允许您选择性地取消特定代码段（即类或方法）中的警告。 其中的想法是当您看到警告时，您将调查它，如果您确定它不是问题，您就可以添加一个 @SuppressWarnings 批注，以使您不会再看到警告。 警告 @SuppressWarnings 就像一粒 止疼片, 本质上并未解决任何问题. 只是在编译期间通过抑制不抛警告而已."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-05-20T08:38:49.000Z"}],["meta",{"property":"article:author","content":"GuoCay"}],["meta",{"property":"article:tag","content":"JDK"}],["meta",{"property":"article:published_time","content":"2023-05-20T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-05-20T08:38:49.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Java 中 @SuppressWarnings 注解用法详解\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-05-20T00:00:00.000Z\\",\\"dateModified\\":\\"2023-05-20T08:38:49.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"GuoCay\\",\\"email\\":\\"guocay@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"源码","slug":"源码","link":"#源码","children":[]},{"level":2,"title":"可选值","slug":"可选值","link":"#可选值","children":[]}],"git":{"createdTime":1684571929000,"updatedTime":1684571929000,"contributors":[{"name":"GuoCay","email":"guocay@gmail.com","commits":1}]},"readingTime":{"minutes":3.06,"words":919},"filePathRelative":"article/JDK-SuppresWarnings-Annotation-Use.md","localizedDate":"2023年5月20日","excerpt":"<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">说明</p>\\n<p>J2SE5.0 提供了一个注解 @SuppressWarnings。该注解的作用是给编译器一条指令，告诉它对被批注的代码元素内部的某些警告保持静默。\\n@SuppressWarnings 批注允许您选择性地取消特定代码段（即类或方法）中的警告。\\n其中的想法是当您看到警告时，您将调查它，如果您确定它不是问题，您就可以添加一个 @SuppressWarnings 批注，以使您不会再看到警告。</p>\\n<div class=\\"hint-container warning\\">\\n<p class=\\"hint-container-title\\">警告</p>\\n<p>@SuppressWarnings 就像一粒 <strong>止疼片</strong>, 本质上并未解决任何问题. 只是在编译期间通过抑制不抛警告而已.</p>\\n</div>\\n</div>","autoDesc":true}');export{e as data};