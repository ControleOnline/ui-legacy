<template>
  <q-card
    class="q-pa-md"
    style="min-height: 90vh;"
  >
    <contract-nav
      :config  ="config"
      :contract="contract"
    />
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
    <contract-form
      :config    ="config"
      :contract  ="contract"
      :readOnly  ="false"
    />
  </q-card>
</template>

<script>
import configurable from './../mixins/configurable';

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
      contract: {},
    }
  },

  methods: {
    loadContract() {
      if (this.id !== null) {
        this.Api.Contracts
          .GetOne({ params: { id: this.id } })
            .then((contract) => {
              this.contract = contract;
            })
          ;
      }
    },
  },
};
</script>
