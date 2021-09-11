<template>
  <q-page padding>
    <q-card
       style   ="min-height: 90vh;"
      :bordered="false"
      :flat    ="true"
    >
        <q-card-section class="text-h6">
          {{ $t('Contas a pagar') }}
        </q-card-section>
        <div class="row">
          <div class="col-12">
            <q-tabs
              :horizontal="$q.screen.gt.xs"
              align      ="justify"
              v-model    ="currentTab"
              class      ="bg-white text-primary"
            >
              <q-tab
                name  ="expenses"
                :label="$t('Despesas')"
              />
              <q-tab
                name  ="categories"
                :label="$t('Categorias')"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="currentTab"
            >
              <q-tab-panel name="expenses" class="q-px-none">
                <InvoiceSearching />
              </q-tab-panel>

              <q-tab-panel name="categories" class="q-px-none">
                <TableCategories
                  :api="api"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
    </q-card>
  </q-page>
</template>

<script>
import Api              from '@controleonline/quasar-common-ui/src/utils/api';
import InvoiceSearching from '../../../components/invoice/pay/InvoiceSearching.vue';
import TableCategories  from '../../../components/expense/TableCategories.vue';

export default {
  components: {
    TableCategories ,
    InvoiceSearching,
  },

  data () {
    return {
      currentTab: 'expenses',
      api       : null
    }
  },

  created() {
    this.api = new Api(this.$store.getters['auth/user'].token);
  },
}
</script>
