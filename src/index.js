import VueUploader from './components/VueUploader.vue'

export default {
  install: function (Vue, options) {
    Vue.component('vue-uploader', VueUploader)
  }
}

export { VueUploader }
