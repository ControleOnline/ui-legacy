<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <q-btn flat no-caps icon="arrow_back" :to="{ name: 'CarrierDetails', params: { id: this.carrierId } }"
          label="Voltar à transportadora" />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md">
            <div class="row">
              <div class="col-xs-12 col-sm-6 text-h6 text-left">
                {{ table.name || 'Carregando...' }}
              </div>
              <div class="col-xs-12 col-sm-6 text-right q-mt-sm">
                <div class="row justify-end q-gutter-xs">
                  <q-btn label="Incrementar taxas" icon="add" size="md" color="primary" @click="dialog = !dialog"
                    :class="$q.screen.lt.sm ? 'full-width' : ''" />
                  <q-btn label="Adicionar conjunto taxas" icon="add" size="md" color="primary"
                    @click="dialog2 = !dialog2" :class="$q.screen.lt.sm ? 'full-width' : ''" />
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <q-tabs align="justify" v-model="currentTab" class="bg-white text-primary">
              <q-tab name="summary" label="Sumário" />
              <q-tab name="import" label="Importar" />
              <q-tab name="fixedTax" label="Taxa fixa" />
              <q-tab name="fixedPercentage" label="Taxa por porcentagem" />
              <q-tab name="fixedKg" label="Taxa fixa por KG" />
              <q-tab name="table" label="Tabela" />
              <q-tab name="taxPercentInvoice" label="Taxa por porcentagem NF ou FRETE" />
              <q-tab name="taxRegion" label="Taxa KG por Praça" />
              <q-tab name="fixedKm" label="Taxa fixa por distância" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="currentTab">
              <q-tab-panel name="summary">
                <CarrierTableSummary :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="import">
                <CarrierImports :tableId="tableId" :api="API" />
              </q-tab-panel>
              <q-tab-panel name="fixedTax">
                <CarrierTableFixedtax :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="fixedPercentage">
                <CarrierTableFixedpercentage :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="fixedKg">
                <CarrierTableFixedkg :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="table">
                <CarrierTableTabela :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="taxPercentInvoice">
                <CarrierTableTaxpercentinvoice :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="taxRegion">
                <CarrierTableTaxregion :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
              <q-tab-panel name="fixedKm">
                <CarrierTableFixedkm :api="API" :table="table" @error="(error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 95vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('Incrementar valor taxas') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <TableIncreaseTaxes :table="table" :api="API" @error="(error) => {
            this.$q.notify({
              message: error.message,
              position: 'bottom',
              type: 'negative',
            });
          }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog2">
      <q-card style="width: 1200px; max-width: 95vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('Adicionar conjunto taxas') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <TableMultipleTaxes :table="table" :api="API" @error="(error) => {
            this.$q.notify({
              message: error.message,
              position: 'bottom',
              type: 'negative',
            });
          }" @saved="(data) => {
  this.$q.notify({
    message: 'Os dados foram salvos com sucesso',
    position: 'bottom',
    type: 'positive',
  });
}" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import CarrierTableSummary from '../../components/carrier/TableSummary';
import CarrierTableFixedtax from '../../components/carrier/TableFixedtax';
import CarrierTableFixedpercentage from '../../components/carrier/TableFixedpercentage';
import CarrierTableFixedkg from '../../components/carrier/TableFixedkg';
import CarrierTableTabela from '../../components/carrier/TableTabela';
import CarrierTableTaxpercentinvoice from '../../components/carrier/TableTaxpercentinvoice';
import CarrierTableTaxregion from '../../components/carrier/TableTaxregion';
import CarrierTableFixedkm from '../../components/carrier/TableFixedkm';
import TableIncreaseTaxes from '../../components/carrier/TableIncreaseTaxes';
import TableMultipleTaxes from '../../components/carrier/TableMultipleTaxes';
import CarrierImports from '@controleonline/quasar-import-ui/src/components/Import/ImportsList';

export default {
  components: {
    CarrierTableSummary,
    CarrierTableFixedtax,
    CarrierTableFixedpercentage,
    CarrierTableFixedkg,
    CarrierTableTabela,
    CarrierTableTaxpercentinvoice,
    CarrierTableTaxregion,
    CarrierTableFixedkm,
    TableIncreaseTaxes,
    TableMultipleTaxes,
    CarrierImports
  },

  created() {
    this.getTable();
  },

  data() {
    return {
      API: new Api(this.$store.getters['auth/user'].token),
      currentTab: 'summary',
      carrierId: this.$route.params.id,
      tableId: this.$route.params.tableId,
      dialog: false,
      dialog2: false,
      table: {
        carrier: null,
        id: null,
        code: null,
        name: null,
        maxHeight: null,
        maxWidth: null,
        maxDepth: null,
        minCubage: null,
        maxCubage: null,
        marketplace: null,
        website: null,
      }
    }
  },

  methods: {
    getTable() {
      return this.API.private(`delivery_tax_groups/${this.tableId}`)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.table.carrier = this.carrierId;
            this.table.id = this.tableId;
            this.table.code = data.code;
            this.table.name = data.groupName;
            this.table.maxHeight = (parseFloat(data.maxHeight) + 0.001).toFixed(2);
            this.table.maxWidth = (parseFloat(data.maxWidth) + 0.001).toFixed(2);
            this.table.maxDepth = (parseFloat(data.maxDepth) + 0.001).toFixed(2);
            this.table.minCubage = (parseFloat(data.minCubage) + 0.001).toFixed(2);
            this.table.maxCubage = (parseFloat(data.maxCubage) + 0.001).toFixed(2);
            this.table.marketplace = data.marketplace;
            this.table.website = data.website;
          }
        });
    }
  },
}
</script>
