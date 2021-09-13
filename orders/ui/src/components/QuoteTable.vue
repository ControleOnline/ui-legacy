<template>
  <div>
    <q-card v-if="this.order_.quotes.length > 0">
      <q-card-section v-if="header"
        style="background-color: #00519b"
      >
        <div class="row items-center title-bar">
          <q-icon name="local_shipping" style="color: #ffbc16; font-size: 40px; margin-right: 20px" />
          <div class="text-h5" style="color: #ffbc16;">
            Cotação #{{ this.order_.id }}
          </div>
          <q-space />
          <q-btn icon="close" color="white" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-card-section style="max-width: 1250px !important; margin: auto !important">
        <q-table flat grid hide-header
          :data           ="order_.quotes"
          :columns        ="columns"
          :visible-columns="visible"
          row-key         ="id"
          :pagination.sync="pagination"
          
        >

          <template v-slot:item="props">
            <div class="q-pb-xs-md q-pa-sm-md col-xs-12 col-sm-6 col-md-3">
              <q-card
                class ="shadow-10"
                :style="getSelectedStyle(props.row.id)"
              >
                <q-card-section v-if="props.cols[5].value == null"
                  class="row items-center justify-center text-center"
                  style="height: 130px; width: 80%; margin-left: 9%"
                >
                  <div class="text-subtitle2">
                    {{ props.cols[1].value }}
                  </div>
                </q-card-section>
                <q-img v-else contain
                  :src      ="props.cols[5].value"
                  style     ="height: 130px; width: 80%; margin-left: 9%"
                  ratio     ="1"
                  transition="scale"
                />

                <q-card-section class="text-center">
                  <div class="text-subtitle1 text-bold" style="color: #00519b">
                    {{ props.cols[0].value }}
                  </div>
                </q-card-section>

                <q-card-section align="center" class="q-pt-none">
                  <q-rating readonly
                    v-model="props.cols[6].value"
                    size   ="2.9em"
                    color  ="yellow"
                    class  ="justify-center"
                  />
                </q-card-section>

                <q-card-section
                  class="text-white"
                  align="center"
                  style="background: #00519b"
                >
                  <q-list>
                    <q-item>
                      <q-item-section style="min-width: 0; padding-right: 8px" avatar>
                        <q-icon color="orange" name="send" />
                      </q-item-section>
                      <q-item-section class="text-left text-bold">{{ props.cols[2].value }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section style="min-width: 0; padding-right: 8px" avatar>
                        <q-icon color="orange" name="send" />
                      </q-item-section>
                      <q-item-section class="text-left text-bold">{{ props.cols[3].value }}</q-item-section>
                    </q-item>
                  </q-list>
                  <div class="text-h4 text-bold q-mt-md">
                    {{ props.cols[4].value }}
                    <q-btn round
                      icon  ="money"
                      color ="primary"
                      @click="showTaxes(props.row)"
                    />
                  </div>
                  <q-btn rounded
                    icon  ="send"
                    style ="width: 85%; background-color: #56da63"
                    :class="mayContract()"
                    label ="Contratar"
                    @click="chooseQuote(props.row)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </template>

        </q-table>
      </q-card-section>

      <q-card-actions v-if="footer"
        align="center"
        class="q-pa-md"
      >
        <q-btn flat label="Retornar aos dados da Cotação" style="color: #00519b" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="dtaxes" transition-show="scale" transition-hide="scale">
      <QuotationTaxes
        :quote="quote"
        @error="error => {
          this.$q.notify({
            message : error.message,
            position: 'bottom',
            type    : 'negative',
          });
        }"
        @added="quote => {
          if (this.order_.quotes) {
            let _quote = this.order_.quotes.find(q => q.id === quote.id);
            let _index = this.order_.quotes.indexOf(_quote);

            this.order_.quotes[_index]
              .taxes.push({
                name : quote.tax.name,
                total: quote.tax.price,
              });
          }
        }"
      />
    </q-dialog>

  </div>
</template>

<script>
import QuotationTaxes from '@controleonline/quasar-common-ui/src/components/common/QuotationTaxes';

export default {
  props     : {
    order : {
      type    : Object,
      required: true,
    },
    header: {
      type    : Boolean,
      required: false,
      default : true,
    },
    footer: {
      type    : Boolean,
      required: false,
      default : true,
    },
  },

  components: {
    QuotationTaxes,
  },

  mounted() {
    this.$emit('load');    
  },

  data() {
    return {
      quote      : {
        id   : null,
        taxes: []
      },
      dtaxes     : false,
      order_     : this.order,

      pagination : {
        sortBy     : 'desc',
        descending : false,
        page       : 1,
        rowsPerPage: 12
      },

      visible    : [
        'groupName'       ,
        'carrierName'     ,
        'carrierImage'    ,
        'retrieveDeadline',
        'deliveryDeadline',
        'totalValue'      ,
        'carrierRating'   ,
        'taxes'           ,
      ],

      columns    : [
        {
          name : 'groupName',
          field: row => row.group.name,
          label: 'Group Name'
        },
        {
          name : 'carrierName',
          field: row => row.carrier.name,
          label: 'Carrier Name'
        },
        {
          name : 'retrieveDeadline',
          field: row => row.retrieveDeadline == null ? 1 : row.retrieveDeadline,
          format: (value) => {
            if (value == 1)
              return 'Coleta em até 1 dia útil'
            else
              return `Coleta em até ${value} dias uteis`;
          },
          label: 'Retrieve Deadline'
        },
        {
          name : 'deliveryDeadline',
          field: row => row.deliveryDeadline == null ? 1 : row.deliveryDeadline,
          format: (value) => {
            if (value == 1)
              return 'Entrega em 1 dia útil';
            else
              return `Entrega em ${value} dias úteis`;
          },
          label: 'Delivery Deadline'
        },
        {
          name  : 'totalValue',
          field : row => row.total,
          format: (value) => {
            let formatter = new Intl.NumberFormat(this.$i18n.locale, {
              style   : 'currency',
              currency: 'BRL',
            });
            return formatter.format(value);
          },
          label : 'Total'
        },
        {
          name  : 'carrierImage',
          field : row => row.carrier.image,
          format: (value) => {
            if (value === null)
              return null;

            return 'https:\/\/app.freteclick.com.br\/' + value.substring(value.indexOf('user/profile'));
          },
          label : 'Carrier Image'
        },
        {
          name  : 'carrierRating',
          field : row => row.carrier.averageRating,
          format: (value) => {
            if (value === null)
              return 4;

            return value;
          },
          label : 'Carrier Rating'
        },

        {
          name  : 'taxes',
          field : row => row.taxes,
          label : 'Taxes'
        },
      ],
    };
  },

  computed: {
    isNewUser() {
      return this.order_.user.logged == false && this.order_.user.isNew == true;
    },

    needLogin() {
      return this.order_.user.logged == false && this.order_.user.isNew == false;
    },

    isPublic() {
      return this.$route.name == 'QuoteIndex';
    },
  },

  methods: {
    getSelectedStyle(quoteId) {
      let style = 'border-radius: 30px;';

      if (!this.order_.quote)
        return style;

      if (this.order_.quote.id == quoteId) {
        style += 'border: 3px solid green;';
      }

      return style;
    },

    mayContract() {
      let _class = 'q-mt-md';

      if (!this.order_.status)
        return _class;

      return this.order_.status.real_status != 'open' ? `${_class} hidden` : _class;
    },

    chooseQuote(quote) {
      if (quote) {
        this.$emit('choose', { id: quote.id, price: quote.total });
      }
    },

    showTaxes(quote) {
      let _taxes = [];

      for (let index in quote.taxes) {
        _taxes.push({
          name : quote.taxes[index].name,
          total: quote.taxes[index].total,
        });
      }

      this.quote.id    = quote.id;
      this.quote.taxes = _taxes;
      this.dtaxes      = _taxes.length > 0;
    },
  },
};
</script>

<style lang="stylus" scoped>
.title-bar
  max-width: 92%  !important
  margin   : auto  !important

@media (max-width: $breakpoint-xs-max)
  .title-bar
    max-width: 95%  !important
    margin   : auto !important
</style>
