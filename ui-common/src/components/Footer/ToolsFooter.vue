<template>
  <q-footer class="bg-accent flex">
    <div class="row full-width justify-between q-px-md">
      <div
        v-for="(button, index) in filteredButtonMenu"
        :key="index"
        class="col-auto"
      >
        <q-btn
          :to="{ name: button.to }"
          :icon="button.icon"
          :label="$t(button.label)"
          stack
          flat
          style="text-transform: none;"
          class="text-secondary text-buttons footer-buttons"
        />
      </div>
    </div>
  </q-footer>
</template>

<script>
export default {
  data() {
    return {
      userRole: null ?? 'cliente',
    };
  },

  computed: {
    filteredButtonMenu() {
      const filteredMenu = this.buttons_footer_menu
        .filter((item) => item.permissions.includes(this.userRole));

      return filteredMenu;
    },
    buttons_footer_menu: {
      get() { return this.$store.getters['Menu/getButtonsFooterMenu']; },
      set(value) { this.$store.commit('Menu/setButtonsFooterMenu', { buttonsFooterMenu: value }); },
    },
  },

  created() {
    this.userRole = this.$store.getters['User/getUser'].type_account;
  },
};
</script>

<style lang="scss" scoped>
.text-buttons {
  font-size: 0.75rem;
  padding: 4px 10px 4px 10px;
}
</style>
