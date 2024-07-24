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
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <q-td key="nascimento" :props="props">
              {{ props.row.nascimento | formatDate }}
            </q-td>
            <q-td key="cpf" :props="props">
              {{ props.row.cpf | formatDoc }}
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
      name : 'nascimento',
      field: row => row.nascimento,
      align: 'left',
      label: 'Data de Nascimento'
    },
    {
      name : 'cpf',
      field: row => row.cpf,
      align: 'left',
      label: 'CPF'
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
        id        : 1,
        nome      : 'MARIA NISHIKAWO 81071499904',
        nascimento: '1980-02-01',
        cpf       : '58741115478',
      });

      items.push({
        id        : 2,
        nome      : 'MARIA NISHIKAWO 81071499904',
        nascimento: '1980-02-01',
        cpf       : '58741115478',
      });

      items.push({
        id        : 3,
        nome      : 'MARIA NISHIKAWO 81071499904',
        nascimento: '1980-02-01',
        cpf       : '58741115478',
      });

      items.push({
        id        : 4,
        nome      : 'MARIA NISHIKAWO 81071499904',
        nascimento: '1980-02-01',
        cpf       : '58741115478',
      });

      this.items = items;
    },
  },

  filters: {
    formatDoc(value) {
      return this.$formatter.formatDocument(value);
    },

    formatDate(value) {
      return this.$formatter.formatDateYmdTodmY(value);
    },
  },
};
</script>
