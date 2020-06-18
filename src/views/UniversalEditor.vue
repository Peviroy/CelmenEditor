<template>
  <div class="container">
    <code-splitter :left-min-width="360" :right-min-width="600">
      <folder slot="left-pane-default" :openedFolders="openedFolders" @dblclick="dbclickHandler">
        <div slot-scope="{ node, data }">
          <div>name: {{ data.label }}</div>
          <div>path: {{ data.path }}</div>
        </div>
      </folder>
      <universal-editor slot="right-pane" :nameTabs="nameTabs" :configs="editorConfigs"></universal-editor>
    </code-splitter>
  </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

import Folder from 'vue-electron-folder';
import codeSplitter from '@/components/splitter/splitter.vue';
import universalEditor from '@/components/unicoder.vue';

export default {
  name: 'UniversalEditor',

  // :value="js_value"
  // @change="handleChange"
  // slot="left-pane-javascript"
  // :kind="'javascript'"
  // :labelSrc="require('@/assets/icons/javascript.svg')"

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
    };
  },
  methods: {
    dbclickHandler(data) {
      console.log('dblclick', data);
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
};
</script>

<style scoped></style>
