<template>
  <q-header class="q-pa-sm bg-secondary q-pt-lg" elevated="elevated">
    <q-toolbar class="flex position-relative q-pa-xs">
      <div class="flex text-center q-px-sm full-width">
        <q-btn
          icon="arrow_back"
          no-caps
          class=" q-py-sm"
          round
          color="secondary"
          flat
          @click="$router.go(-1)">
        </q-btn>
        <q-space></q-space>

        <div class="q-gutter-x-sm">
          <q-btn
            icon="share"
            no-caps
            class=""
            round
            color="secondary"
            flat
            @click="$router.go(-1)">
          </q-btn>
          <q-btn
            icon="favorite"
            no-caps
            class=""
            round
            color="secondary"
            flat
            @click="$router.go(-1)">
          </q-btn>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
};
</script>

<style lang="scss">

</style>
