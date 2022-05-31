<template>
  <q-header class="q-pa-sm q-px-md bg-secondary q-pt-sm" elevated="elevated">
    <q-toolbar class="flex position-relative q-pa-sm q-pb-lg">
      <div class="text-center full-width">
        <div v-if="logo" class="row full-width items-center">
          <div class="col text-left">
            <q-img
              src="../../../../../../src/assets/logo_textoBranco.png"
              width="10.479rem"
              class="q-mb-sm"
            >
            </q-img>
          </div>

          <q-btn
            :icon="!notify ? 'o_notifications' : 'notification_important'"
            no-caps
            size="1.313rem"
            :color="!notify ? 'white' : 'orange-5'"
            class="col-auto"
            align="right"
            flat
            :to="{ name: 'notifications-user' }"
            round
          >
          </q-btn>
        </div>

        <q-input
          dense
          rounded="rounded"
          outlined="outlined"
          v-model="search"
          v-on:keyup="emitSearch"
          :placeholder="$t('search_text')"
          bg-color="white"
          color="secondary"
          :loading="loading"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey"></q-icon>
          </template>
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="close" @click="cleanSearch" color="grey"></q-icon>
          </template>
        </q-input>
      </div>
    </q-toolbar>

    <div class=" q-px-sm">
      <h6 class="q-ma-none title-category">{{ $t(title) }}</h6>
      <p class="q-ma-none subtitle-category">{{ $t(subtitle) }}</p>
    </div>
  </q-header>
</template>

<script>
export default {
  props: {
    logo: {
      type: Boolean,
      defalt: true,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      search: '',
      notify: true,
      loading: false,
    };
  },

  methods: {
    cleanSearch() {
      this.search = '';
    },
    emitSearch(event) {
      this.$emit('emit-search', event.target.value);
    },
  },
};
</script>

<style lang="scss">
.title-category {
  font-size: 1.5rem;
}
.subtitle-category {
  font-size: 1.125rem;
}
</style>
