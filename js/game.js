var Game = function (){

  //获取各种节点
  var throttle;
  var $selector = Util.getElement('#selector'),

      //按钮

      //列表
      $banker = Util.getElement('.banker'),
      $player = Util.getElement('.player'),

      //点数显示区
      $countA = Util.getElement('.countA'),
      $countB = Util.getElement('.countB'),

      //余额显示区
      $balance = Util.getElement('#balance'),

      //遮罩层
      $mask = Util.getElement('.mask'),
      $promot = Util.getElement('.promot');

  var init = function (){
    //游戏初始化操作 普通属性已在config.js

    //初始化事件绑定
    eventBind();
  };

  var eventBind = function (){
    //事件委托
    $selector.addEventListener('click', function (e){
      if(e.target.id == 'begin'){
        //检查余额是否为0
        if(Interfaces.balance == 0){
          Interfaces.balance = 100;
        }
        //开始按钮和规则按钮隐藏，其它按钮出现
        Util.butState($selector);
        //余额改变
        Util.updateBalance($balance, -10);
        //正式发牌，每发一张牌计算对应点数并显示
        Interfaces.divCards($banker, $player, $countA, $countB, $mask, $promot, $balance);

      }else if(e.target.id == 'rules'){
        //居中弹出规则框
        Interfaces.promotMes($mask, $promot, false, Config.rules);
      }else if(e.target.id == 'addCard'){
        //加牌
        Interfaces.addCard('玩家', $player, $countB, $mask, $promot, $balance, $banker, $player);

      }else if(e.target.id == 'stopCard'){
        //停牌

        if(throttle){
          clearTimeout(throttle);
          //有可能出现Interfaces.stopCard已经在执行了又点击了停牌的情况 或者禁用按钮也可
          if($banker.lastElementChild.className != 'unknow'){
            return ;
          }
        }
        throttle = setTimeout(function(){
          Interfaces.stopCard('庄家', $banker, $countA, $mask, $promot, $balance, $banker, $player);
        }, 200);

      }
    }, false);

    //遮罩层
    $mask.addEventListener('click', function (e){
      if(e.target.id != 'promot'){
        var state = $selector.dataset.show.indexOf('rules');
        if(state!= -1){
          Interfaces.promotMes($mask, $promot, true);
          return ;
        }else{
          //从游戏页转来的
          Interfaces.promotMes($mask, $promot, true);
          //点击提示框外部后清除li和显示的点值
          Util.clearItem();
          //清除点数
          Util.updatePoint($countA, 'banker');
          Util.updatePoint($countB, 'player');
          //按钮切换
          Util.butState($selector);
        }
      }
    }, false);
  };

  return {
    init : init
  };

}();

Game.init();
