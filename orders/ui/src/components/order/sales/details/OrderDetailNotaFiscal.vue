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

      <div class="col-12" v-if="incomplete">
        <div class="row items-center justify-center" style="min-height: 90vh">
          <q-banner class="text-white bg-red text-center text-h3" rounded>
            <template v-slot:avatar>
              <q-icon name="error" color="white" />
            </template>
            Os dados da transportadora estão incompletos
          </q-banner>
        </div>
      </div>

      <div class="col-12" v-else>
        <!-- NF VIEWER -->

        <div class="row" v-if="invoiceTax !== null">
          <div class="col-12">
            <h6 class="q-mb-md q-mt-md">
              Nota Fiscal: #{{ invoiceTax.invoice_number }}
            </h6>
            <div class="row justify-center">
              <iframe
                ref="docviewer"
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

        <!-- NF UPLOADER -->

        <div class="row">
          <div class="col-12 q-mt-md">
            <div class="text-subtitle1">
              Dados para emissão da sua nota fiscal:
            </div>
            <div class="text-caption">
              Preencha corretamente sua DANFE, com os seguintes dados:
            </div>

            <ul>
              <li>
                No campo "Transportador/Volumes Transportados", colocar os dados
                da transportadora:
                <ul>
                  <li>{{ carrier.name }}</li>
                  <li>{{ carrier.document }}</li>
                  <li>
                    {{ `${carrier.address.street}, ${carrier.address.number}` }}
                  </li>
                  <li>
                    {{
                      `${carrier.address.postalCode} - ${carrier.address.district} - ${carrier.address.city} / ${carrier.address.state}`
                    }}
                  </li>
                </ul>
              </li>
              <li>
                No campo "Frete por conta", colocar a opção por "Terceiros"
              </li>
              <li>
                Não esqueça de colocar os volumes a serem transportados e peso
                total
              </li>
              <li>
                No campo "Dados adicionais", coloque a seguinte instrução: Frete
                número #{{ order !== null ? order.id : "" }} por conta e ordem
                da {{ provider.name }} CNPJ: {{ provider.document }}
              </li>
              <li>Atenção ao endereço de entrega</li>
              <li>
                Abaixo está nossa carta de consignatário do frete, que deve ser
                impressa e anexada na frente da sua Nota Fiscal.
              </li>
            </ul>

            <q-separator />

            <div class="row">
              <div class="col-12">
                <div class="text-subtitle1 q-mt-md q-mb-md">
                  Upload da nota fiscal
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
                  :extraData="[
                    {
                      name: 'orderId',
                      value: orderId,
                    },
                  ]"
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
      </div>
    </div>
  </q-card>
</template>

<script>
import {
  formatCEP,
  formatDocument,
} from "@controleonline/quasar-common-ui/src/@controleonline/quasar-common-ui/src/utils/formatter";
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
      incomplete: false,
      order: null,
      carrier: {
        name: "",
        document: "",
        address: {
          street: "",
          number: "",
          postalCode: "",
          district: "",
          city: "",
          state: "",
        },
      },
      provider: {
        name: "",
        document: "",
      },
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
      }invoice_taxes/upload-nf?myCompany=${this.myCompany.id}`;
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

      this.onRequest().then((order) => {
        // reload iframe

        this.$refs.docviewer.setAttribute(
          "src",
          this.$refs.docviewer.getAttribute("src")
        );
      });

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
      return this.getItem({
        id: this.orderId,
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((order) => {
          if (order !== null) {
            if (order.carrier.address == null || order.carrier.document == null)
              this.incomplete = true;
            else {
              this.carrier.name = order.carrier.name;
              this.carrier.document =
                order.carrier.document !== null
                  ? formatDocument(order.carrier.document)
                  : "";
              this.carrier.address.street =
                order.carrier.address !== null
                  ? order.carrier.address.street
                  : "";
              this.carrier.address.number =
                order.carrier.address !== null
                  ? order.carrier.address.number
                  : "";
              this.carrier.address.postalCode =
                order.carrier.address !== null
                  ? formatCEP(order.carrier.address.postalCode)
                  : "";
              this.carrier.address.district =
                order.carrier.address !== null
                  ? order.carrier.address.district
                  : "";
              this.carrier.address.city =
                order.carrier.address !== null
                  ? order.carrier.address.city
                  : "";
              this.carrier.address.state =
                order.carrier.address !== null
                  ? order.carrier.address.state
                  : "";

              this.provider.name = order.provider.name;
              this.provider.document = order.provider.document
                ? formatDocument(order.provider.document)
                : "";
              this.order = order;

              if (order.invoiceTax.length > 0) {
                let invoiceTax = order.invoiceTax.find(
                  (inv) => inv.invoice_type == 55
                );
                this.invoiceTax = invoiceTax || null;
              }
            }
          } else this.incomplete = true;

          return order;
        })
        .catch((error) => {
          this.incomplete = true;
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
