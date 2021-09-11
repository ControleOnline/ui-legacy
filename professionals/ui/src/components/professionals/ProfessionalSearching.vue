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
      :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id"                :props="props">
          <q-btn outline dense
            :to   ="{
              name  : 'Professionals.Details',
              params: {
                id: props.row.id
              }
            }"
            :label="`#${props.row.id}`"
            class ="full-width"
          />
        </q-td>
        <q-td key="document" :props="props">{{ props.cols[1].value }}</q-td>
        <q-td key="name"     :props="props">{{ props.row.name      }}</q-td>
        <q-td key="alias"    :props="props">{{ props.row.alias     }}</q-td>
        <q-td key="email"    :props="props">{{ props.row.email     }}</q-td>
        <q-td key="phone"    :props="props">{{ props.cols[5].value }}</q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import Api                             from '@controleonline/quasar-common-ui/src/utils/api';
import { formatDocument, formatPhone } from '@controleonline/quasar-common-ui/src/utils/formatter';
import { mapGetters }                  from 'vuex';

const SETTINGS = {
  visibleColumns: [
    'id'      ,
    'document',
    'alias'   ,
    'name'    ,
    'email'   ,
    'phone'   ,
  ],
  columns       : [
    {
      name  : 'id',
      field : 'id',
      align : 'left',
      label : 'ID'
    },
    {
      name  : 'document',
      field : 'document',
      align : 'left',
      format: (val, row) => {
        return formatDocument(val);
      },
      label : 'Documento'
    },
    {
      name  : 'name',
      field : 'name',
      align : 'left',
      label : 'Nome'
    },
    {
      name : 'alias',
      field: 'alias',
      align: 'left',
      label: 'Sobrenome'
    },
    {
      name : 'email',
      field: 'email',
      align: 'left',
      label: 'E-mail'
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
  created() {
    this.onRequest({
      pagination: this.pagination
    });
  },

  data() {
    return {
      API            : new Api(this.$store.getters['auth/user'].token),
      settings       : SETTINGS,
      data           : [],
      isLoading      : false,
      searchBy       : '',
      pagination     : {
        sortBy     : 'document',
        descending : false,
        page       : 1,
        rowsPerPage: 10,
        rowsNumber : 10,
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
      user     : 'auth/user',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.onRequest({
          pagination: this.pagination,
        });
      }
    },
  },

  methods: {
    // store method
    getProfessionals(params) {
      return this.API.private('/trainers', { params })
        .then(response => response.json())
        .then(result => {
          return {
            members   : result.response.data.members,
            totalItems: result.response.data.total
          };
        });
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
      let params = { limit: rowsPerPage, page };

      if (this.myCompany) {
        params['company'] = this.myCompany.id;
      }

      this.getProfessionals(params)
        .then(data => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              'id'      : item.id,
              'document': item.document,
              'alias'   : item.alias,
              'name'    : item.name,
              'email'   : item.email,
              'phone'   : item.phone
            });
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
