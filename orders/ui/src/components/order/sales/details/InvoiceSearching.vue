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
      <template v-slot:top>
        <div class="col-xs-12 q-pb-md text-h6">Faturas</div>
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
            props.cols[2].value
          }}</q-td>
          <q-td key="fornecedor" :props="props">{{ props.cols[3].value }}</q-td>
          <q-td
            key="status"
            :props="props"
            :style="{ color: props.row.color_status }"
          >
            {{ $t(`invoice.statuses.${props.row.status}`) }}
          </q-td>
          <q-td key="preco" :props="props">{{ props.cols[5].value }}</q-td>
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

const SETTINGS = {
  visibleColumns: [
    "id",
    "pedidos",
    "dataVencimento",
    "fornecedor",
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
      name: "fornecedor",
      field: "fornecedor",
      align: "left",
      label: "Fornecedor",
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
    orderId: {
      type: String,
      required: false,
      default: null,
    },
  },

  created() {
    if (this.myCompany !== null) {
      this.onRequest({
        pagination: this.pagination,
        myCompany: this.myCompany,
      });
    }
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    return {
      settings: SETTINGS,
      dialogs: {
        orders: {
          visible: false,
          items: [],
          invoice: null,
        },
      },
      data: [],
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
        this.onRequest({
          pagination: this.pagination,
          myCompany: company,
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
          orders.push(
            item.order[o].order["@id"].match(
              /^\/sales\/orders\/([a-z0-9-]*)$/
            )[1]
          );
        }

        data.push({
          "@id": item["@id"],
          id: item["@id"].match(/^\/finance\/receive\/([a-z0-9-]*)$/)[1],
          pedidos: orders,
          color_status: item.invoiceStatus.color,
          dataVencimento: item.dueDate,
          fornecedor: item.order[0].order.provider.alias,
          status: item.invoiceStatus.status,
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

    onRequest(props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let myCompany = props.myCompany;
      let params = { itemsPerPage: rowsPerPage, page };

      if (myCompany) {
        params["myCompany"] = myCompany.id;
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
