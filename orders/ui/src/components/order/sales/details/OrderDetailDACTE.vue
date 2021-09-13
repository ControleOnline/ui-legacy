<template>
  <q-card class="my-card" flat>
    <div class="row justify-center items-center q-pa-md">
      <div class="flex flex-center" v-if="isLoading">
        <q-circular-progress
          :indeterminate="isLoading"
          size="sm"
          color="primary"
          class="q-ma-md"
        />
        Carregando...
      </div>

      <div class="col-12" v-else>
        <!-- UPLOAD DACTE -->

        <div class="row" v-if="invoiceTax === null">
          <div class="col-12">
            <div class="text-subtitle1 q-mt-md q-mb-md">
              Faça upload do DACTE
            </div>

            <UploadFileForm
              class="q-mb-md"
              :endpoint="updEndpoint"
              @fileUploaded="onUploadedFile"
              @uploadFailed="onUploadFailed"
              @filesRemoved="onFilesRemoved"
              :multiple="false"
              accepted=".xml"
              :showError="false"
            />
          </div>
          <div class="col-12" v-if="uploadErrors.length > 0">
            <q-banner
              v-for="(error, index) in uploadErrors"
              :key="index"
              class="text-white bg-red q-mb-xs"
            >
              <q-icon left size="md" name="error" color="white" />
              {{ error }}
            </q-banner>
          </div>
        </div>

        <!-- DACTE VIEWER -->

        <div class="row" v-else>
          <div class="col-12">
            <h6 class="q-mb-md q-mt-md">
              DACTE: #{{ invoiceTax.invoice_number }}
            </h6>
            <div class="row justify-center">
              <iframe
                :src="urlInvoiceTax"
                name="invoice-tax"
                class="invoice-tax"
                width="100%"
                height="100%"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import UploadFileForm from "@controleonline/quasar-common-ui/src/components/common/UploadFileForm.vue";
import { mapActions, mapGetters } from "vuex";
import { ENTRYPOINT } from "../../../../../../../../src/config/entrypoint";

export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },

  components: {
    UploadFileForm,
  },

  created() {
    if (this.myCompany !== null) this.onRequest();
  },

  data() {
    return {
      isDownloading: false,
      uploadErrors: [],
      invoiceTax: null,
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "salesOrder/isLoading",
      myCompany: "people/currentCompany",
    }),

    updEndpoint() {
      return `${ENTRYPOINT}${
        ENTRYPOINT.endsWith("/") ? "" : "/"
      }invoice_taxes/upload-dacte?orderId=${this.orderId}`;
    },

    urlInvoiceTax() {
      if (this.invoiceTax === null) return "";

      return `${ENTRYPOINT}${
        ENTRYPOINT.endsWith("/") ? "" : "/"
      }vendor/pdf.js/web/viewer.html?file=/invoice_taxes/${
        this.invoiceTax.id
      }/download-nf`;
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) this.onRequest();
    },
  },

  methods: {
    ...mapActions({
      getItem: "salesOrder/getDetailOrder",
    }),

    onFilesRemoved() {
      this.uploadErrors = [];
    },

    onUploadedFile(file) {
      if (!file) return;

      this.$q.notify({
        message: "Upload feito com sucesso",
        position: "bottom",
        type: "positive",
      });

      this.$emit("fileUploaded");
    },

    onUploadFailed(error) {
      if (!error) return;

      if (error["@context"]) {
        this.uploadErrors.push(error["hydra:description"]);
      }
    },

    onRequest() {
      if (this.isLoading) return;

      this.getItem({
        id: this.orderId,
        params: {
          myCompany: this.myCompany.id,
        },
      }).then((order) => {
        if (order !== null) {
          if (order.invoiceTax.length > 0) {
            let invoiceTax = order.invoiceTax.find(
              (inv) => inv.invoice_type == 57
            );
            this.invoiceTax = invoiceTax || null;
          }
        }
      });
    },
  },
};
</script>
<style>
.invoice-tax {
  min-height: 100vh;
}
</style>
