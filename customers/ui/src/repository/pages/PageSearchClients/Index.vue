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
          name ="inactiveClient"
          label="Clientes inativos"
        />
        <q-tab
          name ="prospectsClient"
          label="Prospects"
        />
        <q-tab
          name ="activeClient"
          label="Clientes ativos"
        />
        <q-tab
          name ="newClient"
          label="Clientes novos"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="inactiveClient" class="q-px-none">
          <TableClientsInactive
            ref      ="inactiveClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onClientSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="prospectsClient" class="q-px-none">
          <TableClientsProspects
            ref      ="prospectsClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onClientSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="activeClient" class="q-px-none">
          <TableClientsActive
            ref      ="activeClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onClientSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="newClient" class="q-px-none">
          <TableClientsNew
            ref      ="newClient"
            :api     ="api"
            :fromDate="dateFrom"
            :toDate  ="dateTo"
            :searchBy="searchBy"
            @selected="onClientSelected"
            @before  ="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

  </div>
</template>

<script>
import { date }              from 'quasar';
import TableClientsInactive  from './components/TableClientsInactive.vue';
import TableClientsProspects from './components/TableClientsProspects.vue';
import TableClientsActive    from './components/TableClientsActive.vue';
import TableClientsNew       from './components/TableClientsNew.vue';
import Api                   from '@freteclick/quasar-common-ui/src/utils/api';

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
    TableClientsInactive ,
    TableClientsProspects,
    TableClientsActive   ,
    TableClientsNew      ,
  },

  created() {
    this.api = new Api(
     this.config.token
    );
  },

  data () {
    return {
      currentTab: 'inactiveClient',
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

    onClientSelected(clientId) {
      if (!clientId)
        return;

      this.$router.push({
        name  : 'ClientsDetails',
        params: {
          id: clientId
        }
      });
    },
  },
}
</script>