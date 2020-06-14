<template>
  <div id="app">
    <menu-bar :menu-data="menuData" @route="routeHandle"></menu-bar>

    <router-view id="routerview" />
  </div>
</template>

<script>
import menuBar from '@/components/menubar.vue';

const menuData = require('@/config/menuData.json');

export default {
  data() {
    return {
      menuData: menuData.menuData,
    };
  },
  components: {
    menuBar,
  },
  methods: {
    routeHandle(routeDir) {
      if (routeDir === 'Home') {
        this.$router.replace('/');
      } else if (routeDir === 'About') {
        this.$router.replace('/about');
      } else if (routeDir === 'Editor') {
        this.$router.replace('/fronter');
      }
    },
  },
};
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100vh;
  overflow: hidden;
}

#routerview {
  height: calc(100% - 32px);
}
</style>
