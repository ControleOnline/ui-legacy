<template>
  <div>
    <q-card v-if="this.order_.quotes.length > 0">
      <q-card-section v-if="header" style="background-color: #00519b">
        <div class="row items-center title-bar">
          <q-icon
            name="local_shipping"
            style="color: #ffbc16; font-size: 40px; margin-right: 20px"
          />
          <div class="text-h5" style="color: #ffbc16">
            Cotação #{{ this.order_.id }}
          </div>
          <q-space />
          <q-btn icon="close" color="white" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-card-section
        style="max-width: 1250px !important; margin: auto !important"
      >
        <div v-if="!isCeg()" class="row items-center bg-grey-2">
          <div class="col-4 items-center text-center">
            <span>CB</span> -
            <span>
              {{ competitor.cargo.carrier }}
            </span>
            -
            <span>
              {{ competitor.cargo.price }}
            </span>
            -
            <span>
              {{ competitor.cargo.deadline }}
              dias
            </span>
          </div>
          <div class="col-4 items-center text-center">
            <span>CF</span> -
            <span>
              {{ competitor.central.carrier }}
            </span>
            -
            <span>
              {{ competitor.central.price }}
            </span>
            -
            <span> {{ competitor.central.deadline }} dias </span>
          </div>
          <div class="col-4 items-center text-center">
            <span>GF</span> -
            <span>
              {{ competitor.go.carrier }}
            </span>
            -
            <span>
              {{ competitor.go.price }}
            </span>
            -
            <span> {{ competitor.go.deadline }} dias </span>
          </div>
        </div>
        <q-table
          flat
          grid
          hide-header
          :data="order_.quotes"
          :columns="columns"
          :visible-columns="visible"
          row-key="id"
          :pagination.sync="pagination"
        >
          <template v-slot:item="props">
            <div class="q-pb-xs-md q-pa-sm-md col-xs-12 col-sm-6 col-md-3">
              <q-card class="shadow-10" :style="getSelectedStyle(props.row.id)">
                <q-card-section
                  v-if="props.cols[5].value == null"
                  class="row items-center justify-center text-center"
                  style="height: 130px; width: 80%; margin-left: 9%"
                >
                  <div class="text-subtitle2">
                    {{ props.cols[1].value }}
                  </div>
                </q-card-section>
                <q-img
                  v-else
                  :src="props.cols[5].value"
                  style="height: 130px; width: 80%; margin-left: 9%"
                  ratio="1"
                  transition="scale"
                  :contain="true"
                >
                  <template v-slot:error>
                    <div
                      class="
                        row
                        items-center
                        justify-center
                        text-center text-subtitle2 text-black
                      "
                      style="
                        height: 130px;
                        width: 80%;
                        margin-left: 9%;
                        background: none;
                      "
                    >
                      {{ props.cols[1].value }}
                    </div>
                  </template>
                </q-img>
                <q-card-section class="text-center">
                  <div
                    v-if="props.cols[5].value === null"
                    class="
                      row
                      items-center
                      justify-center
                      text-center text-subtitle2
                    "
                    style="height: 130px; width: 80%; margin-left: 9%"
                  >
                    {{ props.cols[1].value }}
                  </div>
                  <div
                    v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
                    class="text-subtitle1 text-bold"
                    style="color: #00519b"
                  >
                    {{ props.cols[0].value }}
                  </div>
                  <q-badge
                    v-if="
                      !isPublic &&
                      (props.row.carrier.enabled === false ||
                        props.row.group.enabled === false)
                    "
                    color="negative"
                    align="top"
                  >
                    INATIVA
                  </q-badge>
                  <q-badge
                    v-if="
                      !isPublic &&
                      props.row.carrier.enabled === true &&
                      props.row.group.enabled === true
                    "
                    color="positive"
                    align="top"
                  >
                    ATIVA
                  </q-badge>
                </q-card-section>

                <q-card-section align="center" class="q-pt-none">
                  <q-rating
                    readonly
                    v-model="props.cols[6].value"
                    size="2.9em"
                    color="yellow"
                    class="justify-center"
                  />
                </q-card-section>

                <q-card-section
                  class="text-white"
                  align="center"
                  style="background: #00519b"
                >
                  <q-list>
                    <q-item
                      v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
                      :class="
                        props.row.retrieveDeadline == 0 ||
                        props.row.retrieveDeadline == null
                          ? 'no-retrieve-container'
                          : ''
                      "
                    >
                      <q-item-section
                        style="min-width: 0; padding-right: 8px"
                        avatar
                      >
                        <q-icon
                          :color="
                            props.row.retrieveDeadline == 0 ||
                            props.row.retrieveDeadline == null
                              ? 'red'
                              : 'orange'
                          "
                          name="send"
                        />
                      </q-item-section>
                      <q-item-section
                        :class="
                          props.row.retrieveDeadline == 0 ||
                          props.row.retrieveDeadline == null
                            ? 'text-left text-bold red'
                            : 'text-left text-bold'
                        "
                        >{{ props.cols[2].value }}</q-item-section
                      >
                    </q-item>
                    <q-item>
                      <q-item-section
                        style="min-width: 0; padding-right: 8px"
                        avatar
                      >
                        <q-icon color="orange" name="send" />
                      </q-item-section>
                      <q-item-section class="text-left text-bold">{{
                        props.cols[3].value
                      }}</q-item-section>
                    </q-item>
                    <q-item
                      v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
                      class="obs-container"
                    >
                      <q-item-section class="obs text-center text-bold">
                        (*após coletado)
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div class="text-h4 text-bold col-12">
                    {{ props.cols[4].value }}
                  </div>
                  <div class="col-12">
                    <q-btn
                      v-if="haveToShowTaxes && !isPublic && isSuperAdmin"
                      round
                      icon="money"
                      color="primary"
                      @click="showTaxes(props.row)"
                    />
                    <q-btn
                      v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
                      round
                      icon="send"
                      style="background-color: #56da63"
                      @click="alterQuote(props.row)"
                    />
                  </div>
                  <div class="col-12">
                    <q-btn
                      v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
                      rounded
                      icon="send"
                      style="width: 85%; background-color: #56da63"
                      :class="mayContract()"
                      :label="translate('Hire')"
                      @click="chooseQuote(props.row)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions v-if="footer" align="center" class="q-pa-md">
        <q-btn
          flat
          label="Retornar aos dados da Cotação"
          style="color: #00519b"
          v-close-popup
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="dtaxes" transition-show="scale" transition-hide="scale">
      <QuotationTaxes
        :quote="quote"
        @error="
          (error) => {
            this.$q.notify({
              message: error.message,
              position: 'bottom',
              type: 'negative',
            });
          }
        "
        @added="onAddNewTax"
      />
    </q-dialog>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import translate from "@controleonline/../../src/boot/translate";
import QuotationTaxes from "@controleonline/quasar-common-ui/src/components/Common/QuotationTaxes";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";
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

  components: {
    QuotationTaxes,
  },

  mounted() {
    this.$emit("load");
    if (!this.isCeg()) {
      this.getGoPrice(this.order_);
      this.getCargoPrice(this.order_);
      this.getCentralPrice(this.order_);
    }
  },

  data() {
    return {
      competitor: {
        cargo: {
          carrier: "",
          price: "R$ 0,00",
          deadline: "0",
        },
        central: {
          carrier: "",
          price: "R$ 0,00",
          deadline: "0",
        },
        go: {
          carrier: "",
          price: "R$ 0,00",
          deadline: "0",
        },
      },
      quote: {
        id: null,
        taxes: [],
      },
      dtaxes: false,
      order_: this.order,
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
              return `Entrega entre ${value} e ${
                parseInt(value) + 2
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
          field: (row) => parseFloat(row.carrier.averageRating),
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
      logged: "auth/user",
      haveToShowTaxes: "quote/showTaxes",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),

    isNewUser() {
      return this.order_.user.logged == false && this.order_.user.isNew == true;
    },

    needLogin() {
      return (
        this.order_.user.logged == false && this.order_.user.isNew == false
      );
    },

    isPublic() {
      return this.$route.name == "QuoteIndex";
    },

    isSuperAdmin() {
      return this.myCompany
        ? Object.values(this.myCompany.permission).indexOf("super") != -1 ||
            Object.values(this.myCompany.permission).indexOf("franchisee") != -1
        : false;
    },
  },

  methods: {
    domainType() {
      return this.defaultCompany.domainType;
    },
    getSelectedStyle(quoteId) {
      let style = "border-radius: 30px;";

      if (!this.order_.quote) return style;

      if (this.order_.quote.id == quoteId) {
        style += "border: 3px solid green;";
      }

      return style;
    },

    isCeg() {
      const cegTypes = ["ceg", "simple"];
      return cegTypes.indexOf(this.domainType()) > -1;
    },

    addOtherInformation(competitor_name, competitor_data) {
      let values = {
        other_informations_type: "competitor",
        other_informations: { [competitor_name]: competitor_data },
      };

      let options = {
        method: "POST",
        
        body: JSON.stringify(values),
      };

      return api.fetch(
        `/sales/orders/` + this.order_.id + "/other_informations",
        options
      )
        
        .then((data) => {
          return data;
        });
    },
    getCargoPrice(order) {
      if (
        order.other_informations &&
        order.other_informations.competitor &&
        order.other_informations.competitor.cargo
      ) {
        this.competitor.cargo = order.other_informations.competitor.cargo;
        return this.competitor.cargo;
      } else {
        let values = { competitor: "cargo" };

        let options = {
          method: "POST",
          body: JSON.stringify(values),
        };

        return api.fetch(`/sales/orders/` + order.id + `/competitor`, options)
          
          .then((response) => response.response)
          .then((response) => {
            let data = response.data.competitor;
            if (response.success) {
              this.competitor.cargo.carrier = data.carrier;
              this.competitor.cargo.price = "R$ " + data.value;
              this.competitor.cargo.deadline = data.deadline;
              //this.addOtherInformation("cargo", this.competitor.cargo);
            } else {
              this.competitor.cargo.price = "";
              this.competitor.cargo.deadline = data.error;
            }
            return this.competitor.cargo;
          });
      }
    },
    getCentralPrice(order) {
      if (
        order.other_informations &&
        order.other_informations.competitor &&
        order.other_informations.competitor.central
      ) {
        this.competitor.central = order.other_informations.competitor.central;
        return this.competitor.central;
      } else {
        let values = { competitor: "central" };

        let options = {
          method: "POST",
          body: JSON.stringify(values),
        };
        return api.fetch(`/sales/orders/` + order.id + `/competitor`, options)
          
          .then((response) => response.response)
          .then((response) => {
            let data = response.data.competitor;
            if (response.success) {
              this.competitor.central.carrier = data.carrier;
              this.competitor.central.price = "R$ " + data.value;
              this.competitor.central.deadline = data.deadline;
              //this.addOtherInformation("central", this.competitor.central);
            } else {
              this.competitor.central.price = "";
              this.competitor.central.deadline = data.error;
            }
            return this.competitor.central;
          });
      }
    },
    getGoPrice(order) {
      if (
        order.other_informations &&
        order.other_informations.competitor &&
        order.other_informations.competitor.go
      ) {
        this.competitor.go = order.other_informations.competitor.go;
        return this.competitor.go;
      } else {
        let values = { competitor: "go" };

        let options = {
          method: "POST",
          body: JSON.stringify(values),
        };

        return api.fetch(`/sales/orders/` + order.id + `/competitor`, options)
          
          .then((response) => response.response)
          .then((response) => {
            let data = response.data.competitor;
            if (response.success) {
              this.competitor.go.carrier = data.carrier;
              this.competitor.go.price = "R$ " + data.value;
              this.competitor.go.deadline = data.deadline;
              //this.addOtherInformation("go", this.competitor.go);
            } else {
              this.competitor.go.price = "";
              this.competitor.go.deadline = data.error;
            }
            return this.competitor.go;
          });
      }
    },
    mayContract() {
      let _class = "q-mt-md";
      if (!this.order_.status) return _class;
      return this.order_.status.status == "quote" ||
        this.order_.status.status == "waiting client invoice tax" ||
        this.order_.status.status == "analysis"
        ? _class
        : `${_class} hidden`;
    },
    alterQuote(quote) {
      if (quote) {
        this.$emit("alterQuote", { id: quote.id });
      }
    },
    chooseQuote(quote) {
      if (quote) {
        this.$emit("choose", { id: quote.id });
      }
    },
    showTaxes(quote) {
      let _taxes = [];

      let format = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });
      return api.fetch(`/quote_detail/${quote.id}`)
        
        .then((response) => {
          let quotation = response.response.data;
          for (let index in quotation.taxes) {
            _taxes.push({
              name: quotation.taxes[index].name,
              total: format.format(
                parseFloat(
                  quotation.taxes[index].total ||
                    quotation.taxes[index].subtotal ||
                    0
                ).toFixed(2)
              ),
            });
          }
          this.quote.id = quote.id;
          this.quote.taxes = _taxes;
          this.dtaxes = _taxes.length > 0;
        })
        .catch((e) => {
          if (e instanceof SubmissionError) {
            throw Error(e.errors._error);
            return;
          }

          throw Error(e.message);
        });
    },
    onAddNewTax(quote) {
      if (this.order_.quotes) {
        let _quote = this.order_.quotes.find((q) => q.id === quote.id);
        let _index = this.order_.quotes.indexOf(_quote);
        let new_tax = true;
        let taxes = [];
        let index = 0;
        for (let i in this.order_.quotes[_index].taxes) {
          index++;
          if (this.order_.quotes[_index].taxes[i].name == quote.tax.name) {
            new_tax = false;
            taxes[index] = {
              name: quote.tax.name,
              total: quote.tax.price,
            };
          } else {
            taxes[index] = {
              name: this.order_.quotes[_index].taxes[i].name,
              total:
                this.order_.quotes[_index].taxes[i].total ||
                this.order_.quotes[_index].taxes[i].subtotal,
            };
          }
        }
        this.order_.quotes[_index].taxes = taxes;
        if (new_tax == true) {
          this.order_.quotes[_index].taxes[index++] = {
            name: quote.tax.name,
            total: quote.tax.price,
          };
        }
        this.order_.quotes[_index].total = Number(quote.total);
        this.showTaxes(quote);
      }
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
