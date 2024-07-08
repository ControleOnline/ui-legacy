<template>
  <q-page>
    <div class="q-pt-lg q-pa-md">
      <div class="q-mb-md q-pa-none">
        <DefaultDetail :cardClass="'full-width'" :sectionClass="'full-width'" :configs="configs" :id="peopleId"
          v-if="peopleId" />
      </div>
    </div>

    <q-tabs v-model="tab" class="text-teal">
      <q-tab name="details" label="Detalhes" />
      <q-tab name="occurrences" label="Ocorrências" />
      <q-tab name="financial" label="Financeiro" />
      <q-tab name="attendances" label="Atendimentos" />
      <q-tab name="orders" label="Pedidos" />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="details">
        <div class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <DefaultTable :configs="configsEmail" v-if="loaded && configsEmail" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-6">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <DefaultTable :configs="configsPhones" v-if="loaded && configsPhones" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="q-pt-lg">
          <q-card class="q-mb-md q-pa-none">
            <q-card-section class="q-pa-none">
              <div class="q-pa-none">
                <DefaultTable :configs="configsDocuments" v-if="loaded && configsDocuments" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="q-pt-lg">
          <q-card class="q-mb-md q-pa-none">
            <q-card-section class="q-pa-none">
              <div class="q-pa-none">
                <DefaultTable :configs="configsAddresses" v-if="loaded && configsAddresses" />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="q-pt-lg">
          <q-card class="q-mb-md q-pa-none">
            <q-card-section class="q-pa-none">
              <div class="q-pa-none">
                <DefaultTable :configs="configsUsers" v-if="loaded && configsUsers" />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="q-pt-lg">
          <q-card class="q-mb-md q-pa-none">
            <q-card-section class="q-pa-none">
              <div class="q-pa-none">
                <DefaultTable :configs="configsCompanies" v-if="loaded && configsCompanies" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
      <q-tab-panel name="financial">
        <q-tabs v-model="financialTab" class="text-teal">
          <q-tab name="receive" label="Receber" />
          <q-tab name="expense" label="Pagar" />
        </q-tabs>
        <q-tab-panels v-model="financialTab">
          <q-tab-panel name="receive">
            <div class="q-pt-lg">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <InvoiceReceive :context="receive" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
          <q-tab-panel name="expense">
            <div class="q-pt-lg">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <InvoiceExpense :context="expense" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel name="attendances">
        <q-tabs v-model="attendanceTab" class="text-teal">
          <q-tab name="crm" label="CRM" />
          <q-tab name="tasks" label="Tasks" />
        </q-tabs>
        <q-tab-panels v-model="attendanceTab">
          <q-tab-panel name="crm">
            <div class="q-pt-lg">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <CRMDetails :context="context" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
          <q-tab-panel name="tasks">
            <div class="q-pt-lg">
              <q-card class="q-mb-md q-pa-none">
                <q-card-section class="q-pa-none">
                  <div class="q-pa-none">
                    <TaskDetails :context="context" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <q-tab-panel name="orders">
        <div class="q-pt-lg">
          <q-card class="q-mb-md q-pa-none">
            <q-card-section class="q-pa-none">
              <div class="q-pa-none">
                <Orders :context="'sales'" :peopleId="peopleId" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import DefaultDetail from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultDetail.vue";
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable.vue";
import InvoiceReceive from "@controleonline/quasar-financial-ui/src/pages/Receive/index.vue";
import InvoiceExpense from "@controleonline/quasar-financial-ui/src/pages/Expense/index.vue";
import Orders from "@controleonline/quasar-orders-ui/src/components/Orders.vue";
import CRMDetails from "@controleonline/quasar-crm-ui/src/pages/CRM/details.vue";
import TaskDetails from "@controleonline/quasar-tasks-ui/src/pages/Tasks/details.vue";

import { mapGetters } from "vuex";
import getConfigs from "./Configs";
import people from "../../store/people";

export default {
  components: {
    DefaultDetail,
    DefaultTable,
    Orders,
    InvoiceReceive,
    InvoiceExpense,
    CRMDetails,
    TaskDetails,
  },
  props: {
    context: {
      required: true,
    },
  },
  data() {
    return {
      tab: "details",
      financialTab: "receive",
      attendanceTab: "crm",
      peopleId: null,
      loaded: false,
    };
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      columns: "people/columns",
      companies: "companies/companies",
    }),
    configs() {
      let config = getConfigs(this.context, this.myCompany);
      config.externalFilters = false;
      return config;
    },
    configsEmail() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "emails",
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-email",
            size: "24px",
            class: "q-mr-sm",
          },
        },
        add: true,
        delete: true,
        selection: false,
        search: false,
      };
    },
    configsPhones() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "phones",
        add: true,
        delete: true,
        selection: false,
        search: false,
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-phone",
            size: "24px",
            class: "q-mr-sm",
          },
        },
      };
    },

    configsAddresses() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "addresses",
        add: true,
        delete: true,
        selection: false,
        search: false,
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-map-marker",
            size: "24px",
            class: "q-mr-sm",
          },
        },
      };
    },

    configsDocuments() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "documents",
        add: true,
        delete: true,
        selection: false,
        search: false,
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-file-document",
            size: "24px",
            class: "q-mr-sm",
          },
        },
      };
    },

    configsUsers() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "usersCustomer",
        add: true,
        delete: true,
        selection: false,
        search: false,
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-account-multiple",
            size: "24px",
            class: "q-mr-sm",
          },
        },
      };
    },

    configsCompanies() {
      return {
        externalFilters: false,
        filters: true,
        "full-height": false,
        store: "companies",
        add: true,
        delete: true,
        selection: false,
        search: false,
        title: {
          class: "text-teal text-h6 q-mb-md",
          icon: {
            name: "mdi-office-building",
            size: "24px",
            class: "q-mr-sm",
          },
        },
      };
    },
  },
  created() {
    this.peopleId = decodeURIComponent(this.$route.params.id);
    this.init();
  },
  watch: {
    financialTab(newVal) {
      this.setFinancialFilters();
    },
  },
  methods: {
    init() {
      this.setFinancialFilters();
      // this.setOrdersFilters();
      let filters = {
        people: "/people/" + this.peopleId,
      };
      this.$store.commit("emails/SET_FILTERS", filters);
      this.$store.commit("phones/SET_FILTERS", filters);
      this.$store.commit("addresses/SET_FILTERS", filters);
      this.$store.commit("documents/SET_FILTERS", filters);
      this.$store.commit("usersCustomer/SET_FILTERS", filters);
      this.$store.commit("companies/SET_FILTERS", filters);
      this.loaded = true;
    },

    setFinancialFilters() {
      let financeFilters;

      if (this.financialTab === 'receive') {
        financeFilters = { receiver: "/people/" + this.peopleId };
      } else {
        this.$store.commit("invoice/SET_FILTERS", {});
        financeFilters = { payer: "/people/" + this.peopleId };
      }

      this.$store.commit("invoice/SET_FILTERS", financeFilters);
      this.loaded = true;
    },
    setOrdersFilters() {
      let orderFilters;

      if (this.context === "sales") {
        orderFilters = { client: "/people/" + this.peopleId };
      } else if (this.context === "purchasing") {
        orderFilters = { provider: "/people/" + this.peopleId };
      }

      this.$store.commit("orders/SET_FILTERS", orderFilters);
    },
  },
};
</script>
