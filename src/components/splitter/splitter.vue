<template>
  <!-- 分隔栏template -->
  <div
    class="code-splitter"
    :style="{ cursor, userSelect }"
    @mouseup="onUp"
    @mousemove="onMouseMove"
    @touchmove="onMove"
    @touchend="onUp"
  >
    <!-- left -->
    <div class="left-pane code-splitter-pane" :style="{ width: percent + '%', minWidth: leftMinWidth + 'px' }">
      <ul>
        <li v-for="(item, index) in leftPaneList" :key="index">
          <div class="wrapper">
            <slot :name="`left-pane-${item.kind}`"></slot>
          </div>
        </li>
      </ul>
    </div>
    <!-- mid -->
    <div
      class="code-splitter-inner"
      :class="{ active }"
      @mousedown="onDown"
      @click="onClick"
      @touchstart.prevent="onDown"
    ></div>
    <!-- right -->
    <div class="right-pane code-splitter-pane" :style="{ width: 100 - percent + '%', minWidth: rightMinWidth + 'px' }">
      <slot name="right-pane"></slot>
    </div>
    <div class="code-spliter-inner-modal" v-if="active"></div>
  </div>
</template>

<style>
.code-splitter {
  height: 100vh;
  display: flex;
  z-index: 174;
}
.code-splitter-pane {
  height: inherit;
}

/* 分割栏 */
.code-splitter-inner {
  width: 5px;
  background-color: #dde1e6;
  cursor: ew-resize;
  position: relative;
}
/* 在分割栏上添加标志性图案 */
.code-splitter-inner:before {
  position: absolute;
  top: 50%;
  right: -4px;
  width: 12px;
  height: 40px;

  border-radius: 5px;
  box-shadow: 0px 0px 1px 1px #53535347;
  background-color: #dce0e5;
  content: ' ';

  z-index: 174;
}

.code-spliter-inner-modal {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 164;
}
</style>

<script>
export default {
  name: 'code-splitter',
  props: {
    margin: {
      type: Number,
      default: 10,
    },
    leftMinWidth: {
      type: Number,
      default: 600,
    },
    rightMinWidth: {
      type: Number,
      default: 360,
    },
    leftPaneList: {
      type: Array,
      default() {
        return [
          {
            kind: 'default',
          },
        ];
      },
    },
    rightPaneNum: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      active: false,
      percent: 50, // half
      hasMoved: false,
    };
  },
  computed: {
    userSelect() {
      return this.active ? 'none' : '';
    },
    cursor() {
      return this.active ? 'ew-resize' : '';
    },
  },
  methods: {
    // click -> reset
    onClick() {
      if (!this.hasMoved) {
        this.percent = 50;
        this.$emit('resize'); // resize need to cooperate with outer
      }
    },
    onDown() {
      this.active = true;
      this.hasMoved = false;
    },
    onUp() {
      this.active = false;
      this.$emit('resize-end');
    },
    onMove(e) {
      if (this.active) {
        let offset = 0;
        let target = e.currentTarget;
        while (target) {
          offset += target.offsetLeft;
          target = target.offsetParent;
        }
        console.log(`e.pageX ${e.pageX}`);
        console.log(`offset ${offset}`);
        console.log(`offsetWidth${e.currentTarget.offsetWidth}`);

        const percent = Math.floor(((e.pageX - offset) / e.currentTarget.offsetWidth) * 10000) / 100; // reserve two
        console.log(`percent${percent}$`);

        if (percent > this.margin && percent < 100 - this.margin) {
          this.percent = percent;
        }
        this.$emit('resize');
        this.hasMoved = true;
      }
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false;
      }
      this.onMove(e);
    },
  },
};
</script>
