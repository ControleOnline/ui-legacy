<template>
  <div class="row q-pa-md">
    <div class="col-12">
      <div class="row q-mb-lg justify-end">
        <q-btn-toggle
          v-model="paymentType"
          toggle-color="primary"
          push
          glossy
          class="q-ml-md"
          :options="paymentOptions"
        >
        </q-btn-toggle>

        <q-btn
          v-if="isIps()"
          class="demonstrativa"
          color="primary"
          label="Gerar aula demonstrativa"
          @click="onDemonstrativaClick"
          :loading="isRequesting"
          :disable="!contract.canEdit()"
        />

        <q-btn
          color="primary"
          :label="$t('contracts.request_signatures')"
          @click="requestSignatures"
          :loading="isRequesting"
          :disable="!contract.canSign()"
        />
      </div>
    </div>

    <div v-if="participants.length > 0" class="col-12">
      <div class="text-h6 q-mb-md">
        {{ $t("contracts.signers") }}
      </div>
      <div
        v-for="(participant, index) in participants"
        :key="index"
        class="text-body2 q-mb-sm text-justify"
      >
        {{ participant }}
      </div>
    </div>

    <div class="col-12">
      <div ref="contractDocument" class="contract-document"></div>
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { mapGetters } from "vuex";
import Contract from "./../entity/Contract";
import { formatBRDocument, formatBRPostalCode } from "./../library/formatter";
import configurable from "./../mixins/configurable";

export default {
  name: "ContractDocument",
  mixins: [configurable],

  props: {
    contract: {
      type: Contract,
      required: true,
    },
  },

  created() {
    this.loadParticipants();
  },

  mounted() {
    this.loadDocument();
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
      paymentType: null,
      participants: [],
      isRequesting: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
    }),

    logged() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    paymentType(paymentType) {
      let params = {
        method: "PUT",
        body: JSON.stringify({ paymentType: paymentType }),
        
      };

      params.headers.set("API-TOKEN", this.logged.token);

      this.isLoading = true;

      api
        .fetch("/contracts/" + this.contract.id + "/change/payment", params)
        .then(
          ((data) => {
            if (data.response && data.response.success && data.response.data.contractId) {
              this.$q.notify({
                message: "Contrato atualizado com sucesso",
                position: "bottom",
                type: "positive",
              });
              this.loadDocument();
            }

            return data;
          }).bind(this)
        )
        .catch((e) => {
          if (e instanceof SubmissionError) {
            return e.errors._error;
          }
          return e.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  methods: {
    isIps() {
      const ipsTypes = ["ips"];

      return ipsTypes.indexOf(this.defaultCompany.domainType) > -1;
    },

    loadParticipants() {
      this.Api.Contracts.GetSigners({
        params: {
          id: this.contract.id,
        },
        query: {
          myCompany: this.Params.Company.get(),
        },
      }).then((participants) => {
        participants.forEach((participant) => {
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
      this.Api.Contracts.GetDocument({
        params: {
          id: this.contract.id,
        },
        query: {
          company: this.Params.Company.get(),
          myCompany: this.Params.Company.get(),
        },
      }).then((content) => {
        this.$refs.contractDocument.innerHTML = content;
      });
    },

    requestSignatures() {
      this.isRequesting = true;

      this.Api.Contracts.RequestSignatures({
        params: {
          id: this.contract.id,
        },
        query: {
          myCompany: this.Params.Company.get(),
        },
        payload: {},
      })
        .then((contract) => {
          this.$emit("requested", contract);
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },

    onDemonstrativaClick() {
      let params = {
        method: "PUT",
        body: JSON.stringify({}),
        
      };

      params.headers.set("API-TOKEN", this.logged.token);

      this.isLoading = true;

      api
        .fetch("/contracts/" + this.contract.id + "/status/Active", params)
        .then(
          ((data) => {
            if (data.response && data.response.success && data.response.data.contractId) {
              this.$q.notify({
                message: "Contrato atualizado com sucesso",
                position: "bottom",
                type: "positive",
              });

              location.reload();
            }

            return data;
          }).bind(this)
        )
        .catch((e) => {
          if (e instanceof SubmissionError) {
            return e.errors._error;
          }
          return e.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
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
