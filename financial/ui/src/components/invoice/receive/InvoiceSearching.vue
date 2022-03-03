<template>
  <div>
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
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
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
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
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
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            <q-btn
              outline
              dense
              :to="{ name: 'ReceiveDetails', params: { id: props.row.id } }"
              :label="props.cols[0].value"
              :style="{ color: props.row.color_status }"
              class="full-width"
            />
          </q-td>
          <q-td key="tipo" :props="props">{{ props.cols[1].value }}</q-td>
          <q-td key="pedidos" :props="props">
            <q-btn
              outline
              dense
              :label="
                props.row.pedidos.length > 1
                  ? `${props.row.pedidos.length} Pedidos`
                  : '1 Pedido'
              "
              color="primary"
              @click="seeOrdersList(props.row.pedidos, props.row.id)"
              class="full-width"
            />
          </q-td>
          <q-td key="dataVencimento" :props="props">{{
            props.cols[3].value
          }}</q-td>
          <q-td key="client" :props="props">{{ props.cols[4].value }}</q-td>
          <q-td
            key="status"
            :props="props"
            :style="{ color: props.row.color_status }"
          >
            {{ $t(`invoice.statuses.${props.row.status}`) }}
          </q-td>
          <q-td key="preco" :props="props">{{ props.cols[6].value }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog
      v-model="dialogs.orders.visible"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="text-white"
        style="background-color: #00519b; width: 300px"
      >
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
                  <q-btn
                    flat
                    color="primary"
                    :label="`Ver pedido #${orderId}`"
                    :to="{ name: 'OrderDetails', params: { id: orderId } }"
                  />
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
import { mapActions, mapGetters } from "vuex";
import {
  formatMoney,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import DataFilter from "@controleonline/quasar-common-ui/src/components/common/DataFilter.vue";
import { date } from "quasar";

const SETTINGS = {
  visibleColumns: [
    "id",
    "tipo",
    "pedidos",
    "dataVencimento",
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
    DataFilter,
  },
  props: {
    search: {
      type: Boolean,
      required: false,
      default: true,
    },
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
    this.requestStatuses();
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    let statuses = [{ label: "Selecione um status", value: -1 }];

    return {
      settings: SETTINGS,
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

        if (!clientName) {
          clientName = item.order[0].order.client.alias;
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
            item.order[0].order.client.alias.toLowerCase().trim()
        ) {
          clientName += " " + item.order[0].order.client.alias;
        }

        data.push({
          "@id": item["@id"],
          id: item["@id"].replace(/[^0-9]/g, ""),
          tipo: this.$t(item.invoice_type),
          pedidos: orders,
          color_status: item.invoiceStatus.color,
          dataVencimento: item.dueDate,
          client: clientName,
          status: item.invoiceStatus.status,
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
    "filters.orderType"() {
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
      getItems: "receiveInvoice/getItems",
      reset: "receiveInvoice/reset",
      getStatuses: "receiveInvoice/getStatuses",
    }),

    seeOrdersList(ordersId, invoiceId) {
      this.dialogs.orders.items = ordersId;
      this.dialogs.orders.invoice = invoiceId;
      this.dialogs.orders.visible = true;
    },

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
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
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

      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let filter = props.filter;
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
          params["invoiceStatus"] = this.filters.status.value;
        } else {
          if (this.filters.status.value == -1) {
            params["invoiceStatus.realStatus"] = ["open", "pending"];
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
