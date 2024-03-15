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
            <q-td key="empresa"  :props="props">{{ props.row.empresa  }}</q-td>
            <q-td key="cliente"  :props="props">{{ props.row.cliente  }}</q-td>
            <q-td key="servico"  :props="props">{{ props.row.servico  }}</q-td>
            <q-td key="depto"    :props="props">{{ props.row.depto    }}</q-td>
            <q-td key="preco"    :props="props">
              {{ props.row.preco | money }}
            </q-td>
            <q-td key="qtd"      :props="props">{{ props.row.qtd      }}</q-td>
            <q-td key="subtotal" :props="props">
              {{ props.row.subtotal | money }}
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
      name : 'servico',
      field: row => row.servico,
      align: 'left',
      label: 'Serviço Adicional'
    },
    {
      name : 'depto',
      field: row => row.depto,
      align: 'left',
      label: 'Departamento'
    },
    {
      name : 'preco',
      field: row => row.preco,
      align: 'left',
      label: 'Preço do Serviço'
    },
    {
      name : 'qtd',
      field: row => row.qtd,
      align: 'left',
      label: 'Qt.'
    },
    {
      name : 'subtotal',
      field: row => row.subtotal,
      align: 'left',
      label: 'Subtotal'
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
        id      : 1,
        empresa : 'ANDRE LUIZ SADOWSKY 28372525888',
        cliente : 'André Luiz Sadowsky',
        servico : 'Emissão de Nota Fiscal de Serviço (até 3 notas mês)',
        depto   : 'Fiscal',
        preco   : 29.90,
        qtd     : 1,
        subtotal: 29.90,
      });

      items.push({
        id      : 2,
        empresa : 'ANDRE LUIZ SADOWSKY 28372525888',
        cliente : 'André Luiz Sadowsky',
        servico : 'Emissão de Nota Fiscal de Serviço (até 3 notas mês)',
        depto   : 'Fiscal',
        preco   : 29.90,
        qtd     : 1,
        subtotal: 29.90,
      });

      items.push({
        id      : 3,
        empresa : 'ANDRE LUIZ SADOWSKY 28372525888',
        cliente : 'André Luiz Sadowsky',
        servico : 'Emissão de Nota Fiscal de Serviço (até 3 notas mês)',
        depto   : 'Fiscal',
        preco   : 29.90,
        qtd     : 1,
        subtotal: 29.90,
      });

      items.push({
        id      : 4,
        empresa : 'ANDRE LUIZ SADOWSKY 28372525888',
        cliente : 'André Luiz Sadowsky',
        servico : 'Emissão de Nota Fiscal de Serviço (até 3 notas mês)',
        depto   : 'Fiscal',
        preco   : 29.90,
        qtd     : 1,
        subtotal: 29.90,
      });

      this.items = items;
    },
  },

  filters: {
    money(value) {
      return this.$formatter. formatMoney(value, 'BRL', 'pt-br');
    }
  },
};
</script>
