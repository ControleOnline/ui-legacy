<template>
  <div>
    <q-item class="q-pa-none" clickable="clickable">
      <q-item-section>
        <div class="row lang-switch items-center q-pa-sm">
          <q-img
            :ratio="1"
            style="width: 1.65rem;"
            :src="`/flags/${language.iconImage}.png`"
          >
          </q-img>
          <q-icon class="q-ml-xs" size="1.3rem" name="expand_more"></q-icon>
        </div>
      </q-item-section>

      <q-menu>
        <q-list>
          <q-item
            v-close-popup
            clickable="clickable"
            v-for="(lang, index) in langOptions"
            :key="index"
            @click="changeLang(lang)"
          >
            <q-item-section side="side">
              <q-img
                :ratio="1"
                style="width: 2rem;"
                :src="`/flags/${lang.iconImage}.png`"
              >
              </q-img>
            </q-item-section>
            <q-item-section>{{ lang.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'LangSwitch',

  data() {
    return {
      language: null,
    };
  },

  computed: {
    selectedLanguage: {
      get() { return this.$store.getters['Menu/getSelectedLanguage']; },
      set(value) { this.$store.commit('Menu/setSelectedLanguage', { selectedLanguage: value }); },
    },
    langOptions: {
      get() { return this.$store.getters['Menu/getLangOptions']; },
      set(value) { this.$store.commit('Menu/setLangOptions', { langOptions: value }); },
    },
  },

  methods: {
    changeLang(lang) {
      this.language = lang;

      this.$i18n.locale = lang.value;
    },
    initLang() {
      const lang = this.$i18n.locale;

      this.language = this.selectedLanguage[lang];
    },
  },

  created() {
    this.initLang();
  },
};
</script>

<style lang="scss" scoped>
.lang-switch {
  border: solid 1px $grey-1;
  border-radius: 4px;
}
</style>
