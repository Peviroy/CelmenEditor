<template>
  <div class="universal-editor">
    <div class="label-container">
      <div v-for="value in nameTabs" :key="value.id" class="file-info">
        <input type="radio" name="rd" @click="selectedTab" :id="value.id" :checked="value.show" />
        <div class="label-tab">
          <img :src="value.labelSrc" class="label-icon" />
          <label :for="value.id" class="label-name">
            {{ value.name }}
          </label>
        </div>
      </div>
      <div class="newTabBtn" @click="makeNewTab"></div>
    </div>
    <div class="editor-container" ref="editor_container">
      <code-mirror
        v-for="(config, i) in configs"
        :show="nameTabs[i].show"
        :options="config.option"
        :id="'container-' + nameTabs[i].id"
        :key="'container-' + i"
        :code="code"
        :codemirrorStyle="codemirrorStyle"
        @ready="onEditorReady"
        @focus="onEditorFocus"
        @change="onEditorCodeChange"
      ></code-mirror>
    </div>
  </div>
</template>

<script>
import codeMirror from './codemirror/codemirror.vue';

export default {
  name: 'universalEditor',

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

    nameTabs: Array,
    configs: Array,
  },

  data() {
    return {
      currentTab: '',
      codemirrorStyle: {
        height: '100%',
        textAlign: 'left',
        fontSize: '16px',
        zIndex: '0',
      },
    };
  },

  methods: {
    makeNewTab() {
      console.log('newTabRequest');

      this.$emit('newTab');
    },
    // ! select Tab and editor focus cannot merge, but only divide into two part
    selectedTab(event) {
      const tabId = event.target.id;
      const idContainerCM = `container-${tabId}`;
      console.log('Selected:', idContainerCM);
      const domContainerCM = document.getElementById(idContainerCM).nextElementSibling; // next dom element is the true editor

      const classContainersCM = document.getElementsByClassName('CodeMirror');
      for (let i = 0; i < classContainersCM.length; i += 1) {
        classContainersCM[i].style.display = 'none';
      }
      domContainerCM.style.display = 'block';
      this.currentTab = domContainerCM;
      this.$emit('focusedDomChange', { id: tabId, dom: this.currentTab });
    },
    onEditorReady(editor) {
      console.log('the editor is readied!', editor);
    },
    onEditorFocus(editor) {
      console.log('the editor is focus!', editor);
      this.$emit('editorFocus', editor);
    },
    onEditorCodeChange(newCode) {
      console.log('this is new code', newCode);
      // console.log('this is type', editorType);
      // this.code = newCode;
      this.$emit('change', newCode);
    },
  },
  computed: {
    code() {
      console.log('code computed');

      return this.value;
    },
  },
};
</script>

<style>
.universal-editor {
  position: relative;
  height: inherit;
}

.label-container {
  position: absolute;
  top: 0;
  width: 100%;
  background: #212429;
  height: 50px;
}

.label-container .file-info {
  float: left;
  cursor: pointer;
  font-family: 'Source Sans Pro', sans-serif;
  height: 50px;
  user-select: none;
}

.label-container .file-info input[type='radio'] {
  display: none;
}

.label-container .file-info .label-tab .label-icon {
  height: 30px;
}

.label-container .file-info .label-tab .label-name {
  cursor: pointer;
}

.label-container .file-info input[type='radio']:checked + .label-tab {
  background: #2b3037;
  color: #f1f1f1;
  padding: 0.5em;
  display: inline-block;
}

.label-container .file-info input[type='radio'] + .label-tab {
  padding: 0.5em;
  background: #212429;
  color: #fff;
  display: inline-block;
}

.label-container .newTabBtn {
  float: right;
  color: azure;
  cursor: pointer;
  width: 50px;
  height: 50px;

  position: relative;
  transition: color 0.25s;
}

.label-container .newTabBtn::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  margin-left: -10px;
  margin-top: -2.5px;
  border-top: 5px solid;
  border-radius: 5px;
}

.label-container .newTabBtn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  height: 20px;
  margin-left: -2.5px;
  margin-top: -10px;
  border-left: 5px solid;
  border-radius: 5px;
}

.label-container .newTabBtn:hover {
  color: aqua;
}

.editor-container {
  position: absolute;
  top: 50px;
  width: 100%;
  height: calc(100% - 50px);
}

/* specially for codemirror */
.CodeMirror {
  height: 100%;
}
</style>
