//公共
var  Util = {
    //统计
    //注册事件监听

    //获取事件对象

    //获取元素
    getElement : function(sel){
      return document.querySelector(sel);
    },
    //隐藏某按钮并显示某按钮
    butState : function($parent){
      //需注意this要传进去
      var arrShow, arrHide, hide = $parent.dataset.hide, show = $parent.dataset.show, $item ;
          arrShow = $parent.dataset.show.split(' ');
          arrShow.forEach( function(item, idx){
            $item = this.getElement('#' +item);
            $item.className = 'hide';
          }, this);

          arrHide = $parent.dataset.hide.split(' ');
          arrHide.forEach( function(item, idx){
            $item = this.getElement('#' +item);
            $item.className = 'block';
          }, this);
      $parent.setAttribute('data-hide', show);
      $parent.setAttribute('data-show', hide);
    },
    //创建ele1元素并添加ele2元素中(ele2文档中需已存在)
    appToEle : function (str, ele2){
      var ele1 = document.createElement(str);
      ele2.appendChild(ele1);
      return ele1;
    },
    //产生随机一张牌
    randCard : function (){
      var pok = Config.porker, len, idx;
          len = pok.length;
          idx = Math.floor(Math.random()*len);
          card = pok[idx];
      pok.splice(idx,1);
      return card;
    },
    //截取牌对应数值，如果是1默认值为11
    cardVal : function (card){
      var val = card.slice(1);
      if(val == '1'){
        return 11;
      }else if(/[jqk]/.test(val)){
        return 10;
      }else{
        return val;
      }
    },
    //遍历ul元素所有li元素上的data-val求总值并处理大于21情况
    getCount : function ($ul){
      var count = 0, i= 0, cardA = [];
      Array.prototype.forEach.call($ul.querySelectorAll('li'), function(item, idx){
        count += parseInt(item.dataset.val);

        if(item.dataset.val == '11'){
          cardA.push(item);
        }
        if(count > 21 && cardA.length > 0) {
          cardA[i].dataset.val = 1;
          i++;//计数进来几次
          count -= 10;
        }
      });
      return count;
    },
    //判断是否越界并给出结果
    overFlow : function (currole, $mask, $promot, $balance, $bankerul, $playerul){
      var winb = '玩家输了！<br>' + '点击提示框外部可再来一局~',
      winp = '玩家赢了！<br>' + '点击提示框外部可再来一局~',
      windraw = '哎呦~不分胜负！' + '点击提示框外部可再来一局~';
      if(currole == '庄家'){
        sum = Interfaces.cardPoint.banker;
      }else{
        sum = Interfaces.cardPoint.player;
      }

      switch ( true ) {
        case sum > 21:
          if(currole == '庄家'){
            clearInterval(Interfaces.timer);
            Interfaces.promotMes($mask, $promot, false, winp);
            Util.updateBalance($balance, 10);
          }else{
            Interfaces.promotMes($mask, $promot, false, winb);
          }
          break;
        case sum == 21:
          if(currole == '庄家'){
            clearInterval(Interfaces.timer);
            //玩家输
            Interfaces.promotMes($mask, $promot, false, winb);
          }else{
            //玩家第一次就是21要判断此时庄家是否也是21
            var len = $playerul.querySelectorAll('li').length;
            if(len == 2 && this.getCount($bankerul) == 21){
              //平手
              Interfaces.promotMes($mask, $promot, false, windraw);
              Util.updateBalance($balance, 10);
            }else if(len ==2){
              //玩家胜,玩家是黑杰克中彩了获得双倍赌注
              Interfaces.promotMes($mask, $promot, false, winp);
              Util.updateBalance($balance, 20);
            }else{
              //普通获胜
              Interfaces.promotMes($mask, $promot, false, winp);
              Util.updateBalance($balance, 10);
            }
          }
          break;
        case sum < 21:
          if(currole == '庄家' && sum >= 19){
              clearInterval(Interfaces.timer);
              //都未越界比较玩家和庄家点数
              var bsum, psum;
              bsum = Interfaces.cardPoint.banker;
              psum = Interfaces.cardPoint.player;
              if(bsum > psum){
                Interfaces.promotMes($mask, $promot, false, winb);
              }else if(bsum < psum){
                Interfaces.promotMes($mask, $promot, false, winp);
                Util.updateBalance($balance, 10);
              }else{
                Interfaces.promotMes($mask, $promot, false, windraw);
                Util.updateBalance($balance, 10);
              }
          }
          break;
      }

    },
    //清除ul中li并将li的val加回到Config.porker
    clearItem : function (){
     var $lis, i;
     Array.prototype.forEach.call(document.querySelectorAll('ul'), function ($ul, idx){
        $lis = $ul.querySelectorAll('li');
        for(i = 0; i<$lis.length; i++){
             Config.porker.push($lis[i].dataset.str);
             $ul.removeChild($lis[i]);
        }
     });

     Interfaces.cardPoint.banker = 0;
     Interfaces.cardPoint.player = 0;
    },
    //牌总值与innerHTML同步更新
    updatePoint : function ($count, str){

       $count.innerHTML = Interfaces.cardPoint[str];

    },
    //余额值与innerHTML同步更新
    updateBalance : function ($balance, num){
       Interfaces.balance += num;
       $balance.innerHTML = Interfaces.balance;

    }

}
