# BC-Projects

Smart Contract "Rock-Scissors-Paper Game"
Made based on the course material (not mine).

Была дана Web-игра, работающая только на JavaScript (html+css+js).

Что сделано:
1. Разработан и развернут на платформе remix.org смарт-контракт "Игра "Камень-ножницы-бумага".
2. Файлы Web-игры переработаны:
  2.1) происходит соединение с контрактом,
  2.2) в функцию контракта отправляется ход пользователя, сделанный на сайте,
  2.3) принимаются результаты игры с remix.org,
  2.4) эти результаты обрабатываются для оформления dAap.
  
  A Web game was given that works only on JavaScript (html+css+js).
  
  What's done:
1. Smart contract "Rock-Paper-Scissors game" was developed and deployed on the platform remix.org.
2. The Web game files have been redesigned:
  2.1) the connection with the contract takes place,
  2.2) the user's move made on the site is sent to the contract function,
  2.3) the results of the game are accepted with remix.org,
  2.4) these results are processed for dAap registration.
  
**_____________________________________________________________________________________________________**
  
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  1) Есть пока глюк: по мере выполнения игр при выигрыше к счету прибавляется не 1 очко, а количество сыгранных игр.
  ***Но победитель определяется верно при каждой игре.***
  3) В dApp не реализована возможность регулирования платы за взаимодействие по контракту, а также вывода средств.
     Хотя в самом контракте это есть.
  3) Нужно также получать информацию (логи) с Remix по состоянию контракта.
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  **Это действительно работает контракт, развернутый на Remix, а не JavaScript.**
