<template>
  <div class="col-12">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress
        :indeterminate="isLoading || loadingStatuses"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      {{ $t(`loading`) }}
    </div>

    <q-table
      ref="myTable"
      flat
      :loading="isLoading"
      :data="data"
      :columns="columns"
      row-key="Id"
      :pagination.sync="pagination"
      @request="onRequest"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-btn dense flat color="primary" icon="settings">
              <q-menu>
                <q-list>
                  <q-item clickable @click="openEditModal(props.row)">
                    <q-item-section side>
                      <q-icon name="edit"></q-icon>
                    </q-item-section>
                    <q-item-section> {{ $t(`Edit`) }} </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
          <q-td :props="props" key="Id"> {{ props.row.id }}</q-td>
          <q-td :props="props" key="Priority"> {{ props.row.priority }}</q-td>
          <q-td :props="props" key="RegisterTime">
            {{ formatDate(props.row.registerTime) }}</q-td
          >
          <q-td :props="props" key="UpdateTime">
            {{ formatDate(props.row.updateTime) }}</q-td
          >
          <q-td :props="props" key="People"> {{ props.row.people.label }}</q-td>
          <q-td :props="props" key="Status"> {{ props.row.status.label }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editQueuePeople">
      <q-card style="width: 50%">
        <q-card-section>
          <span class="text-h6"> {{ $t(`Edit`) }}</span>
        </q-card-section>
        <QueuePeopleCreate
          :queuePeopleObj="this.selectedQueuePeople"
          @savedItem="saved"
        ></QueuePeopleCreate>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import QueuePeopleCreate from "@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleCreate.vue";

export default {
  components: {
   
    QueuePeopleCreate,
  },

  props: {},

  data() {
    return {
      loadingStatuses: null,
      isLoading: null,

      pagination: {
        sortBy: "ultimaModificacao",
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },

      selectedQueuePeople: null,

      editQueuePeople: false,

      data: [],
      columns: [
        {
          name: "Actions",
          label: "",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Id",
          label: "Id",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Priority",
          label: "Prioridade",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "RegisterTime",
          label: "Hora do registro",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "UpdateTime",
          label: "Hora da atualização",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "People",
          label: "Pessoa",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Status",
          label: "Status",
          align: "center",
          format: (val) => `${val}`,
        },
      ],
    };
  },

  created() {
    this.getCollectionFiles();
  },
  watch: {},

  methods: {
    onRequest(pagination) {
      console.log("onRequest");
      console.log(onRequest);
      this.pagination = pagination;
    },

    getItems(params) {
      return api.fetch
        .private(`queue_people`, { params })

        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:total"],
          };
        });
    },

    getCollectionFiles() {
      this.isLoading = true;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } = this.pagination;
      let params = { itemsPerPage: rowsPerPage, page };

      this.getItems(params)
        .then((data) => {
          if (data.members) {
            this.data = [];
            for (let index in data.members) {
              this.data.push({
                id: data.members[index]["id"],
                priority: this.$t(`queue.priority.${data.members[index]["priority"]}`),
                registerTime: data.members[index]["registerTime"],
                updateTime: data.members[index]["updateTime"],
                people: {
                  label: data.members[index]["people"]["name"],
                  value: data.members[index]["people"]["@id"].replaceAll("/people/", ""),
                },
                status: {
                  label: this.$t(
                    `queue.status.${data.members[index]["status"]["status"]}`
                  ),
                  value: data.members[index]["status"]["@id"].replaceAll(
                    "/statuses/",
                    ""
                  ),
                },
              });
            }
            console.log(this.data);
          }
          this.pagination.page = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.total;
        })

        .finally(() => {
          this.isLoading = false;
        });
    },

    saved(item) {
      console.log("saved");
      console.log(item);
      if (item["@id"]) console.log("entrou");
      this.getCollectionFiles();
      this.editQueuePeople = false;
    },

    openEditModal(row) {
      this.selectedQueuePeople = row;
      this.editQueuePeople = true;
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>
