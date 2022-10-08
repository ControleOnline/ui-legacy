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

    <!-- BILLET VIEWER -->

    <div :class="showBillet ? 'full-width q-pa-lg' : 'hidden'">
      <q-form
        ref    ="myForm"
        :action="payment !== null ? payment.invoiceUrl : ''"
        method ="post"
        class  ="q-mt-sm row justify-center items-center"
        target ="BILLET"
      >
        <input type="hidden" name="DC" :value="itauHash" />
      </q-form>

      <div style="height: 1200px">
        <iframe name="BILLET" width="100%" height="100%" frameBorder="0">
          <p>This browser does not support IFrame.</p>
        </iframe>
      </div>
    </div>

    <!-- BILLET GENERATOR TRIGGER -->

    <div class="col-12 q-pt-lg" v-if="paymentIsPending && billetMustBeCreated">
      <div
        style="min-height: 80vh;"
        class="row justify-center items-center"
      >
        <q-form
          :action="payment ? payment.invoiceUrl : ''"
          method ="post"
          target ="_blank"
        >
          <input type="hidden" name="DC" :value="itauHash" />
          <q-btn
            type    ="submit"
            icon    ="money"
            size    ="lg"
            color   ="primary"
            label   ="Gerar boleto"
            @click  ="loadOnFocus = true"
            :disable="isPaid"
          />
        </q-form>
      </div>
    </div>

    <!-- PAID MESSAGE -->

    <div class="col-12" v-if="payment !== null && isPaid">
      <div 
        class="row items-center justify-center"
        style="min-height: 90vh;"
      >
        <q-banner class="text-white bg-positive text-center text-h3" rounded>
          <template v-slot:avatar>
            <q-icon name="thumb_up" color="white" />
          </template>
          O boleto foi pago
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script>
import { date, extend }           from 'quasar';
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    invoiceId: {
      type    : String,
      required: true,
    },
    orderId  : {
      type    : String,
      required: true,
    },
  },

  mounted() {
    window.addEventListener   ('focus', this.loadItauDataOnFocus);
  },

  beforeDestroy() {
    window.removeEventListener('focus', this.loadItauDataOnFocus);
  },

  created() {
    this.getPaymentStatus();
  },

  data() {
    return {
      isLoading  : false,
      payment    : null,
      isPaid     : false,
      itauHash   : null,
      showBillet : false,
      loadOnFocus: false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),

    paymentIsPending() {
      if (this.payment === null)
        return false;

      return ['waiting payment', 'outdated billing']
        .includes(this.payment.status);
    },

    billetMustBeCreated() {
      if (this.payment === null)
        return false;

      return this.payment.paymentType == 'choose_pending';
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.getPaymentStatus();
      }
    },

    payment(data) {
      if (!data)
        return;

      if (data.paymentType == 'choose_pending' || data.paymentStatus == 'no_finished') {
        this.isPaid = false;        
        this.getItauHash();
      }
      else {
        if (data.paymentType == 'billet') {
          if (data.paymentStatus == 'paid')
            this.isPaid = true;
          else {
            this.isPaid = false;

            if (data.paymentStatus == 'created')
              this.getItauHash()
                .then(hash => {
                  if (hash !== null)
                    this.showBillet = true;
                });
            else
              this.showBillet = false;
          }
        }
      }
    },

    showBillet(show) {
      if (show == true) {
        this.$refs.myForm.$el.submit();
      }
    },
  },

  methods: {
    ...mapActions({
      getItauData: 'payInvoice/bankItau',
    }),

    loadItauDataOnFocus() {
      if (this.loadOnFocus) {
        this.getPaymentStatus()
          .then(data => {
            this.loadOnFocus = false;
          });
      }
    },

    getItauHash() {
      let params = {};

      this.isLoading = true;

      if (this.myCompany !== null)
        params['myCompany'] = this.myCompany.id;

      return this.getItauData({
        invoiceId: this.invoiceId,
        operation: 'itauhash',
        params   : params
      })
        .then(data => {
          if (data !== null) {
            return this.itauHash = data;
          }

          return null;
        })
        .catch(error => {
          
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    getPaymentStatus() {
      let params = {};

      this.isLoading = true;

      if (this.myCompany !== null)
        params['myCompany'] = this.myCompany.id;

      return this.getItauData({
        invoiceId: this.invoiceId,
        operation: 'payment',
        params   : params
      })
        .then(data => {
          if (data !== null) {
            return this.payment = data;
          }

          return null;
        })
        .catch(error => {
          
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>