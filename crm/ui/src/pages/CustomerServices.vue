<template>
  <div class="q-pa-lg customer-services">
    <h4 class="text-h4 q-mt-none q-mb-lg text-weight-medium">Atendimentos</h4>

    <div class="row q-col-gutter-x-md justify-between q-mb-lg">
      <div class="col-xs-12 col-sm-grow">
        <q-input
          class="customer-services__search-input"
          outlined
          label="Pesquisar"
          v-model.trim="query"
          :debounce="350"
          clearable
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="text-right col-xs-12 col-sm-auto">
        <q-space />
        <q-btn
          icon="add"
          color="primary"
          unelevated
          no-caps
          label="Novo Atendimento"
          class="full-height"
          @click="showCreateModal = true"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4" v-for="item in data" :key="item.id">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle1 text-bold col">
                ID: #{{ item.id }}
              </div>
            </div>

            <div class="text-body2"><b>Cliente ID: </b> #{{ item.customer.id }}</div>
            <div class="text-body2"><b>Nome: </b> {{ item.customer.name }}</div>
            <div class="text-body2"><b>Data e hora: </b> {{ formatDate(item.createdAt) }}</div>
            <div class="text-body2"><b>Origem: </b> {{ item.origin.city + ' - ' + item.origin.state }}</div>
            <div class="text-body2"><b>Destino: </b> {{ item.destination.city + ' - ' + item.destination.state }}</div>
            <div class="text-body2"><b>Status: </b> {{ item.status }}</div>
            <div class="text-body2"><b>Motivo de abertura: </b> {{ item.reason }}</div>
            <div class="text-body2"><b>Motivo de recusa: </b> {{ item.dropoutReason || '-' }}</div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="row q-pa-none">
            <div class="col">
              <q-btn class="full-width q-py-xs" flat no-caps color="grey-9" label="Editar" icon="edit" @click="editItem(item)"/>
            </div>

            <div class="col">
              <q-btn class="full-width q-py-xs" flat no-caps color="red-5" label="Excluir" icon="delete" @click="deleteItem(item)"/>
            </div>
          </q-card-actions>
        </q-card>
      </div>

    </div>
    <q-card class="full-width flex flex-center q-pa-md q-mt-md">
      <q-pagination
        v-model="page"
        :max-pages="6"
        :max="maxPages"
        :boundary-numbers="maxPages > 9"
        direction-links
      />
    </q-card>

    <NewServiceModal v-model="showCreateModal" @confirmNew="saveCall($event)" :loadingAction="loadingSave" />
  </div>
</template>

<script>
import NewServiceModal from '../components/NewServiceModal.vue';
import { mapGetters } from "vuex";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { date } from 'quasar';

export default {
  components: {
    NewServiceModal,
  },

  data: () => ({
    searchTerm: '',
    showCreateModal: false,
    maxPages: 5,
    loadingSave: false,
    isLoading: false,
    pagination: {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 10,
    },
    data: [
      {
        id: 1,
        customer: {
            id: 7269,
            name: "Teste",
            register_date: "2022-06-01 19:58:02",
            alias: "Teste",
            enable: true,
            active: true,
            document: "31342452424242",
            email: null,
            phone: null
        },
        origin: {
          id: "ChIJX48DsG31xZQR8qfMVhqfeas",
          description: "Rua Vergueiro Steidel - Aparecida, 11040271, SP, Brasil",
          country: "Brasil",
          state: "SP",
          city: "Santos",
          district: "Aparecida",
          street: "Rua Vergueiro Steidel",
          number: "",
          postal_code: "11040271",
          provider: "viacep"
        },
        destination: {
          id: "ChIJX48DsG31xZQR8qfMVhqfeas",
          description: "Rua Vergueiro Steidel - Aparecida, 11040271, SP, Brasil",
          country: "Brasil",
          state: "SP",
          city: "Santos",
          district: "Aparecida",
          street: "Rua Vergueiro Steidel",
          number: "",
          postal_code: "11040271",
          provider: "viacep"
        },
        status: 'Em andamento',
        createdAt: '2022-06-01 19:58:02',
        reason: 'Compra de veículo',
        dropoutReason: null,
      },
    ]
  }),

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
    page: {
      get() {
        return Number(this.$route.query.page) || 1;
      },
      set(value){
        this.$router.push({ ...this.$route.name, query: { ...this.$route.query, page: value }});
      }
    },
    query: {
      get() {
        return this.$route.query.q;
      },
      set(value){
        if(value) {
          this.$router.push({ ...this.$route.name, query: { ...this.$route.query, q: value }});
          return
        }

        const { q, ...rest } = this.$route.query; 
        this.$router.push({ ...this.$route.name, query: { ...rest }});
      }
    },
  },

  watch: {
    page(newValue) {
      this.fetchData();
    }
  },

  methods: {
    saveCall(payload) {
      this.loadingSave = true;

      const api = new Api(this.$store.getters["auth/user"].token);

      payload.task_type = 'relationship';

      return api
        .private("/task", {
          body: JSON.stringify(payload),
          method: "POST",
        })
        .then((response) => response.json())
        .then((result) => {
          if (
            result.response &&
            result.response.data &&
            result.response.data.id
          ) {
            this.loadingSave = false;
            this.showCreateModal = false;

            return {
              success: true,
              id: result.response.data.id,
            };
          } else {
            this.loadingSave = false;
            this.showCreateModal = false;
            this.$q.notify({
              message: "Cadastrado com sucesso.",
              position: "bottom",
              type: "positive",
            });

            return {
              success: false,
            };
          }
        });
    },

    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'YYYY-MM-DD HH:mm'), 'DD/MM/YYYY HH:mm');
    },

    fetchData() {
      console.log('Buscar dados da pagina', this.page);
      console.log('Buscar dados da pagina pesquisa: ', this.query);
      this.onRequest({
        pagination: this.pagination,
      });
    },

    getTasks(params) {
      const api = new Api(this.$store.getters["auth/user"].token);

      return api.private("/tasks", { params })
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },

    onRequest(props) {
      if (this.isLoading) return;

      this.isLoading = true;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;

      let params = { itemsPerPage: rowsPerPage, page: this.page, task_type: 'relationship' };

      this.getTasks(params)
        .then((data) => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              id: item.id,
              name: item.name,
              status: item.taskStatus.name,
              taskFor: item.taskFor.name,
              dueDate: item.dueDate,
            });
          }

          this.data = _data;
          this.pagination.page = this.page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.totalItems;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    deleteItem(data) {
      console.log(data)
    },

    editItem({ id }) {
      this.$router.push({
        name: 'customerServiceEdit',
        params: {
          id
        }
      })
    },

    showItemInfo(data) {
      console.log(data)
    }
  },

  mounted() {
    this.fetchData();
  }
}
</script>

<style lang="scss" scoped>
.customer-services {
  .action_column {
    max-width: 50px;
  }
  &__search-input {
    width: 100%;
    margin-bottom: 1rem;
  }

  @media (min-width:  $breakpoint-sm-min) {
    &__search-input {
      width: 100%;
      max-width: 400px;
      margin-bottom: 0;
    }
  }
}
</style>