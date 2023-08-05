<template>
  <div>
    <Filters :filters="filters" @onRequest="onRequest" />
    <q-table dense :loading="isLoading" :data="data" :columns="settings.columns" :pagination.sync="pagination"
      @request="onRequest" row-key="id" :visible-columns="settings.visibleColumns" style="min-height: 90vh">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            <q-btn outline dense :to="{ name: 'ReceiveDetails', params: { id: props.row.id } }"
              :label="props.cols[0].value" :style="{ color: props.row.color_status }" class="full-width" />
          </q-td>
          <q-td key="tipo" :props="props">{{ props.cols[1].value }}</q-td>
          <q-td key="pedidos" :props="props">
            <q-btn outline dense :label="
              props.row.pedidos.length > 1
                ? `${props.row.pedidos.length} Pedidos`
                : '1 Pedido'
            " color="primary" @click="seeOrdersList(props.row.pedidos, props.row.id)" class="full-width" />
          </q-td>
          <q-td key="dataVencimento" :props="props">{{
              props.cols[3].value
          }}</q-td>
          <q-td key="payer" :props="props">{{ props.cols[4].value }}</q-td>
          <q-td key="client" :props="props">{{ props.cols[5].value }}</q-td>
          <q-td key="status" :props="props" :style="{ color: props.row.color_status }">
            {{ translate(`invoice.statuses.${props.row.status}`) }}
          </q-td>
          <q-td key="preco" :props="props">{{ props.cols[7].value }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogs.orders.visible" transition-show="scale" transition-hide="scale">
      <q-card class="text-white" style="background-color: #00519b; width: 300px">
        <q-card-section>
          <div class="row items-center">
            <div class="text-h6">
              Pedidos da Fatura #{{ dialogs.orders.invoice }}
            </div>
            <q-space />
            <q-btn icon="close" color="white" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table>
            <tbody>
              <tr v-for="(orderId, index) in dialogs.orders.items" :key="index">
                <td class="text-center">
                  <q-btn flat color="primary" :label="`Ver pedido #${orderId}`"
                    :to="{ name: 'OrderDetails', params: { id: orderId } }" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import {
formatDateYmdTodmY,
formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import { mapActions, mapGetters } from "vuex";

import { date } from "quasar";
import Filters from "../../common/Filters.vue";

const SETTINGS = {
  visibleColumns: [
    "id",
    "tipo",
    "pedidos",
    "dataVencimento",
    "payer",
    "client",
    "status",
    "preco",
  ],
  columns: [
    {
      name: "id",
      field: "id",
      align: "left",
      format: (val, row) => {
        return `#${val}`;
      },
      label: "ID",
    },
    {
      name: "tipo",
      align: "left",
      field: "tipo",
      label: "Tipo",
    },
    {
      name: "pedidos",
      align: "left",
      field: "pedidos",
      label: "Pedidos",
    },
    {
      name: "dataVencimento",
      field: "dataVencimento",
      align: "left",
      format: (val, row) => {
        return formatDateYmdTodmY(val);
      },
      label: "Data vencimento",
    },
    {
      name: "payer",
      field: "payer",
      align: "left",
      label: "Pagador",
    },
    {
      name: "client",
      field: "client",
      align: "left",
      label: "Cliente",
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
  components: {
    Filters,
  },
  props: {
    orderId: {
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
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    let statuses = [{ label: "Selecione um status", value: -1 }];

    return {
      settings: SETTINGS,
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
      dialogs: {
        orders: {
          visible: false,
          items: [],
          invoice: null,
        },
      },
      data: [],
      filters: {
        orderType: {
          label: "Todos",
          value: null,
        },
        date: {
          from: "",
          to: "",
        },
        text: null,
        status: statuses[0],
        company: null,
      },
      pagination: {
        sortBy: "dataVencimento",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "receiveInvoice/isLoading",
      error: "receiveInvoice/error",
      violations: "receiveInvoice/violations",
      items: "receiveInvoice/items",
      totalItems: "receiveInvoice/totalItems",
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

      for (let i in items) {
        let item = items[i];
        let orders = [];

        for (let o in item.order) {
          orders.push(item.order[o].order["@id"].replace(/[^0-9]/g, ""));
        }

        var clientName = item.order[0].order.client.name;
        var payerName = item.order[0].order.payer.name;

        data.push({
          "@id": item["@id"],
          id: item["@id"].replace(/[^0-9]/g, ""),
          tipo: this.translate(item.invoice_type),
          pedidos: orders,
          color_status: item.status.color,
          dataVencimento: item.dueDate,
          payer: payerName,
          client: clientName,
          status: item.status.status,
          preco: item.price,
        });
      }

      this.data = data;
    },
  },

  methods: {
    ...mapActions({
      getItems: "receiveInvoice/getItems",
      reset: "receiveInvoice/reset",
      getStatuses: "receiveInvoice/getStatuses",
    }),

    seeOrdersList(ordersId, invoiceId) {
      this.dialogs.orders.items = ordersId;
      this.dialogs.orders.invoice = invoiceId;
      this.dialogs.orders.visible = true;
    },

    formatDate(dateString) {
      if (dateString)
        return date.formatDate(
          date.extractDate(dateString, "DD/MM/YYYY"),
          "YYYY-MM-DD"
        );
      else return null;
    },
    onRequest(props) {
      if (this.isLoading) return;

      let pagination = props ? props.pagination : this.pagination;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } = pagination;

      let params = { itemsPerPage: rowsPerPage, page };

      params.from = this.formatDate(this.filters.date.from) || "";
      params.to = this.formatDate(this.filters.date.to) || "";
      params.orderType = this.filters.orderType.value || "";

      if (this.filters.text != null && this.filters.text.length > 0) {
        if (this.filters.text.length < 2) return;

        params["searchBy"] = this.filters.text;
      }

      if (this.filters.status != null) {
        if (this.filters.status.value > 0) {
          params["status"] = this.filters.status.value;
        } else {
          if (this.filters.status.value == -1) {
            params["status.realStatus"] = ["open", "pending"];
          }
        }
      }

      if (this.filters.company != null) {
        params["myCompany"] = this.filters.company.id;
      }

      if (this.orderId !== null) {
        params["order.order"] = this.orderId;
      }

      params["invoice[dueDate]"] = "desc";

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
