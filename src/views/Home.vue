<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" :style="{ 'margin-top': '20px' }" />

    <div id="routerWrapper">
      <router-link to="/fronter" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">Codepen</router-button>
      </router-link>
      <router-link to="/markdown" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">Markdown</router-button>
      </router-link>
      <router-link to="/universal" :style="{ 'pointer-events': 'none', cursor: 'default' }">
        <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">Universal</router-button>
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
