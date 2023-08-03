<template>
  <div>
    <q-expansion-item
      expand-icon-toggle
      :content-inset-level="0.3"
      :color="mItem.color"
      :icon="mItem.icon"
      class="GNL__drawer-item"
      :label="mItem.label"
      v-for="mItem in menu.modules"
      :key="mItem.id"
    >
      <q-item
        v-ripple
        clickable
        class="GNL__drawer-item"
        v-for="item in mItem.menus"
        :key="item.id"
        @click="click(item.route)"
      >
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
  </div>
</template>



<script>
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
      ,
      company: null,
      menu: [],
    };
  },

  created() {},

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

    getMenu() {
      return api.fetch(`menus-people`, {
        params: { myCompany: this.company.id },
      })
        
        .then((result) => {
          this.menu = result.response?.data;
        });
    },

    click(route) {
      this.$emit("clickmenu", route);
    },
  },
};
</script>