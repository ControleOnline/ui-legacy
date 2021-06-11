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

    <q-card class="q-pa-md" style="min-height: 90vh">
      <div v-if="contract !== null">
        <contract-nav
          :config  ="config"
          :contract="contract"
        />
        <contract-form
          :config    ="config"
          :contract  ="contract"
          :readOnly  ="false"
        />
      </div>
    </q-card>
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
  },

  created() {
    this.loadContract();
  },

  data() {
    return {
      contract: null,
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
