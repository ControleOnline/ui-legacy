<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <OrderSearching />
      </div>
    </div>
  </q-page>
</template>

<script>
 import OrderSearching from '../../../components/order/client/OrderSearching';

export default {
  name      : 'ClientOrderIndexPage',

  components: {
    OrderSearching,
  },

  data () {
    return {

    }
  }
}
</script>