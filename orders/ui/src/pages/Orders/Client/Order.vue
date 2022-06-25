<template>
  <q-page padding>
    <ClientOrderDetails />
  </q-page>
</template>

<script>
import ClientOrderDetails from '../../../components/order/client/ClientOrderDetails';

export default {
  name      : 'ClientOrderDetailsPage',

  components: {
    ClientOrderDetails,
  },

  data () {
    return {

    }
  }
}
</script>
