<template>
  <div>
    <q-card class="q-pa-md q-mb-sm">
      <div v-if="contract !== null">
        <div class="row q-pt-sm q-pb-sm q-gutter-xs justify-end">
          <contract-action-cancel
            :config  ="config"
            :contract="contract"
          />
          <contract-action-amend
            :config  ="config"
            :contract="contract"
          />
        </div>
      </div>
    </q-card>

    <div v-if="contract !== null">
      <q-stepper alternative-labels header-nav
        v-model     ="currentStep"
        color       ="primary"
        :vertical   ="$q.screen.lt.sm"
        active-color="primary"
        style       ="min-height: 90vh"
      >
        <q-step :header-nav="true"
          v-for ="panel in panels"
          :key  ="panel.name"
          :name ="panel.name"
          :title="$t(`contracts.panels.${panel.name}`)"
          :icon ="panel.icon"
        >
          <slot
            :name          ="panel.name"
            v-bind:contract="contract"
            v-bind:config  ="config"
          >
            {{ `Panel '${panel.name}' not found` }}
          </slot>
        </q-step>
      </q-stepper>
    </div>
  </div>
</template>

<script>
import configurable from './../mixins/configurable';
import Contract     from './../entity/Contract';

export default {
  name  : 'ContractDetail',
  mixins: [ configurable ],

  props: {
    id     : {
      type    : String,
      required: true
    },
    panels : {
      type    : Array,
      required: true,
    },
  },

  created() {
    this.loadContract();
  },

  data() {
    return {
      contract   : null,
      currentStep: this.panels[0].name,
    }
  },

  methods: {
    loadContract() {
      if (this.id !== null) {
        this.Api.Contracts
          .GetOne({ params: { id: this.id } })
            .then((data) => {
              const contract = new Contract(data['@id'].replace(/\D/g, ''));

              contract.original = (function(c) {
                if (!c.contractParent) return null;

                return {
                  '@id': c.contractParent['@id'],
                  id   : c.contractParent['@id'].replace(/\D/g, '')
                }
              })(data);

              contract.amended = (function(c) {
                if (!c.contractChild) return null;

                if (!c.contractChild.length)
                  return null;

                return {
                  '@id': c.contractChild[0]['@id'],
                  id   : c.contractChild[0]['@id'].replace(/\D/g, '')
                }
              })(data);

              contract.template = (function(c) {
                if (!c.contractModel) return null;

                return {
                  '@id': c.contractModel['@id'],
                  id   : c.contractModel['@id'].replace(/\D/g, '')
                }
              })(data);

              contract.status    = data.contractStatus;
              contract.startDate = data.startDate;
              contract.endDate   = data.endDate;

              return contract;
            })
            .then((contract) => {
              this.contract = contract;
            })
          ;
      }
    },
  },
};
</script>
