<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <InvoiceSearching />
      </div>
    </div>
  </q-page>
</template>

<script>
import InvoiceSearching from '../../../components/invoice/client/InvoiceSearching';

export default {
  name      : 'ClientInvoiceIndexPage',

  components: {
    InvoiceSearching,
  },

  data () {
    return {

    }
  }
}
</script>