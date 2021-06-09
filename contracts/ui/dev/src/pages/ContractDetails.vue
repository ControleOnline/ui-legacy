<template>
  <q-page class="text-center flex flex-center" padding>
    <h2>Contract #{{id}} Details page</h2>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      id: null
    }
  },

  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);
    }
  },

  methods: {

  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
