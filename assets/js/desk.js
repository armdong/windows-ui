(function(window, document, undefined) {
  
  /**
   * [handle4DomReady DOMContentLoaded handler]
   * @param  {[type]} e [event]
   * @return {[type]}   [description]
   */
  function handle4DomReady(e) {

    /*--------------------------------------*\
      DOM elements and variables
    \*--------------------------------------*/

    var containerElem = document.getElementById('container'),
      mouse = utils.captureMouse(containerElem),
      dataList = new List();


    /*--------------------------------------*\
      Functions and Helpers
    \*--------------------------------------*/
    
    // 创建右键 UI
    function createContextMenuUI(element) {
      var ulElem = document.createElement('ul');
      ulElem.classList.add('context-menu');

      if (element === null) { // 在容器空白区域点击右键
        
        // 添加查看按钮
        var viewElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(viewElem, {
          nodeType: 'a',
          className: ['view'],
          attrs: {
            href: 'javascript'
          },
          textContent: '查看(V)'
        });

        // 添加新建按钮
        var newElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(newElem, {
          nodeType: 'p',
          className: ['new'],
          textContent: '新建(W)'
        });
        var subMenu = createChildNode(newElem, {
          nodeType: 'ul',
          className: ['sub-menu']
        });
        var folderElem = createChildNode(subMenu, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(folderElem, {
          nodeType: 'a',
          className: ['folder'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            type: 'folder'
          },
          textContent: '文件夹(F)',
          events: {
            'click': handle4NewFile
          }
        });
        var txtElem = createChildNode(subMenu, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(txtElem, {
          nodeType: 'a',
          className: ['txt'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            type: 'txt',
            ext: '.txt'
          },
          textContent: '文本文档',
          events: {
            'click': handle4NewFile
          }
        });
        var pdfElem = createChildNode(subMenu, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(pdfElem, {
          nodeType: 'a',
          className: ['pdf'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            type: 'pdf',
            ext: '.pdf'
          },
          textContent: 'PDF文档',
          events: {
            'click': handle4NewFile
          }
        });
        var mp3Elem = createChildNode(subMenu, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(mp3Elem, {
          nodeType: 'a',
          className: ['mp3'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            type: 'mp3',
            ext: '.mp3'
          },
          textContent: 'MP3音频',
          events: {
            'click': handle4NewFile
          }
        });


        // 添加属性按钮
        var attrElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(attrElem, {
          nodeType: 'a',
          className: ['attr'],
          attrs: {
            href: 'javascript:;'
          },
          textContent: '属性(R)'
        });
      } else { // 在具体文件或文件夹中右键
        
        var id = element.dataset.id,
          pid = element.dataset.pid,
          name = element.dataset.name,
          type = element.dataset.type,
          ext = element.dataset.ext;

        // 添加删除按钮
        var delElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(delElem, {
          nodeType: 'a',
          className: ['del'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            id: id,
            pid: pid,
            name: name,
            type: type,
            ext: ext
          },
          events: {
            'click': handle4FileRemove
          },
          textContent: '删除(D)'
        });

        // 添加重命名按钮
        var renameElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(renameElem, {
          nodeType: 'a',
          className: ['rename'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            id: id,
            pid: pid,
            name: name,
            type: type,
            ext: ext
          },
          events: {
            'click': handle4FileRename
          },
          textContent: '重命名(M)'
        });

        // 添加属性按钮
        var attrElem = createChildNode(ulElem, {
          nodeType: 'li',
          className: ['menu-item']
        });
        createChildNode(attrElem, {
          nodeType: 'a',
          className: ['attr'],
          attrs: {
            href: 'javascript:;'
          },
          dataset: {
            id: id,
            pid: pid,
            name: name,
            type: type,
            ext: ext
          },
          events: {
            'click': handle4FileAttr
          },
          textContent: '属性(R)'
        });
      }

      return ulElem;
    }
    
    // 获取当前鼠标右键时所处的元素，如果为 null，则处于容器空白处
    function getMousePositionElem() {
      var liElems = containerElem.getElementsByClassName('icon');
      var targetElem = [].slice.call(liElems).filter(function(element) {
        var rect = element.getBoundingClientRect();
        return utils.containsPoint(rect, mouse.x, mouse.y);
      });

      if (targetElem.length > 0) {
        return targetElem[0];
      } else {
        return null;
      }
    }
    
    // 删除之前的 ContextMenu UI
    function destroyContextMenuUI() {
      var originalMenuUI = containerElem.getElementsByClassName('context-menu');
      [].slice.call(originalMenuUI).forEach(function(elem) {
        containerElem.removeChild(elem);
      });
    }
    
    // 为指定元素新增一个子元素
    function createChildNode(parentNode, opts) {
      var elem = document.createElement(opts.nodeType);

      // 添加 className
      opts.className.forEach(function(className) {
        elem.classList.add(className);
      });

      // 添加属性
      for (var attr in opts.attrs) {
        elem[attr] = opts.attrs[attr];
      }

      // 添加 data-xxx 自定义属性
      for (var key in opts.dataset) {
        elem.dataset[key] = opts.dataset[key];
      }

      // 添加文本
      elem.textContent = opts.textContent;

      // 添加监听事件
      for (var event in opts.events) {
        elem.addEventListener(event, opts.events[event], false);
      }
      parentNode.appendChild(elem);
      return elem;
    }

    // 选中元素中的文本
    function selectText(elem) {
      if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(elem);
        range.select();
      } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(elem);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
    }


    /*--------------------------------------*\
      Event handlers
    \*--------------------------------------*/
    
    // handler for container click
    function handle4ContainerClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // 移除 ContextMenu UI
      destroyContextMenuUI();
    }
    
    // handler for contextmenu
    function handle4ContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      destroyContextMenuUI();
      
      var targetElem = getMousePositionElem();
      var menuUI = createContextMenuUI(targetElem);
      menuUI.style.top = mouse.y + 'px';
      menuUI.style.left = mouse.x + 'px';

      containerElem.appendChild(menuUI);
    }

    // handler for dblclick
    function handle4DoubleClick(e) {
      e.preventDefault();
      e.stopPropagation();

      var targetElem = getMousePositionElem();
      if (targetElem !== null) {
        console.log(targetElem);
      }
    }
    
    // handler for add file
    function handle4NewFile(e) {
      e.preventDefault();
      e.stopPropagation();

      var id = containerElem.dataset.id,
        type = this.dataset.type,
        ext = this.dataset.ext;

      var name = '';
      switch (type) {
        case 'folder':
          name = '新建文件夹';
          break;
        case 'txt':
          name = '新建文本文档';
          break;
        case 'pdf':
          name = '新建PDF文档';
          break;
        case 'mp3':
          name = '新建MP3音频';
          break;
      }

      API.createElement(dataList, {
        pid: id,
        type: type,
        name: name,
        ext: ext
      });
      API.render(dataList, containerElem);
    }

    // handler for remove file
    function handle4FileRemove(e) {
      var id = this.dataset.id,
        pid = this.dataset.pid,
        type = this.dataset.type,
        name = this.dataset.name,
        ext = this.dataset.ext;

      API.removeElement(dataList, {
        id: id,
        pid: pid,
        type: type,
        name: name,
        ext: ext
      }) && API.render(dataList, containerElem);
    }

    // handler for rename file
    function handle4FileRename(e) {
      var id = this.dataset.id;
      var iconElems = containerElem.getElementsByClassName('icon');
      var editElem = [].slice.call(iconElems).filter(function(elem) {
        return elem.dataset.id == id;
      })[0];
      var updateElem = {
        id: editElem.dataset.id,
        pid: editElem.dataset.pid,
        name: editElem.dataset.name,
        type: editElem.dataset.type,
        ext: editElem.dataset.ext
      };
      var nameElem = editElem.getElementsByClassName('name')[0];
      nameElem.contentEditable = true;
      nameElem.classList.add('edit');
      nameElem.focus();
      selectText(nameElem);

      nameElem.onblur = function(e) {
        var name = this.textContent;
        if (name == '') {
          console.log('文件名不能为空');
          return false;
        }

        // 检测是否重命名
        var isNameExists = API.checkNameExists(dataList, {
          id: updateElem.id,
          type: updateElem.type,
          name: name
        });

        if (isNameExists) {
          console.log('文件名已存在');
          
          nameElem.focus();
          selectText(nameElem);
          return false;
        }

        updateElem.name = name;
        var updateOK = API.updateElement(dataList, updateElem);

        if (updateOK) {
          this.classList.remove('edit');
          this.contentEditable = false;
          API.render(dataList, containerElem);
        }
      };
    }

    function handle4FileAttr(e) {
      console.log(this.dataset);
    }


    /*--------------------------------------*\
      Initialization
    \*--------------------------------------*/

    // 给容器元素添加右键监听事件
    containerElem.addEventListener('contextmenu', handle4ContextMenu, false);
    containerElem.addEventListener('click', handle4ContainerClick, false);
    containerElem.addEventListener('dblclick', handle4DoubleClick, false);
    
    // 渲染数据
    API.render(dataList, containerElem);
  }

  document.addEventListener('DOMContentLoaded', handle4DomReady, false);

})(window, document);