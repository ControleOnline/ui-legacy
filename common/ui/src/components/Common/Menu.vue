<template>
  <q-list>
    <q-expansion-item expand :content-inset-level="0.3" :icon="mItem.icon" :color="mItem.color" class="GNL__drawer-item"
      :label="mItem.label" v-for="mItem in menu" :key="mItem.id">
      <q-item v-ripple clickable class="GNL__drawer-item" v-for="item in mItem.menus" :color="item.color" :key="item.id"
        @click="click(item.route)">
        <q-item-section avatar>
          <q-icon class="item-icon" :name="item.icon" :color="item.color" />
        </q-item-section>
        <q-item-section no-wrap>
          <q-item-label class="menu-list-text">{{
            $t(item.label)
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    context: {
      required: true,
    },
    people: {
      required: true,
    },
  },

  data() {
    return {
      company: null,
      menu: [],
    };
  },

  created() { },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    myCompany(company) {
      this.company = company;
      this.getMenu();
    },
  },

  methods: {
    ...mapActions({}),


    routeExists(routeName) {
      return this.$router.options.routes.some((route) => {
        if (route.children)
          return route.children.some((child) => {
            
            return routeName === child.name
          });
      });
    },
    getMenu() {

      

      return api.fetch(`menus-people`, {
        params: { myCompany: this.company.id },
      }).then((result) => {        
        let menus = result.response?.data;
        if (!menus.modules)
          return;
        let modules = [];
        Object.values(menus.modules).forEach((module, i) => {
          module.menus.forEach((menu, ii) => {
            if (this.routeExists(menu.route)) {
              let find = modules.findIndex(obj => obj.id == module.id);
              if (find === -1) {
                let itemCopy = { ...module };
                itemCopy.menus = [menu];
                modules.push(itemCopy);
              } else {
                modules[find].menus.push(menu);
              }
            }
          });
        });
        
        this.menu = modules;
      });
    },

    click(route) {
      this.$emit("clickmenu", route);
    },
  },
};
</script>



<style lang="sass">
.GPL
  &__toolbar
    height: 64px
  &__side-btn
    margin-bottom: 20px
    &__label
      font-size: 14px
      font-family: 'EB Garamond', 'Exo', Helvetica,Arial,Lucida,sans-serif
      font-weight: 600
      text-transform: uppercase
</style>