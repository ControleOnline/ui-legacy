<template>
  <div class="row">
    <q-btn no-caps color="grey-3" icon="arrow_back" class="text-grey-9" unelevated label="Voltar" @click="goBack" />



    <div class="q-pb-xs col-12">
      <div class="text-subtitle1 text-left">
        {{ client.name }}
      </div>
      <q-card-section v-if="client.type === 'J'" align="right" class="q-pt-none">
        <q-rating v-model="client.averageRating" size="2.9em" color="yellow" class="justify-center" />
      </q-card-section>
    </div>

    <div class="col-12 q-pa-md text-center">
      <PersonAvatar :url="client.avatar" :upload="`${baseUrl}/${people_type}/${this.$route.params.id}/upload-logo`"
        @uploaded="
          (data) => {
            if (data.url) {
              this.client.avatar = `${this.baseUrl}/files/${data.id}/image.jpg`;
            }
          }
        " />
    </div>
    <div class="col-12">
      <q-tabs align="start" v-model="currentTab" no-caps class="bg-transparent text-primary" dense>
        <q-tab name="summary" :label="$t('Details')" />
        <q-tab name="tasks" :label="$t('Tasks')" />
        <q-tab name="employees" :label="$t('Employees')" v-if="client.type === 'J'" />
        <q-tab name="billing" :label="$t('Billing')" />
        <q-tab name="calls" :label="$t('Calls')" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="currentTab" class="bg-transparent">
        <q-tab-panel name="summary" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12">
            <CustomerSummary :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12">
            <ClientAdminAddresses :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12 row">
            <div class="col-xs-12 col-sm-6">
              <ClientAdminEmails class="full-height" :api="api" :id="clientId" @error="
                (error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }
              " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
            </div>

            <div class="col-xs-12 col-sm-6 q-pl-lg">
              <ClientAdminPhones class="full-height" :api="api" :id="clientId" @error="
                (error) => {
                  this.$q.notify({
                    message: error.message,
                    position: 'bottom',
                    type: 'negative',
                  });
                }
              " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
            </div>
          </div>

          <div class="col-12">
            <ClientAdminDocuments :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12" v-if="client.type === 'F'">
            <ClientAdminUsers :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12" v-if="client.type === 'F'">
            <CustomerCompany :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
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
" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="tasks" class="q-pa-none">
          <OrderTasks :client="people" />
        </q-tab-panel>

        <q-tab-panel name="employees" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12" v-if="client.type === 'J'">
            <ClientAdminEmployees :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
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
" />
          </div>

          <div class="col-12">
            <CustomerSalesman :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="billing" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12">
            <ClientAdminBilling :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12">
            <CustomerOrders :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>

          <div class="col-12">
            <CustomerContracts :api="api" :id="clientId" @error="
              (error) => {
                this.$q.notify({
                  message: error.message,
                  position: 'bottom',
                  type: 'negative',
                });
              }
            " @saved="
  (data) => {
    this.$q.notify({
      message: 'Data successfully saved',
      position: 'bottom',
      type: 'positive',
    });
  }
" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="calls" class="q-px-xs">
          <Calls :client="clientId" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>


<script>
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import Calls from "@controleonline/quasar-crm-ui/src/pages/CustomerServices";
import ClientAdminEmails from "../../components/AdminEmails.vue";
import ClientAdminUsers from "../../components/AdminUsers.vue";
import ClientAdminAddresses from "../../components/AdminAddresses.vue";
import ClientAdminPhones from "../../components/AdminPhones.vue";
import ClientAdminDocuments from "../../components/AdminDocuments.vue";
import ClientAdminEmployees from "../../components/AdminEmployees.vue";
import ClientAdminBilling from "../../components/AdminBilling.vue";
import CustomerOrders from "../../components/Orders.vue";
import CustomerContracts from "../../components/Contracts.vue";
import CustomerSummary from "../../components/Summary.vue";
import CustomerSalesman from "../../components/Salesman.vue";
import CustomerCompany from "../../components/Company.vue";
import { ENTRYPOINT } from "../../../../../../../src/config/entrypoint";
import PersonAvatar from "@controleonline/quasar-common-ui/src/components/common/PersonAvatar";



export default {
  props: {
    id: {
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    people_type: {
      type: String,
      required: true
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
    PersonAvatar
  },

  created() {
    this.api = new Api(this.config.token);

    this.getClient();
  },

  data() {
    return {
      baseUrl: ENTRYPOINT,
      people: {},
      currentTab: "summary",
      api: null,
      goBackRoute: null,
      clientId: this.id,
      client: {
        averageRating: 4,
        name: "Carregando...",
        type: null,
      },
    };
  },

  methods: {
    goBack() {
      if (this.goBackRoute) {
        this.$router.push(this.goBackRoute);
        return
      }

      this.$router.push({ name: 'ClientsIndex' });
    },

    getClient() {
      return this.api
        .private(`people/${this.clientId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data["@id"]) {
            this.people = data;
            this.people.id = this.clientId;
            this.averageRating = data.averageRating;

            this.people.avatar =
              data.file !== null
                ? `${ENTRYPOINT}/files/${data.file.id}/image.png`
                : null;

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
