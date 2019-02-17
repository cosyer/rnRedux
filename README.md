### 问题记录
- tabbarIcon被遮挡(已解决:缩小Icon大小,文字间距)
- android base64上传失败
- 图床绑定域名
- 进度circle(已解决)
- 返回按钮样式(已解决:自定义)
- Image报错Missing request token for request: <NSMutableURLRequest: 0x..>{URL:...png}(已解决:网络图必须不能为空能够访问)
### 第三方依赖库
- react-native-video
- react-native-camera
- react-native-qrcode    
- react-native-qrcode-scanner
- react-native-button     ![progress](http://progressed.io/bar/100)
- react-native-picker     
- react-native-root-toast ![progress](http://progressed.io/bar/100)
- react-native-root-modal
- react-native-image-picker
- react-native-scrollable-tab-view

> ## 性能优化
> 使用 React Native 替代基于 WebView 的框架来开发 App 的一个强有力的理由，就是为了使 App 可以达到每秒 60 帧（足够流畅），并且能有类似原生 App 的外观和手感。因此我们也尽可能地优化 React Native 去实现这一目标，使开发者能集中精力处理 App 的业务逻辑，而不用费心考虑性能。但是，总还是有一些地方有所欠缺，以及在某些场合 React Native 还不能够替你决定如何进行优化（用原生代码写也无法避免），因此人工的干预依然是必要的。 本文的目的是教给你一些基本的知识，来帮你排查性能方面的问题，以及探讨这些问题产生的原因和推荐的解决方法。
> ![在这里插入图片描述](https://camo.githubusercontent.com/f185aec0086e01cfefeec93bd91b1cca8e2b3cae/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137313932343133302e706e673f782d6f73732d70726f636573733d696d6167652f77617465726d61726b2c747970655f5a6d46755a33706f5a57356e6147567064476b2c736861646f775f31302c746578745f6148523063484d364c7939696247396e4c6d4e7a5a473475626d56304c327831626d466f59576c71615746762c73697a655f31362c636f6c6f725f4646464646462c745f3730)
> 
> ### 1. React Native的工作原理
> ![在这里插入图片描述](https://camo.githubusercontent.com/4f9e8b12503eb199ae6e75bca2ffb00e4768977d/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137323030323432302e706e673f782d6f73732d70726f636573733d696d6167652f77617465726d61726b2c747970655f5a6d46755a33706f5a57356e6147567064476b2c736861646f775f31302c746578745f6148523063484d364c7939696247396e4c6d4e7a5a473475626d56304c327831626d466f59576c71615746762c73697a655f31362c636f6c6f725f4646464646462c745f3730)
> React Native为我们提供了JS的运行环境，开发者们只需要关心如何编写JS代码，画UI只需要画到virtual DOM 中，不需要特别关心具体的平台
> 至于JS转换为native代码，由React Native实现
> ![在这里插入图片描述](https://camo.githubusercontent.com/fc62518f84f7149c832e9542e4d24e94ad36f103/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137333431343739342e706e67)
> React Native的本质是把中间的这个桥Bridge搭建好，使JS和Native可以相互调用
> 
> ## 2. 关于“帧”你所需要知道的
> 老一辈人常常把电影称为“移动的画”，是因为视频中逼真的动态效果其实是一种幻觉，这种幻觉是由一组静态的图片以一个稳定的速度快速变化所产生的。我们把这组图片中的每一张图片叫做一帧，而每秒钟显示的帧数直接的影响了视频（或者说用户界面）的流畅度和真实感。iOS 设备提供了每秒 60 的帧率，这就留给了开发者和 UI 系统大约 16.67ms 来完成生成一张静态图片（帧）所需要的所有工作。如果在这分派的 16.67ms 之内没有能够完成这些工作，就会引发‘丢帧’的后果，使界面表现的不够流畅。
> 
> * JavaScript 帧率
>   对大多数React Native应用来说，业务逻辑是运行在JavaScript线程上的。这是React应用所在的线程，也是发生API调用，以及处理触摸事件等操作的线程。更新数据到原生支持的视图是批量进行的，并且在事件循环每进行一次的时候被发送到原生端，这一步通常会在一帧时间结束之前处理完。如果JS线程有一帧没有及时响应，就会被认为发生一次丢帧。例如，你在一个复杂应用的根组件上调用了this.setState，从而导致一次开销很大的子组件树的重绘，可想而知，这可能会花费200ms也就是整整12帧的丢失。此时，任何由JavaScript控制的动画都会卡住。只要卡顿超过100ms，就会就会明显的感觉到。
>   这种情况经常发生在Navigator的切换过程中：当你push一个新的路由时，JavaScript需要重新绘制新场景所需的所有组件，以发送正确的命令给原生端去创建视图。由于切换是由JAvaScript线程所控制，因此经常会占用若干帧的时间，引起一些卡顿。有的时候，组件会在componentDidMount函数中做一些额外的事情，这甚至可能会导致页面切换过程中多达一秒的卡顿。
>   另一个例子是触摸事件的回应：如果你正在JavaScript线程处理一个跨越多个帧的工作，你可能会注意到TouchableOpacity的响应被延迟了。这是因为JavaScript线程太忙了，不能够处理主线程发送的原始触摸事件。结果TouchableOpacity就不能及时的响应这些事件并命令主线程的页面去调整透明度了。
> * 主线程（也即UI线程）帧率
>   很多人会注意到，NavigatorIOS的性能要比 Navigator 好的多。原因就是它的切换动画是完全在主线程上执行的，因此不会被 JavaScript 线程上的掉帧所影响。（阅读关于为何你仍然需要使用 Navigator）
>   同样，当 JavaScript 线程卡住的时候，你仍然可以欢快的上下滚动 ScrollView，因为 ScrollView 运行在主线程之上（尽管滚动事件会被分发到 JS 线程，但是接收这些事件对于滚动这个动作来说并不必要）。
> 
> ### 3. 性能问题的常见原因
> * console.log语句
>   在运行打好了离线包的应用时，控制台打印语句可能会极大的拖累JavaScript线程。注意第三方调试库，如redux-logger
>   ```
>   if (!__DEV__) {
>     global.console = {
>       info: () => {},
>       log: () => {},
>       warn: () => {},
>       debug: () => {},
>       error: () => {}
>     };
>   }
>   ```
>   或使用babel 插件移除，首先yarn add —dev babel-plugin-transform-remove-console来安装，然后在项目根目录下编辑或新建.babelrc的文件
>   ```
>   // .babelrc文件
>   {
>     "env": {
>       "production": {
>         "plugins": ["transform-remove-console"]
>       }
>     }
>   }
>   ```
>   这样在打包发布时，所有的控制台语句就会被自动移除，而在调试时它们仍然会被正常调用。
> * 开发模式（dev=true）
>   JavaScript 线程的性能在开发模式下是很糟糕的。这是不可避免的，因为有许多工作需要在运行的时候去做，譬如使你获得良好的警告和错误信息，又比如验证属性类型（propTypes）以及产生各种其他的警告。
> * 缓慢的导航器（Navigator）切换
>   如之前所说，Navigator的动画是由JavaScript线程控制。想象一下“从右边推入”这个场景的切换：每一帧中，新的场景从右向左移动，从屏幕右边开始，最终移动到x轴偏移为0的屏幕位置。切换过程中的每一帧，JavaScript线程都需要发送一个新的x轴偏移量给主线程。如果JavaScript线程卡住了，它就无法处理这项事情，因而这一帧就无法更新，动画就卡住了。
>   长远的解决方法，其中一部分是要允许基于 JavaScript 的动画从主线程分离。同样是上面的例子，我们可以在切换动画开始的时候计算出一个列表，其中包含所有的新的场景需要的 x 轴偏移量，然后一次发送到主线程以某种优化的方式执行。由于 JavaScript 线程已经从更新 x 轴偏移量给主线程这个职责中解脱了出来，因此 JavaScript 线程中的掉帧就不是什么大问题了 —— 用户将基本上不会意识到这个问题，因为用户的注意力会被流畅的切换动作所吸引。
>   新的React Navigation库的一大目标就是为了解决这个问题。React Navigation 中的视图是原生组件，同时用到了运行在原生线程上的Animated动画库，因而性能表现十分流畅
> * ListView初始化渲染太慢以及列表过长时滚动性能太差
>   这是一个频繁出现的问题。因为 iOS 配备了 UITableView，通过重用底层的 UIViews 实现了非常高性能的体验（相比之下 ListView 的性能没有那么好）。用 React Native 实现相同效果的工作仍正在进行中，但是在此之前，我们有一些可用的方法来稍加改进性能以满足我们的需求。
>   
>   * initialListSize
>     这个属性定义了在首次渲染中绘制的行数。如果我们关注于快速的显示出页面，可以设置initialListSize为 1，然后我们会发现其他行在接下来的帧中被快速绘制到屏幕上。而每帧所显示的行数由pageSize所决定。
>   * pageSize
>     在初始渲染也就是initialListSize被使用之后，ListView 将利用pageSize来决定每一帧所渲染的行数。默认值为 1 —— 但是如果你的页面很小，而且渲染的开销不大的话，你会希望这个值更大一些。稍加调整，你会发现它所起到的作用。
>   * scrollRenderAheadDistance
>     “在将要进入屏幕区域之前的某个位置，开始绘制一行，距离按像素计算。”
>     如果我们有一个 2000 个元素的列表，并且立刻全部渲染出来的话，无论是内存还是计算资源都会显得很匮乏。还很可能导致非常可怕的阻塞。因此scrollRenderAheadDistance允许我们来指定一个超过视野范围之外所需要渲染的行数。
>   * removeClippedSubviews
>     “当这一选项设置为 true 的时候，超出屏幕的子视图（同时overflow值为hidden）会从它们原生的父视图中移除。这个属性可以在列表很长的时候提高滚动的性能。默认为 false。（0.14 版本后默认为 true）”
>     这是一个应用在长列表上极其重要的优化。Android 上，overflow值总是hidden的，所以你不必担心没有设置它。而在 iOS 上，你需要确保在行容器上设置了overflow: hidden。
> * 我的组件渲染太慢，我不需要立即显示全部
>   这在初次浏览 ListView 时很常见，适当的使用它是获得稳定性能的关键。就像之前所提到的，它可以提供一些手段在不同帧中来分开渲染页面，稍加改进就可以满足你的需求。此外要记住的是，ListView 也可以横向滚动。
> * 在重绘一个几乎没什么变化的页面时，JS帧率严重降低
>   如果你正在使用一个 ListView，你必须提供一个rowHasChanged函数，它通过快速的算出某一行是否需要重绘，来减少很多不必要的工作。如果你使用了不可变的数据结构，这项工作就只需检查其引用是否相等。
>   同样的，你可以实现shouldComponentUpdate函数来指明在什么样的确切条件下，你希望这个组件得到重绘。如果你编写的是纯粹的组件（返回值完全由 props 和 state 所决定），你可以利用PureComponent来为你做这个工作。再强调一次，不可变的数据结构在提速方面非常有用 —— 当你不得不对一个长列表对象做一个深度的比较，它会使重绘你的整个组件更加快速，而且代码量更少。
>   ![在这里插入图片描述](https://camo.githubusercontent.com/36ed3222ef29f09dfc93efb9fbef4e6e4728c1e5/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137323733323837342e706e673f782d6f73732d70726f636573733d696d6167652f77617465726d61726b2c747970655f5a6d46755a33706f5a57356e6147567064476b2c736861646f775f31302c746578745f6148523063484d364c7939696247396e4c6d4e7a5a473475626d56304c327831626d466f59576c71615746762c73697a655f31362c636f6c6f725f4646464646462c745f3730)
> * 由于在JavaScript线程中同时做很多事情，导致JS线程掉帧
>   “导航切换极慢”是该问题的常见表现。在其他情形下，这种问题也可能会出现。使用InteractionManager是一个好的方法，但是如果在动画中，为了用户体验的开销而延迟其他工作并不太能接受，那么你可以考虑一下使用LayoutAnimation。
>   Animated的接口一般会在 JavaScript 线程中计算出所需要的每一个关键帧，而LayoutAnimation则利用了Core Animation，使动画不会被 JS 线程和主线程的掉帧所影响。
>   举一个需要使用这项功能的例子：比如需要给一个模态框做动画（从下往上划动，并在半透明遮罩中淡入），而这个模态框正在初始化，并且可能响应着几个网络请求，渲染着页面的内容，并且还在更新着打开这个模态框的父页面。
>   注意：
>   
>   * LayoutAnimation只工作在“一次性”的动画上（"静态"动画） -- 如果动画可能会被中途取消，你还是需要使用Animated。
> * 在屏幕上移动视图（滚动，切换，旋转）时，UI线程掉帧
>   当具有透明背景的文本位于一张图片上时，或者在每帧重绘视图时需要用到透明合成的任何其他情况下，这种现象尤为明显。设置shouldRasterizeIOS或者renderToHardwareTextureAndroid属性可以显著改善这一现象。 注意不要过度使用该特性，否则你的内存使用量将会飞涨。在使用时，要评估你的性能和内存使用情况。如果你没有需要移动这个视图的需求，请关闭这一属性。
> * 使用动画改编图片的尺寸时，UI线程掉帧
>   在 iOS 上，每次调整 Image 组件的宽度或者高度，都需要重新裁剪和缩放原始图片。这个操作开销会非常大，尤其是大的图片。比起直接修改尺寸，更好的方案是使用transform: [{scale}]的样式属性来改变尺寸。比如当你点击一个图片，要将它放大到全屏的时候，就可以使用这个属性。
> * Touchable系列组件不能很好的响应
>   有些时候，如果有一项操作与点击事件所带来的透明度或者高亮效果发生在同一帧中，那么有可能在onPress函数结束之前我们都不看不到这些效果，比如在onPress执行一个setState的操作，这个操纵需要大量的计算操作并且导致了掉帧。对此，一个解决方案就是将onPress处理函数中操作封装到rquestAnimationFrame中：
>   ```
>   handleOnPress() {
>     // 谨记在使用requestAnimationFrame、setTimeout以及setInterval时
>     // 要使用TimerMixin（其作用是在组件unmount时，清除所有定时器）
>     this.requestAnimationFrame(() => {
>       this.doExpensiveAction();
>     });
>   }
>   ```
>   InteractionManager和requestAnimationFrame(fn)的作用类似，都是为了避免动画卡顿，具体的原因是边渲染边执行动画，或者有大量的code计算阻塞页面进程。
>   InteractionManager.runAfterInteractions是在动画或者操作结束后执行
>   ```
>   InteractionManager.runAfterInteractions(() => {
>     // ...long-running synchronous task...
>   });
>   ```
> * 总结
>   ![在这里插入图片描述](https://camo.githubusercontent.com/221fbb5bcc15835fb8483cd9f131a335944d2419/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137343331343331302e706e673f782d6f73732d70726f636573733d696d6167652f77617465726d61726b2c747970655f5a6d46755a33706f5a57356e6147567064476b2c736861646f775f31302c746578745f6148523063484d364c7939696247396e4c6d4e7a5a473475626d56304c327831626d466f59576c71615746762c73697a655f31362c636f6c6f725f4646464646462c745f3730)
> 
> ### 4. 分析
> 你可以利用内置的分析器来同时获取 JavaScript 线程和主线程中代码执行情况的详细信息。
> 对于 iOS 来说，Instruments 是一个宝贵的工具库，Android 的话，你可以使用 systrace。
> 
> ### 5. 拆包和内联引用
> React Native的加载流程主要为几个阶段
> 
> * 初始React Native环境
>   
>   * 创建Bridge
>   * Bridge中的JS环境
>   * RN模块、UI模块
> * 下载JS Bundle
> * 运行JS Bundle
> * 渲染页面
>   ![在这里插入图片描述](https://camo.githubusercontent.com/3f3ca77e89314df40a89fa4219fc53979ad3a66a/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303138313230363137323831393335362e706e673f782d6f73732d70726f636573733d696d6167652f77617465726d61726b2c747970655f5a6d46755a33706f5a57356e6147567064476b2c736861646f775f31302c746578745f6148523063484d364c7939696247396e4c6d4e7a5a473475626d56304c327831626d466f59576c71615746762c73697a655f31362c636f6c6f725f4646464646462c745f3730)
>   通过对FaceBook的ios版进行性能测试，得到上面的耗时图 可以看到，绿色的JS Init + Require占据了一大半的时间，这部分主要的操作是初始化JS环境：下载JS Bundle、运行JS Bundle
>   JS Bundle 是由 RN 开发工具打包出来的 JS 文件，其中包含了RN 页面组件的 JS 代码，还有 react、react-native 的JS代码，还有我们经常会用上的redux、react-navigation等的代码，所以 JS Bundle文件大小是性能优化的瓶颈，如果你有一个较为庞大的应用程序，你就要考虑使用拆分和内联引用。这对于具有大量页面的应用程序是非常有用的，这些页面在应用程序的典型使用过程中可能不会被打开。通常对于启动后一段时间内不需要大量代码的应用程序来说是非常有用的。例如应用程序包含复杂的配置文件屏幕或较少使用的功能，但大多数会话只涉及访问应用程序的主屏幕更新。我们可以通过使用打包器的unbundle特性来优化bundle的加载，并且内联引用这些功能和页面（当它们被实际使用时）。
> * Loading JavaScript
>   在react-native执行JS代码之前，必须将所有的代码加载到内存并进行解析。如果你加载了一个50MB的bundle，那么所有的50MB都必须被加载和解析才能执行。拆分后的优化是，启动时值加载50MB中实际需要的部分，并随着需要的部分逐渐加载更多的包。
> * 内联引用
>   内联引用（require代替import）可以延迟模块或文件的加载，直到实际需要该文件。例如：
>   ```
>   // 优化前
>   import React, {Component} from 'react'
>   import {Text} from 'react-native'
>   // ... import some very exponsive modules
>   
>   // You may want to log at the file level to verify when this is happening
>   console.log('VeryExpensive component loaded.')
>   
>   export default class VeryExpensive extends Component {
>       // lots and lots of code
>       render() {
>           return <Text>Very Expensive Component</Text>
>       }
>   }
>   // 优化后
>   import React,{Component} from 'react'
>   import {RouchableOpacity, View, Text} from 'react-native'
>   
>   let VeryExpensive = null
>   
>   export default class Optimized extends Component {
>       state = {needExpensive: false}
>   	didPress = () => {
>       	if (VeryExpensive == null) 
>               VeryExpensive = require('./VeryExpensive').default
>           this.setState(() => {
>               needExpensive: true
>           })
>   	}
>       render() {
>           return (
>               <View style={{marginTop: 20}}>
>               	<TouchableOpacity onPress={this.didPress}>
>               		<Text>Load</Text>
>               	</TouchableOpacity>
>               	{this.state.needsExpensive ? <VeryExpensive /> : null}
>               </View>
>           )
>       }
>   }
>   ```
>   即使没有使用拆包，内联引用也会使启动时间减少，因为优化后的代码只有第一次require时才会执行
> * 启动拆包
>   在iOS上unbundling将创建一个简单的索引文件，React Native将一次加载一个模块。在 Android 上，默认情况下它会为每个模块创建一组文件。你可以像 iOS 一样，强制 Android 只创建一个文件，但使用多个文件可以提高性能，并降低内存占用。
>   通过编辑 build phase "Bundle React Native code and images"，在 Xcode 中启用 unbundling。在../node_modules/react-native/packager/react-native-xcode.sh 添加 export BUNDLE_COMMAND="unbundle":
>   ```
>   export BUNDLE_COMMAND="unbundle"
>   export NODE_BINARY=node
>   ../node_modules/react-native/packager/react-native-xcode.sh
>   ```
>   在 Android 上，通过编辑你的 android/app/build.gradle 文件启用 unbundling。在apply from: "../../node_modules/react-native/react.gradle"之前修改或添加project.ext.react：
>   ```
>   project.ext.react = [
>     bundleCommand: "unbundle",
>   ]
>   ```
>   如果在 Android 上，你想使用单个索引文件（如前所述），请在 Android 上使用以下行：
>   ```
>   project.ext.react = [
>     bundleCommand: "unbundle",
>     extraPackagerArgs: ["--indexed-unbundle"]
>   ]
>   ```
> * 配置预加载与内联引用
>   现在我们拆分了代码，然而调用require会造成额外的开销。当遇到尚未加载的模块时，现在需要通过桥发送消息。这主要会影响到启动速度，因为在应用程序加载初始模块时可能触发相当大量的请求调用。幸运的是，我们可以配置一部分模块进行预加载。为了做到这一点，你将需要实现某种形式的内联引用。
> * 添加packager配置文件
>   在项目中创建一个名为packager的文件夹，并创建一个名为config.js的文件，添加一下内容
>   ```
>   const config = {
>     getTransformOptions: () => {
>       return {
>         transform: { inlineRequires: true },
>       };
>     },
>   };
>   
>   module.exports = config;
>   ```
>   在 Xcode 的 Build phase 中添加export BUNDLE_CONFIG="packager/config.js"
>   ```
>   export BUNDLE_COMMAND="unbundle"
>   export BUNDLE_CONFIG="packager/config.js"
>   export NODE_BINARY=node
>   ../node_modules/react-native/packager/react-native-xcode.sh
>   ```
>   编辑 android/app/build.gradle 文件，添加bundleConfig: "packager/config.js",
>   ```
>   project.ext.react = [
>     bundleCommand: "unbundle",
>     bundleConfig: "packager/config.js"
>   ]
>   ```
>   最后，在 package.json 的“scripts”下修改“start”命令来启用配置文件：
>   `"start": "node node_modules/react-native/local-cli/cli.js start --config ../../../../packager/config.js",`
>   此时用npm start启动你的 packager 服务即会加载配置文件。请注意，如果你仍然通过 xcode 或是 react-native run-android 等方式自动启动 packager 服务，则由于没有使用上面的参数，不会加载配置文件。
> * 调试预加载模块
>   在您的根文件 (index.(ios|android).js) 中，您可以在初始导入(initial imports)之后添加以下内容：
>   ```
>   const modules = require.getModules();
>   const moduleIds = Object.keys(modules);
>   const loadedModuleNames = moduleIds
>     .filter(moduleId => modules[moduleId].isInitialized)
>     .map(moduleId => modules[moduleId].verboseName);
>   const waitingModuleNames = moduleIds
>     .filter(moduleId => !modules[moduleId].isInitialized)
>     .map(moduleId => modules[moduleId].verboseName);
>   
>   // make sure that the modules you expect to be waiting are actually waiting
>   console.log(
>     'loaded:',
>     loadedModuleNames.length,
>     'waiting:',
>     waitingModuleNames.length
>   );
>   
>   // grab this text blob, and put it in a file named packager/moduleNames.js
>   console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);
>   ```
>   当你运行你的应用程序时，你可以查看 console 控制台，有多少模块已经加载，有多少模块在等待。你可能想查看 moduleNames，看看是否有任何意外。注意在首次 import 时调用的内联引用。你可能需要检查和重构，以确保只有你想要的模块在启动时加载。请注意，您可以根据需要修改 Systrace 对象，以帮助调试有问题的引用。
>   ```
>   require.Systrace.beginEvent = (message) => {
>     if(message.includes(problematicModule)) {
>       throw new Error();
>     }
>   }
>   ```
>   虽然每个 App 各有不同，但只加载第一个页面所需的模块是有普适意义的。当你满意时，把 loadedModuleNames 的输出放到 packager/moduleNames.js 文件中。
> * 转化模块路径
>   得到了需要预加载的模块名还不够，我们还需要模块的绝对路径，所以接下来将会搞定它。添加 packager/generatemodulepaths.js 文件：
>   ```
>   // @flow
>   /* eslint-disable no-console */
>   const execSync = require('child_process').execSync;
>   const fs = require('fs');
>   const moduleNames = require('./moduleNames');
>   
>   const pjson = require('../package.json');
>   const localPrefix = `${pjson.name}/`;
>   
>   const modulePaths = moduleNames.map(moduleName => {
>     if (moduleName.startsWith(localPrefix)) {
>       return `./${moduleName.substring(localPrefix.length)}`;
>     }
>     if (moduleName.endsWith('.js')) {
>       return `./node_modules/${moduleName}`;
>     }
>     try {
>       const result = execSync(
>         `grep "@providesModule ${moduleName}" $(find . -name ${moduleName}\\\\.js) -l`
>       )
>         .toString()
>         .trim()
>         .split('\n')[0];
>       if (result != null) {
>         return result;
>       }
>     } catch (e) {
>       return null;
>     }
>     return null;
>   });
>   
>   const paths = modulePaths
>     .filter(path => path != null)
>     .map(path => `'${path}'`)
>     .join(',\n');
>   
>   const fileData = `module.exports = [${paths}];`;
>   
>   fs.writeFile('./packager/modulePaths.js', fileData, err => {
>     if (err) {
>       console.log(err);
>     }
>   
>     console.log('Done');
>   });
>   ```
>   你可以通过node packager/modulePaths.js来运行这段脚本。
>   此脚本尝试从模块名称映射到模块路径，但它不是万无一失的。例如，它忽略了平台特定的文件（_ ios.js 和_ .android.js）。然而根据最初的测试，它处理了 95％的情况。当它运行一段时间后，它应该完成并输出一个名为packager/modulePaths.js的文件。它应该包含相对于你的项目根目录的模块文件路径。您可以将 modulePaths.js 提交到您的代码仓库，以便它可以被传递。
> * 更新配置文件
>   Returning to packager/config.js we should update it to use our newly generated modulePaths.js file.
>   ```
>   const modulePaths = require('./modulePaths');
>   const resolve = require('path').resolve;
>   const fs = require('fs');
>   
>   const config = {
>     getTransformOptions: () => {
>       const moduleMap = {};
>       modulePaths.forEach(path => {
>         if (fs.existsSync(path)) {
>           moduleMap[resolve(path)] = true;
>         }
>       });
>       return {
>         preloadedModules: moduleMap,
>         transform: { inlineRequires: { blacklist: moduleMap } },
>       };
>     },
>   };
>   
>   module.exports = config;
>   ```
>   配置文件中的 preloadedModules 条目指示哪些模块应被标记为由 unbundler 预加载。当 bundle 被加载时，这些模块立即被加载，甚至在任何 requires 执行之前。blacklist 表明这些模块不应该被要求内联引用，因为它们是预加载的，所以使用内联没有性能优势。实际上每次解析内联引用 JavaScript 都会花费额外的时间。
> 
> 本文借鉴[React Native Performance](https://reactnative.cn/docs/0.51/performance/)