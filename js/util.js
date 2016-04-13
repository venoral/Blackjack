//公共
var  Util = {
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
        if(item.className == 'unknow'){
          return;
        }
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
    overFlow : function (currole, $balance, $bankerul, $bankerBalance){
      var winb = '玩家输了！<br>' + '点击提示框外部可再来一局~',
          winp = '玩家赢了！<br>' + '点击提示框外部可再来一局~',
          windraw = '哎呦~不分胜负！<br>' + '点击提示框外部可再来一局~';
      var num ; //玩家需要减少的量
      if(currole == '庄家'){
        sum = Interfaces.roleInfo.banker.cardPoint;
      }else{
        sum = Interfaces.roleInfo.player.cardPoint;
      }

      switch ( true ) {
        case sum > 21:
          if(currole == '庄家'){
            clearInterval(Interfaces.timer);
            num = Util.updateBankerBalance($bankerBalance, -10);
            Util.updateBalance($balance, num + 10);
            return winp;
          }else{
            Util.updateBankerBalance($bankerBalance, 10);
            return winb;
          }
          break;
        case sum == 21:
          if(currole == '庄家'){
            clearInterval(Interfaces.timer);
            //庄家等于21时候看这时候玩家两张牌是不是21,是的话平手
            if(Interfaces.roleInfo.player.cardAmount == 2 &&Interfaces.roleInfo.player.cardPoint == 21){
              Util.updateBalance($balance, 10);
              return windraw;
            }

            //玩家输
              Util.updateBankerBalance($bankerBalance, 10);
              return winb;
          }else{
            //玩家第一次就是21要判断此时庄家是否也是21，先不做任何事等playerli节点插完再说
            if(Interfaces.roleInfo.player.cardAmount == 2){
              return ;
            }else{
              //玩家不是在第一次发牌时就是21的情况
              num = Util.updateBankerBalance($bankerBalance, -10);
              Util.updateBalance($balance, num + 10);
              return winp;
            }
          }
          break;
        case sum < 21:
          //系统第一次分发四张牌玩家点数为21时，看庄家牌数为2且值要小于21，此时玩家才是黑杰克可获得三倍赌注
          if(currole == '庄家' && Interfaces.roleInfo.banker.cardAmount ==2 && $bankerul.lastElementChild.className != 'unknow'){
            if(Interfaces.roleInfo.player.cardAmount == 2 &&Interfaces.roleInfo.player.cardPoint == 21){
              num = Util.updateBankerBalance($bankerBalance, -20);
              //判断够不够减少的量
              Util.updateBalance($balance, num + 10);
              return '玩家是黑杰克！<br>' + winp;
            }
          }

          //其他情况
          if(currole == '庄家' && sum >= 19){
              clearInterval(Interfaces.timer);
              //都未越界比较玩家和庄家点数
              var bsum, psum;
              bsum = Interfaces.roleInfo.banker.cardPoint;
              psum = Interfaces.roleInfo.player.cardPoint;
              if(bsum > psum){
                Util.updateBankerBalance($bankerBalance, 10);
                return winb;
              }else if(bsum < psum){
                num = Util.updateBankerBalance($bankerBalance, -10);
                Util.updateBalance($balance, num + 10);

                return winp;
              }else{
                Util.updateBalance($balance, 10);
                return windraw;
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

     Interfaces.roleInfo.banker.cardPoint = 0;
     Interfaces.roleInfo.player.cardPoint = 0;
     Interfaces.roleInfo.banker.cardAmount = 0;
     Interfaces.roleInfo.player.cardAmount = 0;
    },
    //参与者牌信息的更新 与牌总值 innerHTML同步更新
    updateRoleInfo : function ($role, $count, str, flag){
       Interfaces.roleInfo[str].cardPoint = Util.getCount($role);
       //flag为false表示当前这次不计数
       if(flag == false){
          $count.innerHTML = Interfaces.roleInfo[str].cardPoint;
          return ;
       }
       //新的一局的开始清空在clearItem中amount计数，所以就不进该判断条件了
       if(Interfaces.roleInfo[str].cardPoint!=0){
          Interfaces.roleInfo[str].cardAmount +=1;
       }
       $count.innerHTML = Interfaces.roleInfo[str].cardPoint;

    },
    //玩家余额值与innerHTML同步更新
    updateBalance : function ($balance, num){

       Interfaces.roleInfo.player.balance += num;
       $balance.innerHTML = Interfaces.roleInfo.player.balance;

    },
    //庄家余额值与innerHTML同步更新
    updateBankerBalance : function ($bankerBalance, num){

       var returnnum = Interfaces.roleInfo.banker.balance;
       if(returnnum + num < 0){

         Interfaces.roleInfo.banker.balance = 0;
         $bankerBalance.innerHTML = Interfaces.roleInfo.banker.balance;
         return returnnum;
       }else{
         Interfaces.roleInfo.banker.balance += num;
         $bankerBalance.innerHTML = Interfaces.roleInfo.banker.balance;
         return -num;
       }

    }

}
