<template>
  <div class="code-coder">
    <code-splitter
      :left-min-width="600"
      :right-min-width="360"
      @resize="handleResize"
      @resize-end="handleResizeEnd"
      :leftPaneList="editorList"

    >
      <code-editor
        :value="html_value"
        @change="handleChange"
        slot="left-pane-html"
        :kind="editorList[0].kind"
        :labelSrc="editorList[0].labelSrc"
        :id="'codemirror-area-html'"
      ></code-editor>
      <code-editor
        :value="js_value"
        @change="handleChange"
        slot="left-pane-javascript"
        :kind="editorList[1].kind"
        :labelSrc="editorList[1].labelSrc"
        :id="'codemirror-area-js'"
      ></code-editor>
      <code-editor
        :value="css_value"
        @change="handleChange"
        slot="left-pane-css"
        :kind="editorList[2].kind"
        :labelSrc="editorList[2].labelSrc"
        :id="'codemirror-area-css'"
      ></code-editor>
      <code-preview :value="render_value" slot="right-pane" ref="preview"></code-preview>
    </code-splitter>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
/* eslint-disable global-require */

import codeEditor from '@/components/coder.vue';
import codePreview from '@/components/preview.vue';
import codeSplitter from '@/components/splitter/splitter.vue';

const { dialog } = window.require('electron').remote;
// const { ipcRenderer } = require('electron')
const fs = require('fs');
const iconv = require('iconv-lite');

export default {
  name: 'Coder',

  components: {
    codeEditor,
    codeSplitter,
    codePreview,
  },

  data() {
    return {
      html_precoding: 'utf8',
      js_precoding: 'utf8',
      css_precoding: 'utf8',
      html_coding: 'utf8',
      js_coding: 'utf8',
      css_coding: 'utf8',
      html_value: '',
      js_value: '',
      css_value: '',
      html_path: '',
      js_path: '',
      csspath: '',
      editorList: [
        {
          kind: 'html',
          labelSrc: '/fileIcon/html.svg',
        },
        {
          kind: 'javascript',
          labelSrc: '/fileIcon/javascript.svg',
        },
        {
          kind: 'css',
          labelSrc: '/fileIcon/css.svg',
        },
      ],
    };
  },

  methods: {
    handleChange(message) {
      const [val, type] = message;

      if (type === 'html') {
        this.html_value = val;
      } else if (type === 'javascript') {
        this.js_value = val;
      } else if (type === 'css') {
        this.css_value = val;
      }
    },
    handleResize() {
      this.$refs.preview.handleResize();
    },
    handleResizeEnd() {
      this.$refs.preview.hideSize();
    },
    fileOp(type) {
      console.log(type);
      switch (type) {
        case 'New': {
          this.setPath('');
          this.setValue('');
          break;
        }
        case 'Open...': {
          const filename = dialog.showOpenDialogSync({
            title: 'Open...',
            filters: [
              { name: 'HTML/JS/CSS', extensions: ['html', 'htm', 'js', 'css'] },
              { name: 'All Files', extensions: ['*'] },
            ],
            properties: ['openFile', 'multiSelections'],
          });
          console.log(filename[0]);
          const path = filename[0];
          const content = fs.readFileSync(path, 'utf8');
          console.log(this.focusedEditor);
          this.setValue(content);
          this.setPath(path);
          this.setPrecoding('utf8');
          break;
        }
        case 'Save': {
          const path = this.getPath();
          const content = this.getValue();
          if (path === '') {
            this.saveAs();
          } else {
            const code = iconv.encode(content, this.getPrecoding());
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
    changeCoding() {
      const from = this.getPrecoding();
      const to = this.getCoding();
      console.log('from coding: ', this.getPrecoding(), 'to coding', this.getCoding());
      let content = this.getValue();
      const code = iconv.encode(content, from);
      content = iconv.decode(code, to);
      this.setValue(content);
      this.setPrecoding(to);
    },
    getPath() {
      if (this.focusedEditor === 'html') {
        return this.html_path;
      }
      if (this.focusedEditor === 'javascript') {
        return this.js_path;
      }
      return this.css_path;
    },
    setPath(path) {
      if (this.focusedEditor === 'html') {
        this.html_path = path;
      } else if (this.focusedEditor === 'javascript') {
        this.js_path = path;
      } else if (this.focusedEditor === 'css') {
        this.css_path = path;
      }
    },
    setValue(value) {
      if (this.focusedEditor === 'html') {
        this.html_value = value;
      } else if (this.focusedEditor === 'javascript') {
        this.js_value = value;
      } else if (this.focusedEditor === 'css') {
        this.css_value = value;
      }
    },
    getValue() {
      if (this.focusedEditor === 'html') {
        return this.html_value;
      }
      if (this.focusedEditor === 'javascript') {
        return this.js_value;
      }
      if (this.focusedEditor === 'css') {
        return this.css_value;
      }
      return null;
    },
    setCoding(coding) {
      if (this.focusedEditor === 'html') {
        this.html_coding = coding;
      } else if (this.focusedEditor === 'javascript') {
        this.js_coding = coding;
      } else if (this.focusedEditor === 'css') {
        this.css_coding = coding;
      }
    },
    setPrecoding(coding) {
      if (this.focusedEditor === 'html') {
        this.html_precoding = coding;
      } else if (this.focusedEditor === 'javascript') {
        this.js_precoding = coding;
      } else if (this.focusedEditor === 'css') {
        this.css_precoding = coding;
      }
    },
    getCoding() {
      if (this.focusedEditor === 'html') {
        return this.html_coding;
      }
      if (this.focusedEditor === 'javascript') {
        return this.js_coding;
      }
      if (this.focusedEditor === 'css') {
        return this.css_coding;
      }
      return null;
    },
    getPrecoding() {
      if (this.focusedEditor === 'html') {
        return this.html_precoding;
      }
      if (this.focusedEditor === 'javascript') {
        return this.js_precoding;
      }
      if (this.focusedEditor === 'css') {
        return this.css_precoding;
      }
      return null;
    },
  },

  computed: {
    render_value() {
      const template = `
              <html>
                <head>
                  <style>
                    body{border:0;padding:0}
                  ${this.css_value}
                  </style>
                </head>
                <body>
                  ${this.html_value}
                  <script>
                  ${this.js_value}
                  <\/script>
                </body>
              </html>
            `;
      console.log(template);
      return template;
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
      console.log('changefocus', message);
      this.focusedEditor = message;
    });
    this.$bus.$off('coding'); // 切换编码
    this.$bus.$on('coding', (message) => {
      console.log(message);
      this.setCoding(message);
      this.changeCoding();
    });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.code-coder {
  /* position: absolute; */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  max-width: 100%;
  font-family: Helvetica Neue, Helvetica, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, Arial, sans-serif;
}

.code-coder .code-coder-edit,
.code-coder .code-coder-preview {
  /* display: inline-block */
  position: relative;
  overflow: hidden;
}
</style>
