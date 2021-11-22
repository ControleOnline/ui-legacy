<template>
  <div class="row q-pa-md">
    <div class="col-12">
      <OrderInvoiceButton
        :order="{
          '@id': `/purchasing/orders/${orderId}`
        }"
        @created="$refs.invoicesRef.reload()"
      />
    </div>
    <div class="col-12">
      <InvoiceSearching
        ref     ="invoicesRef"
        :search ="false"
        :orderId="orderId"
      />
    </div>
  </div>
</template>

<script>
import { date, extend }   from 'quasar';
import InvoiceSearching   from './InvoiceSearching';
import OrderInvoiceButton from '@controleonline/quasar-common-ui/src/components/common/NewOrderInvoiceButton';

export default {
  props: {
    orderId: {
      type    : String,
      required: true,
    }
  },

  components: {
    InvoiceSearching  ,
    OrderInvoiceButton,
  },

  data() {
    return {

    };
  },
};
</script>