<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-common-ui/src/components/Default/DefaultTable";
//import acoes from "@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue";

export default {
  components: {
    DefaultTable,
    //acoes
  },

  computed: {
    configs() {
      return {
        store: 'queues',
        add: true,
        selection: true,
        search: false,
        /*
        tableActions: {
          component: acoes,
          props: {
            teste: 1
          }
        }
        */
        list: {
          displayType: this.displayType,
          company: this.company,
        },
      };
    }
  },
  data() {
    return {

      displayType: [
        { label: this.$t('displayType.production'), value: 'production' },
        { label: this.$t('displayType.delivery'), value: 'delivery' },
        { label: this.$t('displayType.display'), value: 'display' }
      ],
      company: [
        { label: 'RECANTOS', value: '42' },
        { label: 'Controle Online', value: '1' },
      ],

    };
  },
  created() {

  },
  methods: {

  },
};
</script>