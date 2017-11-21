// window.requestAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000/60);
    });
}

// window.cancelRequestAnimationFrame
if (!window.cancelRequestAnimationFrame) {
  window.cancelRequestAnimationFrame = (window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    window.clearTimeout);
}

window.utils = {};

window.utils.captureMouse = function(element) {
  var bodyElem = document.body,
    docElem = document.documentElement,
    mouse = { x: 0, y: 0, event: null },
    bodyScrollLeft = bodyElem.scrollLeft,
    bodyScrollTop = bodyElem.scrollTop,
    docScrollLeft = docElem.scrollLeft,
    docScrollTop = docElem.scrollTop,
    offsetLeft = element.offsetLeft,
    offsetTop = element.offsetTop;

  element.addEventListener('mousemove', function(e) {
    var x, y;

    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + bodyScrollLeft + docScrollLeft;
      y = e.clientY + bodyScrollTop + docScrollTop;
    }

    x -= offsetLeft;
    y -= offsetTop;

    mouse.x = x;
    mouse.y = y;
    mouse.event = e;
  }, false);

  return mouse;
};

window.utils.captureTouch = function(element) {
  var bodyElem = document.body,
    docElem = document.documentElement,
    finger = { x: null, y: null, isPressed: false, event: null },
    bodyScrollLeft = bodyElem.scrollLeft,
    bodyScrollTop = bodyElem.scrollTop,
    docScrollLeft = docElem.scrollLeft,
    docScrollTop = docElem.scrollTop,
    offsetLeft = element.offsetLeft,
    offsetTop = element.offsetTop;

  element.addEventListener('touchstart', function(e) {
    finger.isPressed = true;
    finger.event = e;
  }, false);

  element.addEventListener('touchmove', function(e) {
    var x, y, touch = e.touches[0];

    if (touch.pageX || touch.pageY) {
      x = touch.pageX;
      y = touch.pageY;
    } else {
      x = touch.clientX + bodyScrollLeft + docScrollLeft;
      y = touch.clientY + bodyScrollTop + docScrollTop;
    }

    x -= offsetLeft;
    y -= offsetTop;

    finger.x = x;
    finger.y = y;
    finger.event = e;
  }, false);

  element.addEventListener('touchend', function(e) {
    finger.isPressed = false;
    finger.x = null;
    finger.y = null;
    finger.event = e;
  }, false);

  return finger;
};

window.utils.containsPoint = function(rect, x, y) {
  return !(x < rect.x || 
    x > rect.x + rect.width ||
    y < rect.y ||
    y > rect.y + rect.height);
};

window.utils.intersects = function(rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y);
};

window.utils.drag = function(element) {};