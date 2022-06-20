<template>
  <q-dialog :value="value" @input="$emit('input', $event)" class="new-serice-modal">
    <q-card class="new-service-modal__box column q-pa-md">
      <q-card-section class="row items-center">
        <div class="text-h6">Novo atendimento</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="col">
        <q-form @submit="$emit('confirmNew', formData)" ref="newServiceForm">
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <PeopleAutocomplete
              :source="searchPeople"
              class="col-12 q-mb-md"
              :isLoading="isSearching"
              label="Definir o cliente"
              @selected="onSelectClient"
              placeholder="Pesquisar..."
              lazy-rules="ondemand"
              :rules="[val => !!val || 'Campo de preenchimento obrigatório']"
            />
            <q-select
              v-model="formData.reason"
              class="col-12"
              outlined
              emit-value
              map-options
              label="Motivo"
              :options="categories"
              lazy-rules="ondemand"
              :rules="[val => !!val || 'Campo de preenchimento obrigatório']"
            />
            <q-select
              v-model="formData.status"
              class="col-12"
              outlined
              emit-value
              map-options
              label="Status"
              :options="statuses"
              lazy-rules="ondemand"
              :rules="[val => !!val || 'Campo de preenchimento obrigatório']"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
        <q-btn label="Cancelar" no-caps flat v-close-popup color="primary" class="q-mr-sm"  padding="sm lg"/>
        <q-btn
          label="Confirmar"
          no-caps
          color="primary"
          unelevated
          :disabled="!disable"
          :loading="loadingAction"
          @click="$refs.newServiceForm.submit()"
          padding="sm lg"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar';
import { mapActions } from "vuex";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/common/PeopleAutocomplete";

export default {
  components: {
    PeopleAutocomplete,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    loadingAction: {
      type: Boolean,
      required: false,
    }, 
  },

  emits: ['confirmNew', 'input'],

  data: () => ({
    model: true,
    disable: true,
    isSearching: false,
    clientSelected: "",
    formData: {
      customer: '',
      reason: '',
      status: '',
    },
    categories: [],
    statuses: [],
  }),

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
    getCategories() {
      const api = new Api(this.$store.getters["auth/user"].token);

      return api.private("/task_categories")
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },
    requestCategories() {
      this.getCategories().then((categories) => {
        if (categories.totalItems) {
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories.push({
              label: item.name,
              value: item.id,
            });
          }
        }
      });
    },
    onSelectClient(item) {
      this.clientSelected = item;
      this.formData.customer = item;
    },
    ...mapActions({
      search: "people/searchPeople",
    }),
    searchPeople(input) {
      this.isSearching = true;

      return this.search(input).then((result) => {
        this.isSearching = false;

        if (result && result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label:
                result.data[i].id +
                " - " +
                result.data[i].name +
                " - " +
                result.data[i].alias,
              value: result.data[i],
            });
          }
          return items;
        } else {
          this.isSearching = false;
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            position: "bottom",
            type: "negative",
          });
        }
      });
    },
    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'DD-MM-YYYY'), 'YYYY-MM-DD');
    },
  },

  created() {
    this.requestCategories();
    this.requestStatuses();
  }
}
</script>

<style lang="scss" scoped>
.new-service-modal {
  &__box {
    max-height: calc(100vh - 2rem);
    min-width: 600px;
    max-width: calc(100vw - 2rem);
  }
}
</style>