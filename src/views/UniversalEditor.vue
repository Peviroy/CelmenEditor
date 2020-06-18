<template>
  <div class="container">
    <code-splitter :left-min-width="360" :right-min-width="600">
      <folder slot="left-pane-default" :openedFolders="openedFolders" @dblclick="dbclickHandler">
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
      ></universal-editor>
    </code-splitter>
  </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

import Folder from 'vue-electron-folder';
import codeSplitter from '@/components/splitter/splitter.vue';
import universalEditor from '@/components/unicoder.vue';

const { dialog } = window.require('electron').remote;
// const { ipcRenderer } = require('electron')
const fs = require('fs');
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
      editorConfigs: [
        {
          name: 'Tab-1',
          mode: 'javascript',
          option: this.getEditorOption('javascript'),
        },
        {
          name: 'Tab-2',
          mode: 'text/html',
          option: this.getEditorOption('text/html'),
        },
      ],
      currentEditor: {
        editor: null,
        path: null,
        coding: 'utf-8', // utf-8 default
      },
    };
  },
  methods: {
    // open file via folder tree
    dbclickHandler(data) {
      console.log('dblclick', data);
      this.fileOp('Open...', data.path);
    },
    focusHandler(currentFocusedDom) {
      console.log('currentDom', currentFocusedDom);
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
    fileOp(type, filepath = null) {
      console.log(type);
      switch (type) {
        case 'New': {
          this.setPath('');
          this.setValue('');
          break;
        }
        case 'Open...': {
          let filename = filepath;
          if (filepath === null) {
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
          const path = filename;
          const content = fs.readFileSync(path, 'utf8');
          console.log(this.focusedEditor);
          this.setValue(content);
          this.setPath(path);
          this.setCoding('utf8');
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
          const path = this.getPath();
          const content = this.getValue();
          if (path === '') {
            this.saveAs();
          } else {
            const code = iconv.encode(content, this.getCoding());
            console.log(path);
            console.log(content);
            fs.writeFileSync(path, code, 'utf8');
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
      const path = dialog.showSaveDialogSync(options);
      console.log('save as path: ', path);
      this.setPath(path);
      this.fileOp('Save');
    },
    setPath(path) {
      this.currentEditor.path = path;
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
    this.$bus.$off('changefocus'); // 更新当前
    this.$bus.$on('changefocus', (message) => {
      console.log(message);
      this.focusedEditor = message;
    });
    this.$bus.$off('coding'); // 切换编码
    this.$bus.$on('coding', (codingType) => {
      console.log(codingType);
      this.changeCoding(codingType);
    });
  },
};
</script>

<style scoped></style>
