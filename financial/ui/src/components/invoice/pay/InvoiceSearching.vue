<template>
  <div>
    <div class="col-xs-12 q-mb-md">
      <div class="row justify-end">
        <q-btn
          label="Adicionar despesa"
          icon="add"
          size="md"
          color="primary"
          class="q-ml-sm"
          @click="dialogs.expense.visible = true"
        />
      </div>
    </div>
    <Filters :filters="filters" @onRequest="onRequest" />
    <q-table
      flat
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
              :to="{ name: 'PayDetails', params: { id: props.row.id } }"
              :label="props.cols[0].value"
              :style="{ color: props.row.color_status }"
              class="full-width"
            />
          </q-td>
          <q-td key="tipo" :props="props">{{ props.cols[1].value }}</q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="dataVencimento" :props="props">{{
            props.cols[3].value
          }}</q-td>
          <q-td key="categoria" :props="props">{{ props.cols[4].value }}</q-td>
          <q-td key="fornecedor" :props="props">{{ props.cols[5].value }}</q-td>
          <q-td
            key="status"
            :props="props"
            :style="{ color: props.row.color_status }"
          >
            {{ $t(`invoice.statuses.${props.row.status}`) }}
          </q-td>
          <q-td key="preco" :props="props">{{ props.cols[7].value }}</q-td>
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
              {{ $t("finance.orders") }} da Fatura #{{ dialogs.orders.invoice }}
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
                    :label="`Ver ${$t('finance.order')} #${orderId}`"
                    :to="{
                      name: 'PurchasingOrderDetails',
                      params: {
                        id: orderId,
                      },
                    }"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.expense.visible">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Nova despesa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <CreateExpense @created="onRequest({ pagination, filters })" />
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
import CreateExpense from "../expense/CreateExpense";
import { date } from "quasar";
import Filters from "../../Common/Filters.vue";

export default {
  components: {
    CreateExpense,
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
    let statuses = [{ label: "Todos", value: -1 }];

    return {
      settings: Object.freeze({
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
            name: "description",
            align: "left",
            field: "description",
            label: this.$t("finance.description"),
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
            name: "categoria",
            field: "categoryName",
            align: "left",
            label: "Categoria",
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
      }),

      dialogs: {
        orders: {
          visible: false,
          items: [],
          invoice: null,
        },
        expense: {
          visible: false,
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
        rowsPerPage: 25,
        rowsNumber: 10,
      },
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "payInvoice/isLoading",
      error: "payInvoice/error",
      violations: "payInvoice/violations",
      items: "payInvoice/items",
      totalItems: "payInvoice/totalItems",
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
          orders.push(
            item.order[o].order["@id"].match(
              /^\/purchasing\/orders\/([a-z0-9-]*)$/
            )[1]
          );
        }

        data.push({
          "@id": item["@id"],
          id: item["@id"].match(/^\/finance\/pay\/([a-z0-9-]*)$/)[1],
          tipo: this.$t(item.invoice_type),
          pedidos: orders,
          description: item.description,
          color_status: item.status.color,
          dataVencimento: item.dueDate,
          fornecedor: `${item.order[0].order.provider.name} ${item.order[0].order.provider.alias}`,
          status: item.status.status,
          categoryName: item.categoryName,
          preco: item.price,
        });
      }

      this.data = data;
    },
  },

  methods: {
    ...mapActions({
      getItems: "payInvoice/getItems",
      reset: "payInvoice/reset",
      getStatuses: "payInvoice/getStatuses",
    }),

    formatDate(dateString) {
      if (dateString)
        return date.formatDate(
          date.extractDate(dateString, "DD/MM/YYYY"),
          "YYYY-MM-DD"
        );
      else return null;
    },

    seeOrdersList(ordersId, invoiceId) {
      this.dialogs.orders.items = ordersId;
      this.dialogs.orders.invoice = invoiceId;
      this.dialogs.orders.visible = true;
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
