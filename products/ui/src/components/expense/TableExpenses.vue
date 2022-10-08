<template>
  <div>
    <q-table
        :loading        ="isLoading"
        :data           ="items"
        :columns        ="settings.columns"
        :pagination.sync="pagination"
        @request        ="onRequest"
        row-key         ="id"
        style           ="min-height: 90vh;"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
    >
      <template v-slot:top>
        <div class="col-xs-12 q-mb-md">
          <div class="row justify-end">
            <q-btn
              :label="$t('Adicionar despesa')"
              icon  ="add"
              size  ="md"
              color ="primary"
              class ="q-ml-sm"
              @click="() => {
                dialogs.expense.id      = null;
                dialogs.expense.visible = true;
              }"
            />
          </div>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            <q-btn outline dense
              :label="`#${props.row.id}`"
              :style="{color:props.row.color_status}"
              class ="full-width"
              @click="() => {
                dialogs.expense.id      = props.row.id;
                dialogs.expense.visible = true;
              }"
            />
          </q-td>
          <q-td key="category"    :props="props">{{ props.row.category    }}</q-td>
          <q-td key="provider"    :props="props">{{ props.row.provider    }}</q-td>
          <q-td key="parcels"     :props="props">{{ props.row.parcels     }}</q-td>
          <q-td key="amount"      :props="props">{{ props.row.amount      }}</q-td>
          <q-td key="dueDate"     :props="props">{{ props.row.dueDate     }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="paymentDay"  :props="props">{{ props.row.paymentDay  }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="dialogs.expense.visible" @before-hide="reload">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center justify-end">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <FormExpense
            :id ="dialogs.expense.id"
            :api="api"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters }                      from 'vuex';
import Api                                 from '@controleonline/quasar-common-ui/src/utils/api';
import { formatDateYmdTodmY, formatMoney } from '@controleonline/quasar-common-ui/src/utils/formatter';
import FormExpense                         from './FormExpense';

const SETTINGS = {
  columns       : [
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      label : 'ID'
    },
    {
      name  : 'category',
      align : 'left',
      label : 'Categoria'
    },
    {
      name  : 'provider',
      align : 'left',
      label : 'Fornecedor'
    },
    {
      name  : 'parcels',
      align : 'left',
      label : 'Parcelas'
    },
    {
      name  : 'amount',
      align : 'left',
      label : 'Valor'
    },
    {
      name  : 'dueDate',
      align : 'left',
      label : 'Data vencimento'
    },
    {
      name  : 'description',
      align : 'left',
      label : 'Descrição'
    },
    {
      name  : 'paymentDay',
      align : 'left',
      label : 'Dia pagamento'
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    api: {
      type    : Api,
      required: true
    },
  },

  components: {
    FormExpense,
  },

  created() {
    if (this.myCompany !== null)
      this.onRequest({
        pagination: this.pagination
      });
  },

  data() {
    return {
      settings       : SETTINGS,
      items          : [],
      pagination     : {
        sortBy     : 'dueDate',
        descending : false,
        page       : 1,
        rowsPerPage: 30,
        rowsNumber : 10,
      },
      isLoading      : false,
      dialogs        : {
        expense: {
          id     : null,
          visible: false,
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.onRequest({
          pagination: this.pagination
        });
      }
    },
  },

  methods: {
    // store method
    getItems(params) {
      return this.api.private('company_expenses', { params })
        .then(response => response.json())
        .then(response => {
          return {
            members: response['hydra:member'],
            total  : response['hydra:totalItems'],
          };
        });
    },

    // store method
    delete(id) {
      /*
      let options = {
        method : 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify({ id }),
      };

      let endpoint = `customers/${this.id}/addresses`;
      return this.api.private(endpoint, options)
        .then(response => response.json())
        .then(data => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
      */
    },

    removeItem(item) {
      /*
      if (window.confirm(this.$t('Are you sure about to remove this element?'))) {
        item._bussy = true;

        this.delete(item.id)
          .then (data => {
            if (data) {
              this.cleanItem(item.id);
            }
          })
          .catch(error => {
            this.$emit('error', { message: error.message });
          })
          .finally(() => {
            item._bussy = false;
          });
      }
      */
    },

    cleanItem(id) {
      /*
      let item   = this.items.find(obj => obj['id'] == id);
      let indx   = this.items.indexOf(item);
      this.items = [...this.items.slice(0, indx), ...this.items.slice(indx + 1)];
      */
    },

    reload() {
      this.onRequest({
        pagination: this.pagination
      });
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let params = { itemsPerPage: rowsPerPage, page };
      if (this.myCompany != null) {
        params.company = this.myCompany.id;
      }
      params['order[dueDate]'] = 'ASC';

      this.isLoading = true;
      this.getItems(params)
        .then(data => {
          let _items = [];

          if (data.members.length) {
            for (let index in data.members) {
              _items.push({
                id         : data.members[index].id,
                category   : data.members[index].category.name,
                provider   : data.members[index].provider.name,
                order      : data.members[index].order.id,
                parcels    : data.members[index].parcels === null ? 'Recorrente' : data.members[index].parcels,
                amount     : formatMoney(data.members[index].amount, 'BRL'),
                dueDate    : formatDateYmdTodmY(data.members[index].dueDate),
                description: data.members[index].description,
                paymentDay : data.members[index].paymentDay,
                _bussy     : false,
              });
            }
          }

          this.items                 = _items;
          this.pagination.rowsNumber = data.total;
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
