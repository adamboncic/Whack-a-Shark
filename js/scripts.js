$(document).ready(function() {

  var isTimerOn = false;
  
  function newSpot(){
      // viewport - dimension of obj
      var height = $(window).height() - 50;
      var width = $(window).width() - 50;
      var newheight = Math.floor(Math.random() * height);
      var newwidth = Math.floor(Math.random() * width);
      return [newheight,newwidth];
  }

  function moveSharks(obj){
      var newspot = newSpot();
      var oldspot = $(obj).offset();
      var speed = howFast([oldspot.top, oldspot.left], newspot);
      $(obj).animate({ top: newspot[0], left: newspot[1] }, speed, function(){
        moveSharks(obj);
      });
  };

  function howFast(prev, next) {
      var x = Math.abs(prev[1] - next[1]);
      var y = Math.abs(prev[0] - next[0]);
      var greatest = x > y ? x : y;
      var vel = 0.1;
      var newspeed = Math.ceil(greatest/vel);
      return newspeed;
  }
  
  (function() {

  (function(window,document,undefined){
    //  "use strict";
          var init = function(){
              var points = 0;
              var gameActive = false;
              var canvas = document.body;
              var icon_template = document.querySelector('#shark');
              var icon_width = 40;
              var icon_height = 30;
              var the_images = [
                  './img/Shark.png',
                  './img/Shark1.png',
                  './img/Shark2.png',
                  './img/Shark3.png'
              ];
              var pickRandomImage = function(){
                  var i = Math.floor( Math.random() * the_images.length );
                  return the_images[i];
              };
              var total_number_of_images = 7;
              var max_height = canvas.offsetHeight - icon_height;
              var max_width = canvas.offsetWidth - icon_width;

              var randomCoordinate = function(){
                  var r = [];
                  var x = Math.floor( Math.random() * max_width );
                  var y = Math.floor( Math.random() * max_height );
                  r = [x,y];
                  return r;
              };
              
              //Refresh game if no activity
              (function(seconds) {
                var refresh,       
                    gameRefresh = function() {
                        clearInterval(refresh);
                        refresh = setTimeout(function() {
                           location.href = location.href;
                        }, seconds * 1000);
                    };
            
                $(document).on('keypress click', function() { gameRefresh() });
                gameRefresh();
            
            }(15)); // define here second
       
              //3-2-1 Countdown
              function endCountdown() {
                // logic to finish the countdown here
                $('.begin').hide();
                beginGame()
              }

              function handleTimer() {
                if(count === 0) {
                  clearInterval(timer);
                  endCountdown();
                } else {
                  count --;
                  $('#count_num').html(count);
                }
              }
              
              var count = 3;

              //Endgame Timer
              function endClock() {
                // logic to finish the countdown clock here
                $('.game-over').show();
                endgame();
              }

              function handleClock() {
                if(seconds === 0) {
                  clearInterval(timer);
                  endClock();
                  //ten second mark to endgame
                } else if (seconds <=11) {
                  $('#ticker').css('color','red');
                  seconds --;
                  $('#ticker').html(seconds);
                }
                else {
                  seconds --;
                  $('#ticker').html(seconds);
                }
              }
              
              var seconds = 31;

              function doHit(e) {
                e.addClass('active');
                setTimeout(function() {
                  e.fadeOut('slow').remove();
                  setTimeout( () => {
                    if($('.Shark:not(#shark)').length < 7 ){
                      createImage();
                  }
                  }, 1000 );
                  console.log('Hit!');
                }, 900);
                playSound("bloop");
              };

              $(document).on('click', '.Shark', function() {
                var item = $(this);
                if(gameActive){
                  if(!$(this).hasClass('inactive')) {
                    doHit(item);
                    addPoints("points");
                    this.disabled = true;
                  }
               }
              });

              $(document).on('click', '.restart', '.clock', function() {
                points = 0;
                count = 4;
                $('.begin').show();
                $('#count_num').html("Tap to Begin");
                window.location.reload(true);
                $('#ticker').html(" ");
                $('.game-over').hide();
                clearInterval(timer);
                $('#ticker').css('color','yellow');   
              });

              $(document).on('click', '.begin', function() {
                if (!isTimerOn) { 
                isTimerOn = true;
                count = 4;
                handleTimer();
                $('#count_num').html(count);
                timer = setInterval(function() { handleTimer(); }, 1000);
                }
              });

              // If the window is resized, adjust the size of the canvas
              $(window).on("resize", function(){
                max_height = canvas.offsetHeight - icon_height;
                max_width = canvas.offsetWidth - icon_width;
              });
              
              function endgame() {
                stopSound("game-music");
                $('.game-over').show();
                $('.Shark').hide();
                $('#ticker').html(" ");
                clearInterval(timer);
                gameActive = false;
              }

              function beginGame(){
                isTimerOn = false;
                points = 0;
                playSound("game-music");
                if($('.begin').is(":visible")){
                  $('.begin').hide();
                }
                $('.Shark:not(#shark)').show()
                seconds = 31;
                gameActive = true;
                setTimeout(endgame, 30000);
                handleClock();
                $('#ticker').html(seconds);
                timer = setInterval(function() { handleClock(); }, 1000);        
              }
              
              function playSound(x) {
                var s = document.getElementById(x);
                s.play();
              };

              function stopSound(x) {
                var s = document.getElementById(x);
                s.pause();
                s.currentTime = 0;
              };

              function addPoints(x){
                var p = document.getElementById(x);
                points++;
                p.innerHTML = points;
              };

            function initImages(){
              let numImages = 7;
              for(let i = 0; i < numImages; i++ ){
                createImage();
              }
            }

            function createImage(){
              var node = icon_template.cloneNode(true);
              var xy = randomCoordinate();
              node.removeAttribute('id');
              node.style.top = xy[1] + 'px';
              node.style.left = xy[0] + 'px';
              node.setAttribute('src',pickRandomImage());
              // Add
              setTimeout(function() {
                canvas.appendChild(node);
                if(!gameActive){
                  $(node).hide();
                }else{
                  $(node).show();
                }
                setTimeout(function() {
                  if(!node.classList.contains('active')) {
                    node.classList.remove('Shark');
                    node.classList.add('inactive');
                    setTimeout(function() {
                      node.remove();
                      
                      createImage();
                    }, 900);
                  }
                }, 500 + Math.random() * 5000);
              }, Math.floor(Math.random() * 900) + 500);
              moveSharks(node);

            }
            initImages();
          };

         window.addEventListener('load',init);
  })(window,document);
  })();

  var messagesRef = new Firebase("https://whack-a-shark.firebaseio.com");
  var messageList = $('#msgList');

  var points = $('#points').html();
  messagesRef.orderByChild('points').limitToLast(10).on('child_added', function(snapshot) {
    //GET DATA
    var data = snapshot.val();
    var username = data.chat.name || "anonymous";
    var userpoints = data.chat.points;

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var messageElement = $("<li>");
    var nameElement = $("<strong class='example-chat-username'></strong>");
    nameElement.text(username + ': ');
    messageElement.text(userpoints).prepend(nameElement);
    messageList.prepend(messageElement)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    // messageList[0].scrollTop = messageList[0].scrollHeight;
  });

  $('#send_score').click(function(){
    swal({
    title: 'Enter your name for the leaderboard:',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    customClass: 'animated tada score_board',
    confirmButtonClass: 'btn-leaderboard',
    cancelButtonClass: 'btn-leaderboard',
    preConfirm: (text) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!text) {
            swal.showValidationError(
              'You must enter your name.'
            )
          }
          resolve()
        }, 2000)
      })
    },
    allowOutsideClick: () => !swal.isLoading()
  }).then((result) => {
    if (result.value) {
      var messageList = $('#msgList');
      var points = $('#points').html();
      messagesRef.push({
        chat: {
          name: result.value,
          points: points.toString()
        }
      });
      swal({
        type: 'success',
        title: 'Score submitted!'
      })
    }
  })
  })

  $('#view_scores').click(function(){
    var board = $('#msgList').clone();
    swal({
      title: 'Recent Scores',
      html: $('<div>').addClass('modal_board')
        .append(board),
      customClass: 'animated tada score_board',
      confirmButtonClass: 'btn-leaderboard',
    });
  });

});
