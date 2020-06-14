<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <router-link to="/fronter" :style="{ 'pointer-events': 'none', cursor: 'default' }">
      <router-button :innerstyle="{ 'pointer-events': 'auto', cursor: 'pointer' }">Editor</router-button>
    </router-link>
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
