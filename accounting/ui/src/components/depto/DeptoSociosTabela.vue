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
            <q-td key="nome"  :props="props">{{ props.row.nome }}</q-td>
            <q-td key="links" :props="props" auto-width>
              <div class="col q-gutter-xs items-center">
                <q-btn outline
                  color ="primary"
                  :label="$t('Dependentes')"
                  size  ="sm"
                  :to   ="{
                    name  : 'DeptoSociosDependentes',
                    params: {
                      id: props.row.id
                    }
                  }"
                />
                <q-btn outline
                  color ="primary"
                  :label="$t('Folhas de Ponto')"
                  size  ="sm"
                  :to   ="{
                    name  : 'DeptoSociosFolhas',
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
      name : 'links',
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
        id  : 1,
        nome: 'MARIA NISHIKAWO 81071499904',
      });

      items.push({
        id  : 2,
        nome: 'MARCELO AUGUSTO PINTO 11110607847',
      });

      items.push({
        id  : 3,
        nome: 'Julio Cesar Monte',
      });

      items.push({
        id  : 4,
        nome: 'ADRIANA MELINO FRANCA 99906148860',
      });

      this.items = items;
    },
  },
};
</script>
