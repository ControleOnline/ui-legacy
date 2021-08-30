<template>
  <q-page padding>
    <div v-if="pageLoading" class="row">
      <div class="col-12 pageloader">
        <q-spinner color="primary" class="q-uploader__spinner" />
      </div>
    </div>

    <div class="row back-white" v-else-if="!isSaved">
      <div class="col-12">
        <AcceptForm :payer="payerData" @saved="onSave" />
      </div>
    </div>

    <div class="row back-white" v-else>
      <div class="col-12">
        <h5>
          Obrigado
          <q-icon class="green" name="check_circle" />
        </h5>
        <h6>seu contrato foi finalizado</h6>
      </div>
    </div>
  </q-page>
</template>

<script>
import AcceptForm from "../../components/AcceptForm.vue";
import { fetch } from "../../../../../../src/boot/myapi";

export default {
  components: {
    AcceptForm,
  },

  data() {
    return {
      isSaved: false,
      id: null,
      pageLoading: false,
      payerData: {
        personType: "PF",
        name: "",
        alias: "",
        document: "",
        email: "",
        phone: "",
        address: {
          postal_code: "",
          street: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
          country: "",
        },
      },
    };
  },

  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);

      this.getPayerData().then((response) => {
        if (response && response.response && response.response.data) {
          var data = response.response.data;

          this.payerData = data;
        }
      });
    }
  },

  methods: {
    getPayerData() {
      this.pageLoading = true;

      let options = {
        method: "GET",
        params: {},
      };

      return fetch(`/accept/order/${this.id}/payer`, options)
        .then((response) => response.json())
        .then((data) => {
          this.pageLoading = false;
          return data;
        });
    },
    onSave(data) {
      this.$q.notify({
        message: "Os dados foram salvos com sucesso",
        position: "bottom",
        type: "positive",
      });

      this.isSaved = true;
    },
  },
};
</script>

<style scoped>
.green {
  color: green;
}
.back-white {
  border-radius: 10px;
  background-color: white !important;
}
.back-white > div {
  padding: 10px;
}
.pageloader {
  text-align: center;
}
</style>
