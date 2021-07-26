<template>
  <div class="row">
    <div class="col-12 q-pa-md text-h6">
      Atualização de cadastro de fornecedor
    </div>

    <div class="col-12">
      <div class="q-pa-md text-subtitle1 text-center">
        {{ client.name }}
      </div>
    </div>

    <div class="col-12">
      <q-tabs
        align  ="justify"
        v-model="currentTab"
        class  ="bg-white text-primary"
      >
        <q-tab
          name ="summary"
          label="Resumo"
        />
        <q-tab
          name ="salesman"
          label="Vendedor"
        />
        <q-tab v-if="client.type === 'J'"
          name ="employees"
          label="Funcionários"
        />
        <q-tab
          name ="address"
          label="Endereços"
        />
        <q-tab
          name ="documents"
          label="Documentos"
        />
        <q-tab v-if="client.type === 'F'"
          name ="emails"
          label="Emails"
        />
        <q-tab v-if="client.type === 'F'"
          name ="users"
          label="Usuários"
        />
        <q-tab v-if="client.type === 'F'"
          name ="phones"
          label="Telefones"
        />
        <q-tab
          name ="billing"
          label="Financeiro"
        />
        <q-tab
          name ="orders"
          label="Pedidos"
        />
        <q-tab
          name ="contracts"
          label="Contratos"
        />
        <q-tab v-if="client.type === 'F'"
          name ="companies"
          label="Empresas"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="summary">
          <ProvidersSummary
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="salesman">
          <ProvidersSalesman
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="emails">
          <ProvidersAdminEmails
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="users">
          <ProvidersAdminUsers
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="address">
          <ProvidersAdminAddresses
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="phones">
          <ProvidersAdminPhones
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="documents">
          <ProvidersAdminDocuments
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="employees">
          <ProvidersAdminEmployees
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });

              if (data.id) {
                this.$router.push({
                  name  : 'ProvidersDetails',
                  params: { id: data.id }
                });
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="billing">
          <ProvidersAdminBilling
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="orders">
          <ProvidersOrders
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="contracts">
          <ProvidersContracts
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="companies">
          <ProvidersCompany
            :api  ="api"
            :id   ="clientId"
            @error="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'negative',
              });
            }"
            @saved="(data) => {
              this.$q.notify({
                message : 'Data successfully saved',
                position: 'bottom',
                type    : 'positive',
              });

              if (data.id) {
                this.$router.push({
                  name  : 'ProvidersDetails',
                  params: { id: data.id }
                });
              }
            }"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

  </div>
</template>

<script>
import Api                     from '@freteclick/quasar-common-ui/src/utils/api';
import ProvidersAdminEmails    from '../../components/ProvidersAdminEmails.vue';
import ProvidersAdminUsers     from '../../components/ProvidersAdminUsers.vue';
import ProvidersAdminAddresses from '../../components/ProvidersAdminAddresses.vue';
import ProvidersAdminPhones    from '../../components/ProvidersAdminPhones.vue';
import ProvidersAdminDocuments from '../../components/ProvidersAdminDocuments.vue';
import ProvidersAdminEmployees from '../../components/ProvidersAdminEmployees.vue';
import ProvidersAdminBilling   from '../../components/ProvidersAdminBilling.vue';
import ProvidersOrders         from '../../components/ProvidersOrders.vue';
import ProvidersContracts      from '../../components/ProvidersContracts.vue';
import ProvidersSummary        from '../../components/ProvidersSummary.vue';
import ProvidersSalesman       from '../../components/ProvidersSalesman.vue';
import ProvidersCompany        from '../../components/ProvidersCompany.vue';

export default {
  props: {
    id    : {
      required: true,
    },
    config: {
      type    : Object,
      required: true
    },
  },

  components: {
    ProvidersAdminEmails   ,
    ProvidersAdminUsers    ,
    ProvidersAdminAddresses,
    ProvidersAdminPhones   ,
    ProvidersAdminDocuments,
    ProvidersAdminEmployees,
    ProvidersAdminBilling  ,
    ProvidersOrders        ,
    ProvidersContracts     ,
    ProvidersSummary       ,
    ProvidersSalesman      ,
    ProvidersCompany       ,
  },

  created() {
    this.api = new Api(
      this.config.token
    );

    this.getClient();
  },

  data () {
    return {
      currentTab: 'summary',
      api       : null,
      clientId  : this.id,
      client    : {
        name: 'Carregando...',
        type: null,
      }
    }
  },

  methods: {
    getClient() {
      return this.api.private(`people/${this.clientId}`)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.client.name = data.peopleType === 'J' ? data.alias : `${data.name} ${data.alias}`;
            this.client.type = data.peopleType;
          }
        });
    }
  },
}
</script>
