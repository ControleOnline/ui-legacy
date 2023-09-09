<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-common-ui/src/components/Default/DefaultTable";
export default {
  components: {
    DefaultTable
  },

  computed: {
    configs() {
      let module = 'queues';

      return {
        components: {
          //acoes: () => import("@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue"),
          //componentProps: {
          //   x: 1,
          //    Y: 2
          //}
        },
        list: {
          displayType: this.displayType,
          companies: this.companies,
        },
        add: true,
        module: module,
        isLoading: module + '/isLoading',
        totalItems: module + '/totalItems',
        columns: module + '/columns',
        filters: module + '/filters',
        actions: {
          getItems: module + '/getItems',
          save: module + '/save',
          setFilters: module + '/SET_FILTERS',
        },

        selection: false,
        search: false,

      };
    }


  },
  data() {
    return {

      displayType: [
        { label: this.$t('displayType.production'), value: 'production' },
        { label: this.$t('displayType.service'), value: 'delivery' },
        { label: this.$t('displayType.display'), value: 'display' }
      ],
      companies: [
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