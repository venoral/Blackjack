//黑杰克类
function blackJack(){
  //红桃 黑桃 梅花 方片
  this.poker = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk',
                's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk',
                'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck',
                'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk'];
  this.curWager = 10;
  this.rules = '21点游戏的规则请自行百度';
}

//游戏逻辑类
var Game = function(){
  //获取各种节点
  var $selector = document.querySelector('#selector'),
      $begin = document.querySelector('#begin'),
      $addCard = document.querySelector('#addCard'),
      $stopCard = document.querySelector('#stopCard'),
      $bankerul = document.querySelector('.banker'),
      $playerul = document.querySelector('.player');

  //游戏的初始化操作，将来返回要初始化游戏逻辑，去执行，事件处理被定义在游戏逻辑的初始化里并不是谁的属性
  var init = function(){
    //游戏本身的属性，
    var bj=new blackJack();

    //dom事件绑定代理做好准备
    eventBind.call(bj);
  }

  //统一事件分发
  var eventBind = function(){
    var bj = this;
    //事件委托
    $selector.addEventListener('click', function(e){
       if(e.target == $begin){
          //开始按钮隐藏，其他按钮出现
          $addCard.className+= ' block';
          $stopCard.className+= 'block';
          setTimeout(function(){
            $begin.className += ' hide';
          },0);
          //游戏开始第一次发牌
          divCards.call(bj, $bankerul, $playerul);
       }else if(e.target == $addCard){
          //加牌
          addCard();
       }else if(e.target == $stopCard){
          //停牌
          stopCard();
       }

    }, false);
  }

  return {
    init: init
  }

}();

Game.init();

//产生随机某张牌
var randCard = function(){
  var len = this.poker.length, idx;
      idx = Math.floor(Math.random()*len);
      card = this.poker[idx];

  this.poker.splice(idx, 1);
  return card;
}

//截取牌对应数值
var value = function (cardkind){
  var val = cardkind.slice(1);
  if(val == 1){
    return 11;
    //计算的时候应该判断一下当前的1是到底取11还是1
  }else if(isNaN(parseInt(val))){
    return 10;
  }else{
    return parseInt(val);
  }
}

//第一次发牌
var divCards = function($bankerul, $playerul){
  var i = 0, len = 3, cardkind, $li;
  for(i; i<len; i++){
    cardkind = randCard.call(this);
    //创建li
    $li = document.createElement('li');
    $li.className += ' '+cardkind;
    $li.setAttribute("data-val", value(cardkind));

    if(i == 2){
      $bankerul.appendChild($li);
      //处理背面那张图
      cardkind = randCard.call(this);
      $li = document.createElement('li');
      $li.className += ' back';
      $li.setAttribute("data-val", value(cardkind));
      $bankerul.appendChild($li);

      return;
    }
    $playerul.appendChild($li);
  }
}

//加牌
var addCard = function(){

}

//停牌
var stopCard = function(){

}

//游戏结局
var result = function(){

}

//当前金额
var curMoney = function(){

}
