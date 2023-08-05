<template>
  <q-page padding>
    <q-card style="min-height: 90vh" :bordered="false" :flat="true">
      <q-card-section class="text-h6">
        {{ translate("Categorias") }}
      </q-card-section>
      <div class="row">
        <div class="col-12">
          <TableCategories :context="'expense'" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import TableCategories from "@controleonline/quasar-common-ui/src/components/Categories/Table.vue";

export default {
  components: {
    TableCategories,
  },

  data() {
    return {};
  },

  created() {},
};
</script>
