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
                <q-item clickable @click="confirmDelete(props.row)">
                  <q-item-section side>
                    <q-icon name="delete"></q-icon>
                  </q-item-section>
                  <q-item-section> Excluir </q-item-section>
                </q-item>
                <q-separator></q-separator>
              </q-list>
            </q-menu>
            </q-btn>
          </q-td>
          <q-td :props="props" key="Id"> {{ props.row.id }}</q-td>
          <q-td :props="props" key="Hardware"> {{ props.row.hardware }}</q-td>
          <q-td :props="props" key="Imei"> {{ props.row.imei }}</q-td>
          <q-td :props="props" key="Company"> {{ props.row.company.label }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editHardware">
      <q-card style="width:50%">
        <q-card-section>
          <span class="text-h6">Editar</span>
        </q-card-section>
        <HardwareCreate :hardwareObj="this.selectedHardware" @savedItem="saved()"></HardwareCreate>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";
import HardwareCreate from "./HardwareCreate.vue";

export default {
  components: {
    Api,
    HardwareCreate,
  },

  props: {},

  data() {
    return {
      api: new Api(this.$store.getters["auth/user"].token),
      loadingStatuses: null,
      isLoading: null,

      selectedHardware: null,

      editHardware: false,
      
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
          name: "Imei",
          label: "Imei",
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
        .private(`hardware`, {})
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
              hardware: data.members[index]["hardware"],
              imei: data.members[index]["imei"],
              company: {
                label: data.members[index]["company"]["name"],
                value: data.members[index]["company"]["@id"].replaceAll("/people/", ""),
              }
            });
          }
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
        this.editHardware = false;
    },

    openEditModal(row) {
      this.selectedHardware = row
      this.editHardware = true;
    },
  },
};
</script>