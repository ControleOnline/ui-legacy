<template>
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
</template>

<script>
import configurable from './../mixins/configurable';

export default {
  name  : 'ContractActions',
  mixins: [ configurable ],

  props: {
    id     : {
      type    : String,
      required: false,
      default : null
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
