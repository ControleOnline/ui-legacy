<template>
  <div>
    <q-expansion-item
      expand-icon-toggle
      :content-inset-level="0.3"
      color="white"
      :icon="mItem.icon"
      class="GNL__drawer-item"
      :label="mItem.label"
      v-for="mItem in menu.departments"
      :key="mItem.id"
    >
      <q-item
        v-ripple
        clickable
        class="GNL__drawer-item"
        :to="{ name: item.route }"
        v-for="item in mItem.menus"
        :key="item.id"
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
      menu: {
        departments: {
          commercial: {
            id: 0,
            label: this.$t("menu.commercial"),
            icon: "shopping_cart",
            color: "$primary",
            menus: [
              {
                id: 0,
                label: this.$t("menu.crm"),
                icon: "person",
                color: "$primary",
                route: "CustomersIndex",
              },
              {
                id: 1,
                label: this.$t("menu.docs"),
                icon: "library_books",
                color: "$primary",
                route: "DocsIndex",
              },
              {
                id: 2,
                label: this.$t("menu.coupon"),
                icon: "shopping_cart",
                color: "$primary",
                route: "ContractIndex",
              },
                            {
                id: 3,
                label: this.$t("menu.contracts"),
                icon: "library_books",
                color: "$primary",
                route: "CouponIndex",
              },
            ],
          },
          operational: {
            id: 1,
            label: this.$t("menu.operational"),
            icon: "local_shipping",
            color: "$primary",
            menus: [
              {
                id: 4,
                label: this.$t("menu.profissionals"),
                icon: "local_shipping",
                color: "$primary",
                route: "ProfessionalsIndex",
              },
              {
                id: 5,
                label: this.$t("menu.providers"),
                icon: "person",
                color: "$primary",
                route: "ProvidersIndex",
              },
             {
                id: 6,
                label: this.$t("menu.import"),
                icon: "publish",
                color: "$primary",
                route: "ImportIndex",
              },
          {
                id: 7,
                label: this.$t("menu.tasks"),
                icon: "task",
                color: "$primary",
                route: "SupportIndex",
              },
            ],
          },
          finance: {
            id: 0,
            label: this.$t("menu.finance"),
            icon: "attach_money",
            color: "$primary",
            menus: [
              {
                id: 8,
                label: this.$t("menu.financepay"),
                icon: "attach_money",
                color: "$primary",
                route: "FinancePayIndex",
              },
              {
                id: 9,
                label: this.$t("menu.financereceive"),
                icon: "attach_money",
                color: "$primary",
                route: "FinanceReceiveIndex",
              },
            ],
          },
          support: {
            id: 0,
            label: this.$t("menu.support"),
            icon: "featured_play_list",
            color: "$primary",
            menus: [
              {
                id: 10,
                label: this.$t("menu.news"),
                icon: "featured_play_list",
                color: "$primary",
                route: "News",
              },
             
            ],
          },
        },
      },
    };
  },

  created() {},

  computed: {},

  watch: {},
};
</script>