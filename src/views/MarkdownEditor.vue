<template>
  <div class="indexContainer">
    <div class="btnsContainer">
      <div class="btn" @click="getMdValueFn">获取mdValue</div>
      <div class="btn" @click="getHtmlValueFn">获取htmlValue</div>
    </div>
    <div class="maskContainer" v-if="dilogStatus">
      <div class="contentContainer">
        <div class="closeBtnContainer" @click="closeMaskFn"></div>
        <textarea class="showAreaContainer" v-model="msgShow" readonly></textarea>
      </div>
    </div>
    <div class="editorContainer">
      <markdown
        :mdValuesP="msg.mdValue"
        :fullPageStatusP="false"
        :editStatusP="true"
        :previewStatusP="true"
        :navStatusP="true"
        :icoStatusP="true"
        @childevent="childEventHandler"
      ></markdown>
    </div>
  </div>
</template>

<script>
import markdown from '@/components/markdown.vue';

import '@/assets/css/github-markdown.css';

/* 引入atom的代码高亮样式文件 */

import '@/assets/css/atom-one-dark.min.css';

export default {
  name: 'index',
  data() {
    return {
      msgShow: '我要显示的内容',
      dilogStatus: false,
      msg: {
        mdValue: '## Vue-markdownEditor',
      },
    };
  },
  components: {
    markdown,
  },
  methods: {
    childEventHandler(res) {
      // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
      this.msg = res;
    },
    getMdValueFn() {
      this.msgShow = this.msg.mdValue;
      this.dilogStatus = true;
    },
    getHtmlValueFn() {
      this.msgShow = this.msg.htmlValue;
      this.dilogStatus = true;
    },
    closeMaskFn() {
      this.msgShow = '';
      this.dilogStatus = false;
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
  color: lightblue;
  margin-right: 10px;
  cursor: pointer;
}
.mdContainer .navContainer .markContainer {
  width: auto;
  height: 100%;
  margin-left: 0px;
}
.mdContainer .navContainer .markContainer ul .markListGroup {
  height: 100%;
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.mdContainer .navContainer .markContainer ul .markListGroup li .markListItem {
  list-style: none;
  width: 20px;
  height: 20px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  color: #333;
}
.mdContainer .navContainer .markContainer ul .markListGroup li .markListItem:hover {
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
}
</style>
