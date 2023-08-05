<template>
  <q-table
    :loading="isLoading"
    :data="data"
    :columns="settings.columns"
    :pagination.sync="pagination"
    @request="onRequest"
    row-key="id"
    :visible-columns="settings.visibleColumns"
    style="min-height: 90vh"
  >
    <template v-slot:top v-if="search === true">
      <div class="col-sm-3 col-xs-12 q-pa-md">
        <q-input
          stack-label
          label="Buscar por"
          debounce="1000"
          v-model="filters.text"
          class="full-width"
        />
      </div>
      <div class="col-sm-3 col-xs-12 q-pa-md">
        <q-select
          stack-label
          label="Status do pedido"
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
      <div class="col-sm-6 col-xs-12 q-pa-md">
        <DataFilter
          :fromDate="filters.from"
          :toDate="filters.to"
          :showButton="false"
          @dateChanged="dateChanged"
        />
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          <q-btn
            outline
            dense
            :to="{ name: 'OrderDetails', params: { id: props.row.id } }"
            :label="`#${props.row.id}`"
            :style="{ color: props.row.color_status }"
            class="full-width"
          />
        </q-td>
        <q-td key="notaFiscal" :props="props">{{ props.row.notaFiscal }}</q-td>
        <q-td key="dataPedido" :props="props">{{ props.cols[2].value }}</q-td>
        <q-td key="dataEntrega" :props="props">{{ props.cols[3].value }}</q-td>
        <q-td key="ultimaModificacao" :props="props">{{ props.cols[4].value }}</q-td>
        <q-td key="status" :props="props" :style="{ color: props.row.color_status }">
          {{ translate(`order.statuses.${props.row.status}`) }}
        </q-td>
        <q-td key="coleta" :props="props">
          {{ props.row.localColeta }}<br />{{ props.row.coleta }}
        </q-td>
        <q-td key="entrega" :props="props">
          {{ props.row.localEntrega }}<br />{{ props.row.entrega }}
        </q-td>
        <q-td key="transportadora" :props="props">
          {{ props.row.transportadora }}
        </q-td>
        <q-td key="preco" :props="props">{{ props.cols[9].value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import DataFilter from "@controleonline/quasar-common-ui/src/components/Common/DataFilter.vue";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";

const SETTINGS = {
  visibleColumns: [
    "id",
    "notaFiscal",
    "dataPedido",
    "dataEntrega",
    "ultimaModificacao",
    "status",
    "coleta",
    "entrega",
    "transportadora",
    "preco",
  ],
  columns: [
    {
      name: "id",
      field: "id",
      align: "left",
      label: "ID",
    },
    {
      name: "notaFiscal",
      field: "notaFiscal",
      align: "left",
      label: "Nota Fiscal",
      format: (val, row) => {
        return val ? "#" + val : "";
      },
    },
    {
      name: "dataPedido",
      field: "dataPedido",
      align: "left",
      format: (val, row) => {
        return date.formatDate(val, "DD/MM/YYYY");
      },
      label: "Data do pedido",
    },
    {
      name: "dataEntrega",
      field: "dataEntrega",
      align: "left",
      format: (val, row) => {
        if (val) {
          return date.formatDate(val, "DD/MM/YYYY");
        }
        return "--";
      },
      label: "Previsão de entrega",
    },
    {
      name: "ultimaModificacao",
      field: "ultimaModificacao",
      align: "left",
      format: (val, row) => {
        return date.formatDate(val, "DD/MM/YYYY HH:mm:ss");
      },
      label: "Ultima alteração",
    },
    {
      name: "status",
      field: "status",
      align: "left",
      label: "Status",
    },
    {
      name: "coleta",
      field: "coleta",
      align: "left",
      label: "Coleta",
    },
    {
      name: "localColeta",
      field: "localColeta",
      align: "left",
      label: "Local de coleta",
    },
    {
      name: "entrega",
      field: "entrega",
      align: "left",
      label: "Entrega",
    },
    {
      name: "localEntrega",
      field: "localEntrega",
      align: "left",
      label: "Local de entrega",
    },
    {
      name: "transportadora",
      field: "transportadora",
      align: "left",
      label: "Transportadora",
    },
    {
      name: "preco",
      field: "preco",
      align: "left",
      format: (val, row) => {
        return formatMoney(val, "BRL", "pt-br");
      },
      label: "Preço",
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  components: {
    DataFilter,
  },
  props: {},

  created() {
    if (this.myCompany !== null) {
      this.onRequest();
    }
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    let statuses = [
      { label: "Abertos", value: -1 },
      { label: "Todos", value: 0 },
    ];

    return {
      settings: SETTINGS,
      data: [],
      statuses: statuses,
      filters: {
        status: statuses[0].value,
      },
      pagination: {
        sortBy: "ultimaModificacao",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      loadingStatuses: false,
    };
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      isLoading: "products/isLoading",
      error: "products/error",
      violations: "products/violations",
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    isLoading(isLoading) {
      //if (isLoading) this.$q.loading.show();
      //else this.$q.loading.hide();
    },

    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.onRequest();
      }
    },
  },

  methods: {
    ...mapActions({
      getItems: "products/getProducts",
      reset: "products/reset",
    }),
    onRequest() {
      this.filters.company = "/people/" + this.myCompany.id;
      this.getItems(this.filters);
    },
  },
};
</script>
