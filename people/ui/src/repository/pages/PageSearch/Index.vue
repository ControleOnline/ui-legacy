<template>
  <div class="row">
    <!-- search fields -->
    <div class="col-12">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-4">
          <q-input v-model="dateFrom" label="Data inicio" stack-label outlined>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom" mask="DD-MM-YYYY" @input="() => $refs.qDateProxy1.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input v-model="dateTo" label="Data fim" stack-label outlined>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo" mask="DD-MM-YYYY" @input="() => $refs.qDateProxy2.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input stack-label label="Buscar por" debounce="1000" v-model="searchBy" class="full-width" outlined>
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
      </div>
    </div>
    <!-- search results -->
    <div class="col-12 q-mt-md">
      <div class="row">
        <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab"
          class="bg-transparent text-primary col-auto" dense>
          <q-tab v-if="people_type == 'customers'" name="leads" :label="$t('Leads')" class="text-capitalize" />
          <q-tab name="allClients" :label="$t(people_type)" class="text-capitalize" />
          <q-tab v-if="people_type == 'customers'" name="inactiveClient" :label="$t('Inactive') + ' ' + $t(people_type)"
            class="text-capitalize" />
          <q-tab v-if="people_type == 'customers'" name="prospectsClient" :label="$t('Prospects')"
            class="text-capitalize" />
          <q-tab v-if="people_type == 'customers'" name="activeClient" :label="$t('Active') + ' ' + $t(people_type)"
            class="text-capitalize" />
          <q-tab v-if="people_type == 'customers'" name="newClient" :label="$t('New') + ' ' + $t(people_type)"
            class="text-capitalize" />
        </q-tabs>
      </div>

      <q-separator />

      <q-tab-panels v-model="currentTab" class="q-mt-sm bg-transparent">


        <q-tab-panel name="leads" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="leads" :people_type="people_type" :pageType="'leads'" :api="api"
            :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>


        <q-tab-panel name="allClients" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="allClients" :people_type="people_type" :pageType="'all'" :api="api"
            :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>

        <q-tab-panel name="inactiveClient" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="inactiveClient" :people_type="people_type" :pageType="'inactive'"
            :api="api" :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>

        <q-tab-panel name="prospectsClient" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="prospectsClient" :people_type="people_type" :pageType="'prospect'"
            :api="api" :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>

        <q-tab-panel name="activeClient" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="activeClient" :people_type="people_type" :pageType="'active'"
            :api="api" :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>

        <q-tab-panel name="newClient" class="q-pa-xs">
          <TableAllClients :provider="provider" ref="newClient" :people_type="people_type" :pageType="'new'" :api="api"
            :fromDate="dateFrom" :toDate="dateTo" :searchBy="searchBy" @selected="onClientSelected" @before="(params) => {
              if (this.fetchs.loadClients) {
                this.fetchs.loadClients.before(params);
              }
            }" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar';
import TableAllClients from './components/TableAllClients.vue';
import Api from '@controleonline/quasar-common-ui/src/utils/api';

export default {
  props: {
    config: {
      type: Object,
      required: true
    },
    provider: {
      required: true
    },
    people_type: {
      type: String,
      required: true
    },
    fetchs: {
      type: Object,
      required: false
    },
  },

  components: {
    TableAllClients,
  },

  created() {
    this.api = new Api(
      this.config.token
    );
  },

  data() {
    return {
      currentTab: 'allClients',
      dateFrom: date.formatDate(date.subtractFromDate(Date.now(), { month: 1 }), 'DD-MM-YYYY'),
      dateTo: date.formatDate(Date.now(), 'DD-MM-YYYY'),
      searchBy: '',
      api: null,
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
        name: 'CustomersDetails',
        params: {
          id: clientId
        }
      });
    },
  },
}
</script>