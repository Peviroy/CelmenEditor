<template>
  <div class="universal-editor">
    <div class="label-container">
      <!-- <img :src="labelSrc" class="file-info-icon" />
        <div class="file-info-name">
          <span>{{ this.kind }}</span>
        </div> -->
      <div v-for="value in nameTabs" :key="value.id">
        <input type="radio" name="rd" @click="selectedTab" :id="value.id" :checked="value.show" />
        <label class="label-tab" :for="value.id">
          {{ value.name }}
        </label>
      </div>
    </div>
    <div class="editor-container" ref="editor_container">
      <code-mirror
        v-for="(config, i) in configs"
        :show="nameTabs[i].show"
        :options="config.option"
        :id="'container-' + nameTabs[i].id"
        :key="'container-' + i"
        class="coder-editor__document"
        :code="code"
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
    };
  },

  methods: {
    selectedTab(event) {
      const idContainerCM = `container-${event.target.id}`;
      console.log('Selected:', idContainerCM);
      const domContainerCM = document.getElementById(idContainerCM).nextElementSibling; // next dom element is the true editor

      const classContainersCM = document.getElementsByClassName('CodeMirror');
      for (let i = 0; i < classContainersCM.length; i += 1) {
        classContainersCM[i].style.display = 'none';
      }
      domContainerCM.style.display = 'block';
      this.currentTab = domContainerCM;
      this.$emit('focusedDomChange', this.currentTab);
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
}

.label-container {
  position: absolute;
  top: 0;
  width: 100%;
  background: #212429;
}

input[type='radio'] {
  display: none;
}

.label-tab {
  float: left;
  cursor: pointer;
  font-family: 'Source Sans Pro', sans-serif;
}

input[type='radio']:checked + .label-tab {
  background: #2b3037;
  color: #f1f1f1;
  padding: 1em;
  display: inline-block;
}

input[type='radio'] + .label-tab {
  padding: 1em;
  background: #212429;
  color: #fff;
  display: inline-block;
}

.editor-container {
  position: absolute;
  top: 50px;
  width: 100%;
  height: 100vh;
}

/* specially for codemirror */
.CodeMirror {
  height: calc(100% - 32px);
  text-align: left;
  font-size: 16px;
  z-index: 0;
}
</style>
