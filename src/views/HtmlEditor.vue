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
        :kind="'html'"
        :labelSrc="require('@/assets/icons/html.svg')"
      ></code-editor>
      <code-editor
        :value="js_value"
        @change="handleChange"
        slot="left-pane-javascript"
        :kind="'javascript'"
        :labelSrc="require('@/assets/icons/javascript.svg')"
      ></code-editor>
      <code-editor
        :value="css_value"
        @change="handleChange"
        slot="left-pane-css"
        :kind="'css'"
        :labelSrc="require('@/assets/icons/css.svg')"
      ></code-editor>
      <code-preview :value="render_value" slot="right-pane" ref="preview"></code-preview>
    </code-splitter>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */

import codeEditor from '@/components/coder.vue';
import codePreview from '@/components/preview.vue';
import codeSplitter from '@/components/splitter/splitter.vue';

export default {
  name: 'Coder',

  components: {
    codeEditor,
    codeSplitter,
    codePreview,
  },

  data() {
    return {
      html_value: '',
      js_value: '',
      css_value: '',
      editorList: [
        {
          kind: 'html',
          labelSrc: '@/assets/icons/html.svg',
        },
        {
          kind: 'javascript',
          labelSrc: '../assets/icons/html.svg',
        },
        {
          kind: 'css',
          labelSrc: '@/assets/icons/html.svg',
        },
      ],
    };
  },

  methods: {
    handleChange(message) {
      const [val, type] = message;
      console.log('receivemessage', message);
      console.log('receivevalue', val);

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
      return template;
    },
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
