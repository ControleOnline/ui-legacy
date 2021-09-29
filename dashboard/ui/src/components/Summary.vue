<template>
  <div class="row q-col-gutter-sm">
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="blue-4" size="md" name="groups" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase">Clientes ativos</div>
            <div class="col-6 text-right text-blue-4 text-h6">{{ totals.active_clients_count }}</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="green-14" size="md" name="person_add" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase">Novos clientes</div>
            <div class="col-6 text-right text-green-4 text-h6">{{ totals.new_clients_count }}</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="orange" size="md" name="person_remove" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase">Clientes inativos</div>
            <div class="col-6 text-right text-orange text-h6">{{ totals.inactive_clients_count }}</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="orange" size="md" name="person" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase">Prospects</div>
            <div class="col-6 text-right text-orange text-h6">{{ totals.prospect_clients_count }}</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="blue-4" size="md" name="add_shopping_cart" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase"     >
              Cotações nesse período ({{ totals.quote_orders_totals.total_count }})
            </div>
            <div class="col-6 text-right text-blue-4 text-h6">
              {{
                formatMoney(totals.quote_orders_totals.total_price)
              }}
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="green-14" size="md" name="shopping_basket" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase"       >
              Vendas nesse período ({{ totals.sale_orders_totals.total_count }})
            </div>
            <div class="col-6 text-right text-green-14 text-h6">
              {{
                formatMoney(totals.sale_orders_totals.total_price)
              }}
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3">
      <q-card class="my-card q-pa-md row items-stretch" flat bordered>
        <div class="col-3 text-center">
          <div class="row items-center full-height">
            <q-icon color="green-14" size="md" name="money" />
          </div>
        </div>
        <div class="col-9">
          <div class="column">
            <div class="col-6 text-right text-uppercase"       >Ticket médio</div>
            <div class="col-6 text-right text-green-14 text-h6">
              {{
                formatMoney(totals.average_ticket_total)
              }}
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { date, extend }           from 'quasar';
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    data: {
      required: true,
      default : null
    },
  },

  computed: {
    totals() {
      return this.data || {
        active_clients_count  : 0,
        inactive_clients_count: 0,
        new_clients_count     : 0,
        prospect_clients_count: 0,
        quote_orders_totals   : {
          "total_price": 0,
          "total_count": 0,
        },
        sale_orders_totals    : {
          "total_price": 0,
          "total_count": 0,
        },
        average_ticket_total  : 0,
      };
    },
  },

  methods: {
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

<style lang="sass" scoped>
  .my-card
    min-height: 100%

</style>
