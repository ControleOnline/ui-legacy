<template>
  <div>
    <q-card class="ceg-card-container" v-if="this.order_.quotes.length > 0">
      <q-card-section class="ceg-card-body">
        <div class="row">
          <div class="col-12">
            <div class="quote-result-map" ref="quoteMap"></div>
            <q-card class="ceg-card" v-if="domainType() === 'ceg'">
              <q-card-section class="ceg-card-section">
                <div class="row">
                  <div class="col-4">
                    <q-btn
                      icon="close"
                      color="white"
                      class="ceg-button-close"
                      flat
                      round
                      dense
                      v-close-popup
                    />

                    <h6 class="ceg-title">Dados Gerais</h6>

                    <ul class="ceg-list">
                      <li>
                        <strong>Código:</strong>
                        #{{ order_.id }}
                      </li>
                      <li>
                        <strong>Data da Solicitação:</strong>
                        {{ formatTodayDate() }}
                      </li>
                    </ul>
                  </div>
                  <div class="col-4">
                    <h6 class="ceg-title">Veículos para Transportar</h6>

                    <ul class="ceg-list">
                      <li>
                        <strong v-if="domainType() === 'simple'"
                          >Simulação:</strong
                        >
                        <strong v-if="domainType() === 'ceg'"
                          >Descrição:</strong
                        >
                        {{ order_.product.type }}
                      </li>
                      <li>
                        <strong>Valor:</strong>
                        {{ this.$formatter. formatMoney(order_.product.totalPrice) }}
                      </li>
                    </ul>
                  </div>
                  <div class="col-4">
                    <h6 class="ceg-title">Percurso</h6>

                    <ul>
                      <li>
                        <strong>Origem:</strong>
                        {{ order_.address.origin.city }}
                      </li>
                      <li>
                        <strong>Destino:</strong>
                        {{ order_.address.destination.city }}
                      </li>
                      <li v-if="routeTime">
                        <strong>Tempo estimado:</strong>
                        {{ routeTime }}
                      </li>
                      <li v-if="mapRouteKm">
                        <strong>Distância aproximada:</strong>
                        {{ mapRouteKm }}
                      </li>
                    </ul>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div
      :class="
        domainType() === 'ceg'
          ? 'ceg-quotes-container'
          : 'ceg-quotes-container simple-quotes-container'
      "
    >
      <q-btn
        icon="close"
        color="white"
        class="ceg-button-close"
        flat
        round
        dense
        v-close-popup
      />
      <h6 class="ceg-quotes-title">Opções Encontradas</h6>

      <ul v-if="domainType() === 'simple'">
        <li>
          <strong>Origem:</strong>
          {{ order_.address.origin.city }}
        </li>
        <li>
          <strong>Destino:</strong>
          {{ order_.address.destination.city }}
        </li>
        <li v-if="routeTime">
          <strong>Tempo estimado:</strong>
          {{ routeTime }}
        </li>
        <li v-if="mapRouteKm">
          <strong>Distância aproximada:</strong>
          {{ mapRouteKm }}
        </li>
      </ul>
      <q-list v-if="domainType() === 'simple'" bordered>
        <q-expansion-item
          v-for="(q, index) in carriers"
          :key="index"
          group="carriers"
          icon="explore"
          default-opened
          header-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section>
              <img class="img-logo" :src="'//' + q.carrier.image" />
              <h7 class="negative" v-if="q.carrier.enabled === false">
                (INATIVA)
              </h7>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <ul class="result-box">
                <li v-for="(tax, i) in taxes[index]" :key="i">
                  <h7 class="black">
                    {{ tax.group.name }}
                    {{ tax.group.code ? tax.group.code : "" }} -
                    {{ this.$formatter. formatMoney(tax.total) }}
                    <q-btn
                      round
                      :id="domainType() == 'simple' ? 'taxa-button' : ''"
                      class="ceg-button ceg-button-mini"
                      icon="money"
                      color="black"
                      title="Taxas"
                      :ref="'taxes' + i"
                      @click="showTaxes(tax)"
                    />
                  </h7>
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <q-list v-else bordered>
        <ul
          class="ceg-list no-listred"
          v-for="(quote, index) in order_.quotes"
          :key="index"
        >
          <li>
            <h7
              class="negative"
              v-if="
                quote.carrier.enabled === false || quote.group.enabled === false
              "
            >
              {{ quote.carrier.alias }} - {{ quote.group.name }} (INATIVA)
            </h7>
            <h7 v-else class="positive"
              >{{ quote.carrier.alias }} - {{ quote.group.name }}</h7
            >
          </li>
          <li>
            <h7>Frete (R$):</h7>
            {{ this.$formatter. formatMoney(quote.total) }}
            <q-btn
              round
              :id="domainType() == 'simple' ? 'taxa-button' : ''"
              class="ceg-button ceg-button-mini"
              icon="money"
              color="primary"
              title="Taxas"
              :ref="'taxes' + index"
              @click="showTaxes(quote)"
            />
          </li>
          <!--<li>
          <strong>Prazo (dias):</strong>
          {{ quote.deliveryDeadline }}
        </li>-->
          <li class="ceg-buttons-container">
            <q-btn
              rounded
              v-if="domainType() !== 'simple' && domainType() !== 'ceg'"
              icon="send"
              style="background-color: #56da63"
              :class="mayContract() + 'ceg-contratar ceg-button'"
              :label="$t('Hire')"
              @click="chooseQuote(quote)"
            />

            <q-btn
              rounded
              v-if="domainType() !== 'simple'"
              icon="share"
              style="background-color: #ff9800"
              class="ceg-button ceg-proposta"
              label="Gerar Proposta"
              @click="onPropostaClick(quote)"
            />
          </li>
        </ul>
      </q-list>
    </div>

    <q-dialog
      v-model="dtaxes"
      transition-show="scale"
      ref="taxPopup"
      transition-hide="scale"
    >
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
import { api } from "app/modules/controleonline/quasar-common-ui/src/api";
import QuotationTaxes from "@controleonline/quasar-legacy-ui/quasar-common-ui/src/components/Common/QuotationTaxes";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
    origin: {
      type: Object,
      required: true,
    },
    destination: {
      type: Object,
      required: true,
    },
  },

  components: {
    QuotationTaxes,
  },

  mounted() {
    this.$emit("load");

    this.createMap();
  },
  created() {
    this.getCarriers(this.order.quotes);
  },
  data() {
    return {
      quote: {
        id: null,
        taxes: [],
      },
      dtaxes: false,
      order_: Object.assign({}, this.order),
      mapRouteTime: 0,
      routeTime: 0,
      mapRouteKm: null,
      taxes: [],
      carriers: [],
      processed_route_time: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 12,
      },

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
          field: (row) =>
            row.retrieveDeadline == null ? 1 : row.retrieveDeadline,
          format: (value) => {
            if (value == 1) return "Coleta em até 1 dia útil";
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
            else return `Entrega em ${value} dias úteis`;
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
            if (value === null) return null;

            return `//${value}`;
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
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
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
  },

  methods: {
    ...mapActions({
      sendProposta: "quote/sendProposta",
      chooseRouteTime: "quote/chooseRouteTime",
    }),
    getCarriers(quotes) {
      if (Object.keys(this.carriers).length === 0) {
        let r = [];
        let taxes = [];
        quotes.forEach((quote, index) => {


          this.routeTime =  quote.deliveryDeadline;

          if (
            typeof taxes[quote.carrier.id] === "undefined" &&
            quote.carrier.id !== "undefined"
          ) {
            taxes[quote.carrier.id] = {};
            r[quote.carrier.id] = {
              carrier: quote.carrier,
              taxes: [],
            };
          }

          if (
            typeof taxes[quote.carrier.id][quote.id] === "undefined" &&
            quote.carrier.id !== "undefined" &&
            quote.id !== "undefined"
          ) {
            taxes[quote.carrier.id][quote.id] = {
              carrier: quote.carrier,
              deliveryDeadline: quote.deliveryDeadline,
              group: quote.group,
              id: quote.id,
              retrieveDeadline: quote.retrieveDeadline,
              taxes: quote.taxes,
              total: quote.total,
            };
            r[quote.carrier.id].taxes[quote.id] =
              taxes[quote.carrier.id][quote.id];
          }
        });
        if (
          Object.keys(this.taxes).length === 0 &&
          Object.keys(taxes).length > 0
        ) {
          this.taxes = this.clean(taxes);
        }
        if (
          Object.keys(this.carriers).length === 0 &&
          Object.keys(r).length > 0
        ) {
          this.carriers = this.clean(r);
        }
      }
    },
    clean(obj) {
      var array = ((obj));
      var rerult = array.filter(function (el) {
        return el != null;
      });

      return rerult;
    },
    onPropostaClick(quote) {
      this.isLoading = true;

      this.sendProposta({
        id: quote.id,
        params: {
          myCompany: this.myCompany.id,
        },
      }).then((res) => {
        this.isLoading = false;
        if (res.response && res.response.data && res.response.data.html) {
          /*Imprimir PDF*/
          var pdf = res.response.data.pdf;
          var pdfName = "Proposta - " + quote.id + ".pdf";

          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(
              b64toBlob(pdf, "Aplication/PDF"),
              pdfName
            );
          } else {
            const downloadLink = window.document.createElement("a");
            const blob = this.b64toBlob(pdf, "Aplication/PDF");
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = pdfName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }

          /*
              var html = atob(res.response.data.html);
              var ww = window.open(
                "",
                "PRINT",
                "height=" +
                  (document.innerHeight - 100) +
                  ",width=" +
                  (document.innerWidth - 100)
              );
              ww.document.write(html);
              ww.document.close();
              ww.focus();
*/
        }
      });
    },

    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    domainType() {
      return this.defaultCompany.domainType;
    },

    formatTodayDate() {
      return new Date().toLocaleDateString();
    },

    getMapRouteTime() {
      if (!this.route_time) {
        var km = this.mapRouteKm
          .replace(" km", "")
          .replace(".", "")
          .replace(",", "");

        if (!isNaN(km)) {
          km = Number(km);

          var total = km / 600;

          if (total <= 1) {
            this.mapRouteTime = 3;
          }

          this.mapRouteTime = total + 2;
        }

        let states = ["RR", "AM", "RO", "AC"];

        if (
          states.includes(this.order_.address.origin.state) ||
          states.includes(this.order_.address.destination.state)
        ) {
          this.mapRouteTime = this.mapRouteTime + 10;
        }

        let payload = {
          id: this.order.id,
          values: {
            route_time: Math.round(this.mapRouteTime),
          },
        };

        if (this.myCompany !== null)
          payload.query = {
            myCompany: this.myCompany.id,
          };

        if (!this.processed_route_time) {
          this.chooseRouteTime(payload);
        }

        this.processed_route_time = true;
      }

      this.mapRouteTime =  this.mapRouteTime > 0
        ? "de " +
            Math.round(this.mapRouteTime) +
            " até " +
            Math.round(this.mapRouteTime + 5) +
            " dias"
        : "--";
    },

    getRouteRime(){
      const minRouteTime = this.routeTime <= 5 ? minRouteTime = 2 : this.routeTime -5;

      if (!this.route_time) {
        let payload = {
          id: this.order.id,
          values: {
            route_time: Math.round(this.routeTime),
          },
        };

        if (this.myCompany !== null)
          payload.query = {
            myCompany: this.myCompany.id,
          };

        if (!this.processed_route_time) {
          this.chooseRouteTime(payload);
        }

        this.processed_route_time = true;
      }

      this.routeTime = this.routeTime > 0 ? "de " + Math.round(minRouteTime) + " até " + Math.round(this.routeTime) + " dias" : "--";
    },

   formatMoney(value) {
      let formatter = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });

      if (typeof value == "string" && value.indexOf(",") > -1) {
        value = value.replace(",", ".");
      }

      return formatter.format(value);
    },

    mayContract() {
      let _class = "q-mt-md";
      if (!this.order_.status) return _class;
      return this.order_.status.status == "quote" ||
        this.order_.status.status == "client invoice tax" ||
        this.order_.status.status == "analysis"
        ? _class
        : `${_class} hidden`;
    },

    chooseQuote(quote) {
      if (quote) {
        this.$emit("choose", { id: quote.id, price: quote.total });
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

    createMap() {
      const self = this;
      const mapDiv = this.$refs["quoteMap"];

      if (google && google.maps) {
        const o = this.origin;
        const d = this.destination;

        if (o && o.city && o.country && d && d.city && d.country) {
          const map = new google.maps.Map(mapDiv);

          const direction = new google.maps.DirectionsService();

          const display = new google.maps.DirectionsRenderer({
            map: map,
          });

          var origin = {
            placeId: o.id,
          };
          var destination = {
            placeId: d.id,
          };

          if (!o.id) {
            delete origin.placeId;
            origin.location = new google.maps.LatLng(o.lat, o.lng);
          }

          if (!d.id) {
            delete destination.placeId;
            destination.location = new google.maps.LatLng(d.lat, d.lng);
          }

          direction.route(
            {
              origin: origin,
              destination: destination,
              waypoints: [
                {
                  stopover: true,
                  location: origin,
                },
              ],
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            function (response, status) {
              if (status === "OK") {
                display.setDirections(response);
                self.computeTotalDistance(response);
              } else {
                console.log("google maps error " + status);
              }
            }
          );
        }
      }
    },
    computeTotalDistance(response) {
      var total = null;
      var time = null;
      var route = response.routes[0];

      if (route && route.legs) {
        let length = route.legs.length || 0;

        length--;

        if (length > -1) {
          total = route.legs[length].distance.text;
          time = route.legs[length].duration.text;
        }
      }

      //this.mapRouteTime = time;
      this.mapRouteKm = total;
      // this.getMapRouteTime();
      this.getRouteRime();
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

        let order = ((this.order_));

        order.quotes[_index].taxes = taxes;
        this.taxes = taxes;
        if (new_tax == true) {
          order.quotes[_index].taxes[index++] = {
            name: quote.tax.name,
            total: quote.tax.price,
          };
        }

        order.quotes[_index].total = Number(quote.total);
        this.order_ = order;
        let ref = this.$refs["taxes" + _index][0];
        this.$refs["taxPopup"].hide();
        ref.click();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.quote-result-map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}

.ceg-card-container {
  position: relative;
  height: 100%;
}

.ceg-card-body {
  min-height: 100%;
}

.ceg-card {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  border-radius: 5px !important;
  overflow: none;
}

.ceg-card-section {
  padding-top: 3px;
  padding-bottom: 3px;
}

.ceg-button {
  border-radius: 10px !important;
  padding: 0px !important;
  font-size: 10px;
  min-width: 70px;
  color: white !important;
}

.ceg-button-close {
  z-index: 10;
  position: absolute;
  top: 10px;
  right: 10px;
  color: black !important;
}

.ceg-title {
  padding: 10px 5px;
  margin: 0px;
  border-bottom: 1px solid grey;
}

.ceg-buttons-container {
  padding: 10px 0px;
}

.ceg-contratar {
  float: right;
  margin-top: 5px;
}

.ceg-taxes {
  min-width: 100px;
  width: 100px;
  border-radius: 20px;
  margin-right: 20px;
  vertical-align: bottom;
}

#taxa-button {
  width: 100%;
}

.ceg-proposta {
  width: 100%;
  margin-top: 10px;
}

.ceg-list {
  list-style: none;
  padding-right: 0px !important;
  padding-left: 0px !important;
  padding-bottom: 10px !important;
  padding-top: 20px !important;
  margin: 0px;
  display: block;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;

  &:not(.no-listred) li:nth-child(odd) {
    background-color: #f0f0f0;
  }
}

.simple-quotes-container {
  top: 5vh;
  height: 90vh;
  max-height: 100vh;
  right: 5vh;
}

.ceg-quotes-container {
  position: fixed;
  border-radius: 15px;
  padding: 10px;
  background-color: rgba(120, 120, 120, 0.7);
  overflow: auto;
  color: white;
  top: 6vh;
  right: 12px;
  max-height: calc(85vh - 120px);

  .ceg-quotes-title {
    margin: 0px;
    padding: 0;
    border-bottom: 1px solid white;
    font-size: 14px;
  }
}

.title-bar .text-h5 {
  font-size: 18px;
}

.ceg-button-mini {
  max-width: 30px !important;
  min-width: 30px !important;
  float: right;
}

.negative {
  color: red !important;
}

.black {
  color: black !important;
  padding-right: 20px;
}

.result-box {
  padding: 0;
}

.result-box li {
  clear: both;
  padding-top: 5px;
}

.img-logo {
  width: 100px;
  height: auto;
  border-radius: revert;
}
</style>
