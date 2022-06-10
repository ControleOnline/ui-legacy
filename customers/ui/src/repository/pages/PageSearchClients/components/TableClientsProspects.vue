<template>
  <div class="row q-col-gutter-md">
    <div v-if="isLoading" class="row col-12 q-col-gutter-md">
      <div v-for="n in 6" :key="n" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card>
          <q-item>
            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
              <q-item-label caption>
                <q-skeleton type="text" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div v-else v-for="client in data" :key="client.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <q-card class="column full-height" :class="client.active ? 'bg-red' : ''">
        <q-card-section class="col">
          <div class="row items-center justify-between">
            <div class="text-subtitle1 text-bold col">
              ID: #{{ client.id }}
            </div>
          </div>
          <div class="text-body2">
            <b>{{ client.people_type !== 'F' ? 'CNPJ:' : 'CPF:' }}</b> {{ client.cnpj }}
          </div>
          <div class="text-body2">
            <b>{{ client.people_type !== 'F' ? 'Nome fantasia:' : 'Nome completo' }}</b> {{ client.name }}
          </div>
          <div class="text-body2">
            <b>{{ client.people_type !== 'F' ? 'Razão social:' : 'Nome social:' }}</b> {{ client.alias }}
          </div>
          <div class="text-body2"><b>E-mail:</b> {{ client.email }}</div>
          <div class="text-body2"><b>Tel:</b> {{ client.phone }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="row q-pa-none">
          <div class="col-6 text-center">
            <q-btn @click="$emit('selected', client.id)" class="full-width q-py-xs" flat no-caps color="grey-9" icon="edit" label="Editar" />
          </div>

          <div class="col-6 text-center">
            <q-toggle v-model="client.enable" checked-icon="check" color="green" :label="!client.enable ? 'Desabilitado' : 'Habilitado'" unchecked-icon="clear" />
          </div>
        </q-card-actions>
      </q-card>
    </div>

    <div class="col-12">
      <q-card class="flex flex-center q-pa-md q-mt-md">
        <q-pagination
          v-model="page"
          :max-pages="6"
          :max="maxPages"
          :boundary-numbers="maxPages > 9"
          direction-links
        />
      </q-card>
    </div>
  </div>
</template>

<script>
import { date }                        from 'quasar';
import { formatDocument, formatPhone } from '@controleonline/quasar-common-ui/src/utils/formatter';
import Api                             from '@controleonline/quasar-common-ui/src/utils/api';

const SETTINGS = {
  visibleColumns: [
    'info',
    'id'   ,
    'cnpj' ,
    'alias',
    'name' ,
    'email',
    'phone',
    'actions',
  ],
  columns       : [
    {
      name: 'info',
      field: 'info',
      align: 'left',
      label: 'Info'
    },
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      label : 'ID'
    },
    {
      name  : 'cnpj',
      field : 'cnpj',
      align : 'left',
      format: (val, row) => {
        return formatDocument(val);
      },
      label : 'CNPJ'
    },
    {
      name  : 'alias',
      field : 'alias',
      align : 'left',
      label : 'Nome fantasia'
    },
    {
      name : 'name',
      field: 'name',
      align: 'left',
      label: 'Razão social'
    },
    {
      name : 'email',
      field: 'email',
      align: 'left',
      label: 'Email'
    },
    {
      name  : 'phone',
      field : 'phone',
      align : 'left',
      format: (val, row) => {
        return formatPhone(val);
      },
      label : 'Telefone'
    },
    {
      name: 'actions',
      field: 'actions',
      align: 'left',
      label: 'Ações'
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    api     : {
      type    : Api,
      required: true
    },
    fromDate: {
      type    : String,
      required: false,
    },
    toDate  : {
      type    : String,
      required: false,
    },
    searchBy: {
      type    : String,
      required: false,
    },
  },

  computed: {
    page: {
      get() {
        return this.$route.query.page || 1;
      },
      set(value){
        this.$router.push({ ...this.$route.name, query: { ...this.$route.query, page: value }})
      }
    },
  },

  created() {
    this.onRequest({
      pagination: this.pagination
    });
  },

  data() {
    return {
      maxPages: 5,
      settings       : SETTINGS,
      data           : [],
      isLoading      : false,
      pagination     : {
        sortBy     : 'cnpj',
        descending : false,
        page       : 1,
        rowsPerPage: 8,
        rowsNumber : 10,
      },
    };
  },

  watch: {
    fromDate() {
      this.onRequest({
        pagination: this.pagination
      });
    },

    toDate  () {
      this.onRequest({
        pagination: this.pagination
      });
    },

    searchBy(text) {
      this.onRequest({
        pagination: this.pagination
      });
    },

    page(value) {
      this.pagination = {
        ...this.pagination,
        page: value
      };

      this.onRequest({
        pagination: this.pagination
      });
    },
  },

  methods: {
    // store method
    getCustomers(params) {
      return this.api.private('/customers', { params })
        .then(response => response.json())
        .then(result => {
          return {
            members   : result.response.data.members,
            totalItems: result.response.data.total
          };
        });
    },

    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'DD-MM-YYYY'), 'YYYY-MM-DD');
    },

    reload() {
      this.onRequest({
        pagination: this.pagination
      });
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      this.isLoading = true;

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let params = {};

      params['type']  = 'prospect';
      params['from']  = this.formatDate(this.fromDate);
      params['to']    = this.formatDate(this.toDate  );
      params['page']  = this.page;
      params['limit'] = rowsPerPage;

      if (this.searchBy.length > 1)
        params['searchBy'] = this.searchBy;

      this.$emit('before', params);

      this.getCustomers(params)
        .then(data => {
          let _data = [];

          for (let index in data.members) {
            let item   = data.members[index];
            let client = {};

            client = {
              'id'   : item.id,
              'cnpj' : item.document,
              'alias': item.alias,
              'name' : item.name,
              'email': item.email,
              'phone': item.phone,
              'enable': item.enable,
              'people_type': item.people_type,
            };

            _data.push(client);
          }

          this.data                   = _data;
          this.pagination.page        = this.page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
          this.pagination.rowsNumber  = data.totalItems;
          this.maxPages = Math.ceil(data.totalItems / 8);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>