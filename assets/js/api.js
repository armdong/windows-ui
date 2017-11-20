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

  while (names.indexOf(name + '(' + index + ')') !== -1) {
    index++;
  }
  return name + '(' + index + ')';
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
    id = containerElem.dataset.id || '0';

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
  });

  // console.log(list.data());
};