<template>
  <q-dialog>
    <div class="bg-white full-width" style="max-height: 70%;">
      <q-item class="bg-secondary items-center">
        <q-item-label class="text-bold text-white">
          {{ $t('choose_language') }}
        </q-item-label>
        <q-space></q-space>
        <q-btn
          icon="close"
          size="1rem"
          round
          color="white"
          flat
          v-close-popup>
        </q-btn>
      </q-item>

      <q-input
        dense
        placeholder="Procurar..."
        class="q-px-md q-py-sm"
        v-model="search"
        bg-color="white"
        color="secondary"
      />

      <div
        v-for="option in filteredLangs"
        :key="option.id"
        class="flex items-center"
      >
        <q-btn
          class="full-width border-division-dialog q-py-sm q-px-md"
          flat
          align="left"
          @click="selectLang(option.label)"
          v-close-popup
        >
          <q-avatar size="42px">
            <img :src="`/flags/${option.image}.png`">
          </q-avatar>
          <div class="q-ml-md text-capitalize text-grey-10">
            {{ $t(option.label) }}
          </div>
        </q-btn>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      search: '',
    };
  },

  computed: {
    filteredLangs() {
      const optionsLang = JSON.parse(JSON.stringify(this.options));

      if (!this.search) return optionsLang;

      return optionsLang.filter((lang) => lang.label
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .includes(this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
    },
    options: {
      get() { return this.$store.getters['User/getOptionsLang']; },
      set(value) { this.$store.commit('User/setOptionsLang', { optionsLang: value }); },
    },
  },

  methods: {
    selectLang(lang) {
      this.$emit('select-lang', lang);
    },
  },
};
</script>
