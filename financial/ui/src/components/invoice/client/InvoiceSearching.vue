<template>
  <div>
    <q-table
        :loading        ="isLoading"
        :data           ="data"
        :columns        ="settings.columns"
        :pagination.sync="pagination"
        @request        ="onRequest"
        row-key         ="id"
        :visible-columns="settings.visibleColumns"
        style           ="min-height: 90vh;"
    >
      <template v-slot:top v-if="search === true">
        <div class="col-xs-12 q-pb-md text-h6">
          Faturas
        </div>
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-input stack-label
              label   ="Buscar por"
              debounce="1000"
              v-model ="filters.text"
              class   ="full-width"
          />
        </div>
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <q-select stack-label
              label   ="Status da fatura"
              v-model ="filters.status"
              :options="statuses"
              class   ="full-width"
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
          <q-td key="id"             :props="props">
            <q-btn outline dense
              :to   ="{ name: 'ClientInvoiceDetails', params: { id: props.row.id } }"
              :label="props.cols[0].value"
              :style="{color:props.row.color_status}"              
              class ="full-width"
            />
          </q-td>
          <q-td key="pedidos"        :props="props">
            <q-btn outline dense
              :label="props.row.pedidos.length > 1 ? `${props.row.pedidos.length} Pedidos` : '1 Pedido'"
              color ="primary"
              @click="seeOrdersList(props.row.pedidos, props.row.id)"
              class ="full-width"
            />
          </q-td>
          <q-td key="dataVencimento" :props="props">{{ props.cols[2].value }}</q-td>
          <q-td key="fornecedor"     :props="props">{{ props.cols[3].value }}</q-td>
          <q-td key="status"         :props="props" :style="{color:props.row.color_status}">
            {{ $t(`invoice.statuses.${props.row.status}`) }}
          </q-td>
          <q-td key="preco"          :props="props">{{ props.cols[5].value }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogs.orders.visible" transition-show="scale" transition-hide="scale">
      <q-card class="text-white" style="background-color: #00519b; width: 300px">
        <q-card-section>
          <div class="row items-center">
            <div class="text-h6">Pedidos da Fatura #{{ dialogs.orders.invoice }}</div>
            <q-space />
            <q-btn icon="close" color="white" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table>
            <tbody>
              <tr
                v-for="(orderId, index) in dialogs.orders.items"
                :key ="index"
              >
                <td class="text-center">
                  <q-btn flat
                    color ="primary"
                    :label="`Ver pedido #${orderId}`"
                    :to   ="{ name: 'ClientOrderDetails', params: { id: orderId } }"
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
import { mapActions, mapGetters } from 'vuex';
import { formatMoney  }           from '@controleonline/quasar-common-ui/src/utils/formatter';
import { date }                   from 'quasar';

const SETTINGS = {
  visibleColumns: [
    'id'            ,
    'pedidos'       ,
    'dataVencimento',
    'fornecedor'    ,
    'status'        ,
    'preco'         ,
  ],
  columns       : [
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      format: (val, row) => {
        return `#${val}`;
      },
      label : 'ID'
    },
    {
      name : 'pedidos',
      align: 'left',
      field: 'pedidos',
      label: 'Pedidos'
    },
    {
      name  : 'dataVencimento',
      field : 'dataVencimento',
      align : 'left',
      format: (val, row) => {
        return date.formatDate(val + 'T23:59:00', 'DD/MM/YYYY')
      },
      label : 'Data vencimento'
    },
    {
      name : 'fornecedor',
      field: 'fornecedor',
      align: 'left',
      label: 'Fornecedor'
    },
    {
      name  : 'status',
      field : 'status',
      align : 'left',
      label : 'Status'
    },
    {
      name  : 'preco',
      field : 'preco',
      align : 'left',
      format: (val, row) => {
        return formatMoney(val, 'BRL', 'pt-br');
      },
      label : 'Preço'
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    search : {
      type    : Boolean,
      required: false,
      default : true,
    },
    orderId: {
      type    : String,
      required: false,
      default : null,
    },
  },

  created() {
    if (this.myCompany !== null) {
      this.filters.company = this.myCompany;
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    }
    this.requestStatuses();
  },

  beforeDestroy() {
    this.reset();
  },

  data() {
    let statuses = [
      { 'label': 'Todos', 'value': -1 },
    ];

    return {
      settings       : SETTINGS,
      statuses       : statuses,
      loadingStatuses: false,
      dialogs        : {
        orders: {
          visible: false,
          items  : [],
          invoice: null,
        },
      },
      data           : [],
      filters        : {
        text   : null,
        status : statuses[0],
        company: null,
      },
      pagination     : {
        sortBy     : 'dataVencimento',
        descending : false,
        page       : 1,
        rowsPerPage: 10,
        rowsNumber : 10,
      },
    }
  },

  computed: {
    ...mapGetters({
      isLoading : 'payInvoice/isLoading' ,
      error     : 'payInvoice/error'     ,
      violations: 'payInvoice/violations',
      items     : 'payInvoice/items'     ,
      totalItems: 'payInvoice/totalItems',
      myCompany : 'people/currentCompany',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.onRequest({
          pagination: this.pagination,
          filter    : this.filters,
        });
      }
    },

    totalItems(val) {
      this.pagination.rowsNumber = val;
    },

    items(items) {
      if (!items)
        return;

      let data = [];

      for (let i in items) {
        let item   = items[i];
        let orders = [];

        for (let o in item.order) {
          orders.push(
            item.order[o].order['@id'].match(/^\/purchasing\/orders\/([a-z0-9-]*)$/)[1]
          );
        }

        data.push({
          '@id'           : item['@id'],
          'id'            : item['@id'].match(/^\/finance\/pay\/([a-z0-9-]*)$/)[1],
          'pedidos'       : orders,
          'color_status'  : item.status.color,
          'dataVencimento': item.dueDate,
          'fornecedor'    : item.order[0].order.provider.alias,
          'status'        : item.status.status,
          'preco'         : item.price,
        });
      }

      this.data = data;
    },

    'filters.text'() {
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    },

    'filters.status'() {
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    },
  },

  methods: {
    ...mapActions({
      getItems   : 'payInvoice/getItems'   ,
      reset      : 'payInvoice/reset'      ,
      getStatuses: 'payInvoice/getStatuses',
    }),

    seeOrdersList(ordersId, invoiceId) {
      this.dialogs.orders.items   = ordersId;
      this.dialogs.orders.invoice = invoiceId;
      this.dialogs.orders.visible = true;
    },

    requestStatuses() {
      this.loadingStatuses = true;
      this.getStatuses({
        context: "invoice",
        'visibility': 'public',
        'realStatus': ['open', 'pending', 'canceled', 'closed'],
      })
        .then(statuses => {
          if (statuses.length) {
            let data = [];
            for (let index in statuses) {
              let item = statuses[index];
              this.statuses.push({
                'label': this.$t(`invoice.statuses.${item.status}`),
                'value': item['@id'].match(/^\/statuses\/([a-z0-9-]*)$/)[1],
              });
            }
          }
          this.loadingStatuses = false;
        });
    },

    onRequest(props) {
      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let filter = props.filter;
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.text != null && this.filters.text.length > 0) {
          if (this.filters.text.length < 2)
            return;

          params['searchBy'] = this.filters.text;
      }

      if (this.filters.status != null && this.filters.status.value != -1) {
        params['status'] = this.filters.status.value;
      }
      else {
        params['status.realStatus'] = ['open', 'pending'];
      }

      if (this.filters.company != null) {
        params['myCompany'] = this.filters.company.id;
      }

      if (this.orderId !== null) {
        params['order.order'] = this.orderId;
      }

      params['invoice[dueDate]'] = 'desc';

      this.getItems(params)
        .then(() => {
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
        });
    },
  },
};
</script>