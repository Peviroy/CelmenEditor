<template>
  <textarea></textarea>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

// import 'codemirror/mode/htmlmixed/htmlmixed.js' // XML, JS, CSS
import 'codemirror/mode/htmlembedded/htmlembedded.js';
import 'codemirror/mode/css/css.js';
// import 'codemirror/mode/xml/xml.js' // XML
// import 'codemirror/mode/meta.js' // META

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
// import 'codemirror/addon/fold/brace-fold.js'  // FOR JS
import 'codemirror/addon/fold/foldcode.js';
// import 'codemirror/addon/fold/indent-fold.js'
// import 'codemirror/addon/fold/xml-fold.js'

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
// import 'codemirror/addon/hint/xml-hint.js'
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
import './src/advancedsearch/advanced-dialog.js';
import './src/advancedsearch/advanced-dialog.css';
import './src/advancedsearch/revised-search.js';

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
    unseenLines: Array,
    marker: Function,
    loadtheme: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    debugger: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    options: {
      type: Object,
      required: true,
    },
  },
  created() {
    // if (this.options.lineNumbers === undefined) {
    //   this.options.lineNumbers = true
    // }
    // if (this.options.lineWrapping === undefined) {
    //   this.options.lineWrapping = false
    // }
    // if (this.options.mode === undefined) {
    //   this.options.mode = 'text/javascript'
    // }
    // var theme = this.options.theme
    // var language = this.options.mode
    // var _debugger = this.debugger
    // var _loadtheme = this.loadtheme
    // var isCustomMode = !!CodeMirror.modes[language]
    // // theme config
    // if (theme && theme === 'solarized light') {
    //   theme = 'solarized'
    // }
    // // console.log(language, CodeMirror.modes.simplemode)
    // // language string config
    // if (typeof language === 'string') {
    //   let lang = CodeMirror.findModeByMIME(language)
    //   language = !lang ? lang : lang.mode
    // // language object config
    // } else if (typeof language === 'object') {
    //   if (language.name) {
    //     let lang = CodeMirror.findModeByName(language.name)
    //     if (lang) {
    //       language = lang.mode
    //       // this.options.mode = language
    //     } else {
    //       language = null
    //     }
    //   } else if (language.ext) {
    //     let lang = CodeMirror.findModeByExtension(language.ext)
    //     if (lang) {
    //       language = lang.mode
    //       // this.options.mode = language
    //     } else {
    //       language = null
    //     }
    //   } else if (language.mime) {
    //     let lang = CodeMirror.findModeByMIME(language.mime)
    //     if (lang) {
    //       language = lang.mode
    //       // this.options.mode = language
    //     } else {
    //       language = null
    //     }
    //   } else if (language.filename) {
    //     let lang = CodeMirror.findModeByFileName(language.filename)
    //     if (lang) {
    //       language = lang.mode
    //       // this.options.mode = language
    //     } else {
    //       language = null
    //     }
    //   }
    // }
    // // console.log('language', language, isCustomMode)
    // if ((!language || language === 'null') && _debugger && !isCustomMode) {
    //   console.warn('CodeMirror language mode: ' + language + ' configuration error (CodeMirror语言模式配置错误，或者不支持此语言) See http://codemirror.net/mode/ for more details.')
    //   // return false
    // }
    // // console.log(language, theme)
    // // require language
    // if (language && language !== 'null') {
    //   // require('codemirror/mode/' + language + '/' + language + '.js')
    // }
    // // require theme
    // if (theme && _loadtheme) {
    //   // require('codemirror/theme/' + theme + '.css')
    // }
    // var dummy = {
    //   attrs: {
    //     color: ['red', 'green', 'blue', 'purple', 'white', 'black', 'yellow'],
    //     size: ['large', 'medium', 'small'],
    //     description: null
    //   },
    //   children: []
    // };
    // var tags = {
    //   '!top': ['top'],
    //   '!attrs': {
    //     id: null,
    //     class: ['A', 'B', 'C']
    //   },
    //   top: {
    //     attrs: {
    //       lang: ['en', 'de', 'fr', 'nl'],
    //       freeform: null
    //     },
    //     children: ['animal', 'plant']
    //   },
    //   animal: {
    //     attrs: {
    //       name: null,
    //       isduck: ['yes', 'no']
    //     },
    //     children: ['wings', 'feet', 'body', 'head', 'tail']
    //   },
    //   plant: {
    //     attrs: { name: null },
    //     children: ['leaves', 'stem', 'flowers']
    //   },
    //   wings: dummy,
    //   feet: dummy,
    //   body: dummy,
    //   head: dummy,
    //   tail: dummy,
    //   leaves: dummy,
    //   stem: dummy,
    //   flowers: dummy
    // };
    // function completeAfter(cm, pred) {
    //   // var cur = cm.getCursor();
    //   if (!pred || pred()) {
    //     setTimeout(function() {
    //       if (!cm.state.completionActive) cm.showHint({ completeSingle: false })
    //     }, 100);
    //   }
    //   return CodeMirror.Pass;
    // }
    // function completeIfAfterLt(cm) {
    //   return completeAfter(cm, function() {
    //     var cur = cm.getCursor();
    //     return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === '<'
    //   });
    // }
    // function completeIfInTag(cm) {
    //   return completeAfter(cm, function() {
    //     var tok = cm.getTokenAt(cm.getCursor())
    //     if (
    //       tok.type === 'string' &&
    //       (!/['']/.test(tok.string.charAt(tok.string.length - 1)) ||
    //         tok.string.length === 1)
    //     ) {
    //       return false
    //     }
    //     var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state
    //     return inner.tagName
    //   });
    // }
    // this.options.extraKeys = {
    //   '<': completeAfter,
    //   '/': completeIfAfterLt,
    //   ' ': completeIfInTag,
    //   '=': completeIfInTag
    // }
    // this.options.hintOptions = {
    //   schemaInfo: tags
    // }
  },
  mounted() {
    var _this = this;
    this.editor = CodeMirror.fromTextArea(this.$el, this.options);

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
    this.unseenLineMarkers();
    // prevents funky dynamic rendering
    window.setTimeout(function() {
      _this.editor.refresh();
    }, 0);
    console.log(this);
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
      this.unseenLineMarkers();
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
      this.unseenLineMarkers();
    },
  },
  methods: {
    refresh: function() {
      this.editor.refresh();
    },
    unseenLineMarkers: function() {
      var _this = this;
      if (_this.unseenLines !== undefined && _this.marker !== undefined) {
        _this.unseenLines.forEach((line) => {
          var info = _this.editor.lineInfo(line);
          _this.editor.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : _this.marker());
        });
      }
    },
    removeScriptTag(code) {
      return code.replace(/(<script\b[^>]*>([\s\S]*?)<\/script>)/gim, '');
    },
  },
};
</script>