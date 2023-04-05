# BC-Projects

## RSPdApp folder. It contains "Rock-Scissors-Paper Game" dApp (i. e. executes the smart contract via frontend user interface).
**Made based on the course material. Exactly, the teachers of the course gave a Web-game "Rock Paper Scissors", working only on JavaScript (that is, everything was counted in the Web-application).**


Была дана Web-игра "Камень-ножницы-бумага", работающая только на JavaScript (то есть весь счет происходил в этом Web-приложении).

Что сделано:
- [1]. Разработан и развернут на платформе remix.org смарт-контракт "Игра "Камень-ножницы-бумага".
- [2]. Файлы Web-игры переработаны:
  - [2.1] происходит соединение с контрактом,
  - [2.2] в функцию контракта отправляется ход пользователя, сделанный на сайте,
  - [2.3] принимаются результаты игры с remix.org,
  - [2.4] эти результаты обрабатываются для оформления dAap (после каждой игры по контракту в **Remix** счет по играм ведется в **dApp**).
  - [2.5] dApp [развернуто](http://oademi.kz/RSPweb/index.html).
  
<details><summary>Explanation</summary>
  A Web game was given that works only on JavaScript (that is, everything was counted in the Web-application).
  
  What's done:
- [1]. Smart contract "Rock-Paper-Scissors game" was developed and deployed on the platform remix.org.
- [2]. The Web game files have been redesigned:
  - [2.1] the connection with the contract takes place,
  - [2.2] the user's move made on the site is sent to the contract function,
  - [2.3] the results of the game are accepted with remix.org,
  - [2.4] these results are processed for dAap decoration (after each contract game in **Remix** the scores are counted in **dAap**).
  - [2.5] dAap [deployed](http://oademi.kz/RSPweb/index.html).
</details>
  
**___________________________________________________________________________**

**Это действительно работает контракт, развернутый на Remix, а не JavaScript.**
**___________________________________________________________________________**
  

 - [x] ***Важно то, что победитель определяется верно при каждой игре.***
 - [ ] В dApp не реализована возможность регулирования платы за взаимодействие по контракту, а также вывода средств.
     Хотя в самом контракте эти возможности реализованы.
 - [ ] Есть пока глюк: по мере выполнения игр при выигрыше к счету прибавляется не 1 очко, а количество сыгранных игр. Его достаточно легко исправить. _Причина в транзакциях со статусом "Failed". И если захватывать в dApp (в js) данные  об ошибке транзакции, то этот недочет легко исправится. Позже постараюсь выполнить._
 - [ ] Будет удобно, если в приложении dApp можно будет получать информацию (логи) с Remix по состоянию контракта. Это и необходимо для устранения глюка, описанного выше.

  
<details><summary>...</summary>
**Это действительно работает контракт, развернутый на Remix, а не JavaScript**
</details>
