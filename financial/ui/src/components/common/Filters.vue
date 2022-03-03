<template>
  <q-card class="row q-pa-md">
    <div class="col-xs-12 q-pb-md text-h6">Faturas</div>
    <div class="col-sm-6 col-xs-12 q-pa-md">
      <q-input
        stack-label
        label="Buscar por"
        debounce="1000"
        v-model="filters.text"
        class="full-width"
      />
    </div>
    <div class="col-sm-6 col-xs-12 q-pa-md">
      <q-select
        stack-label
        label="Status da fatura"
        v-model="filters.status"
        :options="statuses"
        class="full-width"
        :loading="loadingStatuses"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-6">
      <q-select
        stack-label
        label="Tipo de Fatura"
        v-model="filters.orderType"
        :options="orderType"
        class="full-width"
        :loading="loadingOrderType"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-6">
      <DataFilter
        :fromDate="filters.date.from"
        :toDate="filters.date.to"
        :showButton="false"
        @dateChanged="dateChanged"
      />
    </div>
  </q-card>
</template>      
<script>
import { mapActions, mapGetters } from "vuex";
import {
  formatMoney,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import DataFilter from "@controleonline/quasar-common-ui/src/components/common/DataFilter.vue";
import { date } from "quasar";

export default {
  components: {
    DataFilter,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.requestStatuses();
  },

  data() {
    let statuses = [{ label: "Selecione um status", value: -1 }];

    return {
      statuses: statuses,
      loadingStatuses: false,
      loadingOrderType: false,
      orderType: [
        {
          label: "Todos",
          value: null,
        },
        {
          label: "Comissão",
          value: "comission",
        },
        {
          label: "Compra",
          value: "purchase",
        },
        {
          label: "Royalties",
          value: "royalties",
        },
        {
          label: "Venda",
          value: "sale",
        },
      ],
    };
  },

  computed: {},

  watch: {
    "filters.text"() {
      this.$emit("onRequest");
    },
    "filters.orderType"() {
      this.$emit("onRequest");
    },
    "filters.status"() {
      this.$emit("onRequest");
    },
  },

  methods: {
    ...mapActions({
      getStatuses: "receiveInvoice/getStatuses",
    }),

    requestStatuses() {
      this.loadingStatuses = true;
      this.getStatuses({
        visibility: "public",
        realStatus: ["open", "pending", "canceled", "closed"],
      }).then((statuses) => {
        if (statuses.length) {
          let data = [];

          data.push({
            label: "Todos",
            value: null,
          });

          for (let index in statuses) {
            data.push({
              label: this.$t(`invoice.statuses.${statuses[index].status}`),
              value: statuses[index]["@id"].replace(/[^0-9]/g, ""),
            });
          }

          this.statuses = data;
        }
        this.loadingStatuses = false;
      });
    },
    dateChanged(item) {
      this.filters.date = item;
      this.$emit("onRequest");
    },
  },
};
</script>