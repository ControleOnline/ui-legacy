<template>
  <div class="row q-pa-md">
    <div class="col-12">
      <InvoiceSearching :search="false" :orderId="orderId" />
    </div>
  </div>
</template>

<script>
import { date, extend } from 'quasar';
import InvoiceSearching   from '../../../invoice/client/InvoiceSearching';

export default {
  props: {
    orderId: {
      type    : String,
      required: true,
    }
  },

  components: {
    InvoiceSearching,
  },
  
  created() {

  },

  data() {
    return {

    };
  },

  computed: {

  },

  watch: {

  },

  methods: {

  },
};
</script>