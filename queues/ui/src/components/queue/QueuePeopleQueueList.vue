<template>
  <div class="col-12">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress :indeterminate="isLoading || loadingStatuses" size="sm" color="primary" class="q-ma-md" />
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
            <q-btn
              dense
              flat
              color="primary"
              icon="settings"
            >
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
          <q-td :props="props" key="QueuePeople"> {{ props.row.queuePeople.label }}</q-td>
          <q-td :props="props" key="Queue"> {{ props.row.queue.label }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editQueuePeopleQueue">
      <q-card style="width:50%">
        <q-card-section>
          <span class="text-h6"> {{ $t(`Edit`) }}</span>
        </q-card-section>
        <QueuePeopleQueueCreate :queuePeopleQueueObj="this.selectedQueuePeopleQueue" @savedItem="saved"></QueuePeopleQueueCreate>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";
import QueuePeopleQueueCreate from "@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleQueueCreate.vue";

export default {
  components: {
    Api,
    QueuePeopleQueueCreate,
  },

  props: {},

  data() {
    return {
      api: new Api(this.$store.getters["auth/user"].token),
      loadingStatuses: null,
      isLoading: null,

      pagination: {
        sortBy: "ultimaModificacao",
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },

      selectedQueuePeopleQueue: null,

      editQueuePeopleQueue: false,
      
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
          name: "QueuePeople",
          label: "Fila pessoa",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Queue",
          label: "Fila",
          align: "center",
          format: (val) => `${val}`,
        },
      ],
    }
  },

  created() {
    this.getCollectionFiles();
  },
  watch: {

  },

  methods: {
    onRequest(pagination) {
      console.log('onRequest')
      console.log(onRequest)
      this.pagination = pagination;
    },

    getItems(params) {
      return this.api
        .private(`queue_people_queues`, { params })
        
        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:total"]
          }
        })
    },

    getCollectionFiles() {
      this.isLoading = true;
      
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = this.pagination;
      let params = { itemsPerPage: rowsPerPage, page };

      this.getItems(params)
      .then((data) => {
        console.log(data)
        if (data.members) {
          this.data = [];
          for (let index in data.members) {
            let translatedStatus = this.$t(`queue.status.${data.members[index]["queuePeople"]["status"]["status"]}`)
            let translatedPriority = this.$t(`queue.priority.${data.members[index]["queuePeople"]["priority"]}`)
            
            this.data.push({
              id: data.members[index]["@id"].replaceAll("/queue_people_queues/",""),
              queuePeople: {
                label: `${data.members[index]["queuePeople"]["people"]["name"]} - ${translatedPriority} - ${translatedStatus}`,
                value: data.members[index]["queuePeople"]["id"],
              },
              queue: {
                label: data.members[index]["queue"]["queue"],
                value: data.members[index]["queue"]["id"],
              }
            });
          }
        } else {
          this.$q.notify({
            message: this.$t(`messages.anErrorOccurred`),
            position: "bottom",
            type: "negative",
          });
        }
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
        this.pagination.rowsNumber = data.total;
      })
      .catch((error) => {
        this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
      })
      .finally(() => {
        this.isLoading = false;
        });
    },

    saved(item) {
      console.log('saved')
      console.log(item)
      if (item["@id"])
      console.log('entrou')
        this.getCollectionFiles();
        this.editQueuePeopleQueue = false;
    },

    openEditModal(row) {
      this.selectedQueuePeopleQueue = row
      this.editQueuePeopleQueue = true;
    },
  },
};
</script>