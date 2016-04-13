## 21点 Blackjack 小游戏
一款支持PC和移动端的人机对战网页游戏，是使用原生JavaScript实现的21点黑杰克小游戏。
这篇总结就兼文档了！

###一.项目要求
使用JS实现21点扑克牌小游戏，可双人对战，判断输赢。扑克牌为一副（4种花色）。界面好看，在手机上可以玩。

游戏规则
> * 游戏开始系统先给玩家和庄家各随机发派两张牌，玩家两张明牌，庄家一张明牌一张暗牌。本游戏设置玩家初始金额为100$，庄家初始金额为50$，赌注默认为10$。庄家牌值大于19时停止为庄家发牌。一副扑克牌中牌的分值取它们的面值，其中A牌的值可作为1或11计算，J,Q,K牌的值作为10计算。游戏规定若玩家为获胜方可获得2倍赌注，庄家为获胜方则获得1倍赌注。当玩家仅拥有两张牌且牌总值为21时而庄家两张牌值不是21，此时玩家为“黑杰克”可获得3倍赌注。
> * 玩家优先，可根据当前两张牌总值可选择“要牌”还是“停牌”。玩家每次“要牌”，则系统随机为玩家发一张牌。若玩家选择“停牌”，则系统根据庄家牌总值自动为庄家发牌。
> * 玩家和庄家都应设法使牌总之达到21但不超过21，若一方超过21则为“爆掉”，对方获胜。


###二.项目分析和程序设计

####项目分析
逻辑模型图如下

![逻辑模型](https://github.com/venoral/Blackjack/blob/master/resultImg/%E9%80%BB%E8%BE%91%E6%A8%A1%E5%9E%8B.png?raw=true)

原型图和素材：原型图为自行设计，扑克牌为网上素材。截图以iphone6plus为准。

![index](https://github.com/venoral/Blackjack/blob/master/resultImg/index.jpg?raw=true) ![card](https://github.com/venoral/Blackjack/blob/master/resultImg/card.png?raw=true) 

####程序设计思路
文件目录结构 
```
  |  index.html
  |  README.md
  |-——css
  |      reset.css
  |      img.scss
  |      img.css
  |      index.css
  |-——js
  |     config.js
  |     util.js
  |     interface.js
  |     game.js
  |-——images
  |         h1.png
  |         h2.png
  |         ...
  |         unknow.png
```
（注：不要在意为什么会出现scss...因为images文件下里图片很多用css定义```background:url()```得写多次，所以这里我偷个懒用sass生成了img.css）

JavaScript 根据游戏需要实现的交互功能，采用面向对象的方式来设计。分为游戏逻辑模块Game，接口模块对象Interfaces，公共方法模块对象Util，初始配置模块对象Config。将它们的实现通过封装在不同功能对象中，写在不同的js文件里，既实现了一定程度上的视图和逻辑操作相分离也通过命名空间能避免定义变量全局污染。

* games.js 使用模块模式实现一个具体的游戏逻辑模块，返回一个拥有init方法的单例可用来初始化游戏的一些```dom```元素和事件绑定。
```javascript
   var Game = function(){
        //获取各种需要操作的dom元素
        var $selector = Util.getElement('#selector'),
            ...;
        var init = function(){
            eventBind();
        }
        var eventBind = function(){
            //事件委托
            //事件绑定
        }
        return {
            init :init
        };
    }(); 
    Game.init();
```
* interface.js 由于dom操作引起的页面变化相关的一些事件处理函数。
```javascript
   var Interfaces = {
      //游戏参与者的信息,包括实时变化的牌值，牌的张数，当前余额
      roleInfo : {},
      //处理发牌操作
      divCards : function (){},
      //处理加牌操作
      addCard : function (){},
      //处理停牌操作
      stopCard : function (){},
      //处理遮罩层提示框
      promotMes : function (){}
   }
```
* util.js 定义事件处理函数中一些频繁使用的代码，将它们封装成功能函数以便调用。主要函数如下：
```javascript
   var Util = {
      //获取元素
      getElement : function (){},
      //隐藏某些按钮并显示某些按钮
      butState : function (){},
      ...
      //随机产生一张牌
      randCard : function (){},
      ...
      //判断是否越界并给出结果
      overFlow : function (){},
      ...
      //游戏参与着牌信息的更新
      updateRoleInfo : function (){},
      //玩家余额信息更新
      updateBalance : function (){},
      //庄家余额信息更新
      updateBankerBalance : function (){}
    }
```
* config.js 本游戏的初始配置信息，比如定义扑克牌，游戏规则，参与者的一些信息。
```javascript
   var Config = {
      porker : ['h1','h2',...],
      rules : '...',
      actor : {
        'banker' : {
          initMoney : 50,
          cardPoint : 0
            },
        'player' : {
          initMoney : 100,
          cardPoint : 0
        }
      }

   }
```

###三.测试结果
以iphone6plus为UA，动图展示整个过程

![blackjack](https://github.com/venoral/Blackjack/blob/master/resultImg/blackjack.gif?raw=true)

###四.个人体会
实践总结

在项目完成中肯定是遇到了一些值得我总结的问题，通过学习和查阅相关资料并最终良好解决，如下：
> 在css方面，小三角形的实现方式可通过css的```border```画出来或者用伪类和```Unicode```字符实现。
> 
> 在Js方面，比如说设计模式的选择，其实刚开始考虑的是用组合继承模式通过自定义函数来实现游戏类和参与者类，事件处理方法定义在原型属性上，这使得处理```dom```变化需要用到类实例上的功能函数，代码管理和逻辑性不是很强，导致很多函数深层嵌套等问题。后来通过模块模式实现一个游戏逻辑的单例很好分离了界面和操作。
> 
> 通过定义游戏参与者的信息对象（包含当前各种可能变化的属性，比如牌总值，当前金额等），通过该对象将页面中某元素的```innerHTML```内容和这些变化的信息关联起来并实现一个接口函数脱离出来，就不用再频繁地在事件处理函数中重复很多代码。

存在问题
> 由于不断操作页面```dom```，导致页面需不断回流重绘，性能上不是很好，不过可以考虑用Canvas实现该游戏。而且在事件处理函数里需要频繁传一些```dom```参数，耦合度还是需要考虑减弱一下。
> 
> 由于游戏的实现可能会考虑到多种可能情况，这就需要很多```if else```或```switch```，感觉代码不美观。
> 
> 暂时还没实现联机多人对战，需要用到socket通信相关知识，还需多学习。
