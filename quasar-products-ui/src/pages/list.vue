<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
//import acoes from "@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue";

export default {
  name: "Products",
  components: {
    DefaultTable
    //acoes
  },

  computed: {
    configs() {
      return {
        store: 'products',
        selection: false,
        search: {
          
        },
        components: {
          /*
          tableActions: {
            component: acoes,
            props: {
              teste: 1
            }
          }
          */
        },

        list: {
          productType: this.productType,
          productConditions: this.productConditions,
        },
      };
    }
  },
  data() {
    return {

      productType: [
        { label: this.$t('product.product'), value: 'product' },
        { label: this.$t('product.service'), value: 'service' },
        { label: this.$t('product.component'), value: 'component' }
      ],
      productConditions: [
        { label: this.$t('product.new'), value: 'new' },
        { label: this.$t('product.used'), value: 'used' },
        { label: this.$t('product.recondicioned'), value: 'recondicioned' }
      ],

    };
  },
  created() {

  },
  methods: {

  },
};
</script>