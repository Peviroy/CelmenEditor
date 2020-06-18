import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import FrontEditor from '@/views/FrontEditor.vue';
import MarkdownEditor from '@/views/MarkdownEditor.vue';
import UniversalEditor from '@/views/UniversalEditor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/fronter',
    name: 'FrontEditor',
    component: FrontEditor,
  },
  {
    path: '/markdown',
    name: 'MarkdownEditor',
    component: MarkdownEditor,
  },
  {
    path: '/universal',
    name: 'UniversalEditor',
    component: UniversalEditor,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
