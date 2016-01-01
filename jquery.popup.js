/**
 * !jQuery弹窗插件
 * @Author LUOZHITAO
 * @Github: <http://git.oschina.net/luozt007/jquery.popup.js>
 */

(function($, undefined){

  // 全局设定
  var Global = {
    initialized: false,               // 是否已初始化
    currentPopupCount: 0,             // 当前的弹窗数目，指显示的弹窗，不是初始化的
    $mask: null,                      // 蒙版MASK的dom
    $win: $(window),
    init: function(){                 // 插件初始化功能
      // 生成公用蒙版
      var mask = document.createElement('div');
      mask.className = 'md-overlay';
      $('body').addClass('md-body').append(mask);
      this.$mask = $(mask);
      this.initialized = true;
    }
  };

  // 工具函数
  var Util = {
    /**
     * 设置弹窗的top值，使其达到页面居中的效果
     * 弹窗定位使用absolute，并且水平已居中(left:50%; margin-left:-w/2;)
     */
    setPopupTop: function(popup){
      var $popup = $(popup),
        popupH = $popup.outerHeight(),
        bodyScrollTop = document.body.scrollTop || document.documentElement.scrollTop,
        top = bodyScrollTop + (Global.$win.height() - popupH)/2,
        docHeight = this.getDocumentHeight();

      if(docHeight - 10 < top + popupH) top = docHeight - popupH - 20;
      if(0 > top) top = 10;

      $popup.css('top', top + 'px');
    },

    // 获取文档的高度
    getDocumentHeight: function(){
      var docHeight;
      if(document.documentElement) docHeight = document.documentElement.scrollHeight;
      if(document.body && document.body.scrollHeight > docHeight) docHeight = document.body.scrollHeight;
      return docHeight;
    },

    // 将弹窗居中定位
    // absolute定位为left:50%，top值为动态计算；
    // fixed定位为left:50%;top:50%;
    // @param popup：弹窗节点
    // @param position：定位方式，取值为："auto" | "absolute" | "fixed"
    replaceCenter: function(popup, position){
      var $popup = $(popup),
        rect = { width: $popup.outerWidth(), height: $popup.outerHeight() };

      switch(position){
        case 'auto':
          if(Global.$win.height() < rect.height){
            // 如果浏览器窗口高度小于弹窗的，用绝对定位
            this.replaceCenter($popup, 'absolute');
          }else{
            // 如果浏览器窗口高度大于弹窗的，用fixed定位
            this.replaceCenter($popup, 'fixed');
          }
          break;

        case 'absolute':
          $popup.css({
            'position': 'absolute',
            'top': '',
            'margin-top': '0',
            'margin-left': rect.width/2*-1+'px'
          });
          this.setPopupTop(popup);
          break;


        case 'fixed':
          $popup.css({
            'position': 'fixed',
            'top': '50%',
            'margin-left': rect.width/2*-1+'px',
            'margin-top': rect.height/2*-1+'px'
          });
          break;
      }
    }
  };

  // 插件功能
  $.popup = function(config){
    // 判断是否已初始化了
    if(!Global.initialized){
      Global.init();
    }

    // setting
    var cf = config || {};

    cf = {
      modal: $(cf.modal) || $(''),                    // 弹窗主体
      closeBtn: $(cf.closeBtn) || $(''),              // 关闭按钮
      openBtn: $(cf.openBtn) || $(''),                // 触发按钮
      effect: undefined !== cf.effect ? cf.effect : 1,// 弹窗效果
      position: cf.position || 'auto',
      zIndex: undefined !== cf.zIndex ? cf.zIndex : '',
      maskClose: undefined !== cf.maskClose ? cf.maskClose : false,
      onShown: cf.onShown || function(){},
      onHidden: cf.onHidden || function(){}
    };

    // 声明和缓存变量
    var
      modalToggle = false,
      showCss = 'md-show',
      initPos = '',
      effectCss,
      originalCssValue = {};

    // 处理节点
    effectCss = 'md-effect-'+cf.effect;
    cf.modal.addClass('md-modal').addClass(effectCss);

    // 记录弹窗原css值
    originalCssValue.position = cf.modal.css("position");
    originalCssValue.left = cf.modal.css("left");
    originalCssValue.top = cf.modal.css("top");
    originalCssValue.zIndex = cf.modal.css("z-index");


    if('auto' === cf.position){
      if(cf.modal.outerHeight() > Global.$win.height()){
        initPos = 'absolute';
      }else{
        initPos = 'fixed';
      }
    }else{
      initPos = cf.position;
    }
    switch(initPos){
      case 'absolute':
        cf.modal.css({
          'position': 'absolute',
          'left': '50%'
        });
        break;

      case 'fixed':
        cf.modal.css({
          'position': 'fixed',
          'left': '50%',
          'top': '50%'
        });
        break;
    }
    if('' !== cf.zIndex){
      cf.modal.css('z-index', cf.zIndex);
    }


    // 根据当前大小先进行一次居中
    Util.replaceCenter(cf.modal, cf.position);

    // 当窗口改变大小时，重新居中
    var winResize = function(){
      Util.replaceCenter(cf.modal, cf.position);
    };
    Global.$win.bind('resize', winResize);


    // 打开弹窗
    var openModal = function(){
      if(modalToggle){return;}

      // 添加显示样式
      Global.$mask.addClass(showCss);
      cf.modal.addClass(showCss);

      modalToggle = true;
      Global.currentPopupCount++;

      // 处理居中问题
      // setTimeout可使元素渲染完后再执行
      setTimeout(function(){
        Util.replaceCenter(cf.modal, cf.position);
        cf.onShown();
      }, 0);
    };
    cf.openBtn.bind('click', openModal);


    // 关闭弹窗
    var closeModal = function(){
      if(!modalToggle){return;}

      // 隐藏样式
      cf.modal.removeClass(showCss);

      Global.currentPopupCount--;

      // 自动判断是否隐藏蒙版
      if(0 === Global.currentPopupCount){
        Global.$mask.removeClass(showCss);
      }

      modalToggle = false;
      cf.onHidden();
    };

    cf.closeBtn.bind('click', closeModal);

    if(cf.maskClose){
      Global.$mask.bind('click', closeModal);
    }


    // 返回API
    return {
      // 手动打开弹窗
      open: function(){
        openModal();
      },

      // 手动关闭弹窗
      close: function(){
        closeModal();
      },

      getConfig: function(){
        return $.extend(true, {}, cf);
      },

      // 刷新弹窗，使其重新居中
      refresh: function(){
        Util.replaceCenter(cf.modal, cf.position);
      },

      // 卸载当前弹窗的插件功能
      teardown: function(){
        cf.modal.removeClass("md-modal").removeClass(effectCss);

        for(var key in originalCssValue){
          cf.modal.css(key, originalCssValue[key]);
        }

        Global.$win.unbind("resize", winResize);
        cf.openBtn.unbind("click", openModal);
        cf.closeBtn.unbind("click", closeModal);
        if(cf.maskClose){
          Global.$mask.unbind("click", closeModal);
        }

        for (var key in this){
          this[key] = null
        }
      }
    };
  };

  // 设置通用蒙版的css属性API
  $.popupGlobal = {
    setMaskCss: function(property, value){
      Global.$mask.css(property, value);
    }
  };

  // 文档就绪后插件功能初始化
  $(function(){
    if(!Global.initialized){
      Global.init();
    }
  });
})(jQuery);
