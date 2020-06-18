<template>
  <div class="container">
    <code-splitter :left-min-width="360" :right-min-width="600">
      <folder
        slot="left-pane-default"
        :openedFolders="openedFolders"
        @dblclick="dbclickHandler"
        :style="{ 'font-size': '15px' }"
      >
        <div slot-scope="{ node, data }">
          <div>name: {{ data.label }}</div>
          <div>path: {{ data.path }}</div>
        </div>
      </folder>
      <universal-editor
        slot="right-pane"
        :nameTabs="nameTabs"
        :configs="editorConfigs"
        @focusedDomChange="focusHandler"
        @editorFocus="editorGetter"
        @onEditorCodeChange="editorContentUpdater"
        @newTab="addTab"
      ></universal-editor>
    </code-splitter>
  </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import Folder from 'vue-electron-folder';
import codeSplitter from '@/components/splitter/splitter.vue';
import universalEditor from '@/components/unicoder.vue';

const { dialog } = window.require('electron').remote;
// const { ipcRenderer } = require('electron')
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

export default {
  name: 'UniversalEditor',

  components: {
    Folder,
    codeSplitter,
    universalEditor,
  },

  data() {
    return {
      openedFolders: ['/home/penguinviceroy/Peviroy/'],
      tabNumber: 2,
      editorConfigs: [
        {
          name: 'Tab-1',
          mode: 'javascript',
          option: this.getEditorOption('javascript'),
          picSrc: '/app.png',
        },
      ],
      currentEditor: {
        id: null,
        path: null,
        domHandle: null,
        editor: null,
        coding: 'utf-8', // utf-8 default
        picSrc: null,
      },
    };
  },
  methods: {
    addTab() {
      this.editorConfigs.push({
        name: 'Tab-New',
        mode: 'text/html',
        option: this.getEditorOption('text/html'),
        picSrc: '/app.png',
      });
    },
    removeTab() {},
    updateTab(filepath) {
      console.log('update！');

      const filename = path.basename(filepath);
      const fileAppendix = filename.split('.').pop();
      const [mode, picSrc] = this.appendixTransform(fileAppendix);

      let config;
      // eslint-disable-next-line no-restricted-syntax
      for (config of this.editorConfigs) {
        console.log('config name', config.name);
        console.log('currentEditor id', this.currentEditor.id);
        if (config.name === this.currentEditor.id) {
          config.name = filename;
          this.currentEditor.id = filename;
          config.mode = mode;
          config.option = this.getEditorOption(mode);
          config.picSrc = picSrc;
          console.log(picSrc);
        }
      }
    },
    // helper
    appendixTransform(appendix) {
      const mode = {};
      // eslint-disable-next-line no-undef
      let picSrc = '/fileIcon/';
      if (appendix === 'js') {
        mode.name = 'text/javascript';
        picSrc += 'javascript.svg';
      } else if (appendix === 'json') {
        mode.name = 'application/json';
        picSrc += 'javascript.svg';
      } else if (appendix === 'html' || appendix === 'htm') {
        mode.name = 'text/html';
        picSrc += 'html.svg';
      } else if (appendix === 'css') {
        mode.name = 'text/css';
        picSrc += 'css.svg';
      } else if (appendix === 'c') {
        mode.name = 'text/x-csrc';
        picSrc += 'c.svg';
      } else if (appendix === 'cpp') {
        mode.name = 'text/x-c++src';
        picSrc += 'cpp.svg';
      } else if (appendix === 'java') {
        mode.name = 'text/x-java';
        picSrc += 'java.svg';
      } else if (appendix === 'py') {
        mode.name = 'text/x-python';
        picSrc += 'python.svg';
      } else {
        mode.name = null;
        picSrc = '/app.png';
      }
      return [mode, picSrc];
    },
    // open file via folder tree
    dbclickHandler(data) {
      console.log('dblclick', data);
      this.fileOp('Open...', data.path);
    },
    focusHandler(DomObject) {
      const { id, dom } = DomObject;
      console.log('focuHandler', id);

      this.currentEditor.id = id.replace('codemirror-area-', '');
      console.log('focuHandler currentEditor', this.currentEditor.id);

      this.currentEditor.domHandle = dom;
    },
    // 多标签难以根据prop确定编辑区，子组件传递编辑区以解决
    editorGetter(editor) {
      this.currentEditor.editor = editor;
    },
    editorContentUpdater(newCode) {
      this.setValue(newCode);
    },
    getEditorOption(editorType) {
      return {
        // codemirror options
        tabSize: 2,
        mode: editorType,
        theme: 'material',

        lineNumbers: true,
        line: true,
        lineWrapping: true,

        // sublime、emacs、vim
        // keyMap: 'sublime',
        // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
        extraKeys: {
          'Shift-,': (cm, pred) => {
            cm.doc.replaceSelection('<');
            if (!pred || pred()) {
              setTimeout(() => {
                if (!cm.state.completionActive) cm.showHint({ completeSingle: false });
              }, 100);
            }
            return cm.Pass;
          },
          // '/': 'autocomplete',
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Q': (cm) => {
            cm.foldCode(cm.getCursor()); // 代码折叠
          },
        },
        // 代码折叠
        foldGutter: true,
        gutters: [
          'CodeMirror-linenumbers', // 使用此功能可以为行号槽提供背景或宽度。
          'CodeMirror-foldgutter',
          'CodeMirror-focused', // 每当编辑器聚焦时，顶级元素都会获得此类。
          'CodeMirror-gutters', // 这是所有沟槽的背景。
          'CodeMirror-selected', // 该选择span由此类的元素表示。
          'CodeMirror-foldmarker',
          'CodeMirror-lines', // 可见线。这是您为编辑器内容指定垂直填充的位置。
          'CodeMirror-lint-markers',
          'CodeMirror-gutter-filler',
        ],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        highlightSelectionMatches: {
          showToken: /\w/,
          annotateScrollbar: true,
        },
        // more codemirror options...
        lint: true,

        // styleActiveLine: true,

        matchBrackets: true,
        smartIndent: true,
        autoCloseTags: true,
        autoCloseBrackets: true,

        scrollbarStyle: 'simple',

        // hintOptions: {
        //   schemaInfo: null
        // }
      };
    },
    fileOp(type, _filepath = null) {
      console.log(type);
      switch (type) {
        case 'New': {
          this.setPath('');
          this.setValue('');
          break;
        }
        case 'Open...': {
          let filename = _filepath;
          if (_filepath === null) {
            // eslint-disable-next-line prefer-destructuring
            filename = dialog.showOpenDialogSync({
              title: 'Open...',
              filters: [
                { name: 'HTML/JS/CSS', extensions: ['html', 'htm', 'js', 'css'] },
                { name: 'All Files', extensions: ['*'] },
              ],
              properties: ['openFile', 'multiSelections'],
            })[0];
          }
          console.log(filename);
          const filepath = filename;
          const content = fs.readFileSync(filepath, 'utf8');
          this.setValue(content);
          this.setPath(filepath);
          this.setCoding('utf8');
          this.updateTab(filepath);
          break;
        }
        case 'Open folder': {
          const foldername = dialog.showOpenDialogSync({
            title: 'Open folder',
            properties: ['openDirectory'],
          })[0];
          this.openedFolders = [foldername];
          break;
        }
        case 'Save': {
          const filepath = this.getPath();
          const content = this.getValue();
          if (filepath === '') {
            this.saveAs();
          } else {
            const code = iconv.encode(content, this.getCoding());
            console.log(filepath);
            console.log(content);
            fs.writeFileSync(filepath, code, 'utf8');
          }
          break;
        }
        case 'Save as': {
          this.saveAs();
          break;
        }
        default:
          break;
      }
    },
    saveAs() {
      const options = {
        title: '保存文件',
        filters: [{ name: 'html/css/js', extensions: ['html', 'css', 'js'] }],
      };
      const filepath = dialog.showSaveDialogSync(options);
      console.log('save as path: ', filepath);
      this.setPath(filepath);
      this.fileOp('Save');
    },
    setPath(filepath) {
      this.currentEditor.path = filepath;
    },
    getPath() {
      return this.currentEditor.path;
    },
    getValue() {
      console.log('currentEditor content', this.currentEditor.editor.getValue());
      return this.currentEditor.editor.getValue();
    },
    setValue(newValue) {
      this.currentEditor.editor.setValue(newValue);
    },
    setCoding(newCoding) {
      this.currentEditor.coding = newCoding;
    },
    getCoding() {
      return this.currentEditor.coding;
    },
    changeCoding(newCoding) {
      const from = this.currentEditor.coding;
      const to = newCoding;
      console.log('from coding: ', from, 'to coding', to);
      let content = this.getValue();
      const code = iconv.encode(content, from);
      content = iconv.decode(code, to);
      this.setValue(content);
      this.setCoding(to);
    },
  },
  computed: {
    nameTabs() {
      const _nameTabs = [];
      this.editorConfigs.forEach((config, i) => {
        _nameTabs.push({
          name: config.name,
          id: `codemirror-area-${config.name}`,
          show: i === 0,
          labelSrc: config.picSrc,
        });
      });
      return _nameTabs;
    },
  },
  created() {
    this.$bus.$off('file'); // 收到file下某个选项的点击
    this.$bus.$on('file', (message) => {
      console.log(message);
      this.fileOp(message);
    });
    this.$bus.$off('coding'); // 切换编码
    this.$bus.$on('coding', (codingType) => {
      console.log(codingType);
      this.changeCoding(codingType);
    });
  },
  mounted() {
    const _this = this;
    document.onkeydown = function(event) {
      const key = window.event.keyCode;
      if (key === 79 && event.ctrlKey) {
        window.event.preventDefault(); // 关闭浏览器快捷键
        _this.fileOp('Open...');
      }
      if (key === 83 && event.ctrlKey) {
        window.event.preventDefault(); // 关闭浏览器快捷键
        _this.fileOp('Save');
      }
      if (key === 78 && event.ctrlKey) {
        window.event.preventDefault(); // 关闭浏览器快捷键
        _this.fileOp('New');
      }
      if (key === 68 && event.ctrlKey) {
        window.event.preventDefault(); // 关闭浏览器快捷键
        _this.fileOp('Save as');
      }
    };
  },
};
</script>

<style scoped></style>
