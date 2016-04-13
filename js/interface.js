//与页面dom操作变化相关
var Interfaces = {

  //参与者的信息 牌当前总点数， 牌当前张数，当前余额
  roleInfo : {
    banker :{
      cardPoint : Config.actor.banker.cardPoint,
      cardAmount : 0,
      balance : Config.actor.banker.initMoney
    },
    player :{
      cardPoint : Config.actor.player.cardPoint,
      cardAmount : 0,
      balance : Config.actor.player.initMoney

    }
  },


  //发牌
  divCards : function($banker, $player, $countB, $countP, $mask, $promot, $balance, $bankerBalance){
    //创建4个li并添加到ul
    var i = 0, $li, card, val, result;
    for(i; i<4; i++){
        if(i == 2){
           $li = Util.appToEle('li',$banker);
        }else if(i == 3){
           $li = Util.appToEle('li',$banker);
           $li.className = 'unknow';
        }else{
           $li = Util.appToEle('li',$player);
        }
        card = Util.randCard();
        val = Util.cardVal(card);
        $li.className = $li.className !='' ? $li.className : card;
        $li.setAttribute('data-val', val);
        $li.setAttribute('data-str', card);
        //计算点数
        if(i < 2){
          //更新参与者信息
          Util.updateRoleInfo($player, $countP, 'player');
          //每加一张牌判断是否越界
          result = Util.overFlow('玩家', $balance, $banker, $bankerBalance);
          if(result){
            this.promotMes($mask, $promot, false, result);
          }

        }else if(i >=2){
          //更新参与者信息
          Util.updateRoleInfo($banker, $countB, 'banker');
          //判断是否越界
          result = Util.overFlow('庄家', $balance, $banker, $bankerBalance);
          if(result){
            this.promotMes($mask, $promot, false, result);
          }

        }
      }
      //判断当前玩家是不是"黑杰克"
      if(Interfaces.roleInfo.player.cardAmount == 2 && Interfaces.roleInfo.player.cardPoint == 21){
        Interfaces.stopCard('庄家', $banker, $countB, $mask, $promot, $balance, $banker, $bankerBalance);
      }

    },
    //提示框的隐藏或展现，flag标记为false表示不隐藏
  promotMes : function ($mask, $promot, flag, mes){
      //检查玩家当前余额是否为0
      if(Interfaces.roleInfo.player.balance == 0 ){
        mes = mes + '<br>本场游戏已结束！玩家当前余额为0！';
      }
      if(Interfaces.roleInfo.banker.bankerBalance == 0){
        mes = mes + '<br>本场游戏已结束！玩家获得庄家全部金额！';
      }
      //标志位true关闭提示框
      if(flag){
         $mask.className = 'mask hide';
         return;
      }

      $promot.innerHTML = mes;
      //判断当前是哪种提示框
      if(mes.length < 50){
        $promot.className += ' result';
      }else{
        $promot.className = 'promot';
      }
      $mask.className = 'mask block';
    },
  //加一张牌
  addCard : function (currole, $role, $count, $mask, $promot, $balance, $banker, $bankerBalance){

      var $li, card, val, sum, role, result;
      $li = Util.appToEle('li', $role);
      card = Util.randCard();
      val = Util.cardVal(card);
      $li.className = card;
      $li.setAttribute('data-val', val);
      $li.setAttribute('data-str', card);

      if(currole == '庄家'){
        role = 'banker';
      }else{
        role = 'player';
      }

      Util.updateRoleInfo($role, $count, role);

      result = Util.overFlow(currole, $balance, $banker, $bankerBalance);
      if(result){
        this.promotMes($mask, $promot, false, result);
      }

    },
  //停牌
  stopCard : function (currole, $role, $countB, $mask, $promot, $balance, $banker, $bankerBalance){
    var $li, over;
    //背过去的图片反转，计算点数判断越界
    $li = $role.lastElementChild;
    $li.className = $li.dataset.str;

    Util.updateRoleInfo($role, $countB, 'banker', false);

    if(this.roleInfo.banker.cardPoint >= 19){
      result = Util.overFlow(currole, $balance, $banker, $bankerBalance);
      if(result){
        this.promotMes($mask, $promot, false, result);
      }

      return;
    }


    //系统自动加牌
    Interfaces.timer = setInterval(function (){

      Interfaces.addCard(currole, $role, $countB, $mask, $promot, $balance, $banker, $bankerBalance);


    }, 500);

  }
}
