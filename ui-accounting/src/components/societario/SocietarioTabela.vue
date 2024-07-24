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
            <q-td key="status"  :props="props">
              <q-badge
                :color     ="'green'"
                :text-color="'white'"
                :label     ="props.row.status"
              />
            </q-td>
            <q-td key="criacao" :props="props">
              {{ props.row.criacao | formatDate }}
            </q-td>
            <q-td auto-width>
              <q-btn outline
                color ="primary"
                :label="$t('Mensagens')"
                size  ="sm"
                :to   ="{
                  name  : 'SocietarioMessages',
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
      name : 'status',
      field: row => row.status,
      align: 'left',
      label: 'Status'
    },
    {
      name : 'criacao',
      field: row => row.criacao,
      align: 'left',
      label: 'Criada em'
    },
    {
      name : 'acoes',
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
        status : 'Liberada',
        criacao: '2020-05-01 15:30',
      });

      items.push({
        id     : 2,
        nome   : 'PGDAS',
        empresa: 'MARCIO ALAMO MARINHO 11133167843',
        status : 'Liberada',
        criacao: '2020-05-01 15:30:00',
      });

      items.push({
        id     : 3,
        nome   : 'PGDAS',
        empresa: 'ALAN ALAMO MARINHO 09133167843',
        status : 'Liberada',
        criacao: '2020-05-01 15:30:00',
      });

      this.items = items;
    },
  },

  filters: {
    formatDate(value) {
      return this.$formatter.formatDateYmdTodmY(value, true);
    },
  },
};
</script>
