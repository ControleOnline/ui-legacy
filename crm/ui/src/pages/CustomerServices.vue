<template>
  <div class="q-pa-lg customer-services">
    <h4 class="text-h4 q-mt-none q-mb-lg text-weight-medium">Atendimentos</h4>

    <div class="row q-col-gutter-x-md justify-between q-mb-lg">
      <div class="col-xs-12 col-sm-auto">
        <q-input class="customer-services__search-input" outlined label="Pesquisar" v-model.trim="query" :debounce="350"
          clearable>
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-xs-12 col-md">
        <q-select
          class="customer-services__search-input"
          outlined
          label="Filtrar por status"
          :options="statuses"
          v-model="filters.status"
        >
          <template #prepend>
            <q-icon name="filter_alt" />
          </template>
        </q-select>
      </div>

      <q-space />

      <div class="text-right col-xs-12 col-sm-auto">
        <q-space />
        <q-btn icon="add" color="primary" unelevated no-caps label="Novo Atendimento" class="full-height"
          @click="showCreateModal = true" />
      </div>
    </div>

    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4" v-for="item in 6" :key="item">
				<q-skeleton height="12rem" />
			</div>
		</div>

    <div v-else-if="error" class="column flex-center q-py-xl text-grey-8">
      <div class="text-center q-mb-md">
        <q-icon size="3rem" name="error"/>
      </div>
      Não foi possível carregar a página, tente novamente mais tarde.
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4" v-for="item in data" :key="item.id">
        <q-card>
          <q-card-actions align="center" class="row q-pa-none">
            <div class="col-12 text-center text-bold">
              <q-icon v-if="item.customer.people_type == 'F'" name="person" class="icon" color="blue" />
              <q-icon v-else name="factory" class="icon" color="green" />
              {{ item.customer.name }}
            </div>
          </q-card-actions>
          <q-separator />
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle1 text-bold col">
                ID: #{{ item.id }}
              </div>
            </div>

            <div class="text-body2">
              <q-icon name="person" color="grey-9" />
              {{ item.customer.alias }}
            </div>
            <div class="text-body2">
              <q-icon name="calendar_month" color="grey-9" />
              {{ !item.createdAt ? 'Não informado' : formatDate(item.createdAt) }}
            </div>
            <div class="text-body2">
              <q-icon name="place" color="grey-9" />
              {{ !item.origin ? 'Não informado' : item.origin.city + ' - ' + item.origin.state }}
            </div>
            <div class="text-body2">
              <q-icon name="where_to_vote" color="grey-9" />
              {{ !item.destination ? 'Não informado' : item.destination.city + ' - ' + item.destination.state }}
            </div>
            <div class="text-body2">
              <q-icon name="schedule" color="grey-9" />
              {{ !item.status ? 'Não informado' : item.status }}</div>
            <div class="text-body2">
              <q-icon name="task_alt" color="grey-9" />
              {{ !item.reason ? 'Não informado' : item.reason }}
            </div>
            <div class="text-body2">
              <q-icon name="highlight_off" color="grey-9" />
              {{ !item.dropoutReason ? 'Não informado' : item.dropoutReason || '-' }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="row q-pa-none">
            <div class="col">
              <q-btn class="full-width q-py-xs" flat no-caps color="grey-9" :label="`#${item.customer.id}`" icon="edit"
                @click="editItem(item)" />
            </div>

            <div class="col">
              <q-btn class="full-width q-py-xs" flat no-caps color="red-5" label="Excluir" icon="delete"
                @click="deleteItem(item)" />
            </div>
          </q-card-actions>
        </q-card>
      </div>

    </div>

    <q-card class="full-width flex flex-center q-pa-md q-mt-md">
      <q-pagination v-model="page" :max-pages="6" :max="maxPages" :boundary-numbers="maxPages > 9" direction-links />
    </q-card>

    <NewServiceModal v-model="showCreateModal" @confirmNew="saveCall($event)" :loadingAction="loadingSave" />
  </div>
</template>

<script>
import { name } from '@controleonline/quasar-dashboard-ui'
import NewServiceModal from '../components/NewServiceModal.vue';
import { mapGetters } from "vuex";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { date } from 'quasar';

export default {

  props: {
    client: {
      required: false
    },
  },

  components: {
    NewServiceModal,
  },

  data: () => ({
    loading: false,
    error: false,
    filters: {
      status: '',
    },
    statuses: [],
    searchTerm: '',
    showCreateModal: false,
    maxPages: 5,
    loadingSave: false,
    isLoading: false,
    pagination: {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 6,
      rowsNumber: 10,
    },
    data: []
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
      set(value) {
        this.$router.push({ ...this.$route.name, query: { ...this.$route.query, page: value } });
      }
    },
    query: {
      get() {
        return this.$route.query.q;
      },
      set(value) {
        if (value) {
          this.$router.push({ ...this.$route.name, query: { ...this.$route.query, q: value } });
          return
        }

        const { q, ...rest } = this.$route.query;
        this.$router.push({ ...this.$route.name, query: { ...rest } });
      }
    },
  },

  watch: {
    page(newValue) {
      this.fetchData();
    },
    "filters.status"() {
      this.fetchData();
    },
  },

  methods: {
    getStatuses() {
      const api = new Api(this.$store.getters["auth/user"].token);

      return api.private("/task_statuses")
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },
    requestStatuses() {
      this.getStatuses().then((statuses) => {
        if (statuses.totalItems) {
          for (let index in statuses.members) {
            let item = statuses.members[index];
            this.statuses.push({
              label: this.$t("tasks.status." + item.name),
              value: item.id,
            });
          }
        }
      });
    },
    saveCall(payload) {
      this.loadingSave = true;

      const api = new Api(this.$store.getters["auth/user"].token);

      payload.task_type = 'relationship';

      payload = {
        description: '',
        name: payload.customer.name,
        taskCategory: payload.reason,
        taskStatus: payload.status,
        client: payload.customer.id,
        provider: this.myCompany.id
      }

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

            this.$q.notify({
              message: "Cadastrado com sucesso.",
              position: "bottom",
              type: "positive",
            });

            return {
              success: true,
              id: result.response.data.id,
            };
          } else {
            this.loadingSave = false;
            this.showCreateModal = false;

            return {
              success: false,
            };
          }
        });
    },

    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'YYYY-MM-DD HH:mm'), 'DD/MM/YYYY HH:mm');
    },

    async fetchData() {
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
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

    async onRequest(props) {
      this.loading = true;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;

      let params = {
        itemsPerPage: rowsPerPage,
        page: this.page,
        task_type: 'relationship' 
      };

      if (this.filters.status.value) {
        params.taskStatus = this.filters.status.value;
      }

      if (this.client)
        params.client = this.client;

      await this.getTasks(params)
        .then((data) => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              id: item?.id,
              customer: item?.client,
              origin: item?.origin ?? null,
              detination: item?.detination ?? null,
              createdAt: item?.dueDate ?? null,
              reason: item?.taskCategory.name ?? null,
              status: item?.taskStatus.name ?? null,
              dropoutReason: item?.taskCategory.name ?? null,
            });
          }

          this.data = _data;
          this.pagination.page = this.page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.totalItems;
          this.maxPages = Math.ceil(data.totalItems / 6);
        })
        .finally(() => {
          this.error = false;

          if (this.data.length == 0) {
            this.error = true;
          }

          this.loading = false;
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

  async mounted() {
    await this.requestStatuses();
    await this.fetchData();
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

  @media (min-width: $breakpoint-sm-min) {
    &__search-input {
      width: 100%;
      max-width: 400px;
      margin-bottom: 0;
    }
  }
}
</style>