<template>
  <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
    <div class="navContainer" v-if="navStatus">
      <div class="nameContainer" v-if="icoStatusP">Celmentor-markdownEditor</div>
      <div class="markContainer">
        <ul class="markListGroup">
          <li class="markListItem" @click="addStrong" title="strong"><b>B</b></li>
          <li class="markListItem" @click="addItalic" title="italic"><i>I</i></li>
          <li class="markListItem" @click="addStrikethrough" title="strikethrough">
            ~~
          </li>
          <li class="markListItem" @click="addHTitle(1)" title="H1-title">H1</li>
          <li class="markListItem" @click="addHTitle(2)" title="H2-title">H2</li>
          <li class="markListItem" @click="addHTitle(3)" title="H3-title">H3</li>
          <li class="markListItem" @click="addHTitle(4)" title="H4-title">H4</li>
          <li class="markListItem" @click="addHTitle(5)" title="H5-title">H5</li>
          <li class="markListItem" @click="addHTitle(6)" title="H6-title">H6</li>
          <li class="markListItem" @click="addLine" title="line">一</li>
          <li class="markListItem" @click="addQuote" title="quote">
            <i class="fa fa-quote-left" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addCode"><i class="fa fa-code" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addLink"><i class="fa fa-link" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addImage"><i class="fa fa-picture-o" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addTable" title="table"><i class="fa fa-table" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addUl" title="ul-list"><i class="fa fa-list-ul" aria-hidden="true"></i></li>
          <li class="markListItem" @click="addOl" title="ol-list"><i class="fa fa-list-ol" aria-hidden="true"></i></li>
          <li class="markListItem" @click="fullPageFn" title="fullpage">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="previewFn" title="preview">
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="previewAllFn" title="previewAll">
            <i class="fa fa-eye" aria-hidden="true"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="mdBodyContainer" :class="{ noMenu: !navStatus }">
      <div class="editContainer" v-if="editStatus">
        <textarea name="" class="mdEditor" @keydown.9="tabFn" v-scroll="editScroll" v-model="input"></textarea>
      </div>
      <div
        class="previewContainer markdown-body"
        v-scroll="previewScroll"
        v-html="compiledMarkdown"
        v-if="previewStatus"
      ></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* 引入reset文件 */
import '@/assets/css/reset.css'; /* 引入github的markdown样式文件 */
import '@/assets/css/github-markdown.css'; /* 引入atom的代码高亮样式文件 */
import '@/assets/css/atom-one-dark.min.css';
import '@/assets/font-awesome-4.4.0/css/font-awesome.min.css';

import Vue from 'vue';
import marked from 'marked';
import scroll from 'vue-scroll';
import hljs from '@/assets/js/highlight.min';
import range from '@/assets/js/rangeFn';

Vue.use(scroll);

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight(code) {
    return hljs.highlightAuto(code).value;
  },
});

function insertContent(val, that) {
  const textareaDom = document.querySelector('.mdEditor');
  const { value } = textareaDom;
  const point = range.getCursortPosition(textareaDom);
  const lastChart = value.substring(point - 1, point);
  const lastFourCharts = value.substring(point - 4, point);
  if (lastChart !== '\n' && value !== '' && lastFourCharts !== '    ') {
    val = `\n${val}`;
    range.insertAfterText(textareaDom, val);
  } else {
    range.insertAfterText(textareaDom, val);
  }
  that.input = document.querySelector('.mdEditor').value;
}
export default {
  name: 'markdown',
  props: ['mdValuesP', 'fullPageStatusP', 'editStatusP', 'previewStatusP', 'navStatusP', 'icoStatusP'],
  data() {
    return {
      input: this.mdValuesP || '',
      editStatus: Boolean(this.editStatusP),
      previewStatus: Boolean(this.previewStatusP),
      fullPageStatus: Boolean(this.fullPageStatusP),
      navStatus: Boolean(this.navStatusP),
      icoStatus: Boolean(this.icoStatusP),
      maxEditScrollHeight: 0,
      maxPreviewScrollHeight: 0,
    };
  },
  created() {
    if (!this.editStatus && !this.previewStatus) {
      this.editStatus = true;
      this.previewStatus = true;
    }
  },
  methods: {
    tabFn(evt) {
      insertContent('    ', this);
      // 屏蔽屌tab切换事件
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    },
    addImage() {
      insertContent('![Celmentor](https://cn.vuejs.org/images/logo.png)', this);
    },
    addHTitle(index) {
      let tmp = '';
      switch (index) {
        case 1:
          tmp = '# ';
          break;
        case 2:
          tmp = '## ';
          break;
        case 3:
          tmp = '### ';
          break;
        case 4:
          tmp = '#### ';
          break;
        case 5:
          tmp = '##### ';
          break;
        case 6:
          tmp = '###### ';
          break;
        default:
          break;
      }
      insertContent(tmp, this);
    },
    addCode() {
      const textareaDom = document.querySelector('.mdEditor');
      const { value } = textareaDom;
      const point = range.getCursortPosition(textareaDom);
      const lastChart = value.substring(point - 1, point);
      insertContent('```\n\n```', this);
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 5);
      } else {
        range.setCaretPosition(textareaDom, point + 4);
      }
    },
    addStrikethrough() {
      const textareaDom = document.querySelector('.mdEditor');
      const { value } = textareaDom;
      const point = range.getCursortPosition(textareaDom);
      const lastChart = value.substring(point - 1, point);
      insertContent('~~~~', this);
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addStrong() {
      const textareaDom = document.querySelector('.mdEditor');
      const { value } = textareaDom;
      const point = range.getCursortPosition(textareaDom);
      const lastChart = value.substring(point - 1, point);
      insertContent('****', this);
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addItalic() {
      const textareaDom = document.querySelector('.mdEditor');
      const { value } = textareaDom;
      const point = range.getCursortPosition(textareaDom);
      const lastChart = value.substring(point - 1, point);
      insertContent('**', this);
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 2);
      } else {
        range.setCaretPosition(textareaDom, point + 1);
      }
    },
    setStrong() {
      const textareaDom = document.querySelector('.mdEditor');
      // eslint-disable-next-line no-unused-vars
      const point = range.getCursortPosition(textareaDom);
    },
    addLine() {
      insertContent('\n----\n', this);
    },
    addLink() {
      insertContent('[Vue](https://cn.vuejs.org/images/logo.png)', this);
    },
    addQuote() {
      const textareaDom = document.querySelector('.mdEditor');
      const { value } = textareaDom;
      const point = range.getCursortPosition(textareaDom);
      const lastChart = value.substring(point - 1, point);
      insertContent('> ', this);
      if (lastChart !== '\n' && value !== '') {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addTable() {
      insertContent('\nheader 1 | header 2\n', this);
      insertContent('---|---\n', this);
      insertContent('row 1 col 1 | row 1 col 2\n', this);
      insertContent('row 2 col 1 | row 2 col 2\n\n', this);
    },
    addUl() {
      insertContent('* ', this);
    },
    addOl() {
      insertContent('1. ', this);
    },
    previewFn() {
      if (!this.editStatus) {
        this.editStatus = true;
        this.previewStatus = !this.previewStatus;
      } else {
        this.previewStatus = !this.previewStatus;
      }
    },
    previewAllFn() {
      if (!this.editStatus && this.previewStatus) {
        this.editStatus = true;
        this.previewStatus = true;
      } else {
        this.editStatus = false;
        this.previewStatus = true;
      }
    },
    fullPageFn() {
      this.fullPageStatus = !this.fullPageStatus;
      const maxEditScrollHeight =
        document.querySelector('.mdEditor').scrollHeight - document.querySelector('.mdEditor').clientHeight;
      const maxPreviewScrollHeight =
        document.querySelector('.previewContainer').scrollHeight -
        document.querySelector('.previewContainer').clientHeight;
      this.maxEditScrollHeight = maxEditScrollHeight;
      this.maxPreviewScrollHeight = maxPreviewScrollHeight;
    },
    previewScroll(e, position) {
      if (this.maxEditScrollHeight !== 0) {
        const topPercent = position.scrollTop / this.maxPreviewScrollHeight;
        document.querySelector('.mdEditor').scrollTop = this.maxEditScrollHeight * topPercent;
      }
    },
    editScroll(e, position) {
      if (this.maxPreviewScrollHeight !== 0) {
        const topPercent = position.scrollTop / this.maxEditScrollHeight;
        document.querySelector('.previewContainer').scrollTop = this.maxPreviewScrollHeight * topPercent;
      }
    },
  },
  computed: {
    compiledMarkdown() {
      return marked(this.input, {
        sanitize: true,
      });
    },
  },
  watch: {
    input() {
      const data = {};
      data.mdValue = this.input;

      data.htmlValue = marked(this.input, {
        sanitize: true,
      });
      this.$emit('childevent', data);
      const maxEditScrollHeight =
        document.querySelector('.mdEditor').scrollHeight - document.querySelector('.mdEditor').clientHeight;
      const maxPreviewScrollHeight =
        document.querySelector('.previewContainer').scrollHeight -
        document.querySelector('.previewContainer').clientHeight;
      this.maxEditScrollHeight = maxEditScrollHeight;
      this.maxPreviewScrollHeight = maxPreviewScrollHeight;
    },
  },
};
</script>

<style>
.mdContainer {
  width: 100%;
  height: 100%;
  background: lightblue;
}
.mdContainer.fullPage {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
}
.mdContainer .navContainer {
  width: 100%;
  height: 36px;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
}
.mdContainer .navContainer .nameContainer {
  color: indigo;
  margin-right: 10px;
  cursor: pointer;
}
.mdContainer .navContainer .markContainer {
  width: auto;
  height: 100%;
  margin-left: 0px;
}
.mdContainer .navContainer .markContainer ul.markListGroup {
  height: 100%;
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.mdContainer .navContainer .markContainer ul.markListGroup li.markListItem {
  list-style: none;
  width: 20px;
  height: 20px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
}
.mdContainer .navContainer .markContainer ul.markListGroup li.markListItem:hover {
  background: #eee;
}
.mdContainer .mdBodyContainer {
  width: 100%;
  height: calc(100% - 36px);
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.mdContainer .mdBodyContainer.noMenu {
  height: 100%;
}
.editContainer {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
  background: #333;
  color: #fff;
  padding: 10px;
}
.editContainer .mdEditor {
  height: 100%;
  width: 100%;
  background: transparent;
  outline: none;
  color: #fff;
  resize: none;
}
.previewContainer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: auto;
  padding: 10px;
  text-align: left;
  font-size: inherit;
}
</style>
