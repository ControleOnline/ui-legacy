<template>
  <DefaultTable :configs="configs"></DefaultTable>
</template>

<script>

import { mapActions, mapGetters } from "vuex";
import DefaultTable from '@controleonline/quasar-default-ui/src/components/Default/DefaultTable.vue';
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods';
import Button from "@controleonline/quasar-common-ui/src/components/Categories/Button";

export default {
  props: {
    orderId: {
      type: Number,
      required: false,
    },
  },

  components: {
    DefaultTable,
    Button
  },
  created() {
    if (this.orderId)
      this.addFilter('orderId', orderId);

  },
  data() {
    return {
      context: 'logistic'
    }
  },
  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
    configs() {
      return {
        store: 'logistic',
        add: true,
        filters: true,
        editable: true,
        delete: true,
        selection: false,
        search: true,
        columns: {
          destintionType: {
            filters: {
              context: this.context,
              company: '/people/' + this.myCompany.id
            }
          },
          originType: {
            filters: {
              context: this.context,
              company: '/people/' + this.myCompany.id
            }
          },
          status: {
            filters: {
              context: this.context
            }
          }
        },
        components: {
          headerActions: {
            component: Button,
            props: {
              context: this.context
            }
          }
        }
      };
    },
  },

  methods: {
    ...DefaultFiltersMethods
  }
};
</script>