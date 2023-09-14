<template>
  <div>
    <q-card v-if="this.order.quotes.length > 0">
      <q-card-section v-if="header" style="background-color: #00519b">
        <div class="row items-center title-bar">
          <q-icon name="local_shipping" style="color: #ffbc16; font-size: 40px; margin-right: 20px" />
          <div class="text-h5" style="color: #ffbc16">
            Cotação #{{ this.order.id }}
          </div>
          <q-space />
          <q-btn icon="close" color="white" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-card-section style="max-width: 1250px !important; margin: auto !important">
        <q-table dense  grid hide-header :rows="order.quotes" :columns="columns" :visible-columns="visible" row-key="id"
          :pagination.sync="pagination">
          <template v-slot:item="props">
            <div class="q-pb-xs-md q-pa-sm-md col-xs-12 col-sm-6 col-md-3">
              <q-card class="shadow-10" :style="getSelectedStyle(props.row.id)">
                <q-img v-if="!logged" src="~/assets/placeholder.png" style="height: 130px; width: 80%; margin-left: 9%"
                  ratio="1" transition="scale" :contain="true">
                  <template v-slot:error>
                    <div class="
                        row
                        items-center
                        justify-center
                        text-center text-subtitle2 text-black
                      " style="
                        height: 130px;
                        width: 80%;
                        margin-left: 9%;
                        background: none;
                      ">
                      {{ props.cols[1].value }}
                    </div>
                  </template>
                </q-img>
                <q-img v-else-if="props.cols[5].value !== null" :src="props.cols[5].value"
                  style="height: 130px; width: 80%; margin-left: 9%" ratio="1" transition="scale" :contain="true">
                  <template v-slot:error>
                    <div class="
                        row
                        items-center
                        justify-center
                        text-center text-subtitle2 text-black
                      " style="
                        height: 130px;
                        width: 80%;
                        margin-left: 9%;
                        background: none;
                      ">
                      {{ props.cols[1].value }}
                    </div>
                  </template>
                </q-img>
                <q-card-section class="text-white" align="center" style="background: #00519b">
                  <q-list>
                    <q-item :class="
                      props.row.retrieveDeadline == 0 ||
                        props.row.retrieveDeadline == null
                        ? 'no-retrieve-container'
                        : ''
                    ">
                      <q-item-section style="min-width: 0; padding-right: 8px" avatar>
                        <q-icon :color="
                          props.row.retrieveDeadline == 0 ||
                            props.row.retrieveDeadline == null
                            ? 'red'
                            : 'orange'
                        " name="send" />
                      </q-item-section>
                      <q-item-section :class="
                        props.row.retrieveDeadline == 0 ||
                          props.row.retrieveDeadline == null
                          ? 'text-left text-bold red'
                          : 'text-left text-bold'
                      ">{{ props.cols[2].value }}</q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section style="min-width: 0; padding-right: 8px" avatar>
                        <q-icon color="orange" name="send" />
                      </q-item-section>
                      <q-item-section class="text-left text-bold">{{
                          props.cols[3].value
                      }}</q-item-section>
                    </q-item>
                    <q-item class="obs-container">
                      <q-item-section class="obs text-center text-bold">
                        (*após coletado)
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div class="text-h4 text-bold col-12">
                    {{ props.cols[4].value }}
                  </div>
                  <div class="col-12">
                    <q-btn rounded icon="send" style="width: 85%; background-color: #56da63" :class="mayContract()"
                      :label="logged ? 'Contratar' : 'Entrar'" @click="chooseQuote(props.row)" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions v-if="footer" align="center" class="q-pa-md">
        <q-btn flat label="Retornar aos dados da Cotação" style="color: #00519b" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="dtaxes" persistent transition-show="scale" transition-hide="scale">
      <q-card class="text-white" style="background-color: #00519b">
        <q-card-section>
          <div class="text-h6 text-center">Taxas</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-left">Nome</th>
                <th class="text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tax, index) in taxes" :key="index">
                <td class="text-left">{{ tax.name }}</td>
                <td class="text-right">{{ tax.total }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
    header: {
      type: Boolean,
      required: false,
      default: true,
    },
    footer: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  mounted() {
    this.$emit("load");
  },

  data() {
    return {
      taxes: [],
      dtaxes: false,

      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 12,
      },

      visible: [
        "groupName",
        "carrierName",
        "carrierImage",
        "retrieveDeadline",
        "deliveryDeadline",
        "totalValue",
        "carrierRating",
        "taxes",
      ],

      columns: [
        {
          name: "groupName",
          field: (row) => row.group.name,
          label: "Group Name",
        },
        {
          name: "carrierName",
          field: (row) => row.carrier.name,
          label: "Carrier Name",
        },
        {
          name: "retrieveDeadline",
          field: (row) => row.retrieveDeadline,
          format: (value) => {
            if (value == null || parseInt(value) == 0)
              return "Sem Coleta (Entregar no Balcão)";
            else if (parseInt(value) == 1) return "Coleta em até 1 dia útil";
            else return `Coleta em até ${value} dias uteis`;
          },
          label: "Retrieve Deadline",
        },
        {
          name: "deliveryDeadline",
          field: (row) =>
            row.deliveryDeadline == null ? 1 : row.deliveryDeadline,
          format: (value) => {
            if (value == 1) return "Entrega em 1 dia útil";
            else
              return `Entrega entre ${value} e ${parseInt(value) + 2
                } dias úteis`;
          },
          label: "Delivery Deadline",
        },
        {
          name: "totalValue",
          field: (row) => row.total,
          format: (value) => {
            let formatter = new Intl.NumberFormat(this.$i18n.locale, {
              style: "currency",
              currency: "BRL",
            });
            return formatter.format(value);
          },
          label: "Total",
        },
        {
          name: "carrierImage",
          field: (row) => row.carrier.image,
          format: (value) => {
            if (value === null || !value) return null;

            return `https://${value}`;
          },
          label: "Carrier Image",
        },
        {
          name: "carrierRating",
          field: (row) => row.carrier.averageRating,
          format: (value) => {
            if (value === null) return 4;

            return value;
          },
          label: "Carrier Rating",
        },

        {
          name: "taxes",
          field: (row) => row.taxes,
          label: "Taxes",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({

    }),
    isNewUser() {
      return this.order.user.logged == false && this.order.user.isNew == true;
    },

    needLogin() {
      return this.order.user.logged == false && this.order.user.isNew == false;
    },

    isPublic() {
      return this.$route.name == "QuoteIndex";
    },

    logged() {
      /*
      let logged = this.getLoggedUser();
      if (logged && logged.email) {
        this.contact.name = logged.username || logged.user;
        this.contact.email = logged.email;
        this.contact.phone = logged.phone;
      }
      */
      return this.isLogged();
    },

  },

  methods: {
    getSelectedStyle(quoteId) {
      let style = "border-radius: 30px;";

      if (!this.order.quote) return style;

      if (this.order.quote.id == quoteId) {
        style += "border: 3px solid green;";
      }

      return style;
    },
    mayContract() {
      let _class = "q-mt-md";

      if (!this.order.status) return _class;

      return this.order.status.real_status != "open"
        ? `${_class} hidden`
        : _class;
    },

    chooseQuote(quote) {
      if (quote) {
        this.$emit("choose", { id: quote.id, price: quote.total });
      }
    },
    getLoggedUser() {
      return this.$store.getters["auth/user"];
    },

    isLogged() {
      return (
        this.getLoggedUser() !== null &&
        this.getLoggedUser().user
      );
    },
    showTaxes(taxes) {
      let _taxes = [];

      let format = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });

      for (let index in taxes) {
        _taxes.push({
          name: taxes[index].name,
          total: format.format(taxes[index].subtotal),
        });
      }

      this.taxes = _taxes;
      this.dtaxes = _taxes.length > 0;
    },
  },
};
</script>

<style lang="stylus" scoped>
.title-bar {
  max-width: 92% !important;
  margin: auto !important;
}

@media (max-width: $breakpoint-xs-max) {
  .title-bar {
    max-width: 95% !important;
    margin: auto !important;
  }
}

.obs {
  color: orange;
  width: 100%;
  margin: 0;
  padding: 0;
  display: block;
  margin-top: -10px;
}

.obs-container {
  margin: 0;
  padding: 0;
}

.red {
  color: red;
}

.no-retrieve-container {
  background: #fff;
  border-radius: 5px;
}
</style>