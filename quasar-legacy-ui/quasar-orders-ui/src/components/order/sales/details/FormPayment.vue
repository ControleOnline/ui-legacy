<template>
  <q-form @submit="onSubmit" class="q-mt-sm" style="width: 100%" ref="myForm">
    <!--- show payment data-->
    <div class="row justify-center q-pb-md">
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label header>Valor</q-item-label>
            <q-item-label>
              {{ this.Data.value }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label header>Cliente</q-item-label>
            <q-item-label>
              {{ this.Data.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
    </div>
    <div class="row justify-center q-pb-md">
      <q-btn-toggle
        no-caps
        unelevated
        v-model="payment"
        toggle-color="primary"
        :options="[
          {
            label: 'Crédito',
            value:
              this.installments > 1
                ? 'CREDITO_PARCELADO_LOJA'
                : 'CREDITO_AVISTA',
          },
          { label: 'Débito', value: 'DEBITO_AVISTA' },
        ]"
      />
    </div>

    <div class="row justify-center q-pb-md">
      <q-btn-toggle
        v-if="
          payment === 'CREDITO_PARCELADO_LOJA' || payment === 'CREDITO_AVISTA'
        "
        no-caps
        unelevated
        v-model="installments"
        toggle-color="primary"
        :options="[
          { label: '1x', value: 1 },
          { label: '2x', value: 2 },
          { label: '3x', value: 3 },
          { label: '4x', value: 4 },
          { label: '5x', value: 5 },
          { label: '6x', value: 6 },
          { label: '7x', value: 7 },
          { label: '8x', value: 8 },
          { label: '9x', value: 9 },
          { label: '10x', value: 10 },
          { label: '11x', value: 11 },
          { label: '12x', value: 12 },
        ]"
      />
    </div>
    <div class="row justify-center q-pb-md">
      <q-btn
        label="Pagar"
        icon="payment"
        size="md"
        color="green"
        class="q-ml-sm"
        @click="onSubmit"
      />
    </div>
  </q-form>
</template>

<script>
//import { payLio } from "@controleonline/quasar-legacy-ui/quasar-common-ui/src/utils/formatter";
export default {
  data() {
    return {
      payment: "credito",
      installments: 1,
    };
  },
  props: {
    Data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    payLio(
      //  accessToken,
      clientID,
      email,
      installments,
      items,
      paymentCode,
      value
    ) {
      const data = {
        accessToken: "KeZIHpRaLZwWTR2t60rLZQNdQpGSgUiU3Q6D2awxcNDiVArBT5",
        clientID: clientID,
        email: email,
        installments: installments,
        items: items,
        paymentCode: paymentCode,
        value: value,
      };

      //encode data to base64
      const base64data = btoa(JSON.stringify(data));
      //redirect to lio
      console.log("data:", data);
      const cieloUrl = `lio://payment?request=${base64data}&urlCallback=order://response`;
      const $q = useQuasar();
      if ($q.platform.is.mobile) {
        window.open(cieloUrl, "_system");
      } else if (window.cordova && window.cordova.InAppBrowser) {
        window.cordova.InAppBrowser.open(cieloUrl, "_system");
      } else {
        console.error("Cordova InAppBrowser plugin not available.");
        alert("Essa funcionalidade só está disponível no aplicativo.");
      }
    },
    onSubmit() {
      this.$emit("pay", {
        payment: this.payment,
        installments: this.installments,
      });
      this.payLio(
        this.Data.clientID,
        this.Data.email,
        this.installments,
        this.Data.items,
        this.payment,

        this.Data.value
      );
    },
  },
};
</script>
