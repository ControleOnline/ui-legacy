<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <div class="row">
          <div class="col-6 q-pa-md text-h6">
            {{ carrier.name || "Carregando..." }}
          </div>
          <div class="col-6 q-pa-md">
            <q-card-section align="right" class="q-pt-none">
              <q-rating
                v-model="carrier.averageRating"
                size="2.9em"
                color="yellow"
                class="justify-center"
              />
            </q-card-section>
          </div>

          <div class="col-12 q-pa-md text-center">
            <PersonAvatar
              :url="carrier.avatar"
              :upload="`${baseUrl}/carriers/${this.$route.params.id}/upload-logo`"
              @uploaded="
                (data) => {
                  if (data.url) {
                    this.carrier.avatar = `${this.baseUrl}${data.url}`;
                  }
                }
              "
            />
          </div>

          <div class="col-12">
            <q-tabs
              align="start"
              v-model="currentTab"
              no-caps
              class="bg-transparent text-primary"
              :horizontal="$q.screen.gt.xs"
              dense
            >
              <q-tab name="summary" :label="$t('Details')" />
              <q-tab
                name="employees"
                :label="$t('Employees')"
                v-if="carrier.peopleType === 'J'"
              />
              <q-tab name="tasks" :label="$t('Tasks')" />
              <q-tab name="billing" :label="$t('Billing')" />
              <q-tab name="calls" :label="$t('Calls')" />
              <q-tab name="regions" label="Praças" />
              <q-tab name="tables" label="Tabelas de frete" />
              <q-tab name="integration" label="Integração" />
            </q-tabs>
            <q-separator />

            <q-tab-panels v-model="currentTab">
              <q-tab-panel name="summary" class="q-px-none row q-col-gutter-y-lg">
                <div class="col-12">
                  <CustomerSummary
                    :people_type="'carriers'"
                    :id="carrierId"
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
                    :people_type="'carriers'"
                    :id="carrierId"
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
                    <PeopleAdminEmails
                      class="full-height"
                      :people_type="'carriers'"
                      :id="carrierId"
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
                    <PeopleAdminPhones
                      class="full-height"
                      :people_type="'carriers'"
                      :id="carrierId"
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
                    :people_type="'carriers'"
                    :id="carrierId"
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

                <div class="col-12" v-if="carrier.peopleType === 'F'">
                  <PeopleAdminUsers
                    :people_type="'carriers'"
                    :id="carrierId"
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

                <div class="col-12" v-if="carrier.peopleType === 'F'">
                  <CustomerCompany
                    :people_type="'carriers'"
                    :id="carrierId"
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
                            name: 'CustomersDetails',
                            params: { id: data.id },
                          });
                        }
                      }
                    "
                  />
                </div>
              </q-tab-panel>

              <q-tab-panel name="tasks" class="q-pa-none">
                <OrderTasks
                  :provider="provider"
                  :client="people"
                  :task_type="'support'"
                />
              </q-tab-panel>
              <q-tab-panel name="employees" class="q-px-none row q-col-gutter-y-lg">
                <div class="col-12" v-if="carrier.peopleType === 'J'">
                  <PeopleAdminEmployees
                    :people_type="'carriers'"
                    :id="carrierId"
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
                            name: 'CustomersDetails',
                            params: { id: data.id },
                          });
                        }
                      }
                    "
                  />
                </div>

                <div class="col-12">
                  <CustomerSalesman
                    :people_type="'carriers'"
                    :id="carrierId"
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
                    :people_type="'carriers'"
                    :id="carrierId"
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
                  <CustomerOrders
                    :people_type="'carriers'"
                    :id="carrierId"
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
                  <CustomerContracts
                    :people_type="'carriers'"
                    :id="carrierId"
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
                <OrderTasks
                  :provider="provider"
                  :client="people"
                  :task_type="'relationship'"
                />
              </q-tab-panel>
              <q-tab-panel name="regions">
                <CarrierRegions
                  :people_type="'carriers'"
                  :id="carrierId"
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
                        message: 'Os dados foram salvos com sucesso',
                        position: 'bottom',
                        type: 'positive',
                      });

                      this.$router.push({
                        name: 'CarrierRegionDetails',
                        params: {
                          id: this.carrierId,
                          regionId: data.id,
                        },
                      });
                    }
                  "
                />
              </q-tab-panel>

              <q-tab-panel name="tables">
                <CarrierTables
                  :people_type="'carriers'"
                  :id="carrierId"
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
                        message: 'Os dados foram salvos com sucesso',
                        position: 'bottom',
                        type: 'positive',
                      });

                      if (data !== false) {
                        this.$router.push({
                          name: 'CarrierTableDetails',
                          params: {
                            id: this.carrierId,
                            tableId: data.id,
                          },
                        });
                      }
                    }
                  "
                />
              </q-tab-panel>

              <q-tab-panel name="integration">
                <CarrierIntegration
                  :people_type="'carriers'"
                  :id="carrierId"
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
                        message: 'Os dados foram salvos com sucesso',
                        position: 'bottom',
                        type: 'positive',
                      });
                    }
                  "
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import PersonAvatar from "@controleonline/quasar-common-ui/src/components/Common/PersonAvatar";
import CustomerOrders from "@controleonline/quasar-orders-ui/src/components/order/purchasing/OrderSearching.vue";
import PeopleAdminAddresses from "@controleonline/quasar-people-ui/src/repository/components/AdminAddresses.vue";
import PeopleAdminBilling from "@controleonline/quasar-people-ui/src/repository/components/AdminBilling.vue";
import PeopleAdminDocuments from "@controleonline/quasar-people-ui/src/repository/components/AdminDocuments.vue";
import PeopleAdminEmails from "@controleonline/quasar-people-ui/src/repository/components/AdminEmails.vue";
import PeopleAdminEmployees from "@controleonline/quasar-people-ui/src/repository/components/AdminEmployees.vue";
import PeopleAdminPhones from "@controleonline/quasar-people-ui/src/repository/components/AdminPhones.vue";
import PeopleAdminUsers from "@controleonline/quasar-people-ui/src/repository/components/AdminUsers.vue";
import CustomerCompany from "@controleonline/quasar-people-ui/src/repository/components/Company.vue";
import CustomerContracts from "@controleonline/quasar-people-ui/src/repository/components/Contracts.vue";
import CustomerSalesman from "@controleonline/quasar-people-ui/src/repository/components/Salesman.vue";
import CustomerSummary from "@controleonline/quasar-people-ui/src/repository/components/Summary.vue";
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import { mapGetters } from "vuex";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";
import CarrierIntegration from "../../components/carrier/CarrierIntegration";
import CarrierRegions from "../../components/carrier/CarrierRegions";
import CarrierTables from "../../components/carrier/CarrierTables";

export default {
  components: {
    CarrierRegions,
    CarrierTables,
    CarrierIntegration,
    PersonAvatar,
    OrderTasks,
    PeopleAdminEmails,
    PeopleAdminUsers,
    PeopleAdminAddresses,
    PeopleAdminPhones,
    PeopleAdminDocuments,
    PeopleAdminEmployees,
    PeopleAdminBilling,
    CustomerOrders,
    CustomerContracts,
    CustomerSummary,
    CustomerSalesman,
    CustomerCompany,
  },

  created() {
    this.getCarrier();
  },
  computed: {
    ...mapGetters({
      myProvider: "people/currentCompany",
    }),
  },

  data() {
    return {
      baseUrl: ENTRYPOINT,
      currentTab: "summary",
      carrierId: this.$route.params.id,
      people: {},
      provider: null,
      carrier: {
        name: null,
        type: null,
        avatar: null,
        averageRating: 4,
      },
    };
  },
  watch: {
    myProvider(provider) {
      if (provider !== null) {
        this.provider = provider.id;
      }
    },
  },
  methods: {
    getCarrier() {
      return api
        .fetch(`people/${this.carrierId}`)

        .then((data) => {
          this.people = data;
          this.people.id = this.carrierId;
          if (data["@id"]) {
            this.carrier = data;
            this.carrier.averageRating = data.averageRating;
            this.carrier.name = `${data.name} / ${data.alias}`;
            this.carrier.peopleType = data.peopleType;
            this.carrier.avatar =
              data.file !== null ? `${ENTRYPOINT}${data.file.url}` : null;
          }
        });
    },
  },
};
</script>
