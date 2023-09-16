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
        <q-btn
          icon    ="money"
          size    ="lg"
          color   ="primary"
          label   ="Gerar boleto"
          :loading="retrievingHash"
          @click  ="() => {
            this.retrievingHash = true;

            this.getItauHash()
              .then(hash => {
                if (hash !== null) {
                  this.loadOnFocus = true;
                  this.$refs.billetForm.$el
                    .submit();
                }
              })
              .finally(() => {
                this.retrievingHash = false;
              });
          }"
          :disable="isPaid"
        />
        <q-form
          ref    ="billetForm"
          :action="payment ? payment.invoiceUrl : ''"
          method ="post"
          target ="_blank"
        >
          <input type="hidden" name="DC" :value="itauHash" />
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

  beforeUnmount() {
    window.removeEventListener('focus', this.loadItauDataOnFocus);
  },

  created() {
    this.getPaymentStatus();
  },

  data() {
    return {
      isLoading     : false,
      payment       : null,
      isPaid        : false,
      itauHash      : null,
      showBillet    : false,
      loadOnFocus   : false,
      retrievingHash: false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),

    paymentIsPending() {
      if (this.payment === null)
        return false;

      return this.payment.invoiceRealStatus === 'pending';
    },

    billetMustBeCreated() {
      if (this.payment === null)
        return false;

      return this.payment.paymentType === 'choose_pending' || this.payment.paymentStatus !== 'paid';
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

      this.isPaid = data.paymentStatus === 'paid';

      if (data.paymentType == 'billet') {
        if (data.paymentStatus == 'created' && this.isPaid === false)
          this.getItauHash()
            .then(hash => {
              if (hash !== null)
                this.showBillet = true;
            });
        else
          this.showBillet = false;
      }

      this.$emit(
        'billetStatus',
        {
          hasBillet: data.paymentType === 'billet' && data.paymentStatus === 'created',
          isPaid   : data.paymentStatus === 'paid'
        }
      );
    },

    showBillet(show) {
      if (show == true) {
        this.$refs.myForm.$el.submit();
      }
    },
  },

  methods: {
    ...mapActions({
      getItauData: 'receiveInvoice/bankItau',
    }),

    refresh() {
      this.getPaymentStatus();
    },

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