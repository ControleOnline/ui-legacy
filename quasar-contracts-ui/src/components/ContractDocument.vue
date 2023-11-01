<template>
  <div v-if="!contract" class="flex column flex-center q-mt-lg">
    <q-icon name="warning" class="text-red" style="font-size: 4rem" />
    <q-banner dense inline-actions class="text-white bg-red q-pa-xs">
      <span v-html="'<strong>Ainda não há contrato para esse pedido</strong>'
        " style="font-size: 14px">
      </span>
    </q-banner>
  </div>

  <div class="row q-pa-md" v-else>

    <q-card class="q-pa-md q-mb-sm col-12">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-4">
          <div :class="statusStyle" v-if="contract_s">
            {{ this.$t(`contracts.statuses.${contract_s.status}`) }}
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <div class="row items-center justify-end">

            <q-btn color="primary" :label="$t('contracts.edit')" @click="isEdit" :loading="isRequesting" />
            <q-btn color="primary" :label="$t('contracts.save')" @click="saveContract" :loading="isRequesting" />
            <!-- <contract-action-cancel :config="config" :contract="contract" />
            <contract-action-amend :config="config" :contract="contract" /> -->
          </div>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <div class="row items-center justify-end">
            <q-btn color="primary" :label="$t('contracts.request_signatures')" @click="requestSignatures"
              :disable="statusIsWaitingForSignature()" :loading="isRequesting" />
          </div>
        </div>
      </div>

    </q-card>

    <div class="col-12">
      <q-btn-toggle v-model="paymentType" toggle-color="primary" push glossy class="q-mb-md" :options="paymentOptions"
        @click="confirmChange"></q-btn-toggle>

      <q-dialog v-model="showConfirmationDialog">
        <q-card>
          <q-card-section>
            <p>Tem certeza de que deseja alterar a forma de pagamento?
              Isso vai resultar em uma atualização completa do contrato.
            </p>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="negative" @click="cancelChange" />
            <q-btn label="Confirmar" color="primary" @click="changePayment" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div v-if="participants.length > 0" class="col-12">
      <div class="text-h6 q-mb-md">
        {{ $t("contracts.signers") }}
      </div>
      <div v-for="(participant, index) in participants" :key="index" class="text-body2 q-mb-sm text-justify">
        {{ participant }}
      </div>
    </div>

    <div class="col-12">
      <div ref="contractDocument" class="contract-document"></div>
      <div class="flex flex-center">
        <q-circular-progress :indeterminate="isLoading" size="sm" color="primary" class="q-ma-md" />
      </div>

      <q-editor :disable="isEditDisable" class="full-width" v-model="htmlContract" :dense="$q.screen.lt.md" :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify'],
          },
        ],
        [
          'bold',
          'italic',
          'strike',
          'underline',
          'subscript',
          'superscript',
        ],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana',
            ],
          },
        ],

        ['undo', 'redo'],
        ['viewsource'],
      ]" :fonts="{
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana',
}" />
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { ENTRYPOINT } from '../../../../../src/config/entrypoint';
import { mapGetters } from "vuex";
import { formatBRDocument, formatBRPostalCode } from "./../library/formatter";
import configurable from "./../mixins/configurable";

export default {
  name: "ContractDocument",
  mixins: [configurable],

  props: {
    contract: {
      required: false,
    },
  },

  created() {
    if (this.contract) {
      this.loadParticipants();
      this.loadContract();
    }
  },

  mounted() {
    if (this.contract) {
      this.loadDocument();
      this.loadContract();
    }
  },

  data() {
    return {
      paymentOptions: [
        { label: this.$t("Payment.Options.Today"), value: 1 },
        { label: this.$t("Payment.Options.Before"), value: 5 },
        { label: this.$t("Payment.Options.Slice"), value: 2 },
        { label: this.$t("Payment.Options.Half"), value: 4 },
        { label: this.$t("Payment.Options.Card"), value: 3 },
      ],
      paymentType: "",
      participants: [],
      htmlContract: null,
      isRequesting: false,
      isLoading: false,
      contract_s: null,
      isEditDisable: true,
      showConfirmationDialog: false,
    };
  },

  watch: {

    currentCompany(data) {
      if (data) {
        this.pageLoading = false;
        this.loadDocument();
        this.loadContract();
      }
    },

    paymentType(newPaymentType, oldPaymentType) {
      if (newPaymentType !== oldPaymentType) {
        this.showConfirmationDialog = true;
      }
      console.log(this.paymentType)
    },

  },

  computed: {
    ...mapGetters({
      currentCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
    }),

    logged() {
      return this.$store.getters["auth/user"];
    },

    statusStyle() {
      let style = "text-center text-h6 rounded-borders q-pl-sm q-pr-sm ";

      if (this.contract_s && this.contract_s.status) {
        switch (this.contract_s.status) {
          case "Draft":
            style += "bg-blue text-white";
            break;
          case "Waiting approval":
          case "Waiting signatures":
            style += "bg-yellow text-black";
            break;
          case "Active":
            style += "bg-green text-white";
            break;
          case "Canceled":
          case "Amended":
            style += "bg-red text-white";
            break;
          default:
            style += "text-black";
        }
      } else {
        style += "text-black";
      }

      return style;
    }
  },

  methods: {

    changePayment() {
      this.showConfirmationDialog = false;

      const contractData = {
        id: this.contractId,
        contratante: this.contratante,
        contratante_doc_type: this.contratanteDocType,
        payment_type: this.paymentType,
      };

      function replaceVariables(data, html = '') {
        if (typeof html !== 'string') {
          html = html.toString();
        }

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const regex = new RegExp('{{\\s*' + key + '\\s*}}', 'g');
            html = html.replace(regex, data[key]);
          }
        }
        return html;
      }


      const updatedHtmlContent = replaceVariables(contractData);

      const params = {
        method: "PUT",
        body: JSON.stringify({
          paymentType: this.paymentType,
          htmlContent: updatedHtmlContent,
        }),
      };

      this.isLoading = true;

      const url = `/contracts/${this.contract}/change/payment`;

      api.fetch(url, params)
        .then(data => {
          if (data.response && data.response.success && data.response.data && data.response.data.contractId) {
            this.$q.notify({
              message: "Contrato atualizado com sucesso",
              position: "bottom",
              type: "positive",
            });
            this.loadDocument();
          }
          return data;
        })
        .catch(error => {
          console.error('Erro:', error);
          if (error instanceof SubmissionError) {
            return error.errors._error;
          } else {
            return error.message;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });

    },

    cancelChange() {
      this.showConfirmationDialog = false;
    },

    loadParticipants() {
      let params = {};
      params.myCompany = this.myCompany.id;
      api.fetch(`/my_contracts/${this.contract}/participants`, params)
        .then((response) => {
          response.response.data.forEach((participant) => {
            let info = "";

            info += this.$t(`contracts.roles.${participant.role}`) + ":";
            info += ` ${participant.people.name}.`;

            if (participant.people.address !== null) {
              info += ` Com sede na`;
              info += ` ${participant.people.address.street}`;
              info += ` nº ${participant.people.address.number}`;
              info += ` - CEP ${formatBRPostalCode(participant.people.address.postalCode)}`;
              info += ` - ${participant.people.address.district}`;
              info += ` - ${participant.people.address.city}`;
              info += ` - ${participant.people.address.state}`;
            }

            if (participant.people.document !== null) {
              let document = formatBRDocument(participant.people.document.id);

              if (participant.people.document.type == "CNPJ")
                info += `, inscrita no CNPJ sob nº ${document}.`;
              else {
                if (participant.people.document.type == "CPF")
                  info += `, CPF nº ${document}.`;
                else info += `, ${document}.`;
              }
            }

            if (info.length) {
              this.participants.push(info);
            }
          });
        });
    },

    loadDocument() {
      const params = {
        company: this.myCompany.id,
        myCompany: this.myCompany.id,
      };

      const url = `${ENTRYPOINT}/my_contracts/${this.contract}/document`;

      const config = {
        method: 'GET',
        url: url,
        headers: {
          'Accept': 'application/ld+json',
          'API-TOKEN': this.logged.token,
        },
        params: params,
      };

      api.execute(config)
        .then((response) => {
          this.htmlContract = response.data;
        })
        .catch((error) => {
          console.error("Error loading document:", error);
        });
    },

    loadContract() {
      if (this.contract !== null) {
        let params = {
          method: "GET",
        };

        this.isLoading = true;

        api.fetch("/contracts/" + this.contract, params)
          .then((data) => {
            const contract = {
              status: data.contractStatus,
            };

            return contract;
          })
          .then((contract) => {
            this.contract_s = contract;
            this.isLoading = false;
          })
          .catch((error) => {
            console.error("Erro ao carregar contrato:", error);
            this.isLoading = false;
          });
      }
    },

    isEdit() {
      this.isEditDisable = false;
    },

    saveContract() {
      const novoConteudoHTML = this.htmlContract;

      this.isLoading = true;

      const url = `/contracts/${this.contract}/change`;
      const params = {
        method: "PUT",
        body: JSON.stringify({ htmlContent: novoConteudoHTML }),
      };

      api.fetch(url, params)
        .then(data => {
          if (data.response && data.response.success && data.response.data.contractId) {
            this.$q.notify({
              message: "Contrato atualizado com sucesso",
              position: "bottom",
              type: "positive",
            });
            this.loadDocument();
          } else {
            throw new Error("Erro ao atualizar o contrato");
          }
        })
        .catch(error => {
          console.error('Erro:', error);
          if (error instanceof SubmissionError) {
            return error.errors._error;
          } else {
            return error.message;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });

      this.isEditDisable = true;
    },

    statusIsWaitingForSignature() {
      return this.contract_s && this.contract_s.status === "Waiting signatures";
    },

    requestSignatures() {
      if (this.contract !== null) {
        const options = {
          method: "PUT",
          body: {},
        };

        this.isRequesting = true;

        api.fetch(`/my_contracts/${this.contract}/request-signatures`, options)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw response;
            }
          })
          .then((contract) => {
            this.$emit("requested", contract);

            this.$q.notify({
              message: "Contrato atualizado com sucesso",
              position: "bottom",
              type: "positive",
            });
          })
          .catch((errorResponse) => {
            this.$q.notify({
              message: "Erro ao solicitar assinaturas: " + errorResponse.response.error,
              position: "bottom",
              type: "negative",
            });
            this.isRequesting = false;
          });
      }
    },

  },
};
</script>

<style lang="sass">
.demonstrativa
  margin-right: 10px

.contract-document
  margin-top: 20px
  overflow: auto
  text-align: justify

  & div
    max-width: 100%
</style>
