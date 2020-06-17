<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <div id="routerWrapper">
      <router-link to="/fronter" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">CodepenEditor</router-button>
      </router-link>
      <router-link to="/about" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">About</router-button>
      </router-link>
      <router-link to="/markdown" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">MarkdownEditor</router-button>
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import RouterButton from '@/components/RouterButton.vue';

export default {
  name: 'Home',
  components: {
    RouterButton,
  },
};
</script>

<style>
#routerWrapper {
  display: flex;
  justify-content: center;
}
</style>
