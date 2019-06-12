<template>
  <div id="app">
    <nayo-c :is="layout" v-if="independent_switch"></nayo-c>
    <router-view name="nayoIndependent" v-else></router-view>
  </div>
</template>

<script>
  export default {
    props: {
      layout: {
        required: true
      }
    },
    computed: {
      independent_switch() {
        if (this.$route.matched.length > 0) {
          if (this.$route.matched[0].props.independent == true || this.$route.matched[0].props.independent == false) {
            return !this.$route.matched[0].props.independent;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    }
  }
</script>

<style>
  html, body, #app {
    width: 100%;
  }
</style>
