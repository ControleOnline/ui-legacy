<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <div class="col-xs-12 col-sm-5 q-pa-sm">
          <q-input stack-label
            v-model="fromDate"
            label  ="Data inicio"
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
        <div class="col-xs-12 col-sm-5 q-pa-sm">
          <q-input stack-label
            v-model="toDate"
            label  ="Data fim"
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
        <div class="col-xs-12 col-sm-2 q-pa-sm">
          <q-btn flat
            :loading="isLoading"
            type    ="submit"
            label   ="Consultar"
            size    ="md"
            color   ="primary"
            class   ="q-mt-md full-width"
            @click  ="getDashboardData"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <Summary
        :data="data"
      />
    </q-card-section>

    <q-card-section>
      <ChartSalesMoney
        :data="data"
      />
    </q-card-section>

    <q-card-section>
      <ChartSalesOrder
        :data="data"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import { date }                   from 'quasar';
import { mapActions, mapGetters } from 'vuex';
import Summary                    from './Summary';
import ChartSalesMoney            from './Charts/ChartSalesMoney';
import ChartSalesOrder            from './Charts/ChartSalesOrder';

export default {
  name  : 'Dashboard',
  components: {
    Summary        ,
    ChartSalesMoney,
    ChartSalesOrder,
  },

  created() {
    if (this.theCompany !== null)
      this.request();
  },

  data() {
    return {
      fromDate : date.formatDate(date.subtractFromDate(Date.now(), { month: 1 }), 'DD/MM/YYYY'),
      toDate   : date.formatDate(Date.now(), 'DD/MM/YYYY'),
      data     : null,
      isLoading: false,
    }
  },

  computed: {
    ...mapGetters({
      theCompany: 'people/currentCompany',
    }),
  },

  watch: {
    theCompany(company) {
      this.request();
    },
  },

  methods: {
    ...mapActions({
      getTotals: 'dashboard/getTotals',
    }),

    getDashboardData() {
      if (this.fromDate.length == 10 && this.toDate.length == 10) {
        this.request();
      }
    },

    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'DD/MM/YYYY'), 'YYYY-MM-DD');
    },

    request() {
      if (this.isLoading)
        return;

      this.isLoading = true;

      this.getTotals({
        "fromDate"  : this.formatDate(this.fromDate),
        "toDate"    : this.formatDate(this.toDate  ),
        "providerId": this.theCompany !== null ? this.theCompany.id : null
      })
        .then((data) => {
          this.data = data.response ? data.response.data : null;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
