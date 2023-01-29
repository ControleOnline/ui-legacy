<template>
  <q-header class="q-pa-sm bg-secondary q-pt-lg" elevated="elevated">
    <div class="q-ma-sm flex favorite-container items-center">
      <q-avatar size="3rem">
        <img class="profile-radius" src="https://github.com/CarlosMendesDev.png">
      </q-avatar>

      <div class="q-px-sm">
        <q-item-section class="q-ma-none text-white" style="font-size: 1.25rem;">
          Juliano
        </q-item-section>
        <div class="flex items-center">
          <q-item-section
            @click="viewProfile"
            class="link-format q-ma-none text-caption cursor-pointer text-white">
            {{ $t('view_profile') }}
          </q-item-section>
        </div>
      </div>
      <q-space></q-space>
      <LangSwitch></LangSwitch>
    </div>
  </q-header>
</template>

<script>
import LangSwitch from '../UI/LangSwitch';

export default {
  components: {
    LangSwitch,
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

<style lang="scss">
.link-format {
  font-size: 0.875rem;
  text-decoration: underline;
}
.profile-radius {
  border: 1.5px solid white;
  border-radius: 40px;
}
</style>
