<template>
  <div>
    <DataFilter
      :fromDate="filters.from"
      :toDate="filters.to"
      :showButton="true"
      @dateChanged="dateChanged"
    />
    <q-card class="q-pa-md q-mb-sm">
      <div class="row q-col-gutter-sm">
        <div
          class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12"
          v-for="element in elements"
          :key="element.name"
        >
          <slot
            :name="element.name"
            v-bind:config="config"
            v-bind:filters="filters"
          >
            {{ `Dashboard element '${element.name}' not found` }}
          </slot>
        </div>
      </div>
    </q-card>

    <q-card v-if="charts.length > 0" class="q-pa-md q-mb-sm">
      <q-card-section v-for="chart in charts" :key="chart.name">
        <slot
          :name="chart.name"
          v-bind:config="config"
          v-bind:filters="filters"
        >
          {{ `Dashboard chart '${chart.name}' not found` }}
        </slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import DataFilter from "@controleonline/quasar-common-ui/src/components/Common/DataFilter.vue";
import configurable from "../mixins/configurable";
import { date } from "quasar";

export default {
  components: {
    DataFilter,
  },
  name: "DashboardDefault",
  mixins: [configurable],

  props: {
    elements: {
      type: Array,
      required: true,
    },
    charts: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },

    filters: {
      type: Object,
      required: false,
    },
  },
  methods: {
    dateChanged(date) {
      if (date.from && date.to) {
        this.fromDate = date.from;
        this.toDate = date.to;
        this.filters.from = date.from;
        this.filters.to = date.to;
      }
      this.$emit("refresh");
    },
  },
  computed: {},
  data() {
    return {
      isLoading: false,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  min-height: 100%
</style>
