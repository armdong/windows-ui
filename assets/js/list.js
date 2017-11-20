/*--------------------------------------*\
  List Structure
\*--------------------------------------*/
function List() {
  var Node = function(element) {
    this.element = element;
    this.next = null;
  };

  var length = 0,
    head = null;
  
  // 向列表末尾追加一个元素
  this.append = function(element) {
    var node = new Node(element),
      current;

    if (head === null) {
      head = node;
    } else {
      current = head;

      // loop the first until find last item
      while (current.next) {
        current = current.next;
      }

      // get last item and assign next to node to make the link
      current.next = node;
    }

    length++; // update size of list
  };
  
  // 向列表指定位置插入一个元素
  this.insert = function(position, element) {

    // check for out-of-bounds values
    if (position >= 0 && position <= length) {
      var node = new Node(element),
        current = head,
        previous,
        index = 0;

      if (position === 0) {
        node.next = current;
        head = node;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        node.next = current;
        previous.next = node;
      }

      length++; // update size of list

      return true;
    } else {
      return false;
    }
  };
  
  // 删除列表中指定位置的元素
  this.removeAt = function(position) {

    // check for out-of-bounds values
    if (position > -1 && position < length) {
      var current = head,
        previous,
        index = 0;

      // removing first item
      if (position === 0) {
        head = current.next;
      } else {
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        // link privous with current's next: skip it to remove
        previous.next = current.next;
      }

      length--;

      return current.element;
    } else {
      return null;
    }
  };
  
  // 删除列表中的指定元素
  this.remove = function(element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

  // 修改列表中的指定元素
  this.update = function(element) {
    var current = head,
      index = 0;

    while (current) {
      if (element.id === current.element.id) {
        current.element.name = element.name;
        current.element.type = element.type;
        current.element.pid = element.pid;
        current.element.ext = element.ext;

        return true;
      }
      index++;
      current = current.next;
    }

    return false;
  };
  
  // 获取列表中指定元素的索引
  this.indexOf = function(element) {
    var current = head,
      index = 0;

    while (current) {
      if (element.id == current.element.id) {
        return index;
      }
      index++;
      current = current.next;
    }

    return -1;
  };
  
  // 检测列表是否为空
  this.isEmpty = function() {
    return length === 0;
  };
  
  // 获取列表中元素的个数
  this.size = function() {
    return length;
  };
  
  // 获取列表的第一个元素
  this.getHead = function() {
    return head;
  };
  
  // 获取列表中的所有元素
  this.data = function() {
    var current = head,
      data = [];

    while (current) {
      data.push(current.element);
      current = current.next;
    }

    return data;
  };
}