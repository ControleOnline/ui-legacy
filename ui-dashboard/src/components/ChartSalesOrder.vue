<template>
 <div class="chart-box">
    <IEcharts
      :option   ="options"
      :loading  ="loading"
      @ready    ="onReady"
      @click    ="onClick"
      :resizable="true"
    />
  </div>
</template>

<script>
import configurable               from '../mixins/configurable';
import { date }                   from 'quasar';
import IEcharts                   from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';

function formatToUSDate(dateString) {
  return date.formatDate(date.extractDate(dateString, 'DD/MM/YYYY'), 'YYYY-MM-DD');
}

export default {
  name  : 'DashboardChartSalesOrder',
  mixins: [ configurable ],

  components: {
    IEcharts,
  },

  props : {
    from: {
      type    : String,
      required: false,
    },
    to  : {
      type    : String,
      required: false,
    },
  },

  created() {
    this.loadData()

    this.options.title.text     = this.$t('dashboard.charts.sales_order_qty');
    this.options.series[0].name = this.$t('dashboard.charts.quotations');
    this.options.series[1].name = this.$t('dashboard.charts.sales_orders');
  },

  data() {
    return {
      data   : {
        sales_order_total_date: null,
        quote_order_total_date: null,
      },
      loading: false,
      isReady: false,

      options: {
        title: {
          text: 'Vendas por quantidade de pedidos'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '1%'
        },
        grid  : {
          left        : '1%',
          right       : '2%',
          bottom      : '1%',
          containLabel: true
        },
        xAxis: {
          type     : 'category',
          axisLabel: {
            inside: false,
            rotate: 45
          },
          axisTick : {
            show: true
          },
          data     : []
        },
        yAxis: {
          type     : 'value',
          position : 'left',
          axisLine : {
            show: false
          },
          axisTick : {
            show: false
          },
        },
        series: [
          {
            name : 'Cotações',
            type : 'line',
            data : []
          },
          {
            name : 'Pedidos de venda',
            type : 'line',
            data : []
          },
        ]
      },
    }
  },

  watch: {
    isReady(isReady) {
      if (isReady) {
        this.buildData()
      }
    }
  },

  methods: {
    getRandomInt(min, max) {
      min = Math.ceil (min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    onReady(instance, ECharts) {

    },

    onClick(event, instance, ECharts) {

    },

    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'YYYY-MM-DD'), 'DD-MM-YYYY');
    },

   formatMoney(value) {
      let formatter = new Intl.NumberFormat(this.$i18n.locale, {
        style   : 'currency',
        currency: 'BRL',
      });
      return formatter.format(value);
    },

    loadData() {
      if (!this.Params.Company.get()) {
        return;
      }

      this.loading = true;
      this.isReady = false;

      this.requestQuery('sales-date-totals')
        .then(data => {
          this.data.sales_order_total_date = data.sales_order_total_date;
        });

      this.requestQuery('quote-date-totals')
        .then(data => {
          this.data.quote_order_total_date = data.quote_order_total_date;

          return true;
        })
        .then(() => {
          this.isReady = true;
          this.loading = false;
        });
    },

    requestQuery(queryName) {
      return this.Api.client
        .private(
          '/dashboards',
          {
            method: 'POST',
            body  : JSON.stringify({
            	"query"   : queryName,
            	"fromDate": formatToUSDate(this.from),
            	"toDate"  : formatToUSDate(this.to),
            	"company" : this.Params.Company.get(),
            	"viewType": this.Params.ViewType.get(),
            })
          }
        )
         .then(response => {
           if (response.ok) {
             return response.json()
               .then(data => {
                 if (data.response) {
                   if (data.response.success) {
                     return data.response.data;
                   }
                   else {
                     throw new Error(data.response.error);
                   }
                 }

                 return null;
               });
           }
           else {
             return response.json()
               .then(responseJson => {
                 throw new Error('Unknown error');
               });
           }
         });
    },

    buildData() {
      let _data = this.data;

      let chartData = {
        xAxis : [],
        series: {
          quotes: [],
          sales : [],
        }
      };

      let totalsByDate = { };

      if (_data.quote_order_total_date) {
        _data.quote_order_total_date.forEach(quoteByDate => {
          if (!totalsByDate[quoteByDate.order_date]) {
            totalsByDate[quoteByDate.order_date] = {
              quotes: quoteByDate,
              sales : {
                total_count: 0
              }
            };
          }
        });
      }

      if (_data.sales_order_total_date) {
        _data.sales_order_total_date.forEach(saleByDate => {
          if (!totalsByDate[saleByDate.order_date]) {
            totalsByDate[saleByDate.order_date]  = {
              quotes: {
                total_count: 0
              },
              sales : saleByDate
            };
          }
          else {
            totalsByDate[saleByDate.order_date].sales = saleByDate;
          }
        });
      }

      for (let _date in totalsByDate) {
        chartData.xAxis.push(this.formatDate(_date));

        chartData.series.quotes
          .push(totalsByDate[_date].quotes.total_count);

        chartData.series.sales
          .push(totalsByDate[_date].sales.total_count);
      }

      // set chart data in options

      this.options.xAxis.data     = chartData.xAxis;
      this.options.series[0].data = chartData.series.quotes;
      this.options.series[1].data = chartData.series.sales;
    },

    reload() {
      this.loadData()
    },
  },
};
</script>

<style lang="stylus" scoped>
  .chart-box
    height 400px
</style>
