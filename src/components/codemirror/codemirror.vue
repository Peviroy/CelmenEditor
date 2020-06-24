<template>
  <div :style="codemirrorStyle">
    <textarea :id="id"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import 'codemirror/mode/htmlembedded/htmlembedded.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/python/python.js';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js'; // FOR JS
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/indent-fold.js';

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';

import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/lint/html-lint.js';

import 'codemirror/addon/edit/closetag.js';
// import 'codemirror/addon/selection/active-line.js'
// import 'codemirror/addon/runmode/colorize.js'

import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars.js';

import 'codemirror/addon/scroll/annotatescrollbar.js'; // 提供在滚动条上显示标记的功能，以调出文档的某些部分。

import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';

import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/search/matchesonscrollbar.js';

import 'codemirror/addon/search/search.js'; // 实现搜索命令
import 'codemirror/addon/search/searchcursor.js'; // 实现搜索/替换功能
import 'codemirror/addon/search/jump-to-line.js'; // 实现一个jumpToLine命令并绑定Alt-G到它
import 'codemirror/addon/search/match-highlighter.js';

import 'codemirror/addon/edit/matchbrackets.js';

import 'codemirror/addon/display/panel.js';

// import 'codemirror-revisedsearch'
// import './src/advancedsearch/advanced-dialog.js';
// import './src/advancedsearch/advanced-dialog.css';
// import './src/advancedsearch/revised-search.js';

export default {
  name: 'codeMirror',
  data() {
    return {
      content: '',
    };
  },
  props: {
    code: String,
    value: String,
    events: Array,
    options: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      default: 'codemirror-area-0',
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
    codemirrorStyle: {
      type: Object,
    },
  },
  mounted() {
    var _this = this;
    this.editor = CodeMirror.fromTextArea(this.$el.firstElementChild, this.options);

    console.log('catch editor object', this.editor);

    // this.editor = new CodeMirror(document.getElementById(this.id), this.options);

    const filterCode = this.removeScriptTag(this.code || this.value || this.content);
    this.editor.setValue(filterCode);
    this.editor.on('change', function(cm) {
      // console.log('change')
      _this.content = _this.removeScriptTag(cm.getValue());
      if (_this.$emit) {
        _this.$emit('change', _this.content);
        _this.$emit('input', _this.content);
      }
    });
    var events = [
      'scroll',
      'changes',
      'beforeChange',
      'cursorActivity',
      'keyHandled',
      'inputRead',
      'electricInput',
      'beforeSelectionChange',
      'viewportChange',
      'swapDoc',
      'gutterClick',
      'gutterContextMenu',
      'focus',
      'blur',
      'refresh',
      'optionChange',
      'scrollCursorIntoView',
      'update',
    ];
    if (this.events && this.events.length) {
      events = events.concat(this.events);
    }
    for (var i = 0; i < events.length; i++) {
      if (events.indexOf(events[i]) === i) {
        (function(event) {
          _this.editor.on(event, function(a, b, c) {
            _this.$emit(event, a, b, c);
          });
        })(events[i]);
      }
    }
    this.$emit('ready', this.editor);
    // prevents funky dynamic rendering
    window.setTimeout(function() {
      _this.editor.refresh();
    }, 0);
    console.log(this);

    if (!this.show) {
      document.getElementById(this.id).style.display = 'none';
    }
  },
  beforeDestroy() {
    // garbage cleanup
    var element = this.editor.doc.cm.getWrapperElement();
    if (element && element.remove) {
      element.remove();
    }
  },
  watch: {
    options: {
      deep: true,
      handler(options, oldOptions) {
        var key;
        for (key in options) {
          this.editor.setOption(key, options[key]);
        }
      },
    },
    code(newVal, oldVal) {
      // console.log('code')
      var editor_value = this.editor.getValue();
      if (newVal !== editor_value) {
        var scrollInfo = this.editor.getScrollInfo();
        this.editor.setValue(newVal);
        this.content = newVal;
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
      }
    },
    value(newVal, oldVal) {
      // console.log('value')
      var editor_value = this.editor.getValue();
      if (newVal !== editor_value) {
        var scrollInfo = this.editor.getScrollInfo();
        this.editor.setValue(newVal);
        this.content = newVal;
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
      }
    },
  },
  methods: {
    refresh: function() {
      this.editor.refresh();
    },
    removeScriptTag(code) {
      return code.replace(/(<script\b[^>]*>([\s\S]*?)<\/script>)/gim, '');
    },
  },
};
</script>
