<template>
  <div class="col-12">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress :indeterminate="isLoading || loadingStatuses" size="sm" color="primary" class="q-ma-md" />
      Carregando...
    </div>

    <q-table
      ref="myTable"
      flat
      :loading="isLoading"
      :data="data"
      :columns="columns"
      row-key="Id"
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
                  <q-item-section> Editar </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
          <q-td :props="props" key="Id"> {{ props.row.id }}</q-td>
          <q-td :props="props" key="Queue"> {{ props.row.queue }}</q-td>
          <q-td :props="props" key="Company"> {{ props.row.company.label }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editQueue">
      <q-card style="width:50%">
        <q-card-section>
          <span class="text-h6">Editar</span>
        </q-card-section>
        <QueueCreate :queueObj="this.selectedQueue" @savedItem="saved()"></QueueCreate>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";
import QueueCreate from "@controleonline/quasar-queues-ui/src/components/queue/QueueCreate.vue";

export default {
  components: {
    Api,
    QueueCreate,
  },

  props: {},

  data() {
    return {
      api: new Api(this.$store.getters["auth/user"].token),
      loadingStatuses: null,
      isLoading: null,

      selectedQueue: null,

      editQueue: false,
      
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
          name: "Queue",
          label: "Fila",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Company",
          label: "Empresa",
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
    getItems() {
      return this.api
        .private(`queues`, {})
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
          }
        })
    },

    getCollectionFiles() {

      this.getItems()
      .then((data) => {
        if (data.members) {
          this.data = [];
          for (let index in data.members) {
            this.data.push({
              id: data.members[index]["id"],
              queue: data.members[index]["queue"],
              company: {
                label: data.members[index]["company"]["name"],
                value: data.members[index]["company"]["@id"].replaceAll("/people/", ""),
              }
            });
          }
          console.log(this.data)
        } else {
          this.$q.notify({
            message: this.$t("Não foi possível salvar os dados!"),
            position: "bottom",
            type: "negative",
          });
        }
      })
      .catch((error) => {
        this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
      });
    },

    saved(item) {
      console.log('saved')
      console.log(item)
      if (item["@id"])
      console.log('entrou')
        this.getCollectionFiles();
        this.editQueue = false;
    },

    openEditModal(row) {
      this.selectedQueue = row
      this.editQueue = true;
    },
  },
};
</script>