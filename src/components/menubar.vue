<template>
  <div>
    <menu-bar :menu="menu" :showAccelerators="true" :css="theme" @itemExecute="showMsg" />
  </div>
</template>

<script>
/* eslint-disable no-tabs */
import { component as nativeMenubar } from '@joe_kerr/vue-native-menubar';

export default {
  props: {
    menuData: Array,
  },
  data() {
    return {
      menu: null,
      theme: {
        menubarClass: 'menubar',

        submenuClass: 'submenu',

        itemBaseClass: 'itemBase',

        itemTopClass: 'itemTop',
        itemSeparatorClass: 'itemSeparator',
        itemFunctionalClass: 'itemFunctional',

        itemContentClass: 'item--content',
        itemLeftClass: 'item--left',
        itemMiddleClass: 'item--middle',
        itemRightClass: 'item--right',

        itemActiveClass: 'item--active',
      },
    };
  },

  methods: {
    showMsg(event) {
      console.log(`Event '${event.eventSource.type}' for menu item '${event.item.label}'.`);
      if (event.item.label.substring(0, 6) === 'route-') {
        const routeDir = event.item.label.substring(6);
        this.$emit('route', routeDir);
      } else if (event.item.type === 'coding') {
        console.log('emit coding');
        this.$bus.$emit('coding', event.item.label);
      } else if (event.item.type === 'file') {
        console.log('emit file');
        this.$bus.$emit('file', event.item.label);
      }
    },
  },
  created() {
    this.menu = this.menuData;

    // document.addEventListener('keydown', (event) => {
    //   if (['o', 'q', 'x', 'c', 'v', 'f'].indexOf(event.key) > -1 && event.ctrlKey) {
    //     event.preventDefault();
    //     console.log('Notice: Accelerators are shown only. No listeners will be set up for them!');
    //   }
    // });
  },
  components: { 'menu-bar': nativeMenubar },
};
</script>

<style>
.menubar {
  -webkit-app-region: drag;
  background-color: #303238;
  height: 32px;
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: left;

  z-index: 9999;
  position: relative;
}

.submenu {
  padding: 6px 4px 6px 6px;
  background-color: #31566a;
  /* border-color: #31566a; */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.itemBase {
  line-height: 32px;
  color: #f5f5f5;
  font-size: 14px;
}

.itemTop {
  padding: 0px 12px;
}

.itemSeparator {
  margin: 0 0 0 auto;
  width: calc(100%);
  height: 1px;
  border: none;
}

.item--content {
  display: inline-block;
}

.item--left {
  width: 8px;
}

.item--right {
  text-align: right;
  padding-left: 15px;
  padding-right: 8px;
  float: right;
  min-width: 10px;
}

.itemBase:focus:not(.itemSeparator),
.item--active {
  background-color: #31566a;
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.1);
}
</style>
