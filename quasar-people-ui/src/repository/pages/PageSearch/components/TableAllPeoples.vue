<template>
  <div class="row justify-center q-col-gutter-md">
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

    <div v-else  class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <template v-if="data.length" v-for="people in data" :key="people.id">
        <q-card class="column full-height" :class="people.active ? 'bg-red' : ''">
          <q-card-actions align="center" class="row q-pa-none">
            <div class="col-12 text-center text-bold">
              <q-icon v-if="people.people_type == 'F'" name="person" class="icon" color="blue" />
              <q-icon v-else name="factory" class="icon" color="green" />
              {{ people.name }}
            </div>
          </q-card-actions>
          <q-separator />
          <q-card-section class="col">
            <div v-if="people.name != people.alias" class="text-body2">
              {{ people.alias }}
            </div>
            <div v-if="people.cnpj" class="text-body2">
              {{ people.cnpj }}
            </div>
            <div class="text-body2 text-bold">
              <q-icon name="phone" />
              {{ people.phone }}
            </div>
            <div class="text-body2">
              <q-icon name="mail" /> {{ people.email }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="row q-pa-none">
            <div class="col-6 text-center">
              <q-btn outline dense :to="{
                name: getRoute(), params: { id: people.id }
              }" flat no-caps color="grey-9" icon="edit" :label="`#${people.id}`" class="full-width q-py-xs" />
            </div>
            <div class="col-6 text-center">
              <q-toggle v-model="people.enable" checked-icon="check" color="green"
                :label="!people.enable ? 'Desabilitado' : 'Habilitado'" unchecked-icon="clear"
                @input="changeEnable(people)" />
            </div>
          </q-card-actions>
        </q-card>
      </template>
      <div v-else  class="flex justify-center">
        <span>Sem Resultados</span>
      </div>
    </div>

    <div class="col-12">
      <q-card class="flex flex-center q-pa-md q-mt-md">
        <q-pagination v-model="page" :max-pages="6" :max="maxPages" :boundary-numbers="maxPages > 9" direction-links />
      </q-card>
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { formatDocument, formatPhone } from '@controleonline/quasar-common-ui/src/utils/formatter';
import { date } from 'quasar';

import { mapGetters } from 'vuex';

const SETTINGS = {
  visibleColumns: [
    'info',
    'id',
    'cnpj',
    'alias',
    'name',
    'email',
    'phone',
    'register_date',
    'actions',
  ],
  columns: [
    {
      name: 'info',
      field: 'info',
      align: 'left',
      label: 'Info'
    },
    {
      name: 'id',
      field: 'id',
      align: 'left',
      label: 'ID'
    },
    {
      name: 'cnpj',
      field: 'cnpj',
      align: 'left',
      format: (val, row) => {
        return formatDocument(val);
      },
      label: 'CNPJ'
    },
    {
      name: 'alias',
      field: 'alias',
      align: 'left',
      label: 'Nome fantasia'
    },
    {
      name: 'name',
      field: 'name',
      align: 'left',
      label: 'Razão social'
    },
    {
      name: 'email',
      field: 'email',
      align: 'left',
      label: 'Email'
    },
    {
      name: 'phone',
      field: 'phone',
      align: 'left',
      format: (val, row) => {
        return formatPhone(val);
      },
      label: 'Telefone'
    },
    {
      name: 'register_date',
      field: 'register_date',
      align: 'left',
      label: 'Data do Registro'
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
  computed: {
    ...mapGetters({
      theCompany: "people/currentCompany",
    }),

    page: {
      get() {
        return this.$route.query.page || 1;
      },
      set(value) {
        this.$router.push({ ...this.$route.name, query: { ...this.$route.query, page: value } })
      }
    },
  },

  props: {

    fromDate: {
      type: String,
      required: false,
    },
    toDate: {
      type: String,
      required: false,
    },
    searchBy: {
      type: String,
      required: false,
    },
    provider: {
      required: true,
    },
    people_type: {
      type: String,
      required: true
    },
    pageType: {
      type: String,
      required: true,
    }
  },

  created() {
    this.peopleType = this.people_type;
    if (this.provider !== null)
      this.onRequest({
        pagination: this.pagination
      });
  },

  data() {
    return {
      peopleType: null,
      maxPages: 5,
      settings: SETTINGS,
      data: [],
      isLoading: false,
      pagination: {
        sortBy: 'cnpj',
        descending: false,
        page: 1,
        rowsPerPage: 8,
        rowsNumber: 10,
      },
    };
  },

  watch: {
    myProvider(provider) {      
      if (provider !== null)
        this.onRequest({
          pagination: this.pagination
        });

    },
    fromDate() {
      this.onRequest({
        pagination: this.pagination
      });
    },

    toDate() {
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
    getRoute() {
      let route = this.people_type.charAt(0).toUpperCase() + this.people_type.slice(1);
      route = route + 'Details';
      return route;
    },
    changeEnable(people) {
      const options = {
        method: 'PUT',
        
        body: (people.enable),
        params: {
          company: this.theCompany.id,
          enable: people.enable
        },
      }

      return api.fetch(`/people_${this.peopleType}/${people.people_people_id}/change-status`, options)
        
        .then(result => {
          return this.$q.notify({
            message: "Alterado com sucesso.",
            position: "bottom",
            type: "positive",
          });
        });
    },
    // store method
    getCustomers(params) {
      this.onBeforeLoadPeople(params);
      return api.fetch(`/${this.peopleType}`, { params })
        
        .then(result => {
          return {
            members: result.response.data.members,
            totalItems: result.response.data.total
          };
        });
    },
    onBeforeLoadPeople(params) {
      params['myProvider'] = this.provider.id;
    },

    onBeforeCreatePeople(params) {
      params['myProvider'] = this.provider.id;
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
      } = props.pagination;

      let params = {};

      params['type'] = this.pageType;
      params['from'] = this.formatDate(this.fromDate);
      params['to'] = this.formatDate(this.toDate);
      params['page'] = this.page;
      params['limit'] = rowsPerPage;

      if (this.searchBy.length > 1)
        params['searchBy'] = this.searchBy;

      this.$emit('before', params);

      this.getCustomers(params)
        .then(data => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];
            let people = {};

            people = {
              'id': item.id,
              'cnpj': formatDocument(item.document),
              'alias': item.alias,
              'name': item.name,
              'email': item.email,
              'people_people_id': item.people_client_id || item.people_carrier_id || item.people_provider_id,
              'phone': formatPhone(item.phone),
              'enable': item.enable,
              'people_type': item.people_type,
              'register_date': date.formatDate(item.register_date, "DD/MM/YYYY H:m:s")
            };

            _data.push(people);
          }

          this.data = _data;
          this.pagination.page = this.page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.totalItems;
          this.maxPages = Math.ceil(data.totalItems / 8);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>