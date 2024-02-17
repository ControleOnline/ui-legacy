<template>
  <q-header class="bg-secondary q-pt-lg q-px-lg" elevated="elevated">
    <div class="q-py-sm">
      <q-btn
        icon="arrow_back"
        no-caps
        class=""
        round
        color="secondary"
        flat
        @click="$router.go(-1)">
      </q-btn>
    </div>

    <div class="q-my-lg flex favorite-container items-center">
      <div style="max-width: 60%;">
        <q-item-section
          class="q-ma-none q-pa-none text-bold text-white"
          style="font-size: 1.5rem;"
        >
          {{ $t('my_name') }} {{ user_name }}
        </q-item-section>
      </div>
      <q-space></q-space>
      <q-avatar size="3rem">
        <img class="profile-border" :src="image_profile">
      </q-avatar>
    </div>
  </q-header>
</template>

<script>
export default {
  props: {
    user_name: {
      type: String,
      default: '',
    },
    image_profile: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    viewProfile() {
      this.$router.push({ name: 'view-profile' });
    },
  },
};
</script>

<style lang="scss" scoped>
.link-format {
  text-decoration: underline;
}
.profile-border {
  border: solid 0.15rem $grey-1;
}
</style>
