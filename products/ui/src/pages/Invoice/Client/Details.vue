<template>
  <q-page padding>
    <ClientInvoiceDetails />
  </q-page>
</template>

<script>
import ClientInvoiceDetails from '../../../components/invoice/client/ClientInvoiceDetails';

export default {
  name      : 'ClientInvoiceDetailsPage',

  components: {
    ClientInvoiceDetails,
  },

  data () {
    return {

    }
  }
}
</script>
