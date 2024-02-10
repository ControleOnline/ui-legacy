<template>
  <div class="row">
    <div class="q-pa-md text-subtitle1">
      {{ $t('Mensagens') }}
    </div>
    <div class="col-12 q-mt-md">
      <q-table dense 
        :rows   ="items"
        :columns="settings.columns"
        row-key ="id"
        :loading="loading"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="status"      :props="props">{{ props.row.status      }}</q-td>
            <q-td key="comentarios" :props="props">{{ props.row.comentarios }}</q-td>
            <q-td key="quando"      :props="props">{{ props.row.quando      }}</q-td>
            <q-td key="porquem"     :props="props">{{ props.row.porquem     }}</q-td>
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
      name : 'status',
      field: row => row.status,
      align: 'left',
      label: 'Status'
    },
    {
      name : 'comentarios',
      field: row => row.comentarios,
      align: 'left',
      label: 'Comentários'
    },
    {
      name : 'quando',
      field: row => row.quando,
      align: 'left',
      label: 'Quando'
    },
    {
      name : 'porquem',
      field: row => row.porquem,
      align: 'left',
      label: 'Por'
    },
  ],
};

Object.freeze(SETTINGS);

export default {
  props: {
    id: {
      type    : String,
      required: true,
    },
  },

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
        id         : 1,
        status     : 'Recusado',
        comentarios: '',
        quando     : '22/02/2021 - 13:15',
        porquem    : 'Verônica Barros',
      });

      items.push({
        id         : 2,
        status     : 'Recusado',
        comentarios: '',
        quando     : '22/02/2021 - 13:15',
        porquem    : 'Verônica Barros',
      });

      items.push({
        id         : 3,
        status     : 'Recusado',
        comentarios: '',
        quando     : '22/02/2021 - 13:15',
        porquem    : 'Verônica Barros',
      });

      this.items = items;
    },
  },
};
</script>
