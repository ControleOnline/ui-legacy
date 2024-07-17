<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import ActionBar from "./ActionBar";

export default {
  components: {
    DefaultTable,
    ActionBar,
  },
  props: {
    context: {
      required: true
    },
    loaded: {
      type: Boolean,
      required: true,
    },
    store: {
      required: true,
      default: 'tasks'
    },
    peopleId: {
      required: false,
    }
  },
  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
      columns: 'orders/columns',
    }),

    filters() {
      return this.$store.getters[this.configs.store + '/filters'] || {}
    },
    configs() {
      let config = {
        companyParam: 'provider_id',
        filters: true,
        store: this.store,
        add: true,
        delete: false,
        selection: false,
        search: false,
        columns: {
          category: {
            filters: {
              context: this.context,
              company: '/people/' + this.myCompany.id
            }
          },
          criticality: {
            filters: {
              context: this.context + '-criticality',
              company: '/people/' + this.myCompany.id
            }
          },
          reason: {
            filters: {
              context: this.context + '-reason',
              company: '/people/' + this.myCompany.id
            }
          },
          taskStatus: {
            filters: {
              context: this.context
            }
          }
        },
        components: {
          tableActions: {
            //component: OtherInformations,
            props: {
              context: this.context
            }
          },
          headerActions: {
            component: ActionBar,
            props: {
              context: this.context
            }
          }
        }
      };

      if (this.peopleId) {
        config.externalFilters = false;
        config["full-height"] = false;
      }
      return config;
    }
  },
  data() {
    return {
    };
  },
  created() {
    const filters = this.$copyObject(this.filters);
    filters.task_type = this.context;
    this.$store.commit(this.configs.store + '/SET_FILTERS', filters);

  },
  methods: {
  },
};
</script>
