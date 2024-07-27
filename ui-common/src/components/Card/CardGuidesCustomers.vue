<template>
  <q-card
    class="q-pa-sm border-card q-mx-md"
    square
    flat
    @click="goGuide"
  >
    <q-card-section horizontal>
      <q-img
        class="image-border q-mr-md"
        width="25%"
        :src="image_guide"
      />

      <div>
        <q-card-section class="q-pa-none text-bold">
          {{ title_guide }}
        </q-card-section>
        <q-card-section class="q-pa-none">
          {{ $t('conductor') }}: {{ provider }}
        </q-card-section>
        <q-card-section class="q-pa-none q-pt-md justify-end text-caption text-secondary text-bold">
          {{ date.from }} - {{ date.to }}
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    image_guide: {
      type: String,
      default: '',
    },
    title_guide: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      default: '',
    },
    date: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    goGuide() {
      this.$router.push({ name: 'cliente-guide-details', params: { id: this.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.q-card__section--horiz > div:not(:last-child), .q-card__section--horiz > img:not(:last-child) {
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
}
.border-card {
  border-bottom: 1px solid $grey-5;
}
.image-border {
  border-radius: 6px!important;
  margin-left: -0.4rem;
}
</style>
