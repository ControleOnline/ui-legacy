<template>
  <q-page padding>
    <q-card style="min-height: 90vh;" :bordered="false" :flat="true">       
      <div class="row">
        <div class="col-12">
          <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab" class="bg-white text-primary">
            <q-tab name="products" :label="$t('Products')" />
            <q-tab name="categories" :label="$t('Categorias')" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="products" class="q-px-none">              
              <ProductList />
            </q-tab-panel>

            <q-tab-panel name="categories" class="q-px-none">
              <!--<TableCategories :context="'expense'" :api="api" />-->
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import ProductList from '../../components/products/ProductList.vue';


export default {
  components: {
    ProductList,
    //InvoiceSearching,
  },

  data() {
    return {
      currentTab: 'products',
      api: new Api(this.$store.getters['auth/user'].token)
    }
  },

  created() {
    
  },
}
</script>

