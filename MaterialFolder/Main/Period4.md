## Troneditor

1. 在这个项目中较为神奇地采用了skin.js。用来动态生成DOM，但并非一个好的设计；
2. CodeMirror异常强大，甚至能够直接在其对象中设置暴露在外的快捷键；

3. 这个项目使用CodeMirror的方式是创建一个div对象，**并在其.show方法中加入CodeMirror对象的事件监听**；这样的话，div对象是静态存在的，而codemirror对象的动态改动可以显得编辑器是可以动态配置的。

## CodePad

就我目前肤浅的认知来看，这个前端编辑器非常精致。虽然初看之下可能会显得其貌不扬，但如果仔细去体会，将会发现无论是编程规范还是项目设计，都很值得推敲。

### focus editor 设计

#### `效果图`

![image-20200517225543553](https://i.loli.net/2020/05/17/UcSFRmAbY6xBVfI.png)



如图所示有三个编辑'窗口'，在目前选择的HTML上出现了高亮强调效果。

#### `设计思路`

对于下图所示的一个`编辑窗口`，可以将其分成label区以及body区。（这两个分区同时由一个editor div来包括）

<img src="https://i.loli.net/2020/05/17/osZbiUacwh2RXgD.png" alt="image-20200517225622896" style="zoom:50%;" />

基本的设计思路是对于body编辑区（逻辑上是CodeMirror对象），==设置一个focus事件的监听==；同时设置响应函数changeEditor来针对所focus的body区的label区来添加class：editor-focus‘：

```javascript
function changeEditor(editor){
    removeFocus(editorLabels) // 删<img src="upload/image-20200517221016582.png" alt="image-20200517221016582" style="zoom:67%;" />除上一个focus的结果
    // 使用了if比较，如果使用在有随机个标签而非固定三个的情况，可以采取同所有的editor进行比较的方式
    if(editor == html) 
    {
      editorLabels[0].classList.add('editor-focus')
      currentEditor = html
    }
```

==视觉效果==的实现采用的是box-shadow：

<img src="upload/image-20200517220704184.png" alt="image-20200517220704184" style="zoom:67%;" />

API为：

<img src="upload/image-20200517221016582.png" alt="image-20200517221016582" style="zoom:67%;" />



​	

### focus 机制补充

focus事件是由鼠标的点击来驱动的，然而如果使用快捷键来进行编辑区之间的切换，会否导致无法实现focus editor的效果？

产生这个疑问的本质在于对于标签切换效果的欠考虑——只需要考虑如何实现标签切换效果即可。

实际上，标签的切换本身便是通过focus另外一个标签来实现的，**于是乎，只需要在进行标签切换快捷键时focus下一个标签即可。**

```javascript
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Tab') {
        toggleEditors(getCurrenEditor()) // 首先获得当前对象，然后依据于此进行切换
    }

...
      
function toggleEditors(editorI) {
  if (editorI === html) {
    css.focus()
  }
   ....
}
```



### focus 更多标签的可能

本项目的使用了固定的三个标签（编辑区|editor），所以是将标签固定写入到editosr{var}数组变量之中的。因此若是要实现任意多个标签，那么设定函数来动态增删editors数组即可。





### js脚本require规范（import）

所见到的一些项目很喜欢直接将辅助性js脚本以可执行的方式写就——在脚本中直接解释执行而非函数封装。

以python为例子（js同python很相近）。我们平常构建辅助代码基本上是以函数来封装功能，而后import该模块，使用函数来执行这些功能。

**然而**，因为js最初是在浏览器中运行的，在入门教程中，我们很容易见到html文件中使用script标签来**直接执行或者导入执行**一些我们希望的行为动作。==但对于一个项目而言，这混淆了代码的层次结构==。

因此一个合理的方式是：

1. 将辅助代码功能进行函数封装：

   ```javascript
   // shortcuts.js
   module.exports = {
     shortcuts
   }
   
   function shortcuts () {
     window.addEventListener('keydown', (e) => {
         ...
   ```

2. 将代码导入到正真需要该功能的地方:

   ```javascript
   // editor.js
   const SHORTCUT = require('./shortcuts')
   ```

3. 由这一继承模块来执行功能（以渲染端为例：

   ```javascript
   // editor.js
   // onload toggles after the browser loads the object  
   onload = function () {
   	SHORTCUT.shortcuts()
   }
   ```

4. 在html中加载：

   ```html
   // index.html
   <script src="editor.js"></script>
   ```

   

导入到主文件中：

* 对于主进程来说，直接将js脚本在main.js或其他中以require的方式