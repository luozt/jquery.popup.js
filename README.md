#jquery.popup.js弹窗插件

本插件特意为了应付常用的弹窗居中需求，拥有的特点：

1. 自适应窗口居中，默认为fixed定位居中，如果窗口高度过小，则自动变为absolute定位
2. 自带蒙版，可设置点击蒙版关闭
3. 完美兼容IE7+，属于优雅降级的插件，在现代浏览器中有动画效果，在IE8以下浏览器则为简单的显示/隐藏功能
4. 自带多个动画效果，可丰富页面动态效果

##使用说明

1. 在css中引入LESS文件`_popup.less`。（如果对less不熟的朋友，就引入_popup.css吧）
2. 在js引入`jquery.popup.js`
3. 给弹窗modal节点添加`.md-modal-instance`样式，只需定义宽度、高度以及内容的样式，不用管定位类的样式，如position, left, top。
  （加上`.md-modal-instance`后会看不见该弹窗，不好调试样式，这时可以加一个`.temp`样式显示弹窗，调整好样式后删去`.temp`样式即可）
4. 调用`$.popup()`方法：

```javascript
var popupApi = $.popup({
  modal: $("#modal"),
  closeBtn: $("#modal .close"),
  openBtn: $("#triggerBtn"),
  effect: 1,
  maskClose: true,
  onShown: function(){
    console.log("onShown");
  },
  onHidden: function(){
    console.log("onHidden");
  }
});

// (可选)手动打开弹窗
// popupApi.open();
```

##参数说明

`$.popup(<config>)`参数config说明

```javascript
{
  modal:       //弹窗DOM
  closeBtn:    //用来关闭弹窗的按钮，一般是在弹窗内的DOM
  openBtn:     //用来打开弹窗的按钮
  effect:      //弹窗效果，默认为1，取值为0,1,2,3,4,5,6
  maskClose:   //是否点击蒙版关闭弹窗，默认为false
  position:    //定位方式，默认为"auto"，取值为"auto","fixed","absolute"
  zIndex:      //自定义弹窗的z-index
  onShown:     //打开弹窗后触发的方法
  onHidden:    //关闭弹窗后触发的方法
}
```

调用方法后返回的API对象`popupApi`的方法包括有：

```javascript
popupApi.open()         //手动打开弹窗
popupApi.close()        //手动关闭弹窗
popupApi.getConfig()    //获取参数配置
popupApi.refresh()      //刷新弹窗定位，使其重新居中
popupApi.teardown()     //卸载当前弹窗的插件功能
```
