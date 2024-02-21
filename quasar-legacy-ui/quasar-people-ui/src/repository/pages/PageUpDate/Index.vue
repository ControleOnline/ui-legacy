<template>
  <div class="row">
    <q-btn
      no-caps
      color="grey-3"
      icon="arrow_back"
      class="text-grey-9"
      unelevated
      label="Voltar"
      @click="goBack"
    />
    <div class="col-12">
      <div class="text-subtitle1 text-left q-pt-md">
        {{ people.name }}
      </div>
      <q-card-section v-if="people.type === 'J'" align="right" class="q-pt-none">
        <q-rating
          v-model="people.averageRating"
          size="2.9em"
          color="yellow"
          class="justify-center"
        />
      </q-card-section>
    </div>

    <div class="col-12 q-pa-md text-center">
      <PersonAvatar
        :url="people.avatar"
        :upload="`${baseUrl}/${people_type}/${this.$route.params.id}/upload-logo`"
        @uploaded="
          (data) => {
            if (data.url) {
              this.people.avatar = `${this.baseUrl}${data.url}`;
            }
          }
        "
      />
    </div>
    <div class="col-12">
      <q-tabs
        v-model="currentTab"
        no-caps
        class="bg-transparent text-primary"
        dense
      >
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
            <PeopleSummary
              :people_type="people_type"
              :particulars_context="context_type"
              :id="peopleId"
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
            <PeopleAdminAddresses
              :people_type="people_type"
              :id="peopleId"
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
          <div v-if="people.type === 'F'" class="col-12 row">
            <div class="col-xs-12 col-sm-6">
              <PeopleAdminEmails
                :people_type="people_type"
                class="full-height"
                :id="peopleId"
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
            <div v-if="people.type === 'F'" class="col-xs-12 col-sm-6 q-pl-lg">
              <PeopleAdminPhones
                :people_type="people_type"
                class="full-height"
                :id="peopleId"
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
            <PeopleAdminDocuments
              :people_type="people_type"
              :id="peopleId"
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

          <div class="col-12" v-if="people.type === 'F' && people_type !== 'providers' ">
            <PeopleAdminUsers
              :people_type="people_type"
              :id="peopleId"
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

          <div class="col-12" v-if="people.type === 'F' && people_type !== 'providers' ">
            <PeopleCompany
              :people_type="people_type"
              :id="peopleId"
              @error="handleError"
              @saved="handleSaved"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="tasks" class="q-pa-none">
          <OrderTasks
            v-if="provider"
            :provider="provider"
            :task_type="'support'"
            :registeredBy="user.people"
            :taskFor="user.people"
            :key="key"
            :client="people"
          />
        </q-tab-panel>

        <q-tab-panel name="employees" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12" v-if="people.type === 'J'">
            <PeopleAdminEmployees
              :people_type="people_type"
              :id="peopleId"
              @error="handleError"
              @saved="handleSaved"
            />
          </div>

          <div class="col-12">
            <PeopleSalesman
              :people_type="people_type"
              :id="peopleId"
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

        <q-tab-panel name="billing" class="q-px-none row q-col-gutter-y-lg">
          <div class="col-12">
            <PeopleAdminBilling
              :people_type="people_type"
              :id="peopleId"
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
            <PeopleOrders
              :people_type="people_type"
              :client_id="peopleId"
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
            <PeopleContracts
              :people_type="people_type"
              :client_id="peopleId"
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

        <q-tab-panel name="calls" class="q-px-xs">
Tasks
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks";

import PersonAvatar from "@controleonline/quasar-legacy-ui/quasar-common-ui/src/components/Common/PersonAvatar";
import PeopleOrders from "@controleonline/quasar-legacy-ui/quasar-orders-ui/src/components/order/sales/OrderSearching.vue";
import TasksSearching from "@controleonline/quasar-tasks-ui/src/components/Tasks";
import { mapGetters } from "vuex";
import { ENTRYPOINT } from "src/config/entrypoint";
import PeopleAdminAddresses from "../../components/AdminAddresses.vue";
import PeopleAdminBilling from "../../components/AdminBilling.vue";
import PeopleAdminDocuments from "../../components/AdminDocuments.vue";
import PeopleAdminEmails from "../../components/AdminEmails.vue";
import PeopleAdminEmployees from "../../components/AdminEmployees.vue";
import PeopleAdminPhones from "../../components/AdminPhones.vue";
import PeopleAdminUsers from "../../components/AdminUsers.vue";
import PeopleCompany from "../../components/Company.vue";
import PeopleContracts from "../../components/Contracts.vue";
import PeopleSalesman from "../../components/Salesman.vue";
import PeopleSummary from "../../components/Summary.vue";

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
      required: true,
    },
    context_type: {
      type: String,
      required: false,
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
    PersonAvatar,
  },

  created() {
    this.provider = this.myCompany ? this.myCompany.id : null;
    this.getPeople();
  },

  data() {
    return {
      baseUrl: ENTRYPOINT,
      people: {},
      currentTab: "summary",
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
      //route = route.substring(0, route.length - 1) + inc;
      route = route + inc;
      return route;
    },

    goBack() {
      if (this.goBackRoute) {
        this.$router.push(this.goBackRoute);
        return;
      }

      this.$router.push({ name: this.getRoute("Index") });
    },

    handleError(error) {
      this.$q.notify({
        message: error.message,
        position: "bottom",
        type: "negative",
      });
    },
    handleSaved(data) {
      this.$q.notify({
        message: "Data successfully saved",
        position: "bottom",
        type: "positive",
      });

      if (data.id) {
        this.$router.push({
          name: this.getRoute("Details"),
          params: { id: data.id },
        });
      }
    },

    getPeople() {
      return api.fetch
        (`people/${this.peopleId}`)

        .then((data) => {
          if (data["@id"]) {
            this.people = data;
            this.people.id = this.peopleId;
            this.averageRating = data.averageRating;

            this.people.avatar =
              data.file !== null ? `${ENTRYPOINT}${data.file.url}` : null;

            this.people.name =
              data.peopleType === "J" ? data.alias : `${data.name} ${data.alias}`;
            this.people.type = data.peopleType;
          }
        });
    },
  },
};
</script>
