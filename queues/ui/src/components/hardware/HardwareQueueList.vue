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
          <q-td :props="props" key="Hardware"> {{ props.row.hardware.label }}</q-td>
          <q-td :props="props" key="Queue"> {{ props.row.queue.label }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editHardwareQueue">
      <q-card style="width: 50%">
        <q-card-section>
          <span class="text-h6"> {{ $t(`Edit`) }}</span>
        </q-card-section>
        <HardwareQueueCreate
          :hardwareQueue="this.selectedHardwareQueue"
          @savedItem="saved"
        ></HardwareQueueCreate>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import HardwareQueueCreate from "@controleonline/quasar-queues-ui/src/components/hardware/HardwareQueueCreate.vue";

export default {
  components: {
    Api,
    HardwareQueueCreate,
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

      selectedHardwareQueue: null,

      editHardwareQueue: false,

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
          name: "Hardware",
          label: "Hardware",
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
        .private(`hardware_queues`, { params })

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
                hardware: {
                  label: data.members[index]["hardware"]["hardware"],
                  value: data.members[index]["hardware"]["id"],
                },
                queue: {
                  label: data.members[index]["queue"]["queue"],
                  value: data.members[index]["queue"]["id"],
                },
              });
            }
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
      if (item["@id"]) this.getCollectionFiles();
    },

    openEditModal(row) {
      this.selectedHardwareQueue = row;
      this.editHardwareQueue = true;
    },
  },
};
</script>
