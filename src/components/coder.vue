<template>
  <div class="coder-editor">
    <div class="coder-editor__label">
      <div class="file-info">
        <img :src="labelSrc" class="file-info-icon" />
        <div class="file-info-name">
          <span>{{ this.kind }}</span>
        </div>
      </div>
    </div>
    <code-mirror
      class="coder-editor__document"
      ref="myEditor"
      :code="code"
      :options="editorOptions"
      :codemirrorStyle="codemirrorStyle"
      :id="id"
      @ready="onEditorReady"
      @focus="onEditorFocus"
      @change="onEditorCodeChange"
    ></code-mirror>
  </div>
</template>

<script>
import codeMirror from './codemirror/codemirror.vue';

export default {
  name: 'codeEditor',

  components: {
    codeMirror,
  },

  props: {
    labelSrc: {
      String,
      default: '',
    },
    value: [String, Document],
    kind: String,
    id: String,
  },

  data() {
    return {
      editorOptions: this.getEditorOption(),
      label_height: 30,
      codemirrorStyle: {
        height: 'calc(100% - 32px)',
        textAlign: 'left',
        fontSize: '16px',
        zIndex: '0',
      },
    };
  },

  methods: {
    onEditorReady(editor) {
      console.log('the editor is readied!', editor);
    },
    onEditorFocus(editor) {
      console.log('the editor is focus!', editor);
      console.log('focus editor type', this.kind);
      this.$bus.$emit('changefocus', this.kind);
    },
    onEditorCodeChange(newCode) {
      // console.log('this is new code', newCode);
      // console.log('this is type', editorType);
      // this.code = newCode;
      const editorType = this.kind;

      this.$emit('change', [newCode, editorType]);
    },
    getEditorOption() {
      console.log('applyed');

      const kindWrapper = this.kind === 'html' ? 'text/html' : this.kind;

      return {
        // codemirror options
        tabSize: 2,
        mode: kindWrapper,
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
    code() {
      return this.value;
    },
    editor() {
      return this.$refs.myEditor.editor;
    },
  },
};
</script>

<style scoped>
.coder-editor {
  max-width: 100%;
  height: 100%;
}

.coder-editor__label {
  height: 32px;
  line-height: 32px;

  background-color: #232831;
  color: #eaeaea;

  text-align: center;
}

.coder-editor__label:hover {
  cursor: default;
}

.coder-editor__label .file-info,
.coder-editor__label .file-info {
  display: flex;
  justify-content: center;
}

.coder-editor__label .file-info .file-info-icon {
  height: 25px;
  margin: 4px;
}

.coder-editor__label .file-info .file-info-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}

.coder-editor__label .file-tooltip {
  color: #78909c;
  font-weight: bold;
  text-decoration: none;
}

/* specially for codemirror */
.CodeMirror {
  height: 100%;
}
</style>
