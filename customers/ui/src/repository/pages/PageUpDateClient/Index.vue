<template>
  <div class="row">
    <div class="col-12 q-py-xs text-h6">Atualização cadastral do cliente</div>

    <div class="q-pb-xs col-12">
      <div class="text-subtitle1 text-left">
        {{ client.name }}
      </div>
    </div>

    <div class="col-12">
      <q-tabs
        align="start"
        v-model="currentTab"
        no-caps
        class="bg-transparent text-primary"
        dense
      >
        <q-tab v-if="client.type === 'F'" name="companies" label="Empresas" />

        <q-tab name="summary" label="Detalhes" />
        <q-tab name="tasks" label="Ocorrências" />
        <q-tab name="salesman" label="Vendedor" />
        <q-tab
          v-if="client.type === 'J'"
          name="employees"
          label="Funcionários"
        />
        <q-tab v-if="client.type === 'F'" name="users" label="Usuários" />
        <q-tab name="billing" label="Financeiro" />
        <q-tab name="orders" :label="$t('menu.salesorders')" />
        <q-tab name="contracts" label="Contratos" />
        <q-tab name="calls" label="Atendimentos" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" class="bg-transparent">
        <q-tab-panel name="summary" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12">
            <CustomerSummary
              :api="api"
              :id="clientId"
              @error="
                (error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }
              "
              @saved="
                (data) => {
                  this.$q.notify({
                    message: 'Data successfully saved',
                    position: 'bottom',
                    type: 'positive',
                  });
                }
              "
            />
          </div>

          <div class="col-12">
            <ClientAdminAddresses
              :api="api"
              :id="clientId"
              @error="
                (error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }
              "
              @saved="
                (data) => {
                  this.$q.notify({
                    message: 'Data successfully saved',
                    position: 'bottom',
                    type: 'positive',
                  });
                }
              "
            />
          </div>

          <div class="col-12 row">
            <div class="col-xs-12 col-sm-6">
              <ClientAdminEmails
                class="full-height"
                :api="api"
                :id="clientId"
                @error="
                  (error) => {
                    this.$q.notify({
                      message: error.message,
                      position: 'bottom',
                      type: 'negative',
                    });
                  }
                "
                @saved="
                  (data) => {
                    this.$q.notify({
                      message: 'Data successfully saved',
                      position: 'bottom',
                      type: 'positive',
                    });
                  }
                "
              />
            </div>

            <div class="col-xs-12 col-sm-6 q-pl-lg">
              <ClientAdminPhones  
                class="full-height"
                :api="api"
                :id="clientId"
                @error="
                  (error) => {
                    this.$q.notify({
                      message: error.message,
                      position: 'bottom',
                      type: 'negative',
                    });
                  }
                "
                @saved="
                  (data) => {
                    this.$q.notify({
                      message: 'Data successfully saved',
                      position: 'bottom',
                      type: 'positive',
                    });
                  }
                "
              />
            </div>
          </div>

          <div class="col-12">
            <ClientAdminDocuments
              :api="api"
              :id="clientId"
              @error="
                (error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }
              "
              @saved="
                (data) => {
                  this.$q.notify({
                    message: 'Data successfully saved',
                    position: 'bottom',
                    type: 'positive',
                  });
                }
              "
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="tasks" class="q-pa-none">
          <OrderTasks :client="people" />
        </q-tab-panel>

        <q-tab-panel name="salesman">
          <CustomerSalesman
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="users" class="q-pa-none">
          <ClientAdminUsers
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="employees">
          <ClientAdminEmployees
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });

                if (data.id) {
                  this.$router.push({
                    name: 'ClientsDetails',
                    params: { id: data.id },
                  });
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="billing" class="q-pr-none">
          <ClientAdminBilling
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="orders" class="q-px-xs">
          <CustomerOrders
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="contracts" class="q-px-xs">
          <CustomerContracts
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="calls" class="q-px-xs">
          <Calls />
        </q-tab-panel>

        <q-tab-panel name="companies">
          <CustomerCompany
            :api="api"
            :id="clientId"
            @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            "
            @saved="
              (data) => {
                this.$q.notify({
                  message: 'Data successfully saved',
                  position: 'bottom',
                  type: 'positive',
                });

                if (data.id) {
                  this.$router.push({
                    name: 'ClientsDetails',
                    params: { id: data.id },
                  });
                }
              }
            "
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import Calls from "@controleonline/quasar-crm-ui/src/pages/CustomerServices";
import ClientAdminEmails from "../../components/ClientAdminEmails.vue";
import ClientAdminUsers from "../../components/ClientAdminUsers.vue";
import ClientAdminAddresses from "../../components/ClientAdminAddresses.vue";
import ClientAdminPhones from "../../components/ClientAdminPhones.vue";
import ClientAdminDocuments from "../../components/ClientAdminDocuments.vue";
import ClientAdminEmployees from "../../components/ClientAdminEmployees.vue";
import ClientAdminBilling from "../../components/ClientAdminBilling.vue";
import CustomerOrders from "../../components/CustomerOrders.vue";
import CustomerContracts from "../../components/CustomerContracts.vue";
import CustomerSummary from "../../components/CustomerSummary.vue";
import CustomerSalesman from "../../components/CustomerSalesman.vue";
import CustomerCompany from "../../components/CustomerCompany.vue";

export default {
  props: {
    id: {
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },

  components: {
    ClientAdminEmails,
    ClientAdminUsers,
    ClientAdminAddresses,
    ClientAdminPhones,
    ClientAdminDocuments,
    ClientAdminEmployees,
    ClientAdminBilling,
    CustomerOrders,
    CustomerContracts,
    CustomerSummary,
    CustomerSalesman,
    CustomerCompany,
    OrderTasks,
    Calls,
  },

  created() {
    this.api = new Api(this.config.token);

    this.getClient();
  },

  data() {
    return {
      people:{},
      currentTab: "summary",
      api: null,
      clientId: this.id,
      client: {
        name: "Carregando...",
        type: null,
      },
    };
  },

  methods: {
    getClient() {
      return this.api
        .private(`people/${this.clientId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data["@id"]) {
            this.people = data;
            this.people.id = this.clientId;
            this.client.name =
              data.peopleType === "J"
                ? data.alias
                : `${data.name} ${data.alias}`;
            this.client.type = data.peopleType;
          }
        });
    },
  },
};
</script>
