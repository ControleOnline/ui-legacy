<template>
  <q-table
      :loading        ="isLoading"
      :data           ="data"
      :columns        ="settings.columns"
      :pagination.sync="pagination"
      @request        ="onRequest"
      row-key         ="id"
      :visible-columns="settings.visibleColumns"
      style           ="min-height: 90vh;"
      :flat           ="true"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id"                :props="props">
          <q-btn outline dense
            :label="`#${props.row.id}`"
            :style="{color:props.row.color_status}"
            class ="full-width"
            @click="$emit('selected', props.row.id)"
          />		  
        </q-td>
        <q-td key="cnpj"  :props="props">{{ props.cols[1].value }}</q-td>
        <q-td key="alias" :props="props">{{ props.row.alias     }}</q-td>
        <q-td key="name"  :props="props">{{ props.row.name      }}</q-td>
        <q-td key="email" :props="props">{{ props.row.email     }}</q-td>
        <q-td key="phone" :props="props">{{ props.cols[5].value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { date }                        from 'quasar';
import { formatDocument, formatPhone } from '@controleonline/quasar-common-ui/src/utils/formatter';
import Api                             from '@controleonline/quasar-common-ui/src/utils/api';

const SETTINGS = {
  visibleColumns: [
    'id'   ,
    'cnpj' ,
    'alias',
    'name' ,
    'email',
    'phone',
  ],
  columns       : [
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

  mounted() {
    this.onRequest({
      pagination: this.pagination
    });
  },

  data() {
    return {
      settings       : SETTINGS,
      data           : [],
      isLoading      : false,
      pagination     : {
        sortBy     : 'cnpj',
        descending : false,
        page       : 1,
        rowsPerPage: 30,
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
  },

  methods: {

    getProviders(params) {
      params.table = "provider";
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

    /**
     * @fix load data once
     * @fix load data passing myProvider param
     */
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

      params['type']  = 'inactive';
      params['from']  = this.formatDate(this.fromDate);
      params['to']    = this.formatDate(this.toDate  );
      params['page']  = page;
      params['limit'] = rowsPerPage;

      if (this.searchBy.length > 1)
        params['searchBy'] = this.searchBy;

      this.$emit('before', params);

      this.getProviders(params)
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
              'phone': item.phone
            };

            _data.push(client);
          }

          this.data                   = _data;
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
          this.pagination.rowsNumber  = data.totalItems;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>