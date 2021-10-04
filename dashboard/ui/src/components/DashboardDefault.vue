<template>
  <div>
    <q-card class="q-mb-sm">
      <q-card-section>
        <div class="row">
          <div class="col-xs-12 col-sm-6 q-pa-sm">
            <q-input stack-label
              v-model="fromDate"
              :label ="$t('dashboard.from_date')"
              mask   ="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model ="fromDate"
                      mask    ="DD/MM/YYYY"
                      @input  ="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-6 q-pa-sm">
            <q-input stack-label
              v-model="toDate"
              :label ="$t('dashboard.to_date')"
              mask   ="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model ="toDate"
                      mask    ="DD/MM/YYYY"
                      @input  ="() => $refs.qDateProxy2.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat
          :loading="isLoading"
          :label  ="$t('dashboard.request')"
          color   ="primary"
          @click  ="$emit('refresh')"
        />
      </q-card-actions>
    </q-card>

    <q-card class="q-pa-md q-mb-sm">
      <div class="row q-col-gutter-sm">
        <div
          class="col-xs-12  col-md-4 col-sm-6"
          v-for="element in elements"
          :key ="element.name"
        >
          <slot
            :name         ="element.name"
            v-bind:config ="config"
            v-bind:filters="filters"
          >
            {{ `Dashboard element '${element.name}' not found` }}
          </slot>
        </div>
      </div>
    </q-card>

    <q-card v-if="charts.length > 0"
      class="q-pa-md q-mb-sm"
    >
      <q-card-section
        v-for="chart in charts"
        :key ="chart.name"
      >
        <slot
          :name         ="chart.name"
          v-bind:config ="config"
          v-bind:filters="filters"
        >
          {{ `Dashboard chart '${chart.name}' not found` }}
        </slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import configurable from './../mixins/configurable';
import { date }     from 'quasar';

export default {
  name  : 'DashboardDefault',
  mixins: [ configurable ],

  props : {
    elements: {
      type    : Array,
      required: true,
    },
    charts  : {
      type    : Array,
      required: false,
      default : function() {
        return [];
      }
    },
  },

  computed: {
    filters() {
      return {
        from: this.fromDate,
        to  : this.toDate,
      }
    },
  },

  data() {
    return {
      fromDate : date.formatDate(date.subtractFromDate(Date.now(), { month: 1 }), 'DD/MM/YYYY'),
      toDate   : date.formatDate(Date.now(), 'DD/MM/YYYY'),
      isLoading: false,
    }
  },
};
</script>

<style lang="sass" scoped>
  .my-card
    min-height: 100%

</style>
