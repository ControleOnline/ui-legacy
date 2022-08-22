<template>
  <q-page padding>
    <q-card style="min-height: 90vh" :bordered="false" :flat="true">
      <q-card-section class="text-h6">
        {{ $t("Categorias") }}
      </q-card-section>
      <div class="row">
        <div class="col-12">
          <TableCategories :context="'expense'" :api="api" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";

import TableCategories from "@controleonline/quasar-common-ui/src/components/categories/Table.vue";

export default {
  components: {
    TableCategories,
  },

  data() {
    return {      
      api: new Api(this.$store.getters["auth/user"].token),
    };
  },

  created() {},
};
</script>
