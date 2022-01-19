<template>
  <div>
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
      <template v-slot:top v-if="search === true">
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
          <DataFilter
            :fromDate="fromDate"
            :toDate="toDate"
            :showButton="false"
            @dateChanged="dateChanged"
          />
        </div>
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
      </template>

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
          <q-td key="pedidos" :props="props">
            <q-btn
              outline
              dense
              :label="
                props.row.pedidos.length > 1
                  ? `${props.row.pedidos.length} ${$t('finance.orders')}`
                  : `1 ${$t('finance.order')}`
              "
              color="primary"
              @click="seeOrdersList(props.row.pedidos, props.row.id)"
              class="full-width"
            />
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
import DataFilter from "@controleonline/quasar-common-ui/src/components/common/DataFilter.vue";
import { date } from "quasar";

export default {
  components: {
    CreateExpense,
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
    let statuses = [{ label: "Todos", value: -1 }];

    return {
      fromDate: date.formatDate(
        date.subtractFromDate(Date.now(), { month: 1 }),
        "DD/MM/YYYY"
      ),
      toDate: date.formatDate(Date.now(), "DD/MM/YYYY"),
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
            name: "pedidos",
            align: "left",
            field: "pedidos",
            label: this.$t("finance.orders"),
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
      statuses: statuses,
      loadingStatuses: false,
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
        text: null,
        status: statuses[0],
        company: null,
        date: {
          from: null,
          to: null,
        },
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
          color_status: item.invoiceStatus.color,
          dataVencimento: item.dueDate,
          fornecedor: `${item.order[0].order.provider.name} ${item.order[0].order.provider.alias}`,
          status: item.invoiceStatus.status,
          categoryName: item.categoryName,
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
      getItems: "payInvoice/getItems",
      reset: "payInvoice/reset",
      getStatuses: "payInvoice/getStatuses",
    }),

    formatDate(dateString) {
      return date.formatDate(
        date.extractDate(dateString, "DD/MM/YYYY"),
        "YYYY-MM-DD"
      );
    },

    dateChanged(item) {
      this.filters.date = item;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
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
          for (let index in statuses) {
            let item = statuses[index];
            this.statuses.push({
              label: this.$t(`invoice.statuses.${item.status}`),
              value: item["@id"].match(/^\/invoice_statuses\/([a-z0-9-]*)$/)[1],
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
      params.from = this.formatDate(filter.date.from);
      params.to = this.formatDate(filter.date.to);

      if (this.filters.text != null && this.filters.text.length > 0) {
        if (this.filters.text.length < 2) return;

        params["searchBy"] = this.filters.text;
      } else {
        if (this.filters.status != null && this.filters.status.value != -1) {
          params["invoiceStatus"] = this.filters.status.value;
        } else {
          params["invoiceStatus.realStatus"] = ["open", "pending"];
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
