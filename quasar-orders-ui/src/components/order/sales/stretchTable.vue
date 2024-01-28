<template>
  <DefaultTable :configs="tableSettings"></DefaultTable>
</template>

<script>
import StrechModal from "./stretchAddEdit.vue";
import DefaultTable from '@controleonline/quasar-default-ui/src/components/Default/DefaultTable.vue';
import DefaultCustomActions from '@controleonline/quasar-default-ui/src/components/Default/DefaultCustomActions.vue';
import {
  formatDateYmdTodmY,
  formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    orderId: {
      type: Number,
      required: false,
    },
    orderPrice: {
      type: Number,
      required: false,
    },
  },

  components: {
    DefaultTable,
    StrechModal,
  },
  created() {
  },
  data() {
    return {
    }
  },
  computed: {
    tableSettings() {
      return {
        store: 'logistics',
        add: true,
        filters: true,
        editable: true,
        delete: false,
        selection: false,
        search: true,
        list: {
        },
        components: {
          tableActions: {
            component: DefaultCustomActions,
            props: {
              btnTitle: '',
              btnIcon: 'settings',
              btnFlat: true,
              btnDense: true,
              items: [
                { title: 'Editar', icon: 'edit', action: this.openEditModal },
                { title: 'Finalizar', icon: 'check', action: this.finish },
                { title: 'Vistoria', icon: 'checklist', action: this.addSurvey },
                { title: 'Excluir', icon: 'delete', action: this.deleteTrecho },
              ]
            }
          }
        }
      };
    },
  },

  methods: {

  }

};
</script>