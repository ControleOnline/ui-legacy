<template>
  <div>
    <q-expansion-item expand-icon-toggle :content-inset-level="0.3" :color="mItem.color" :icon="mItem.icon"
      class="GNL__drawer-item" :label="mItem.label" v-for="mItem in menu.modules" :key="mItem.id">
      <q-item v-ripple clickable class="GNL__drawer-item" v-for="item in mItem.menus" :key="item.id"
        @click="click(item.route)">
        <q-item-section avatar>
          <q-icon class="item-icon" :name="item.icon" :color="item.color" />
        </q-item-section>
        <q-item-section no-wrap>
          <q-item-label class="menu-list-text">{{ $t(item.label) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </div>
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
      return api.fetch(`menus/people`, {
        params: { myCompany: this.company.id },
      })

        .then((result) => {
          let menus = result.response?.data;
          let modules = [];
          menus.modules.forEach((module, i) => {
            module.menus.forEach((menu, ii) => {
              if (this.routeExists(menu.rota)) {
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
          menus.modules = modules;
          this.menu = menus;
        });
    },

    click(route) {
      this.$emit("clickmenu", route);
    },
  },
};
</script>
