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
import { date }                   from 'quasar';
import { mapActions, mapGetters } from 'vuex';
import IEcharts                   from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';

export default {
  props: {
    data: {
      required: true,
      default : null
    },
  },

  components: {
    IEcharts,
  },

  data() {
    return {
      loading: false,
      options: {
        title: {
          text: 'Vendas em R$'
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
          data     : [],
        },
        yAxis: {
          type     : 'value',
          position : 'left',
          axisLabel: {
            formatter: (value) => {
              return this.formatMoney(value);
            },
          },
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
    data(_data) {
      if (_data !== null) {
        let chartData = {
          xAxis : [],
          series: {
            quotes: [],
            sales : [],
          }
        };

        let totalsByDate = { };

        if (_data.quote_orders_total_date) {
          _data.quote_orders_total_date.forEach(quoteByDate => {
            if (!totalsByDate[quoteByDate.order_date]) {
              totalsByDate[quoteByDate.order_date] = {
                quotes: quoteByDate,
                sales : {
                  total_price: 0
                }
              };
            }
          });
        }

        if (_data.sale_orders_total_date ) {
          _data.sale_orders_total_date.forEach(saleByDate => {
            if (!totalsByDate[saleByDate.order_date]) {
              totalsByDate[saleByDate.order_date]  = {
                quotes: {
                  total_price: 0
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
            .push(totalsByDate[_date].quotes.total_price);

          chartData.series.sales
            .push(totalsByDate[_date].sales.total_price);

          /*
          chartData.series.quotes
            .push(this.getRandomInt(800, 1700));

          chartData.series.sales
            .push(this.getRandomInt(500, 3200));
          */
        }

        // set chart data in options

        this.options.xAxis.data     = chartData.xAxis;
        this.options.series[0].data = chartData.series.quotes;
        this.options.series[1].data = chartData.series.sales;
      }
    },
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
  },
};
</script>

<style lang="stylus" scoped>
  .chart-box
    height 400px
</style>
