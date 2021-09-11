<template>
  <div class="row">

    <!-- search fields -->

    <div class="col-12">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-4">
          <q-input v-model="dateFrom" label="Data inicio" stack-label>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model ="dateFrom"
                    mask    ="DD-MM-YYYY"
                    @input  ="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input v-model="dateTo" label="Data fim" stack-label>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model ="dateTo"
                    mask    ="DD-MM-YYYY"
                    @input  ="() => $refs.qDateProxy2.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input stack-label
              label   ="Buscar por"
              debounce="1000"
              v-model ="searchBy"
              class   ="full-width"
          />
        </div>
      </div>
    </div>

    <!-- search results -->

    <div class="col-12 q-mt-md">
      <q-tabs
        :horizontal="$q.screen.gt.xs"
        align      ="justify"
        v-model    ="currentTab"
        class      ="bg-white text-primary"
      >
        <q-tab
          name ="allClient"
          label="Fornecedores"
        />
        <!--
        <q-tab
          name ="inactiveClient"
          label="Fornecedores inativos"
        />
        <q-tab
          name ="activeClient"
          label="Fornecedores ativos"
        />
        <q-tab
          name ="newClient"
          label="Fornecedores novos"
        />
        -->
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="allClient" class="q-px-none">
          <TableAllProviders
            ref      ="allClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onProviderSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

      <!--
        <q-tab-panel name="inactiveClient" class="q-px-none">
          <TableProvidersInactive
            ref      ="inactiveClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onProviderSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="activeClient" class="q-px-none">
          <TableProvidersActive
            ref      ="activeClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onProviderSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="newClient" class="q-px-none">
          <TableProvidersNew
            ref      ="newClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onProviderSelected"
            @before  ="(params) => {              
              if (this.fetchs.loadClients) {                
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>
        -->
      </q-tab-panels>
    </div>

  </div>
</template>

<script>
import { date }                  from 'quasar';
import TableAllProviders         from './components/TableAllProviders.vue';
//import TableProvidersInactive  from './components/TableProvidersInactive.vue';
//import TableProvidersActive    from './components/TableProvidersActive.vue';
//import TableProvidersNew       from './components/TableProvidersNew.vue';
import Api                     from '@controleonline/quasar-common-ui/src/utils/api';

export default {
  props: {
    config: {
      type    : Object,
      required: true
    },
    fetchs: {
      type    : Object,
      required: false
    },
  },

  components: {
    TableAllProviders,
    //TableProvidersInactive,
    //TableProvidersActive  ,
    //TableProvidersNew     ,
  },

  created() {
    this.api = new Api(
     this.config.token
    );
  },

  data () {
    return {
      currentTab: 'allClient',
      dateFrom  : date.formatDate(date.subtractFromDate(Date.now(), { month: 1 }), 'DD-MM-YYYY'),
      dateTo    : date.formatDate(Date.now(), 'DD-MM-YYYY'),
      searchBy  : '',
      api       : null,
    }
  },

  methods: {
    loadCurrentTabRows() {
      this.$refs[this.currentTab].reload();
    },

    onProviderSelected(clientId) {
      if (!clientId)
        return;

      this.$router.push({
        name  : 'ProvidersDetails',
        params: {
          id: clientId
        }
      });
    },
  },
}
</script>