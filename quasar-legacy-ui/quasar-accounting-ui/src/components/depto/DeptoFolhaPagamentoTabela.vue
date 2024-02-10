<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      <q-table dense 
        :rows   ="items"
        :columns="settings.columns"
        row-key ="id"
        :loading="loading"
      >
        <template v-slot:top>
          <div class="col-xs-12 q-pa-md">
            <q-input
      dense
      outlined stack-label
              label   ="Buscar por empresa"
              debounce="1000"
              v-model ="filters.empresa"
              class   ="full-width"
            />
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nome"    :props="props">{{ props.row.nome    }}</q-td>
            <q-td key="empresa" :props="props">{{ props.row.empresa }}</q-td>
            <q-td key="periodo" :props="props">{{ props.row.periodo }}</q-td>
            <q-td key="pago"    :props="props">
              <q-badge
                :color     ="props.row.pago ? 'green' : 'yellow'"
                :text-color="props.row.pago ? 'white' : 'black'"
                :label     ="props.row.pago ? 'Sim' : 'Não'"
              />
            </q-td>
            <q-td key="arquivo" :props="props" auto-width>
              <q-btn
                color   ="secondary"
                :label  ="$t('Baixar')"
                size    ="sm"
                @click  =""
                :loading="false"
              />
            </q-td>
            <q-td key="acoes" :props="props">
              <div class="col q-gutter-xs items-center justify-center">
                <q-btn outline
                  color ="primary"
                  :label="$t('Editar')"
                  size  ="sm"
                  :to   ="{
                    name  : 'DeptoFolhaPagamentoEdit',
                    params: {
                      id: props.row.id
                    }
                  }"
                />
                <q-btn
                  color   ="red"
                  :label  ="$t('Apagar')"
                  size    ="sm"
                  @click  =""
                  :loading="false"
                />
              </div>
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
      name : 'periodo',
      field: row => row.periodo,
      align: 'left',
      label: 'Período'
    },
    {
      name : 'pago',
      field: row => row.pago,
      align: 'left',
      label: 'Pago'
    },
    {
      name : 'arquivo',
      field: row => row.id,
      align: 'left',
      label: 'Arquivo'
    },
    {
      name : 'acoes',
      field: row => row.id,
      align: 'left',
      label: 'Ações'
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
      filters : {
        empresa: ''
      }
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
        nome   : 'DEFIS (Declaração simples)',
        empresa: 'MARIA NISHIKAWO 81071499904',
        periodo: 'Jan 2021',
        pago   : true,
      });

      items.push({
        id     : 2,
        nome   : 'DEFIS (Declaração simples)',
        empresa: 'MARCELO AUGUSTO PINTO 11110607847',
        periodo: 'Jan 2021',
        pago   : false,
      });

      items.push({
        id     : 3,
        nome   : 'DEFIS (Declaração simples)',
        empresa: 'Julio Cesar Monte',
        periodo: 'Mar 2021',
        pago   : true,
      });

      items.push({
        id     : 4,
        nome   : 'DEFIS (Declaração simples)',
        empresa: 'ADRIANA MELINO FRANCA 99906148860',
        periodo: 'Abr 2021',
        pago   : true,
      });

      this.items = items;
    },
  },
};
</script>
