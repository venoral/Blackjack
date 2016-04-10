//黑杰克类
function blackJack(){
  //红桃 黑桃 梅花 方片
  this.poker = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk',
                's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk',
                'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck',
                'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk'];
  this.curWager = 10;
  this.rules = '人物角色：庄家 pk 玩家。<br>'+
               '规则详情：游戏开始先给玩家发2张牌，再给庄家发2张（一张明牌，一张暗牌）。'+
               '玩家根据手中牌的点数可选择继续要牌还是停牌，若玩家选择要牌，系统再为其发一张牌；'+
               '若玩家选择停牌，则展示庄家暗牌，若庄家点数小于19，系统自动为庄家发牌直到等于19停止。'+
               '系统每发一次牌都会计算玩家或庄家当前点数。'+'其中A可作为1或11计算。<br>'+
               '可能情况：谁的点数和先等于21谁获胜';
}

//游戏逻辑类
var Game = function(){
  //获取各种节点
  var $selector = document.querySelector('#selector'),
      $begin = document.querySelector('#begin'),
      $rules = document.querySelector('#rules'),
      $addCard = document.querySelector('#addCard'),
      $wager = document.querySelector('#wager'),
      $stopCard = document.querySelector('#stopCard'),
      $bankerul = document.querySelector('.banker'),
      $playerul = document.querySelector('.player'),
      $countA = document.querySelector('.countA'),
      $countB = document.querySelector('.countB'),
      $promot = document.querySelector('.promot');
      $mask = document.querySelector('.mask');


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
          $addCard.className = ' block';
          $wager.className = ' block';
          $stopCard.className = 'block';

          setTimeout(function(){
            $begin.className = ' hide';
            $rules.className = ' hide';
          },0);

          //游戏开始第一次发牌
          divCards.call(bj, $bankerul, $playerul, $countA, $countB, $promot);
       }else if(e.target == $rules){
          //居中弹出规则
          $promot.innerHTML = bj.rules;
          $mask.className = $mask.className.replace('hide','block');
       }else if(e.target == $addCard){
          //加牌
          addCard.call(bj, $playerul, $countB, $promot);
       }else if(e.target == $stopCard){
          //停牌
          stopCard.call(bj, $bankerul, $countA, $countB, $promot);
       }
    }, false);

    $mask.addEventListener('click', function(e){
      if(e.target != $promot){
        //需要写个移除某类的框架
        if($countA.innerHTML == 0){
          $mask.className = $mask.className.replace('block','hide');
          return;
        }
        $mask.className = $mask.className.replace('block','hide');
        $countA.innerHTML = '0';
        $countB.innerHTML = '0';
        //移除li元素并加回到bj中
        var $lisb = $bankerul.querySelectorAll('li');
        for(var i=0;i<$lisb.length;i++){
          bj.poker.push($lisb[i].dataset.str);
          $bankerul.removeChild($lisb[i]);
        }
        var $lisp = $playerul.querySelectorAll('li');
        for(var i=0;i<$lisp.length;i++){
          bj.poker.push($lisp[i].dataset.str);
          $playerul.removeChild($lisp[i]);
        }
        //按钮显示及隐藏
        var blarr = document.querySelectorAll('button:not([class="hide"])');
        Array.prototype.forEach.call(blarr, function(item, idx){
          item.className= 'hide';
        });

        $begin.className = 'block';
        $rules.className = 'block';
      }
    },false);
  }

  return {
    init: init
  };

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

//计算当前牌的总点数判断情况
var count = function($ul, $span, $result, t){
  var obj = null, winner, sum = 0, $lis = $ul.querySelectorAll('li');
  winner = $ul.className == 'player' ? '玩家' : '庄家';
  for(var i=0;i<$lis.length;i++){
    if($lis[i].dataset.val == '11'){
      obj = $lis[i];
    }
    sum+=parseInt($lis[i].dataset.val);
    if(sum>21&&obj){
      //要是能进来只能进来一次，因为修改后最小就是20
      obj.setAttribute('data-val', 1);
      sum = count($ul, $span);
    }
  }
  $span.innerHTML = sum;

  //此处要加return 关键字，因为要result()的返回结果返回给sum，之前将result内容写在这的下面是因为跟count在一个函数内返回的结果直接就赋值给了sum
  return result(sum, $ul, $result, t);

}

//第一次发牌
var divCards = function($bankerul, $playerul, $countA, $countB, $result){
  var i = 0, len = 3, cardkind, $li;
  for(i; i<len; i++){
    cardkind = randCard.call(this);
    //创建li
    $li = document.createElement('li');
    $li.className += ' ' + cardkind;
    $li.setAttribute("data-val", value(cardkind));
    $li.setAttribute("data-str", cardkind);

    if(i == 2){
      $bankerul.appendChild($li);
      count($bankerul, $countA, $result);
      //处理背面那张图
      cardkind = randCard.call(this);
      $li = document.createElement('li');
      $li.className += ' back';
      $li.setAttribute("data-val", value(cardkind));
      $li.setAttribute("data-str", cardkind);
      $bankerul.appendChild($li);

      return;
    }
    $playerul.appendChild($li);
    count($playerul, $countB, $result);
  }

}

//加牌
var addCard = function($playerul, $countB, $result, time){
  cardkind = randCard.call(this);
  //创建li
  $li = document.createElement('li');
  $li.className += ' ' + cardkind;
  $li.setAttribute("data-val", value(cardkind));
  $li.setAttribute("data-str", cardkind);
  $playerul.appendChild($li);
  count($playerul, $countB, $result, time);
}

//停牌
var stopCard = function($bankerul, $countA, $countB, $result){

  //更换背面图片
  var $secChild = $bankerul.lastElementChild;
  var card = $secChild.dataset.str;
  var suma, sumb;
  //改变样式把图片反转过来
  $secChild.className = card;
  //计算
  $countA.innerHTML = parseInt($countA.innerHTML) + parseInt($secChild.dataset.val);

  //当翻开的那个牌与前一张已经是19时
  if($countA.innerHTML == '19'){
    //比较
    suma = parseInt($countA.innerHTML);
    sumb = parseInt($countB.innerHTML);
    //调用函数比较
    normalResult(suma, sumb, $result);
    return;
  }else if($countA.innerHTML == '21'){
    $result.innerHTML = '本局结束！<br>' + '庄家赢咯！<br>' + '点击提示框外部可重新开始游戏~';
    $result.parentNode.className += ' block';
    return;
  }

      //继续给庄家发 this要注意
      var time = setInterval(function(bj){
       return function(){
        addCard.call(bj, $bankerul, $countA, $result, time);
      };
      }(this),500);

}

//游戏结局
var result = function(sum, $ul, $result, t){
  var winner;
  winner = $ul.className == 'player' ? '玩家' : '庄家'
  if(sum == 21){
    clearInterval(t);
    $result.innerHTML = '本局结束！<br>' + winner + '赢咯！<br>' + '点击提示框外部可重新开始游戏~';
    $result.parentNode.className += ' block';
  }else if(sum > 21){
    clearInterval(t);
    $result.innerHTML = '本局结束！<br>' + winner + '输咯！<br>' + '点击提示框外部可重新开始游戏~';
    $result.parentNode.className += ' block';
  }else if(sum < 21){
    //所以加这句话在最里面递归的时候出来该函数
    if(sum == 19 && winner == '庄家'){
      clearInterval(t);
      //比较

     // normalResult(19, sumb, $result);
    }
    return sum;
  }
}

//当玩家和庄家都未越界，判断输赢
var normalResult = function(suma, sumb, $result){
   if(suma >sumb){
      $result.innerHTML = '本局结束！<br>' + '庄家赢咯！<br>' + '点击提示框外部可重新开始游戏~';
      $result.parentNode.className += ' block';
    }else if(suma == sumb){
      $result.innerHTML = '本局结束！<br>' + '哎呦~不分胜负咯！<br>' + '点击提示框外部可重新开始游戏~';
      $result.parentNode.className += ' block';
    }else{
      $result.innerHTML = '本局结束！<br>' + '玩家赢咯！<br>' + '点击提示框外部可重新开始游戏~';
      $result.parentNode.className += ' block';
    }
}

//当前金额
var curMoney = function(){

}
