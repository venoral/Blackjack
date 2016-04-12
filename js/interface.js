//与页面dom操作变化相关
var Interfaces = {
  //显示的牌点值
  cardPoint : {
    banker : Config.actor.banker.cardPoint,
    player : Config.actor.player.cardPoint
  },

  //余额值
  balance : Config.actor.player.initMoney,

  divCards : function($banker, $player, $countA, $countB, $mask, $promot, $balance){
    //创建4个li并添加到ul
    var i = 0, $li, card, val;
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
          this.cardPoint.player = Util.getCount($player);
          Util.updatePoint($countB, 'player')
          //每加一张牌判断是否越界
          Util.overFlow('玩家', $mask, $promot, $balance, $banker, $player);
        }else if(i ==2){
          this.cardPoint.banker = Util.getCount($banker);
          Util.updatePoint($countA, 'banker');
          //判断是否越界
          Util.overFlow('庄家', $mask, $promot, $balance, $banker, $player);

        }
      }
    },
    //提示框的隐藏或展现，flag标记为false表示不隐藏
  promotMes : function ($mask, $promot, flag, mes){
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
  addCard : function (currole, $parent, $count, $mask, $promot, $balance, $banker, $player){

      var $li, card, val, sum, role;
      $li = Util.appToEle('li', $parent);
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
      this.cardPoint[role] = Util.getCount($parent);
      Util.updatePoint($count, role);

      Util.overFlow(currole, $mask, $promot, $balance, $banker, $player);


    },
  //停牌
  stopCard : function (currole, $parent, $count, $mask, $promot, $balance, $banker, $player){
    //背过去的图片反转，计算点数判断越界
    $li = $parent.lastElementChild;
    $li.className = $li.dataset.str;

    this.cardPoint.banker = Util.getCount($parent);

    Util.updatePoint($count, 'banker');
    if(this.cardPoint.banker >= 19){
      Util.overFlow(currole, $mask, $promot, $balance, $banker, $player);
      return;
    }


    //系统自动加牌
    Interfaces.timer = setInterval(function (){

      Interfaces.addCard(currole, $parent, $count, $mask, $promot, $balance, $banker, $player);


    }, 500);

  }
}
