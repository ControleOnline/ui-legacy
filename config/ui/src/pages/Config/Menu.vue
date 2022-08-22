<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 q-mb-md text-h6 text-left">
            {{ $t("config.menu.tittle") }}
          </div>
        </div>
      </q-card-section>

      <q-tabs
        :horizontal="$q.screen.gt.xs"
        align="justify"
        v-model="currentTab"
        class="bg-transparent text-primary col-auto"
        dense
      >
        <q-tab
          name="menu"
          :label="$t('config.menu.tittle')"
          class="text-capitalize"
        />
        <q-tab
          name="menu-categories"
          :label="$t('config.categories.tittle')"
          class="text-capitalize"
        />
      </q-tabs>
      <q-tab-panels v-model="currentTab" class="q-mt-sm bg-transparent">
        <q-tab-panel name="menu" class="q-pa-xs">
          <Menu />
        </q-tab-panel>
        <q-tab-panel name="menu-categories" class="q-pa-xs">
          <TableCategories :context="'menu'" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import TableCategories from "@controleonline/quasar-common-ui/src/components/categories/Table.vue";
import Menu from "./../../components/config/Menu/Table";

export default {
  //
  components: {
    Menu,
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"] || {};
    },
  },

  data() {
    return {
      currentTab: "menu",
    };
  },

  methods: {},
};
</script>
