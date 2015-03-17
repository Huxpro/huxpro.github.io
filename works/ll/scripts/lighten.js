/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
  'use strict';

  var navdrawerContainer = document.querySelector('.navdrawer-container');
  var appbarElement = document.querySelector('.app-bar');
  var menuBtn = document.querySelector('.menu');
  var main = document.querySelector('main');

  function closeMenu() {
    // appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
    clearStyle();
    
  }

  function toggleMenu() {
    // appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    clearStyle();
  }
  
  function touchMenu(){
    menuBtn.removeEventListener('click', toggleMenu);
    toggleMenu();
  }

  function clearStyle(){
    var transformStyle = "";

    navdrawerContainer.style.msTransform = transformStyle;
    navdrawerContainer.style.MozTransform = transformStyle;
    navdrawerContainer.style.webkitTransform = transformStyle;
    navdrawerContainer.style.transform = transformStyle;
  }

  main.addEventListener('touchstart', closeMenu);
  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('touchstart',touchMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
  navdrawerContainer.addEventListener('touchend', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
  
  // //Hux Custom
  navdrawerContainer.addEventListener("touchmove",onDrawerScroll);
  function onDrawerScroll(e){
    e.preventDefault();
  }
  
})();

// Shim for requestAnimationFrame from Paul Irishpaul ir
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/ 
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// Hux TouchMove Support Test

var drawer = document.querySelector('.navdrawer-container');
var main = document.querySelector('main');

var dra = {
  x : 0,
  y : 0,
}
var initPoint = {};
var lastPoint = {};
var target = {};  // LastHold
var isAnimating = false;

drawer.addEventListener('touchstart',onDrawerStart);

function onDrawerStart(e){
  drawer.addEventListener('touchmove',onDrawerMove);
  drawer.addEventListener('touchend',onDrawerEnd);
  initPoint.x = e.targetTouches[0].clientX;
  console.log("touchstart");

}

function onDrawerMove(e){
  e.preventDefault();
  lastPoint.x = e.targetTouches[0].clientX;
  isAnimating = true; 
  window.requestAnimFrame(onDrawerAnimate);
  console.log('touchmove');
}

function onDrawerAnimate(){
   if(!isAnimating) {
    return;
  }

  var diff = {};
  diff.x = lastPoint.x - initPoint.x;
  target.x = dra.x + diff.x ;

  limitValue(target);
  var transformStyle = "translate3d(" + target.x + "px," + "0,0)";
    drawer.style.msTransform = transformStyle;
    drawer.style.MozTransform = transformStyle;
    drawer.style.webkitTransform = transformStyle;
    drawer.style.transform = transformStyle;
}

function onDrawerEnd(e){
  drawer.removeEventListener('touchmove',onDrawerMove);
  drawer.removeEventListener('touchend',onDrawerEnd);
  isAnimating = false;
  console.log('touchend');
  checkPosition();
}

function limitValue(target){
  if(target.x > 0 ){
    target.x = 0;
  }
}

function checkPosition(){
  if(target.x < -50){
    console.log(" Close !! ");

    (function closeMenu() {
      // drawer.removeEventListener('touchstart',onDrawerStart);
      drawer.classList.remove('open');
      var transformStyle = "";

      drawer.style.msTransform = transformStyle;
      drawer.style.MozTransform = transformStyle;
      drawer.style.webkitTransform = transformStyle;
      drawer.style.transform = transformStyle;
    })();
  }else{
      dra.x = 0;
      dra.y = 0;

      var transformStyle = "translate3d(0,0,0)";

      drawer.style.msTransform = transformStyle;
      drawer.style.MozTransform = transformStyle;
      drawer.style.webkitTransform = transformStyle;
      drawer.style.transform = transformStyle;

  };
}


//welcome & login page

$("#welcome").on('touchmove',function(e){
  e.preventDefault();
})