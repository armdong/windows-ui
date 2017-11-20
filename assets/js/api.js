var API = {};

/*--------------------------------------*\
  API Helper Functions
\*--------------------------------------*/

API.newId = function() {
  return _.uniqueId();
};

/*--------------------------------------*\
  API CRUD Methods
\*--------------------------------------*/

API.createElement = function(list, opts) {
  var id = API.newId(),
    pid = opts.pid || 0,
    type = opts.type,
    name = opts.name,
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
    liElem.innerHTML = '<p>' + item.name + item.ext + '</p>';
    
    containerElem.appendChild(liElem);
  });
};