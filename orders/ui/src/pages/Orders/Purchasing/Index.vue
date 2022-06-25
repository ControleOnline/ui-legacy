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
import OrderSearching from './../../../components/order/purchasing/OrderSearching.vue';

export default {
  name      : 'OrderIndexPage',

  components: {
    OrderSearching,
  },

  data () {
    return {

    }
  }
}
</script>
