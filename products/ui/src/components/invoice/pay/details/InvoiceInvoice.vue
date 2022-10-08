<template>
  <q-card>
    <q-card-section>
      <DetailExpense
        :id     ="invoiceId"
        @deleted="$router.push({ name: 'Admin.InvoicePay.Index' })"
        @updated="$emit('updated')"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DetailExpense              from './../../expense/DetailExpense';

export default {
  components: {
    DetailExpense,
  },

  props: {
    invoiceId: {
      type    : String,
      required: true,
    },
  },

  data() {
    return {

    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    ...mapActions({

    }),
  },
};
</script>
