<template>
  <q-page padding>
    <q-card style="min-height: 90vh;" :bordered="false" :flat="true">       
      <div class="row">
        <div class="col-12">
              <OrderList />          
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import OrderList from '../../components/products/OrderList.vue';


export default {
  components: {
    OrderList,
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

