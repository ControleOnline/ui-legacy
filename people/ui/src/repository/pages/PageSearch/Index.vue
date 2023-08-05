<template>
  <div class="row">
    <!-- search fields -->
    <div class="col-12">
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-4">
          <q-input dense outlined v-model="dateFrom" label="Data inicio" stack-label>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy1"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFrom"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input dense outlined v-model="dateTo" label="Data fim" stack-label>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy2"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateTo"
                    mask="DD-MM-YYYY"
                    @input="() => $refs.qDateProxy2.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-input
            dense
            outlined
            stack-label
            label="Buscar por"
            debounce="1000"
            v-model="searchBy"
            class="full-width"
          >
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
        <q-tabs
          :horizontal="$q.screen.gt.xs"
          align="justify"
          v-model="currentTab"
          class="bg-transparent text-primary col-auto"
          dense
        >
          <q-tab
            v-if="people_type == 'customers'"
            name="oportunities"
            :label="$t(people_type + '.Oportunities')"
            class="text-capitalize"
          />
          <q-tab
            v-if="people_type == 'customers'"
            name="leads"
            :label="$t(people_type + '.Leads')"
            class="text-capitalize"
          />
          <q-tab
            name="allPeoples"
            :label="$t(people_type + '.Customers')"
            class="text-capitalize"
          />
          <q-tab
            v-if="people_type == 'customers'"
            name="inactivePeople"
            :label="$t(people_type + '.Inactive')"
            class="text-capitalize"
          />
          <q-tab
            v-if="people_type == 'customers'"
            name="prospectsPeople"
            :label="$t(people_type + '.Prospects')"
            class="text-capitalize"
          />
          <q-tab
            v-if="people_type == 'customers'"
            name="activePeople"
            :label="$t(people_type + '.Active')"
            class="text-capitalize"
          />
          <q-tab
            v-if="people_type == 'customers'"
            name="newPeople"
            :label="$t(people_type + '.New')"
            class="text-capitalize"
          />
        </q-tabs>
      </div>

      <q-separator />

      <q-tab-panels v-model="currentTab" class="q-mt-sm bg-transparent">
        <q-tab-panel name="oportunities" class="q-pa-xs">
          <TasksSearching
            v-if="provider"
            :provider="provider.id"
            :task_type="context"
            :registeredBy="user.people"
            :taskFor="user.people"
            :key="key"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
          />
        </q-tab-panel>
        <q-tab-panel name="leads" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="leads"
            :people_type="people_type"
            :pageType="'leads'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="allPeoples" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="allPeoples"
            :people_type="people_type"
            :pageType="'all'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="inactivePeople" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="inactivePeople"
            :people_type="people_type"
            :pageType="'inactive'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="prospectsPeople" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="prospectsPeople"
            :people_type="people_type"
            :pageType="'prospect'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="activePeople" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="activePeople"
            :people_type="people_type"
            :pageType="'active'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
                }
              }
            "
          />
        </q-tab-panel>

        <q-tab-panel name="newPeople" class="q-pa-xs">
          <TableAllPeoples
            :provider="provider"
            ref="newPeople"
            :people_type="people_type"
            :pageType="'new'"
            :fromDate="dateFrom"
            :toDate="dateTo"
            :searchBy="searchBy"
            @selected="onPeopleSelected"
            @before="
              (params) => {
                if (this.fetchs.loadPeoples) {
                  this.fetchs.loadPeoples.before(params);
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
import TasksSearching from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import { date } from "quasar";
import { mapGetters } from "vuex";
import TableAllPeoples from "./components/TableAllPeoples.vue";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    provider: {
      required: true,
    },
    people_type: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  components: {
    TableAllPeoples,
    TasksSearching,
   
  },

  created() {},

  data() {
    return {
      key: null,
      context: "relationship",
      currentTab: this.people_type == "customers" ? "oportunities" : "allPeoples",
      dateFrom: date.formatDate(
        date.subtractFromDate(Date.now(), { month: 1 }),
        "DD-MM-YYYY"
      ),
      dateTo: date.formatDate(Date.now(), "DD-MM-YYYY"),
      searchBy: "",
    };
  },
  watch: {},
  methods: {
    loadCurrentTabRows() {
      this.$refs[this.currentTab].reload();
    },

    onPeopleSelected(peopleId) {
      if (!peopleId) return;

      this.$router.push({
        name: "CustomersDetails",
        params: {
          id: peopleId,
        },
      });
    },
  },
};
</script>
