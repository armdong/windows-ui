var API = {};

/*--------------------------------------*\
  API Helper Functions
\*--------------------------------------*/

API.newId = function() {
  return _.uniqueId();
};

API.newName = function(list, type, name) {
  var index = 1;

  var names = list.data().filter(function(elem) {
    return elem.type == type;
  }).map(function(elem) {
    return elem.name;
  });

  if (names.length == 0) {
    return name;
  }

  if (names.indexOf(name) === -1) {
    return name;
  } else {
    while (names.indexOf(name + '(' + index + ')') !== -1) {
      index++;
    }
    return name + '(' + index + ')';
  }
};

API.checkNameExists = function(list, opts) {
  var id = opts.id,
    type = opts.type,
    name = opts.name;

  var names = list.data().filter(function(elem) {
    return elem.id !== id && elem.type === type;
  }).map(function(elem) {
    return elem.name;
  });

  return names.indexOf(name) > -1;
};

API.convertFloat2Absolute = function(elements) {
  var positions = [];
  
  // 拿到所有文件位置信息
  elements.forEach(function(element) {
    var top = element.offsetTop,
      left = element.offsetLeft;

    positions.push({
      top: top,
      left: left
    });
  });
  
  // 更改成 absolute 布局
  elements.forEach(function(element, index) {
    element.style.position = 'absolute';
    element.style.top = positions[index].top + 'px';
    element.style.left = positions[index].left + 'px';
    element.style.zIndex = 9;
    element.style.margin = '0px';
  });
};

API.enableDrag = function(elements, container) {
  elements.forEach(function(element) {
    API.drag({
      el: element,
      box: container,
      onStart: function() {
        element.style.zIndex = 99;
      },
      onMove: function() {},
      onEnd: function() {
        element.style.zIndex = 9;
      }
    });
  });
};

API.drag = function(opts) {
  var el = opts.el,
    box = opts.box,
    onStart = opts.onStart || null,
    onMove = opts.onMove || null,
    onEnd = opts.onEnd || null,
    mouse = window.utils.captureMouse(box),
    boxRect = box.getBoundingClientRect(),
    offsetX = 0,
    offsetY = 0,
    isPressed = false;

  el.addEventListener('mousedown', function(e) {
    e.preventDefault();
    e.stopPropagation();

    isPressed = true;
    offsetX = mouse.x - el.offsetLeft;
    offsetY = mouse.y - el.offsetTop;

    onStart && onStart();

    box.addEventListener('mousemove', handle4Move, false);
    box.addEventListener('mouseup', handle4Up, false);
  }, false);

  function handle4Move(e) {
    e.preventDefault();
    e.stopPropagation();

    var x = mouse.x - offsetX,
      y = mouse.y - offsetY;

    if (x < boxRect.left) {
      x = boxRect.left;
    } else if (x + el.offsetWidth > boxRect.left + boxRect.width) {
      x = boxRect.left + boxRect.width - el.offsetWidth;
    }

    if (y < boxRect.top) {
      y = boxRect.top;
    } else if (y + el.offsetHeight > boxRect.top + boxRect.height) {
      y = boxRect.top + boxRect.height - el.offsetHeight;
    }

    el.style.left = x + 'px';
    el.style.top = y + 'px';

    onMove && onMove();
  }

  function handle4Up(e) {
    box.removeEventListener('mousemove', handle4Move, false);
    box.removeEventListener('mouseup', handle4Up, false);

    onEnd && onEnd();
  }
};

/*--------------------------------------*\
  API CRUD Methods
\*--------------------------------------*/

API.createElement = function(list, opts) {
  var id = API.newId(),
    pid = opts.pid || '0',
    type = opts.type,
    name = API.newName(list, type, opts.name),
    ext = opts.ext || '';

  var elem = {
    id: id,
    pid: pid,
    type: type,
    name: name,
    ext: ext
  };

  list.append(elem);
  return elem;
};

API.removeElement = function(list, element) {
  return list.remove(element) !== null ? true : false;
};

API.updateElement = function(list, element) {
  return list.update(element);
};


/*--------------------------------------*\
  Render UI
\*--------------------------------------*/

API.render = function(list, containerElem) {
  var data = list.data(),
    id = containerElem.dataset.id || '0',
    liElems = [];

  var currentLevelData = data.filter(function(item) {
    return item.pid == id;
  });
  
  // 清空容器
  containerElem.innerHTML = '';

  currentLevelData.forEach(function(item) {
    var liElem = document.createElement('li');
    liElem.dataset.id = item.id;
    liElem.dataset.pid = item.pid;
    liElem.dataset.type = item.type;
    liElem.dataset.name = item.name;
    liElem.dataset.ext = item.ext;

    liElem.classList.add('icon');
    liElem.classList.add('icon-' + item.type);
    liElem.innerHTML = '<p class="name">' + item.name + '</p>';
    
    containerElem.appendChild(liElem);
    liElems.push(liElem);
  });
  
  // convert float layout to absolute layout
  API.convertFloat2Absolute(liElems);

  // enable drag
  API.enableDrag(liElems, containerElem);

  // console.log(list.data());
};