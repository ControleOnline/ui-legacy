<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress :indeterminate="isLoading"
        size ="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <!-- QUOTE TABLE RESULTS  -->
    <div class="col-12" v-if="order !== null">
      <QuoteTable
        :order ="order"
        :header="false"
        :footer="false"
        @choose="onChoose"
      />
    </div>

    <!-- CHECKUP STEP TO STEP -->
    <q-dialog maximized no-esc-dismiss no-backdrop-dismiss
      v-model        ="dialog"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <ContractPage
        :order   ="order"
        @finished="onFinished"
      />
    </q-dialog>

    <div class="col-12" v-if="order === null && incomplete">
      <div 
        class="row items-center justify-center"
        style="min-height: 90vh;"
      >
        <q-banner class="text-white bg-red text-center text-h3" rounded>
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          Os dados do pedido estão incompletos
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script>
import { date, extend }           from 'quasar';
import { mapActions, mapGetters } from 'vuex';
import { formatMoney }            from '@controleonline/quasar-common-ui/src/utils/formatter';
import QuoteTable                 from '../../../QuoteTable';
import ContractPage               from '../../../contracting/Index';

export default {
  props: {
    orderId: {
      type    : String,
      required: true,
    }
  },

  components: {
    QuoteTable  ,
    ContractPage,
  },

  created() {
    if (this.myCompany !== null && this.orderId !== null) {
      this.requestQuotation(this.orderId)
        .then(result => {
          if (result === false)
            this.incomplete = true;
        });
    }
  },

  data() {
    return {
      order     : null,
      isLoading : false,
      editable  : false,
      incomplete: false,
      dialog    : false,
      quotation : null,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.requestQuotation(this.orderId)
          .then(result => {
            if (result === false)
              this.incomplete = true;
          });
      }
    },

    quotation(data) {
      if (!data)
        return;

      this.order = {
        id     : data.id,
        quotes : data.quotes,
        quote  : data.quote,
        status : data.status,
        choose : null,
        price  : null,
        user   : {
          logged: true,
          isNew : false,
        },
        contact: data.contact,
        product: data.product,
        address: {
          origin     : data.origin,
          destination: data.destination,
        },
      };
    },
  },

  methods: {
    ...mapActions({
      getQuotation: 'salesOrder/getDetailQuotation',
    }),

    onChoose(quote) {
      if (quote) {
        this.order.choose = quote.id;
        this.order.price  = quote.price;
      }

      this.dialog = true ;
    },

    onFinished() {
      this.$emit('finished');

      if (this.myCompany !== null && this.orderId !== null) {
        this.requestQuotation(this.orderId)
          .then(result => {
            if (result === false)
              this.incomplete = true;
          });
      }

      this.dialog = false;
    },

    formatMoney(value) {
      return formatMoney(value, 'BRL', 'pt-br');
    },

    requestQuotation(orderId) {
      let params = {};

      params['myCompany'] = this.myCompany.id;

      this.isLoading = true;

      return this.getQuotation({ orderId, params })
        .then(response => {

          this.isLoading = false;

          if (!response) {
            this.quotation = null;

            return false;
          }

          if (response.success) {
            this.quotation = response.data;

            return true;
          }

          return false;
        })
        .catch(error => {
          this.isLoading = false;
          this.quotation = null;
        });
    },
  },
};
</script>