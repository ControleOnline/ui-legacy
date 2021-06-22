<template>
  <q-page padding>
    <InvoiceDetails />
  </q-page>
</template>

<script>
import InvoiceDetails from '../../../components/invoice/receive/InvoiceDetails';

export default {
  name      : 'InvoiceDetailsPage',

  components: {
    InvoiceDetails,
  },

  data () {
    return {

    }
  }
}
</script>
