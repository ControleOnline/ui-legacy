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
    <div class="col-12">
      <div class="row q-mb-lg justify-end">
        <q-btn-toggle v-model="paymentType" toggle-color="primary" push glossy class="q-ml-md" :options="paymentOptions">
        </q-btn-toggle>

        <!-- Gerar aula demonstrativa
          :disable="!contract.canEdit()"
         -->
        <q-btn v-if="isIps()" class="demonstrativa" color="primary" label="Gerar aula demonstrativa"
          @click="onDemonstrativaClick" :loading="isRequesting" />

        <!-- contracts.request_signatures
          :disable="!contract.canSign()"
         -->
        <q-btn color="primary" :label="$t('contracts.request_signatures')" @click="requestSignatures"
          :loading="isRequesting" />
      </div>
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
      <!-- <div class="flex flex-center">
        <q-circular-progress :indeterminate="true" size="sm" color="primary" class="q-ma-md" />
        Carregando contrato...
      </div>
      -->
      <q-editor class="full-width" v-model="htmlContract" :dense="$q.screen.lt.md" :toolbar="[
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
import { mapGetters } from "vuex";
import Contract from "./../entity/Contract";
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
    }
  },

  mounted() {
    if (this.contract) {
      this.loadDocument();
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
      paymentType: null,
      participants: [],
      htmlContract: null,
      isRequesting: false,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
    }),

    logged() {
      return this.$store.getters["auth/user"];
    },
  },
  watch: {
    paymentType(paymentType) {
      let params = {
        method: "PUT",
        body: ({ paymentType: paymentType }),

      };

      params.headers.set("API-TOKEN", this.logged.token);

      this.isLoading = true;

      api
        .fetch("/contracts/" + this.contract + "/change/payment", params)
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
      let params = {};
      params.company = 418;
      params.myCompany = 418;

      const config = {
        method: 'GET',
        url: `https://api.foccuscegonhas.com.br/my_contracts/${this.contract}/document`,
        headers: {
          'Accept': 'application/ld+json',
          'API-TOKEN': this.logged.token,
        },
        params: params
      };

      api.execute(config).then((response) => {
        this.htmlContract = response.data;
        // this.$refs.contractDocument.innerHTML = response.data;

      })

      // api.fetchText(`/my_contracts/${this.contract}/document`, {params})
      // .then((response) => {
      //   this.$refs.contractDocument.innerHTML = response.text();
      // });
    },

    requestSignatures() {
      let options = {};
      options.params = { myCompany: this.myCompany.id };
      options.method = 'PUT';
      options.body = {};

      this.isRequesting = true;

      api.fetch(`/my_contracts/${this.contract}/request-signatures`, options)
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
        body: ({}),

      };

      params.headers.set("API-TOKEN", this.logged.token);

      this.isLoading = true;

      api
        .fetch("/contracts/" + this.contract + "/status/Active", params)
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
