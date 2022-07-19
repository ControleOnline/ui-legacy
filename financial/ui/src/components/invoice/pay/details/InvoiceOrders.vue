<template>
  <q-table
    :loading="isLoading"
    :data="data"
    :columns="settings.columns"
    :pagination.sync="pagination"
    @request="onRequest"
    row-key="id"
    style="min-height: 90vh"
    :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          <q-btn
            outline
            dense
            :to="{
              name: 'PurchasingOrderDetails',
              params: { id: props.row.id },
            }"
            :label="`#${props.row.id}`"
            :style="{ color: props.row.color_status }"
            class="full-width"
          />
        </q-td>
        <q-td key="mainOrder" :props="props">
          <q-btn
            v-if="props.row.mainOrder"
            outline
            dense
            :to="{
              name: 'OrderDetails',
              params: { id: props.row.mainOrder },
            }"
            :label="`#${props.row.mainOrder}`"
            :style="{ color: 'grey' }"
            class="full-width"
          />
        </q-td>
        <q-td key="client" :props="props">{{ props.row.client }}</q-td>
        <q-td key="notaFiscal" :props="props">{{ props.row.notaFiscal }}</q-td>
        <q-td key="dataPedido" :props="props">{{ props.cols[4].value }}</q-td>
        <q-td key="ultimaModificacao" :props="props">{{
          props.cols[5].value
        }}</q-td>
        <q-td
          key="status"
          :props="props"
          :style="{ color: props.row.color_status }"
        >
          {{ $t(`order.statuses.${props.row.status}`) }}
        </q-td>
        <q-td key="preco" :props="props">{{ props.cols[7].value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { date } from "quasar";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";

const SETTINGS = {
  columns: [
    {
      name: "id",
      field: "id",
      align: "left",
      label: "ID",
    },
    {
      name: "mainOrder",
      field: "mainOrder",
      align: "left",
      label: "Pedido Principal",
    },
    {
      name: "client",
      field: "client",
      align: "left",
      label: "Cliente",
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
      label: "Data",
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
  props: {
    search: {
      type: Boolean,
      required: false,
      default: true,
    },
    invoiceId: {
      type: String,
      required: false,
      default: null,
    },
  },

  created() {
    if (this.myCompany !== null) {
      this.filters.company = this.myCompany;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    }
    this.requestStatuses();
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    let statuses = [{ label: "Todos", value: -1 }];

    return {
      settings: SETTINGS,
      data: [],
      statuses: statuses,
      filters: {
        text: null,
        status: statuses[0],
        company: null,
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
      isLoading: "purchasingOrder/isLoading",
      error: "purchasingOrder/error",
      violations: "purchasingOrder/violations",
      items: "purchasingOrder/items",
      totalItems: "purchasingOrder/totalItems",
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.onRequest({
          pagination: this.pagination,
          filter: this.filters,
        });
      }
    },

    totalItems(val) {
      this.pagination.rowsNumber = val;
    },

    items(items) {
      if (!items) return;

      let data = [];

      for (let index in items) {
        let item = items[index];

        var clientName = "--";

        if (item.mainOrder && item.mainOrder.client) {
          clientName = item.mainOrder.client.name;

          if (!clientName) {
            clientName = item.mainOrder.client.alias;
          } else if (
            clientName.toLowerCase().indexOf(" ltda") == -1 &&
            clientName.toLowerCase().indexOf(" eireli") == -1 &&
            clientName.toLowerCase().indexOf(" comercio") == -1 &&
            clientName.toLowerCase().indexOf(" comércio") == -1 &&
            clientName.toLowerCase().indexOf(" comercial") == -1 &&
            clientName.toLowerCase().indexOf(" industria") == -1 &&
            clientName.toLowerCase().indexOf(" indústria") == -1 &&
            clientName.toLowerCase().indexOf(" soluções") == -1 &&
            clientName.toLowerCase().indexOf(" importação") == -1 &&
            clientName.toLowerCase().indexOf(" solutions") == -1 &&
            clientName.toLowerCase().indexOf(" me") == -1 &&
            clientName.toLowerCase().trim() !=
              item.mainOrder.client.alias.toLowerCase().trim()
          ) {
            clientName += " " + item.mainOrder.client.alias;
          }
        }

        data.push({
          "@id": item["@id"],
          id: item["@id"].match(/^\/purchasing\/orders\/([a-z0-9-]*)$/)[1],
          mainOrder: item.mainOrderId,
          client: clientName,
          notaFiscal:
            item.invoiceTax.length > 0
              ? "#" + item.invoiceTax[0].invoiceTax.invoiceNumber
              : "",
          dataPedido: item.orderDate,
          ultimaModificacao: item.alterDate,
          status: item.status.status,
          color_status: item.status.color,
          preco: item.price,
        });
      }

      this.data = data;
    },

    "filters.text"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },

    "filters.status"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  },

  methods: {
    ...mapActions({
      getItems: "purchasingOrder/getItems",
      reset: "purchasingOrder/reset",
      getStatuses: "purchasingOrder/getStatuses",
    }),

    requestStatuses() {
      this.loadingStatuses = true;
      this.getStatuses({
        visibility: "public",
        realStatus: ["open", "pending", "closed"],
        context:'order'
      }).then((statuses) => {
        if (statuses.length) {
          let data = [];
          for (let index in statuses) {
            let item = statuses[index];
            this.statuses.push({
              label: this.$t(`order.statuses.${item.status}`),
              value: item["@id"].match(/^\/statuses\/([a-z0-9-]*)$/)[1],
            });
          }
        }
        this.loadingStatuses = false;
      });
    },

    onRequest(props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let filter = props.filter;
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.text != null && this.filters.text.length > 0) {
        if (this.filters.text.length < 2) return;

        params["searchBy"] = this.filters.text;
      }

      if (this.filters.status != null && this.filters.status.value != -1) {
        params["status"] = this.filters.status.value;
      }

      if (this.filters.company != null) {
        params["myCompany"] = this.filters.company.id;
      }

      if (this.invoiceId !== null) {
        params["invoice.invoice"] = this.invoiceId;
      }

      params["order[alterDate]"] = "desc";

      this.getItems(params).then(() => {
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
      });
    },
  },
};
</script>
