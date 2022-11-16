import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $isMobile: boolean
  }
}


export default () => {
  const isMobile = window.screen.width < 900
  
  Vue.prototype.$isMobile = isMobile
}


