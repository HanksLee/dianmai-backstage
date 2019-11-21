/*
 * [计算页面滚动的位置]
 */
export function getScrollY() {
  if (document.body.scrollTop) {
    return document.body.scrollTop
  } else {
    return document.documentElement.scrollTop
  }
}
 /**
  *事件绑定
  */
export function bindEvt(type, target, handler) {
  if (target.addEventListener) {
    target.addEventListener(type, handler, false)
  } else if (target.attachEvent) {
    target.attachEvent('on' + type, handler)
  }
}
 /**
  * 判断是否是父元素
  */
export function isParentNode(element, className) {
  let isParent = false
  const checkParent = function(element) {
    element = element.parentNode
    if (element.tagName.toLowerCase() === 'body') {
      return false
    } else {
      const elementClassArray = element.className.split(' ')
      if (elementClassArray.indexOf(className) > -1) {
        isParent = true
      } else {
        checkParent(element, className)
      }
    }
  }
  checkParent(element)
  return isParent
}

 /**
  * 事件委托绑定
  * @param  {[type]} targetSelector 仅支持'.a li',不支持'li.a'
  */
export function eventDelegate(parentSelector, targetSelector, events, foo) {
  // 触发执行的函数
  function triFunction(e) {
    // 兼容性处理
    var event = e || window.event

    // 获取到目标阶段指向的元素
    var target = event.target || event.srcElement

    // 获取到代理事件的函数
    var currentTarget = event.currentTarget

    // 处理 matches 的兼容性
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var sArray = s.split(' ')
          var matches
          if (sArray.length > 1) {
            sArray.forEach(function($s) {
              $s = $s.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
              if ($s.length > 0) {
                matches = matches.querySelectorAll($s)
              }
            })
          } else {
            matches = (this.document || this.ownerDocument).querySelectorAll(s)
          }
          var i = matches.length
          while (i >= 0 && matches.item(i) !== this) { --i }
          return i > -1
        }
    }

    // 遍历外层并且匹配
    while (target !== currentTarget) {
      // 判断是否匹配到我们所需要的元素上
      if (target.matches(targetSelector)) {
        var sTarget = target
        // 执行绑定的函数，注意 this
        foo.call(sTarget, Array.prototype.slice.call(arguments))
      }

      target = target.parentNode
    }
  }

  // 如果有多个事件的话需要全部一一绑定事件
  events.split('.').forEach(function(evt) {
    // 多个父层元素的话也需要一一绑定
    Array.prototype.slice.call(document.querySelectorAll(parentSelector)).forEach(function($p) {
      if ($p.addEventListener) {
        $p.addEventListener(evt, triFunction)
      } else if ($p.attachEvent) {
        $p.attachEvent('on' + evt, triFunction)
      }
    })
  })
}
