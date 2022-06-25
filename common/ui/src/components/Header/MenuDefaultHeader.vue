<template>
  <q-header
    :class="(!title && !icon) ? 'q-px-sm bg-secondary q-py-lg' : 'q-pa-sm bg-secondary q-pt-lg'"
    elevated="elevated"
  >
    <div class="q-pa-sm q-px-md flex items-center">
      <q-btn
        icon="arrow_back"
        no-caps
        class="bg-white"
        round
        color="secondary"
        flat
        @click="$router.go(-1)">
      </q-btn>
      <q-space></q-space>
      <q-btn
        v-if="save_button"
        dense
        class="q-pa-xs text-capitalize"
        outline
        flat
        color="white"
        :label="$t('save_header')"
        @click="save"
      >
      </q-btn>
    </div>

    <div v-if="title && icon" class="q-pa-sm q-my-xs q-mx-sm flex items-center">
      <q-item-section style="font-size: 1.5rem;">{{ title }}</q-item-section>
      <q-icon size="2rem" :name="icon"></q-icon>
    </div>
  </q-header>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    save_button: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    viewProfile() {
      this.$router.push({ name: 'view-profile' });
    },
    save() {
      this.$emit('save');
    },
  },
};
</script>

<style lang="scss">
.link-format {
  text-decoration: underline;
}
</style>
