<template>
  <div class="row q-pa-md">
    <div class="col-12">
      <div class="row q-mb-lg justify-end">
        <q-btn
          color   ="primary"
          :label  ="$t('contracts.request_signatures')"
          @click  ="requestSignatures"
          :loading="isRequesting"
          :disable="!contract.canEdit()"
        />
      </div>
    </div>

    <div
      v-if ="participants.length > 0"
      class="col-12"
    >
      <div class="text-h6 q-mb-md">
        {{ $t('contracts.signers') }}
      </div>
      <div
        v-for="(participant, index) in participants"
        :key ="index"
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
import configurable           from './../mixins/configurable';
import Contract               from './../entity/Contract';
import { formatBRDocument   } from './../library/formatter';
import { formatBRPostalCode } from './../library/formatter';

export default {
  name  : 'ContractDocument',
  mixins: [ configurable ],

  props: {
    contract : {
      type    : Contract,
      required: true
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
      participants: [],
      isRequesting: false,
      isLoading   : false,
    }
  },

  methods: {
    loadParticipants() {
      this.Api.Contracts
        .GetSigners({
          params: {
            id: this.contract.id,
          },
          query : {
            myCompany: this.Params.Company.get()
          }
        })
          .then(participants => {
            participants
              .forEach(participant => {
                let info = '';

                info += this.$t(`contracts.roles.${participant.role}`) + ':';
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

                  if (participant.people.document.type == 'CNPJ')
                    info += `, inscrita no CNPJ sob nº ${document}.`;
                  else {
                    if (participant.people.document.type == 'CPF')
                      info += `, CPF nº ${document}.`;
                    else
                      info += `, ${document}.`;
                  }
                }

                if (info.length) {
                  this.participants.push(info);
                }
              });
          });
    },

    loadDocument() {
      this.Api.Contracts
        .GetDocument({
          params: {
            id: this.contract.id,
          },
          query : {
            company  : this.Params.Company.get(),
            myCompany: this.Params.Company.get(),
          },
        })
          .then(content => {
            this.$refs.contractDocument.innerHTML = content;
          })
          .catch(error => {
            this.$q.notify({
              message : error.message,
              position: 'bottom',
              type    : 'negative',
            });
          })
        ;
    },

    requestSignatures() {
      this.isRequesting = true;

      this.Api.Contracts
        .RequestSignatures({
          params: {
            id: this.contract.id,
          },
          query : {
            myCompany: this.Params.Company.get()
          },
          payload: {}
        })
          .then(contract => {
            this.$emit('requested', contract);
          })
          .catch(error => {
            this.$q.notify({
              message : error.message,
              position: 'bottom',
              type    : 'negative',
            });
          })
          .finally(() => {
            this.isRequesting = false;
          })
        ;
    },
  },
};
</script>

<style lang="sass">

  .contract-document
    margin-top: 20px
    overflow  : auto
    text-align: justify

    & div
      max-width: 100%

</style>
