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
import InvoiceSearching from '../../../components/invoice/receive/InvoiceSearching';

export default {
  name      : 'InvoiceIndexPage',

  components: {
    InvoiceSearching,
  },

  data () {
    return {

    }
  }
}
</script>