<template>
  <div>
    <q-table
      :loading="isLoading"
      :data="items"
      :columns="settings.columns"
      :pagination.sync="pagination"
      @request="onRequest"
      row-key="id"
      :visible-columns="settings.visibleColumns"
      style="min-height: 90vh"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="trackingStatus" :props="props">{{ props.row.trackingStatus }}</q-td>
          <q-td key="dataHora" :props="props">{{ props.cols[1].value }}</q-td>
          <q-td key="dominio" :props="props">{{ props.row.dominio }}</q-td>
          <q-td key="filial" :props="props">{{ props.row.filial }}</q-td>
          <q-td key="cidade" :props="props">{{ props.row.cidade }}</q-td>
          <q-td key="ocorrencia" :props="props">{{ props.row.ocorrencia }}</q-td>
          <q-td key="descricao" :props="props">{{ props.row.descricao }}</q-td>
          <q-td key="tipo" :props="props">{{ props.row.tipo }}</q-td>
          <q-td key="dataHoraEfetiva" :props="props">{{ props.cols[8].value }}</q-td>
          <q-td key="nomeRecebedor" :props="props">{{ props.row.nomeRecebedor }}</q-td>
          <q-td key="nroDocRecebedor" :props="props">{{
            props.row.nroDocRecebedor
          }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";

const SETTINGS = {
  visibleColumns: [
    "trackingStatus",
    "dataHora",
    "dominio",
    "filial",
    "cidade",
    "ocorrencia",
    "descricao",
    "tipo",
    "dataHoraEfetiva",
    "nomeRecebedor",
    "nroDocRecebedor",
  ],
  columns: [
    {
      name: "trackingStatus",
      align: "left",
      field: "trackingStatus",
      label: "Status",
    },
    {
      name: "dataHora",
      field: "dataHora",
      align: "left",
      format: (val, row) => {
        return formatDateYmdTodmY(val, true);
      },
      label: "Data",
    },
    {
      name: "dominio",
      align: "left",
      field: "dominio",
      label: "Dominio",
    },
    {
      name: "filial",
      align: "left",
      field: "filial",
      label: "Filial",
    },
    {
      name: "cidade",
      align: "left",
      field: "cidade",
      label: "Cidade",
    },
    {
      name: "ocorrencia",
      align: "left",
      field: "ocorrencia",
      label: "Ocorrencia",
    },
    {
      name: "descricao",
      align: "left",
      field: "descricao",
      label: "Descrição",
    },
    {
      name: "tipo",
      align: "left",
      field: "tipo",
      label: "Tipo",
    },
    {
      name: "dataHoraEfetiva",
      field: "dataHoraEfetiva",
      align: "left",
      format: (val, row) => {
        return formatDateYmdTodmY(val, true);
      },
      label: "Data efetiva",
    },
    {
      name: "nomeRecebedor",
      align: "left",
      field: "nomeRecebedor",
      label: "Recebedor",
    },
    {
      name: "nroDocRecebedor",
      align: "left",
      field: "nroDocRecebedor",
      label: "Doc. Recebedor",
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    orderId: {
      type: String,
      required: false,
      default: null,
    },
  },

  created() {
    this.onRequest({
      pagination: this.pagination,
      filter: null,
    });
  },

  data() {
    return {
      settings: SETTINGS,
      items: [],
      isLoading: false,
      pagination: {
        sortBy: "dataHora",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
    };
  },

  methods: {
    // store method
    getItems(params) {
      return api
        .fetch(`purchasing_orders/${this.orderId}/trackings`, {
          params,
        })

        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:totalItems"],
          };
        });
    },

    onRequest(props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination;
      let filter = props.filter;
      let params = { itemsPerPage: rowsPerPage, page };

      params["order[dataHora]"] = "DESC";

      this.isLoading = true;

      this.getItems(params)
        .then((data) => {
          let _items = [];

          for (let index in data.members) {
            let item = data.members[index];

            _items.push({
              "@id": item["@id"],
              id: item["@id"].replace(/\D/g, ""),
              trackingStatus: item.trackingStatus,
              dataHora: item.dataHora,
              dominio: item.dominio,
              filial: item.filial,
              cidade: item.cidade,
              ocorrencia: item.ocorrencia,
              descricao: item.descricao,
              tipo: item.tipo,
              dataHoraEfetiva: item.dataHoraEfetiva,
              nomeRecebedor: item.nomeRecebedor,
              nroDocRecebedor: item.nroDocRecebedor,
            });
          }

          this.items = _items;
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
  },
};
</script>
