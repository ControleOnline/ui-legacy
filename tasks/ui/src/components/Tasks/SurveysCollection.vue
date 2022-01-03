<template>
  <div>
    <div class="col-12">
      <div class="row justify-end q-mb-md q-mt-md">
        <q-btn
            :loading="addLoading"
            :disable="addDisable"
            label="Adicionar"
            icon="add"
            size="md"
            color="primary"
            class="q-ml-sm"
            @click="addSurvey"
        />
      </div>
    </div>
    <div
        v-if="generalWarningVisible"
        class="aviso_alerta q-mt-lg">
      <q-icon name="warning" class="text-red" style="font-size: 4rem;"/>
      <q-banner dense inline-actions class="text-white bg-red q-pa-xs">
        <span
            v-html="'<strong>Vistoria não ativada para este tipo de Ocorrência</strong> - order_id em task null'"
            style="font-size: 14px;">
        </span>
      </q-banner>
    </div>
    <q-table
        v-if="visibleQtable"
        :loading="isLoading"
        :data="data"
        :columns="settings.columns"
        :pagination.sync="pagination"
        row-key="id"
        :visible-columns="settings.visibleColumns"
        style="min-height: 90vh"
        :flat="true"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" :ref="'linha' + props.row.id">
          <q-td key="id" :props="props">
            <q-btn
                outline
                dense
                type="a"
                :href="'task/checklist/id/' + props.row.id"
                target="_blank"
                :label="`#${props.row.id}`"
                class="full-width"
            />
          </q-td>
          <q-td key="client_name" :props="props">{{ props.row.client_name }}</q-td>
          <q-td key="vehicle" :props="props">{{ props.row.vehicle }}</q-td>
          <q-td key="date" :props="props">{{ props.row.date }}</q-td>
          <q-td key="type_survey" :props="props">{{ props.cols[4].value }}</q-td>
          <q-td key="status" :props="props">
            <q-badge :color="props.cols[5].value==='Completo' ? 'green' : 'blue-grey-6'" class="q-pa-xs">
              {{ props.cols[5].value }}
            </q-badge>
          </q-td>
          <q-td key="acoes" :props="props">
            <div class="row q-gutter-xs items-center justify-center">
              <q-btn
                  color="red"
                  label="Apagar"
                  size="sm"
                  @click="deleteConfirm(props.row.id)"
                  :loading="false"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog
        v-model="confirmDelete"
        persistent>
      <q-card style="width: 600px;">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="delete" color="red" text-color="white"/>
          <div class="text-h6 q-ml-md">
            Apagar Registro
          </div>
          <q-space/>
          <q-btn icon="close" @click="setClassRow(idRowToDelete, false);" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section class="row items-center">
          <span class="q-ml-sm" v-html="msgDelete"></span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="setClassRow(idRowToDelete, false);" v-close-popup/>
          <q-btn flat label="Sim" color="primary" @click="nowDelete(idRowToDelete);" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import {ENTRYPOINT} from '../../../../../../src/config/entrypoint';
import axios from "axios";

function findIn(obj, search) {
  let tmp = obj.find(c => c.value === search);
  return tmp.label;
}

export default {
  name: "SurveysCollection",
  props: {
    taskId: {
      type: Number,
      required: true
    },
    api: {
      type: Api,
      required: true
    }
  },
  data() {
    let statuses = [{label: "Todos", value: -1}];
    return {
      idRowToDelete: null,
      msgDelete: null,
      confirmDelete: false,
      addLoading: false,
      addDisable: true,
      visibleQtable: true,
      generalWarningVisible: false,
      filters: {
        status: statuses[0],
      },
      statuses: statuses,
      loadingStatuses: false,
      settings: {
        visibleColumns: ["id", "client_name", "vehicle", "date", "type_survey", "status", "acoes"],
        columns: [
          {
            name: "id",
            field: "id",
            align: "center",
            label: "ID",
          },
          {
            name: "client_name",
            field: "client_name",
            align: "left",
            label: "Cliente",
          },
          {
            name: "vehicle",
            field: "vehicle",
            align: "left",
            label: "Veículo",
          },
          {
            name: "date",
            field: "date",
            align: "left",
            label: "Data",
          },
          {
            name: "type_survey",
            field: "type_survey",
            align: "left",
            label: "Tipo",
            format: (val, row) => {
              if (val === null) {
                return '';
              }
              return findIn(this.options_type_survey, val);
            }
          },
          {
            name: "status",
            field: "status",
            align: "left",
            label: "Status",
            format: (val, row) => {
              return findIn(this.status_survey, val);
            }
          },
          {
            name: 'acoes',
            field: row => row.id,
            align: 'center',
            label: 'Ações'
          }
        ],
      },
      data: [],
      isLoading: true,
      searchBy: "",
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      options_type_survey: [
        {
          label: 'Coleta',
          value: 'collect'
        },
        {
          label: 'Entrega',
          value: 'delivery'
        },
        {
          label: 'Outros',
          value: 'others'
        }
      ],
      status_survey: [
        {
          label: 'Completo',
          value: 'complete'
        },
        {
          label: 'Pendente',
          value: 'pending'
        }
      ],
    }
  },
  methods: {
    nowDelete(id) {

      this.isLoading = true;

      axios({
        url: ENTRYPOINT + `/tasks_surveys/${id}/surveys?timestamp=${new Date().getTime()}`,
        method: 'DELETE',
        headers: {'api-token': this.api.token}
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando Falha
          this.alertNotify(data.message, 'n');
          this.isLoading = false;
        }

        if (data.success) { // Quando tem Êxito
          this.callAjaxGetCollection(this.taskId);
          this.alertNotify(data.message, 'p');
        }

        this.setClassRow(id, false);

      });

    },
    setClassRow(id, action) {
      if (action) {
        this.idRowToDelete = id;
        this.$refs['linha' + id].$el.classList.value = 'bg-deep-orange-10 text-white';
      } else {
        this.idRowToDelete = null;
        this.$refs['linha' + id].$el.classList.value = '';
      }
    },
    deleteConfirm(id) {
      let data = this.data.find(i => i.id === id);
      this.setClassRow(id, true);
      let company = data.company;
      let msg = ''
      msg += 'Você deseja realmente Excluir a Vistoria:<br>';
      msg += `ID: ${id}`;
      this.msgDelete = msg;
      this.confirmDelete = true;
    },
    addSurvey() {
      this.addLoading = true;
      this.callAjaxAddNewSurvey(this.taskId);
    },
    /**
     * Exibe Alerta Positivo ou Negativo
     * @param msg
     * @param tipo ('n','p')
     */
    alertNotify(msg, tipo) {
      let status = (tipo === 'n') ? 'negative' : 'positive';
      this.$q.notify({
        message: msg,
        html: true,
        group: false,
        multiLine: true,
        position: 'bottom',
        type: status,
      });
    },
    callAjaxAddNewSurvey(taskId) {

      axios({
        url: ENTRYPOINT + `/tasks_surveys/${taskId}/surveys?timestamp=${new Date().getTime()}`,
        method: 'POST',
        headers: {'api-token': this.api.token}
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando Falha
          this.alertNotify(data.message, 'n');
        }

        if (data.success) { // Quando tem Êxito
          this.callAjaxGetCollection(this.taskId);
          this.alertNotify('Registro de Vistoria Adicionado com Êxito.', 'p');
        }

        this.addLoading = false;

      });

    },
    callAjaxGetCollection(taskId) {
      this.isLoading = true;
      axios({
        url: ENTRYPOINT + `/tasks_surveys/${taskId}/surveys?timestamp=${new Date().getTime()}`,
        method: 'get',
        headers: {'api-token': this.api.token}
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando falha o retorno dos dados
          let allowSurvey = data.allow_survey;
          if (!allowSurvey) {
            this.visibleQtable = false;
            this.generalWarningVisible = true;
          } else {
            this.addDisable = false;
            this.alertNotify(data.message, 'n');
          }
          this.data = [];
        }

        if (data.success) { // Quando os dados são retornados com êxito

          let allowSurvey = data.allow_survey;
          if (!allowSurvey) {
            this.visibleQtable = false;
            this.generalWarningVisible = true;
          } else {
            this.addDisable = false;
          }

          let _data = [];

          for (let index in data.data) {
            let item = data.data[index];
            _data.push({
              id: item.id,
              client_name: item.client_name,
              vehicle: item.vehicle,
              date: item.date,
              type_survey: item.type_survey,
              status: item.status,
            });
          }

          this.data = _data;

        }

        this.isLoading = false;

      });

    }

  },
  mounted() {
    this.callAjaxGetCollection(this.taskId);
  }
}
</script>

<style scoped>

.aviso_alerta {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>
