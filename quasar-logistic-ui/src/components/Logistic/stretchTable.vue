<template>
  <DefaultTable :configs="tableSettings"></DefaultTable>
</template>

<script>
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
        store: 'logistic',
        add: true,
        filters: true,
        editable: true,
        delete: true,
        selection: false,
        search: true,
        list: {
        },
        columns: {
          status: {
            filters: {
              context: 'logistic'
            }
          }
        },

      };
    },
  },

  methods: {
    ...DefaultMethods,
  }
};
</script>