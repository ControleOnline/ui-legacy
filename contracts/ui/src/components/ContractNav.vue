<template>
  <div class="row q-pt-sm q-pb-sm q-gutter-xs justify-end">
    <q-btn flat
      :to   ="Routes.Details.get(originalId)"
      :label="$t('contracts.original')"
    />

    <q-btn flat
      :to   ="Routes.Details.get(amendedId)"
      :label="$t('contracts.amended')"
    />
  </div>
</template>

<script>
import configurable from './../mixins/configurable';

export default {
  name  : 'ContractNav',
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
      originalId: '',
      amendedId : '',
    }
  },

  methods: {
    loadContract() {
      if (this.id !== null) {
        this.Api.Contracts
          .GetOne({ params: { id: this.id } })
            .then((contract) => {
              this.originalId = contract.contractParent !== null ?
                contract.contractParent['@id'].replace(/\D/g, '')   : '';

              this.amendedId  = contract.contractChild[0] ?
                contract.contractChild[0]['@id'].replace(/\D/g, '') : '';
            })
          ;
      }
    },
  },
};
</script>
