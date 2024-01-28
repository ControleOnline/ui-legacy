<template>
  <DefaultTable :configs="tableSettings"></DefaultTable>
</template>

<script>
import stretchAddEdit from "./stretchAddEdit.vue";
import DefaultTable from '@controleonline/quasar-default-ui/src/components/Default/DefaultTable.vue';
import DefaultCustomActions from '@controleonline/quasar-default-ui/src/components/Default/DefaultCustomActions.vue';
import {
  formatDateYmdTodmY,
  formatMoney,
  buildAmericanDate,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';
import { api } from "@controleonline/../../src/boot/api";

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
    stretchAddEdit,
  },
  created() {
  },
  data() {
    return {

      stretchToEdit: {},
    }
  },
  computed: {
    tableSettings() {
      return {
        store: 'logistics',
        add: false,
        filters: true,
        editable: false,
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
                { title: 'Editar', icon: 'edit', component: stretchAddEdit },
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
    ...DefaultMethods,
    openEditModal(props) {
      this.stretchToEdit = props.row;

    },

  }

};
</script>