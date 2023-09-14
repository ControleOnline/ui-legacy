<template>
  <q-page padding>
    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Cadastro de Cupom</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section> 
          
          
          <CreateCoupon @created="onRequest({ pagination, filters })" />



        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table
      :loading="isLoading"
      :rows="data"
      :columns="settings.columns"
      :pagination.sync="pagination"
      @request="onRequest"
      row-key="id"
      :visible-columns="settings.visibleColumns"
      style="min-height: 90vh"
    >
      <template v-slot:top v-if="search === true">
        <div class="col-xs-9 q-pb-md text-h6">Cupons</div>
        <div class="col-xs-3">
          <div class="row justify-end q-mb-md">
            <q-btn
              label="Cadastrar"
              icon="add"
              size="md"
              color="primary"
              class="q-ml-sm"
              @click="dialog = !dialog"
            />
          </div>
        </div>
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-input
      dense
      outlined
            stack-label
            label="Buscar por"
            debounce="1000"
            v-model="filters.text"
            class="full-width"
          />
        </div>
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-select dense outlined 
            stack-label
            label="Status do pedido"
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
        <div class="col-sm-12 col-xs-12">
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
          <q-td key="id" :props="props"> {{ props.row.id }} </q-td>
          <q-td key="code" :props="props">{{ props.row.code }}</q-td>
          <q-td key="type" :props="props">
            {{ props.cols[2].value }}
          </q-td>
          <q-td key="value" :props="props"> {{ props.cols[3].value }} </q-td>
          <q-td key="total" :props="props">
            {{ props.cols[4].value }}
          </q-td>
          <q-td key="order" :props="props">
            <q-btn
              v-if="props.row.order"
              outline
              dense
              :to="{
                name: 'OrderDetails',
                params: { id: props.row.order.id },
              }"
              :label="`#${props.row.order.id}`"
            />
          </q-td>
          <q-td key="discountDate" :props="props">{{
            props.cols[6].value
          }}</q-td>
          <q-td key="discountStartDate" :props="props">{{
            props.cols[7].value
          }}</q-td>
          <q-td key="discountEndDate" :props="props">{{
            props.cols[8].value
          }}</q-td>
          <q-td key="client" :props="props">
            <q-btn
              v-if="props.row.client"
              outline
              dense
              :to="{
                name: 'ClientsDetails',
                params: { id: props.row.client.id },
              }"
              :label="`#${props.row.client.id} - ${props.cols[9].value}`"
            />
          </q-td>
          <q-td key="creator" :props="props">
            <q-btn
              v-if="props.row.creator"
              outline
              dense
              :to="{
                name: 'ClientsDetails',
                params: { id: props.row.creator.id },
              }"
              :label="`#${props.row.creator.id} - ${props.cols[10].value}`"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import DataFilter from "@controleonline/quasar-common-ui/src/components/Common/DataFilter.vue";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";
import CreateCoupon from "./CreateCoupon.vue";

const SETTINGS = {
  visibleColumns: [
    "id",
    "code",
    "type",
    "value",
    "total",
    "order",
    "discountDate",
    "discountStartDate",
    "discountEndDate",
    "client",
    "creator",
  ],
  columns: [
    {
      name: "id",
      field: "id",
      align: "left",
      label: "ID",
    },
    {
      name: "code",
      field: "code",
      align: "left",
      label: "Cupon",
      format: (val, row) => {
        return val ? "#" + val : "";
      },
    },
    {
      name: "type",
      field: "type",
      align: "left",
      label: "Tipo de Desconto",
    },
    {
      name: "value",
      field: "value",
      align: "left",
      label: "Valor de desconto",
      format: (val, row) => {
        return val
          ? row.type == "percentage"
            ? parseFloat(val).toFixed(2) + " %"
            : formatMoney(val, "BRL", "pt-br")
          : "";
      },
    },
    {
      name: "total",
      field: "total",
      align: "left",
      format: (val, row) => {
        return formatMoney(val, "BRL", "pt-br");
      },
      label: "Desconto Total",
    },
    {
      name: "order",
      field: "order",
      align: "left",
      label: "Pedido",
    },
    {
      name: "discountDate",
      field: "discountDate",
      align: "left",
      format: (val, row) => {
        return date.formatDate(val, "DD/MM/YYYY");
      },
      label: "Data do Desconto",
    },
    {
      name: "discountStartDate",
      field: "discountStartDate",
      align: "left",
      format: (val, row) => {
        if (val) {
          return date.formatDate(val, "DD/MM/YYYY");
        }
        return "--";
      },
      label: "Inicio da Promoção",
    },
    {
      name: "discountEndDate",
      field: "discountEndDate",
      align: "left",
      format: (val, row) => {
        return date.formatDate(val, "DD/MM/YYYY HH:mm:ss");
      },
      label: "Fim da Promoção",
    },

    {
      name: "client",
      field: "client",
      align: "left",
      label: "Cliente",
      format: (val, row) => {
        return val.name || val.alias;
      },
    },
    {
      name: "creator",
      field: "creator",
      align: "left",
      label: "Criador",
      format: (val, row) => {
        return val.name || val.alias;
      },
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  components: {
    DataFilter,
    CreateCoupon,
  },
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
      dialog: false,
      settings: SETTINGS,
      data: [],
      statuses: statuses,
      filters: {
        text: null,
        status: statuses[0],
        company: null,
        defaultCompany: null,
        from: "",
        to: "",
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
      isLoading: "salesOrder/isLoading",
      error: "salesOrder/error",
      violations: "salesOrder/violations",
      items: "coupon/items",
      totalItems: "coupon/totalItems",
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
        data.push({
          "@id": item["@id"],
          id: item["@id"].match(/^\/coupon\/([a-z0-9-]*)$/)[1],
          client: item.client,
          code: item.code,
          config: item.config,
          creator: item.creator,
          discountDate: this.formatDate(item.discountDate),
          discountEndDate: this.formatDate(item.discountEndDate),
          discountStartDate: this.formatDate(item.discountStartDate),
          order: item.order,
          type: item.type,
          value: item.value,
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

    "filters.from"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.to"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  },

  methods: {
    ...mapActions({
      getItems: "coupon/getItems",
      reset: "coupon/reset",
    }),
    dateChanged(date) {
      if (date.from || date.to) {
        this.filters.from = date.from;
        this.filters.to = date.to;
        this.onRequest({
          pagination: this.pagination,
          filter: this.filters,
        });
      }
    },
    formatDate(dateString) {
      if (dateString)
        return date.formatDate(
          date.extractDate(dateString, "DD/MM/YYYY"),
          "YYYY-MM-DD"
        );
      else return null;
    },
    requestStatuses() {
      this.loadingStatuses = true;

      let data = [];
      this.statuses.push(
        {
          label: this.$t(`Open`),
          value: "open",
        },
        {
          label: this.$t(`Closed`),
          value: "closed",
        },
        {
          label: this.$t(`Expired`),
          value: "expired",
        },
        {
          label: this.$t(`Not Expired`),
          value: "not_expired",
        }
      );

      this.loadingStatuses = false;
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
      params.fromDate = this.formatDate(this.filters.from) || "";
      params.toDate = this.formatDate(this.filters.to) || "";

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
