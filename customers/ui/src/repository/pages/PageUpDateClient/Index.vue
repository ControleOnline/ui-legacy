<template>
  <div class="row">
    <div class="col-12 q-pa-md text-h6">
      Atualização de cadastro de cliente
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
        <q-tab v-if="client.type === 'F'"
          name ="companies"
          label="Empresas"
        />

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
          :label="$t('orders')"
        />
        <q-tab
          name ="contracts"
          label="Contratos"
        />
        
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="currentTab"
      >
        <q-tab-panel name="summary">
          <CustomerSummary
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
          <CustomerSalesman
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
          <ClientAdminEmails
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
          <ClientAdminUsers
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
          <ClientAdminAddresses
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
          <ClientAdminPhones
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
          <ClientAdminDocuments
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
          <ClientAdminEmployees
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
                  name  : 'ClientsDetails',
                  params: { id: data.id }
                });
              }
            }"
          />
        </q-tab-panel>

        <q-tab-panel name="billing">
          <ClientAdminBilling
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
          <CustomerOrders
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
          <CustomerContracts
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
          <CustomerCompany
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
                  name  : 'ClientsDetails',
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
import Api                  from '@controleonline/quasar-common-ui/src/utils/api';
import ClientAdminEmails    from '../../components/ClientAdminEmails.vue';
import ClientAdminUsers     from '../../components/ClientAdminUsers.vue';
import ClientAdminAddresses from '../../components/ClientAdminAddresses.vue';
import ClientAdminPhones    from '../../components/ClientAdminPhones.vue';
import ClientAdminDocuments from '../../components/ClientAdminDocuments.vue';
import ClientAdminEmployees from '../../components/ClientAdminEmployees.vue';
import ClientAdminBilling   from '../../components/ClientAdminBilling.vue';
import CustomerOrders       from '../../components/CustomerOrders.vue';
import CustomerContracts    from '../../components/CustomerContracts.vue';
import CustomerSummary      from '../../components/CustomerSummary.vue';
import CustomerSalesman     from '../../components/CustomerSalesman.vue';
import CustomerCompany      from '../../components/CustomerCompany.vue';

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
    ClientAdminEmails   ,
    ClientAdminUsers    ,
    ClientAdminAddresses,
    ClientAdminPhones   ,
    ClientAdminDocuments,
    ClientAdminEmployees,
    ClientAdminBilling  ,
    CustomerOrders      ,
    CustomerContracts   ,
    CustomerSummary     ,
    CustomerSalesman    ,
    CustomerCompany     ,
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
