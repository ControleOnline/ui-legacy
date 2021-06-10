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
    contract: {
      type    : Object,
      required: true
    },
  },

  data() {
    return {

    }
  },

  computed: {
    originalId() {
      if (this.contract === null) return ''

      if (!this.contract.contractParent)
        return '';

      return this.contract.contractParent['@id'].replace(/\D/g, '');
    },

    amendedId () {
      if (this.contract === null) return ''

      if (!this.contract.contractChild)
        return '';

      if (!this.contract.contractChild.length)
        return '';

      return this.contract.contractChild[0]['@id'].replace(/\D/g, '');
    },
  },
};
</script>
