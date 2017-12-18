/* eslint no-new: "off" */
import Vue from 'vue';

import { store } from './vuex/store';
import WebApp from './components/index.vue';

function isMobile() {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const x = w.innerWidth || e.clientWidth || g.clientWidth;
  const y = w.innerHeight || e.clientHeight || g.clientHeight;
  return x < y * 0.75;
}

new Vue({
  el: '#app',
  render: h => h(WebApp),
  store,
});
