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
        <div class="row" v-if="invoiceTax === null">
          <div v-if="defaultCompany.domainType == 'ceg'" class="col-12">
            <div class="row justify-end q-mb-md">
              <q-btn
                label="Emitir DACTE"
                icon="add"
                size="md"
                color="primary"
                class="q-ml-sm"
                @click="DACTEGenerator"
              />
            </div>
          </div>

          <!-- DACTE FORM -->

          <div class="col-12" v-if="dacteMode == 'fields'">
            <q-form @submit="updateDacte" class="q-mt-sm" ref="myForm">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    outlined
                    stack-label
                    lazy-rules
                    reverse-fill-mask
                    v-model="item.dacte"
                    type="text"
                    label="Número do DACTE"
                    mask="#"
                    :rules="[isInvalid('dacte')]"
                  />
                </div>

                <div class="col-xs-12 col-sm-6">
                  <q-input
                    outlined
                    stack-label
                    lazy-rules
                    reverse-fill-mask
                    prefix="R$"
                    v-model="item.total"
                    type="text"
                    label="Valor"
                    mask="#,##"
                    :rules="[isInvalid('total')]"
                    fill-mask="0"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn type="submit" color="primary" label="Salvar" :loading="isSaving" />
              </div>
            </q-form>
          </div>

          <!-- UPLOAD DACTE -->

          <div class="col-12">
            <div class="row">
              <div class="col-12">
                <div class="text-subtitle1 q-mt-md q-mb-md">Faça upload do DACTE</div>
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
          </div>
        </div>

        <!-- DACTE VIEWER -->

        <div class="row" v-else>
          <div class="col-12">
            <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <h6 class="q-mb-md q-mt-md">DACTE: #{{ invoiceTax.invoice_number }}</h6>
            </div>
            <div class="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <q-btn
                v-if="
                  order.status.status == 'on the way' ||
                  order.status.status == 'delivered'
                "
                lazy-rules
                color="negative"
                label="Remover DACTE"
                @click="removeDACTE"
              />
            </div>
          </div>
          <div class="col-12">
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
import { api } from "@controleonline/../../src/boot/api";
import UploadFileForm from "@controleonline/quasar-common-ui/src/components/Common/UploadFileForm.vue";
import { mapActions, mapGetters } from "vuex";
import { ENTRYPOINT } from "../../../../../../../../src/config/entrypoint";

export default {
  props: {
    orderId: {
      type: Number,
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
      dacteMode: "upload",
      order: null,
      isSaving: false,
      item: {
        dacte: null,
        total: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "salesOrder/isLoading",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
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
      removeInvoiceTax: "salesOrder/removeInvoiceTax",
    }),
    DACTEGenerator() {
      if (this.isSaving) return;

      this.isSaving = true;

      let options = {
        method: "POST",
        body: JSON.stringify({
          order: this.orderId,
        }),
        params: {
          myCompany: this.myCompany.id,
        },
      };

      return api.fetch(`sales/orders/${this.orderId}/detail/create-dacte`, options)
        .then((order) => {
          if (order && order.response && order.response.success) {
            this.$q.notify({
              message: "DACTE emitido com sucesso",
              position: "bottom",
              type: "positive",
            });
            this.onRequest();
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
    updateDacte() {
      if (this.isSaving) return;

      this.isSaving = true;

      let options = {
        method: "PUT",
        body: JSON.stringify({
          total: parseFloat(this.item.total.replace(",", ".")),
          dacte: this.item.dacte,
        }),
        params: {
          myCompany: this.myCompany.id,
        },
      };

      return api.fetch(`sales/orders/${this.orderId}/detail/update-dacte`, options)
        .then((order) => {
          if (order !== null) {
            this.$q.notify({
              message: "DACTE atualizado com sucesso",
              position: "bottom",
              type: "positive",
            });

            this.onRequest();

            this.$emit("fileUploaded");
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

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

      this.onRequest();

      this.$emit("fileUploaded");
    },

    onUploadFailed(error) {
      if (!error) return;

      if (error["@context"]) {
        this.uploadErrors.push(error["hydra:description"]);
      }
    },
    removeDACTE() {
      this.removeInvoiceTax({
        id: this.orderId,
        values: {
          orderId: this.orderId,
          invoiceTax: this.invoiceTax.id,
        },
      }).then((order) => {
        if (order.response && order.response.error) {
        } else {
          location.reload();
        }
      });
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
          this.order = order;
          if (order.invoiceTax.length > 0) {
            let invoiceTax = order.invoiceTax.find((inv) => inv.invoice_type == 57);
            this.invoiceTax = invoiceTax || null;
          }

          if (order.sameCity || order.sameState) {
            this.dacteMode = "fields";
          }
        }
      });
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("Este campo é obrigatório");
        return true;
      };
    },
  },
};
</script>
<style>
.invoice-tax {
  min-height: 100vh;
}
</style>
