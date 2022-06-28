<template>
  <div class="row">
    <q-btn no-caps color="grey-3" icon="arrow_back" class="text-grey-9" unelevated label="Voltar" @click="goBack" />
    <div class="col-12">
      <div class="text-subtitle1 text-left q-pt-md">
        {{ people.name }}
      </div>
      <q-card-section v-if="people.type === 'J'" align="right" class="q-pt-none">
        <q-rating v-model="people.averageRating" size="2.9em" color="yellow" class="justify-center" />
      </q-card-section>
    </div>

    <div class="col-12 q-pa-md text-center">
      <PersonAvatar :url="people.avatar" :upload="`${baseUrl}/${people_type}/${this.$route.params.id}/upload-logo`"
        @uploaded="
          (data) => {
            if (data.url) {
              this.people.avatar = `${this.baseUrl}/files/${data.id}/image.jpg`;
            }
          }
        " />
    </div>
    <div class="col-12">
      <q-tabs align="start" v-model="currentTab" no-caps class="bg-transparent text-primary" dense>
        <q-tab name="summary" :label="$t('Details')" />
        <q-tab name="tasks" :label="$t('Tasks')" />
        <q-tab name="employees" :label="$t('Employees')" v-if="people.type === 'J'" />
        <q-tab name="billing" :label="$t('Billing')" />
        <q-tab name="calls" :label="$t('Calls')" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="currentTab" class="bg-transparent">
        <q-tab-panel name="summary" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12">
            <PeopleSummary :people_type="people_type" :api="api" :id="peopleId" @error="
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
            <PeopleAdminAddresses :people_type="people_type" :api="api" :id="peopleId" @error="
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
              <PeopleAdminEmails :people_type="people_type" class="full-height" :api="api" :id="peopleId" @error="
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
              <PeopleAdminPhones :people_type="people_type" class="full-height" :api="api" :id="peopleId" @error="
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
            <PeopleAdminDocuments :people_type="people_type" :api="api" :id="peopleId" @error="
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

          <div class="col-12" v-if="people.type === 'F'">
            <PeopleAdminUsers :people_type="people_type" :api="api" :id="peopleId" @error="
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

          <div class="col-12" v-if="people.type === 'F'">
            <PeopleCompany :people_type="people_type" :api="api" :id="peopleId" @error="
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
        name: this.getRoute('Details'),
        params: { id: data.id },
      });
    }
  }
" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="tasks" class="q-pa-none">
          <OrderTasks v-if="provider" :provider="provider" :task_type="'support'" :registeredBy="user.people"
            :taskFor="user.people" :key="key" :client="people" />
        </q-tab-panel>

        <q-tab-panel name="employees" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12" v-if="people.type === 'J'">
            <PeopleAdminEmployees :people_type="people_type" :api="api" :id="peopleId" @error="
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
        name: this.getRoute('Details'),
        params: { id: data.id },
      });
    }
  }
" />
          </div>

          <div class="col-12">
            <PeopleSalesman :people_type="people_type" :api="api" :id="peopleId" @error="
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
            <PeopleAdminBilling :people_type="people_type" :api="api" :id="peopleId" @error="
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
            <PeopleOrders :people_type="people_type" :api="api" :id="peopleId" @error="
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
            <PeopleContracts :people_type="people_type" :api="api" :id="peopleId" @error="
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
          <TasksSearching :provider="provider" :client="people" :task_type="'relationship'" :registeredBy="user.people"
            :taskFor="user.people" :key="key" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>


<script>
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import Api from "@controleonline/quasar-common-ui/src/utils/api";

import TasksSearching from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import PeopleAdminEmails from "../../components/AdminEmails.vue";
import PeopleAdminUsers from "../../components/AdminUsers.vue";
import PeopleAdminAddresses from "../../components/AdminAddresses.vue";
import PeopleAdminPhones from "../../components/AdminPhones.vue";
import PeopleAdminDocuments from "../../components/AdminDocuments.vue";
import PeopleAdminEmployees from "../../components/AdminEmployees.vue";
import PeopleAdminBilling from "../../components/AdminBilling.vue";
import PeopleOrders from "../../components/Orders.vue";
import PeopleContracts from "../../components/Contracts.vue";
import PeopleSummary from "../../components/Summary.vue";
import PeopleSalesman from "../../components/Salesman.vue";
import PeopleCompany from "../../components/Company.vue";
import { ENTRYPOINT } from "../../../../../../../src/config/entrypoint";
import PersonAvatar from "@controleonline/quasar-common-ui/src/components/common/PersonAvatar";
import { mapGetters } from "vuex";

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
    PeopleAdminEmails,
    PeopleAdminUsers,
    PeopleAdminAddresses,
    PeopleAdminPhones,
    PeopleAdminDocuments,
    PeopleAdminEmployees,
    PeopleAdminBilling,
    PeopleOrders,
    PeopleContracts,
    PeopleSummary,
    PeopleSalesman,
    PeopleCompany,
    OrderTasks,
    TasksSearching,
    PersonAvatar
  },

  created() {
    this.provider = this.myCompany.id;
    this.api = new Api(this.config.token);

    this.getPeople();
  },

  data() {
    return {
      baseUrl: ENTRYPOINT,
      people: {},
      currentTab: "summary",
      api: null,
      goBackRoute: null,
      peopleId: this.id,
      provider: null,
      key: null,
      people: {
        averageRating: 4,
        name: "Carregando...",
        type: null,
      },
    };
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.provider = company.id;
        this.key++;
      }
    },
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    getRoute(inc) {
      let route = this.people_type.charAt(0).toUpperCase() + this.people_type.slice(1);
      route = route.substring(0, route.length - 1) + inc;
      return route;
    },

    goBack() {
      if (this.goBackRoute) {
        this.$router.push(this.goBackRoute);
        return
      }

      this.$router.push({ name: this.getRoute('Index') });
    },

    getPeople() {
      return this.api
        .private(`people/${this.peopleId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data["@id"]) {
            this.people = data;
            this.people.id = this.peopleId;
            this.averageRating = data.averageRating;

            this.people.avatar =
              data.file !== null
                ? `${ENTRYPOINT}/files/${data.file.id}/image.png`
                : null;

            this.people.name =
              data.peopleType === "J"
                ? data.alias
                : `${data.name} ${data.alias}`;
            this.people.type = data.peopleType;
          }
        });
    },
  },
};
</script>
