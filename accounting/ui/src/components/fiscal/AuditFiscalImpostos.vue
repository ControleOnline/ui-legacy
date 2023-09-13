<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      <q-table dense 
        :rows   ="items"
        :columns="settings.columns"
        row-key ="id"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nome"    :props="props">{{ props.row.nome    }}</q-td>
            <q-td key="empresa" :props="props">{{ props.row.empresa }}</q-td>
            <q-td key="cliente" :props="props">{{ props.row.cliente }}</q-td>
            <q-td auto-width>
              <q-btn outline
                color ="primary"
                :label="$t('Revisar')"
                size  ="sm"
                :to   ="{
                  name  : 'AuditFiscalDetails',
                  params: {
                    id: props.row.id
                  }
                }"
              />
            </q-td>
            <q-td auto-width>
              <q-btn outline
                color ="primary"
                :label="$t('Histórico')"
                size  ="sm"
                :to   ="{
                  name  : 'AuditFiscalHistorico',
                  params: {
                    id: props.row.id
                  }
                }"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const SETTINGS = {
  columns       : [
    {
      name : 'nome',
      field: row => row.nome,
      align: 'left',
      label: 'Nome'
    },
    {
      name : 'empresa',
      field: row => row.empresa,
      align: 'left',
      label: 'Empresa'
    },
    {
      name : 'cliente',
      field: row => row.cliente,
      align: 'left',
      label: 'Cliente'
    },
    {
      name : 'revisar',
      field: row => row.id,
    },
    {
      name : 'historico',
      field: row => row.id,
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  data() {
    return {
      items   : [],
      settings: SETTINGS,
      saving  : false,
      loading : false,
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),

    user() {
      return this.$store.getters['auth/user'];
    },
  },

  watch: {
    myCompany(company) {
      this.onRequest();
    },
  },

  methods: {
    onRequest() {
      let params = {};
      let items  = [];

      items.push({
        id     : 1,
        nome   : 'Levantamento de Pendências ref 2020',
        empresa: 'ANDRE LUIZ RAMOS 28372525111',
        cliente: 'André Luiz Ramos',
      });

      items.push({
        id     : 2,
        nome   : 'PGDAS',
        empresa: 'MARCIO ALAMO MARINHO 11133167843',
        cliente: 'Marcio Alamo',
      });

      items.push({
        id     : 3,
        nome   : 'PGDAS',
        empresa: 'ALAN ALAMO MARINHO 09133167843',
        cliente: 'Alan Alamo',
      });

      this.items = items;
    },
  },
};
</script>
