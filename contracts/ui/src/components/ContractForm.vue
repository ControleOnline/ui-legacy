<template>
  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input stack-label borderless readonly
          v-model ="status"
          :label  ="$t('contracts.status')"
        >
        </q-input>
      </div>

      <div class="col-xs-12 col-sm-6">
        <q-select stack-label emit-value map-options :hide-dropdown-icon="readOnly"
          v-model    ="model"
          :label     ="$t('contracts.model')"
          :options   ="contractModels"
          :loading   ="loadingModels"
          :outlined  ="!readOnly"
          :borderless="readOnly"
          :readonly  ="readOnly"
          :rules     ="[val => val !== null || $t('messages.select_an_option')]"
        >
        </q-select>
      </div>

      <div class="col-xs-12 col-sm-6">
        <q-input stack-label
          v-model    ="startDate"
          mask       ="##/##/####"
          :label     ="$t('contracts.start_date')"
          :rules     ="[isInvalid('date')]"
          :outlined  ="!readOnly"
          :borderless="readOnly"
          :readonly  ="readOnly"
        >
          <template v-slot:append v-if="!readOnly">
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                <q-date
                  v-model ="startDate"
                  mask    ="DD/MM/YYYY"
                  @input  ="() => {
                    $refs.qDateProxy1
                      .hide();
                  }"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         :label   ="$t('contracts.save')"
         :loading ="isSaving"
         :disable ="readOnly"
      />
    </div>
  </q-form>
</template>

<script>
import configurable           from './../mixins/configurable';
import validation             from './../mixins/validation';
import { formatDateYmdTodmY } from './../library/formatter';

export default {
  name  : 'ContractForm',
  mixins: [ configurable, validation ],

  props: {
    id     : {
      type    : String,
      required: false,
      default : null
    },
    readOnly: {
      type    : Boolean,
      required: false,
      default : false
    }
  },

  created() {
    this.loadContract();
    this.loadContractModels();
  },

  data() {
    return {
      status        : null,
      model         : null,
      startDate     : null,
      contractModels: [],
      loadingModels : false,
      isSaving      : false,
    }
  },

  methods: {
    onSubmit() {
      this.isSaving = true;

      this.Api.Contracts
        .Save({
          params : { id: this.id },
          payload: {
            contractModel: this.model,
            startDate    : this.startDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "$3-$2-$1"),
          },
          query  : {
            myCompany : this.Params.Company.get(),
            myProvider: this.Params.Company.get(),
          }
        })
          .then(contract => {
            this.$q.notify({
              message : this.$t('messages.saved_successfully'),
              position: 'bottom',
              type    : 'positive',
            });
          })
          .catch(e => {
            this.$q.notify({
              message : this.$t(error.message),
              position: 'bottom',
              type    : 'negative',
            });
          })
          .finally(() => {
            this.isSaving = false;
          })
        ;
    },

    loadContract() {
      if (this.id !== null) {
        this.Api.Contracts
          .GetOne({
            params: { id: this.id },
          })
            .then((contract) => {
              this.status    = this.$t(`contracts.statuses.${contract.contractStatus}`);
              this.model     = contract.contractModel['@id'];
              this.startDate = contract.startDate ? formatDateYmdTodmY(contract.startDate) : '';
            })
          ;
      }
    },

    loadContractModels() {
      if (this.loadingModels) {
        return;
      }

      if (this.contractModels.length) {
        return;
      }

      this.loadingModels = true;
      this.Api.Contracts
        .GetTemplateList()
          .then(data => {
            let templates = [];

            if (data) {
              data.members.forEach(template => {
                templates.push({
                  label: template.contractModel,
                  value: template['@id'],
                });
              });
            }

            this.contractModels = templates;
          })
          .finally(() => {
            this.loadingModels = false;
          })
        ;
    },
  },
};
</script>
