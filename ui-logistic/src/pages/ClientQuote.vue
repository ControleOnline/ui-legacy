<template>
  <q-page :class="isCeg() ? 'quote-page-ceg quote-page' : 'quote-page'" padding>
    <div v-if="pageLoading" class="row">
      <div class="col-12 pageloader">
        <q-spinner color="primary" class="q-uploader__spinner" />
      </div>
    </div>
    <PageContainer
      :contact="contact"
      :product="product"
      :origin="origin"
      :destination="destination"
      :productTypeLabel="productTypeLabel"
      :invoiceTaxLabel="invoiceTaxLabel"
    />

    <!-- QUOTE TABLE RESULTS -->
    <q-dialog
      v-if="!pageLoading"
      maximized
      v-model="dialogs.quote.visible"
      transition-show="scale"
      transition-hide="scale"
    >
      <QuoteTable
        :order="order"
        :origin="origin"
        :destination="destination"
        :isLogged="logged"
        @choose="onChoose"
        @load="onViewQuotes"
      />
    </q-dialog>

    <!-- LOGIN FORM -->
    <q-dialog
      maximized
      no-backdrop-dismiss
      v-model="dialogs.login.visible"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <LoginPage @logged="onLogged" @signup="onSignUp" />
    </q-dialog>

    <!-- SIGNUP STEP TO STEP -->
    <q-dialog
      maximized
      no-backdrop-dismiss
      v-model="dialogs.signup.visible"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <SignUpPage
        @created="onCreated"
        @company="onCompany"
        @registered="onRegistered"
        @signIn="dialogs.signup.visible = false"
        :signUpFields="signUpFields"
        :defaultCompany="defaultCompany"
      />
    </q-dialog>

    <!-- ORDER STEP TO STEP -->
    <q-dialog
      maximized
      no-backdrop-dismiss
      v-model="dialogs.order.visible"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <CheckoutPage
        :order="order"
        :quoteContact="contact"
        @finished="onFinished"
        @load="onCheckOut"
      />
    </q-dialog>

    <q-dialog
      v-if="selectedMarker"
      v-model="dialogs.details.visible"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <div class="details-dialog-container">
        <h3 class="title-details-dialog">{{ selectedMarker.name }}</h3>
        <q-btn
          icon="close"
          color="black"
          class="close-details-dialog"
          flat
          round
          dense
          v-close-popup
        />
        <div class="details-dialog-content">
          <strong>Nome: </strong> {{ selectedMarker.name }}
          {{ selectedMarker.alias }}<br />
          <strong>E-mail: </strong> {{ selectedMarker.email || "--" }}<br />
          <strong>Telefone: </strong> {{ selectedMarker.phone || "--" }}<br />
          <strong>Endereço: </strong>
          {{
            selectedMarker.street +
            (selectedMarker.complement
              ? " (" + selectedMarker.complement + ")"
              : "")
          }}, {{ selectedMarker.number }}<br />
          <strong>Bairro: </strong> {{ selectedMarker.district }}<br />
          <strong>Cidade: </strong> {{ selectedMarker.city }} -
          {{ selectedMarker.uf }}<br />
          <strong>CEP: </strong> {{ selectedMarker.cep }}
        </div>
        <div class="row q-pa-md justify-center items-center">
          <q-btn
            :label="isMarkerSelected() ? 'Remover' : 'Selecionar'"
            :color="isMarkerSelected() ? 'red' : 'primary'"
            @click="onSelectMarkerClick"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import Analytics from "@controleonline/ui-common/src/utils/analytics";
import LoginPage from "@controleonline/ui-legacy/ui-login/src/components/user/login/Index.vue";
import SignUpPage from "@controleonline/ui-legacy/ui-login/src/components/user/signup/Index";
import { LocalStorage } from "quasar";
import PageContainer from "../components/ClientPageContainer";
import QuoteTable from "../components/ClientQuoteTable";

 import CheckoutPage from "../components/checkout/Index";

export default {
  name: "PageIndex",

  components: {
    QuoteTable,
    CheckoutPage,
    PageContainer,
    LoginPage,
    SignUpPage,
  },

  data() {
    return {
      //logged: false,
      pageLoading: true,
      map: null,
      originMarkers: {},
      destinationMarkers: {},
      dialogs: {
        quote: {
          visible: false,
        },
        login: {
          visible: false,
        },
        signup: {
          visible: false,
        },
        order: {
          visible: false,
        },
        details: {
          visible: false,
        },
      },
      order: {
        id: null,
        quotes: [],
        choose: null,
        price: null,
        user: null,
        contact: null,
        product: null,
        address: {
          origin: null,
          destination: null,
        },
      },
      contact: {},
      product: {
        type: "",
        product: "",
        totalPrice: "0",
        packages: [
          {
            qtd: "1",
            weight: "0,000",
            height: "0,00",
            width: "0,00",
            depth: "0,00",
          },
        ],
        cubage: "0,00",
        sumCubage: 0,
      },
      origin: {
        id: "",
        country: "",
        state: "",
        city: "",
        district: "",
        address: "",
        postalCode: "",
        street: "",
        number: "",
        complement: "",
        lat: "",
        lng: "",
        professionalId: null,
      },
      destination: {
        id: "",
        country: "",
        state: "",
        city: "",
        district: "",
        address: "",
        postalCode: "",
        street: "",
        number: "",
        complement: "",
        lat: "",
        lng: "",
        professionalId: null,
      },

      selectedMarker: null,
      lastMapDirection: null,
      productTypeLabel: "Tipo do Produto",
      invoiceTaxLabel: "Valor da Nota",
    };
  },

  computed: {
    ...mapGetters({
      retrieved: "quote/retrieved",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
      signUpFields: "auth/signUpFields",
    }),

    logged() {
      let logged = this.$store.getters["auth/user"];
      if (logged && logged.email) {
        this.contact.name = logged.realname || logged.username || logged.user;
        this.contact.email = logged.email;
        this.contact.phone = logged.phone;
      }
      return this.isLogged();
    },
  },

  created() {
    if (this.defaultCompany) {
      this.pageLoading = false;
      this.checkLabels();
    }
  },

  watch: {
    defaultCompany(data) {
      if (data) {
        this.pageLoading = false;
        this.checkLabels();
      }
    },
    retrieved(response) {
      if (response.success === true && response.count > 0 && response.data) {
        this.order.id = response.data.order.id;
        this.order.quotes = response.data.order.quotes;
        this.order.choose = null;
        this.order.price = null;
        this.order.user = response.user;
        this.order.contact = this.contact;
        this.order.product = this.product;
        this.order.address.origin = this.origin;
        this.order.address.destination = this.destination;

        this.showDialog("quote");


      } else if (response.error) {
        this.$q.notify({
          message: this.$t(response.error),
          position: "center",
          type: "warning",
        });
      } else {
        this.$q.notify({
          message: "Sem resultados para a origem e destino informados",
          position: "center",
          type: "warning",
        });
      }
    },
  },

  methods: {
    ...mapActions({
      createContract: "contracts/saveContract",
      getClose: "people/getCloseProfessionals",
    }),
    isCeg() {
      const cegTypes = ["ceg", "simple"];
      if (this.defaultCompany) {
        return cegTypes.indexOf(this.defaultCompany.domainType) > -1;
      }
    },
    isLogged() {
      return (
        this.$store.getters["auth/user"] !== null &&
        this.$store.getters["auth/user"].user
      );
    },
    getLoggedUser() {
      return this.$store.getters["auth/user"];
    },

    domainType() {
      if (this.defaultCompany) {
        return this.defaultCompany.domainType;
      }
    },

    checkLabels() {},

    orderQuotes(quotes) {
      if (Array.isArray(quotes) && quotes.length > 0) {
        return quotes.sort((a, b) =>
          a.total > b.total ? 1 : a.total < b.total ? -1 : 0
        );
      }

      return quotes;
    },

    // when checkout starts

    onCheckOut() {
      // log analytics event

      if (this.order.id && this.order.choose) {
        let quote = this.order.quotes.find(
            (_quote) => _quote.id == this.order.choose
          ),
          item = {
            id: quote.id,
            brand: quote.carrier.name,
            name: `Frete de ${this.order.address.origin.city}/${this.order.address.origin.state} para ${this.order.address.destination.city}/${this.order.address.destination.state} (${quote.retrieveDeadline}-${quote.deliveryDeadline})`,
            category: quote.group.name,
            variant: quote.group.name,
            price: this. formatMoneyToBRL(quote.total),
            currency: "BRL",
            quantity: 1,
          },
          data = { items: item, coupon: this.order.id };

        Analytics.logEvent("begin_checkout", data);
      }
    },

    // when quote list is showed

    onViewQuotes() {
      // log analytics event

      if (this.order.quotes) {
        let items = [],
          data = {};

        for (let i = 0; i < this.order.quotes.length; i++) {
          items.push({
            id: this.order.quotes[i].id,
            brand: this.order.quotes[i].carrier.name,
            name: `Frete de ${this.order.address.origin.city}/${this.order.address.origin.state} para ${this.order.address.destination.city}/${this.order.address.destination.state} (${this.order.quotes[i].retrieveDeadline}-${this.order.quotes[i].deliveryDeadline})`,
            list_name: "Cotação",
            variant: this.order.quotes[i].group.name,
            price: this. formatMoneyToBRL(this.order.quotes[i].total),
            currency: "BRL",
            quantity: 1,
          });
        }

        data.items = items;

        if (items.length > 0) {
          Analytics.logEvent("view_item_list", data);
        }
      }
    },

    // when quote is selected

    onChoose(quote) {
      this.order.choose = quote.id;
      this.order.price = quote.price;

      // log analytics event
      

      let data = {
        event_category: "Cotação",
        event_label: this.order.address.origin.state,
        value: this. formatMoneyToBRL(this.order.price),
      };

      Analytics.logEvent("Solicitar", data);

      if (this.isLogged()) {
        if (!this.getLoggedUser()) this.showDialog("signup");
        else this.showDialog("order");
      } else this.showDialog("login");
    },

    // when user logged is succeeded

    onLogged(user) {
      this.$q.notify({
        message: `Agora você esta logado como "${user.username}"`,
        position: "top",
        type: "positive",
      });

      if (this.order.choose !== null) {
        this.showDialog(!this.getLoggedUser() ? "signup" : "order");
      }
    },

    // when request signup

    onSignUp() {
      this.showDialog("signup");
    },

    // when user created signup step 1

    onCreated(user) {
      this.$store.dispatch("auth/logIn");

      if (this.isLogged())
        this.$q.notify({
          message: `Agora você esta logado como "${user.username}"`,
          position: "top",
          type: "positive",
        });
    },

    // when company created signup step 2

    onCompany(company) {
      // refresh company id if not defined

      if (LocalStorage.has("session")) {
        let storedUser = LocalStorage.getItem("session");

        if (!storedUser || !storedUser.mycompany) {
          storedUser.mycompany = company.id;

          LocalStorage.set("session", storedUser);
        }
      }
    },

    // when signup process is finished

    onRegistered(user) {
      this.$q.notify({
        message: "Seu cadastro foi realizado com sucesso",
        position: "bottom",
        type: "positive",
      });

      if (this.order.choose !== null) {
        this.showDialog("order");
      }
    },

    // when checkout is finished

    onFinished(order) {
      // log analytics event

      let quote = this.order.quotes.find(
          (_quote) => _quote.id == this.order.choose
        ),
        item = {
          id: quote.id,
          brand: quote.carrier.name,
          name: `Frete de ${this.order.address.origin.city}/${this.order.address.origin.state} para ${this.order.address.destination.city}/${this.order.address.destination.state} (${quote.retrieveDeadline}-${quote.deliveryDeadline})`,
          category: quote.group.name,
          variant: quote.group.name,
          price: this. formatMoneyToBRL(quote.total),
          currency: "BRL",
          quantity: 1,
        },
        data = {
          transaction_id: this.order.id,
          affiliation: "Google online store",
          value: this. formatMoneyToBRL(this.order.price),
          currency: "BRL",
          tax: 0,
          shipping: this. formatMoneyToBRL(this.order.price),
          items: item,
        };

      Analytics.logEvent("purchase", data);

      // show notification

      this.$q.notify({
        message: `Pedido #${order.id} foi salvo com sucesso`,
        position: "bottom",
        type: "positive",
      });

      // redirect to order detail page

      setTimeout(
        (() => {
          //this.$router.push({ name: 'PurchasingOrderDetails', params: { id: this.order.id }});
          this.$router.push({
            name: "ClientOrderDetails",
            params: { id: this.order.id },
          });
        }).bind(this),
        1000
      );
    },

    showDialog(name) {
      if (name !== false) {
        this.dialogs[name].visible = true;
      }

      // hide all opened dialogs

      let time = name === false ? 0 : 600;

      setTimeout(() => {
        for (let dialogName in this.dialogs) {
          if (dialogName !== name && this.dialogs[dialogName].visible)
            this.dialogs[dialogName].visible = false;
        }
      }, time);
    },

   formatMoneyToBRL(value) {
      let formatter = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });

      if (typeof value == "string") value = value.replace(",", ".");

      return formatter.format(value);
    },

    async getCloseProfessionals(lat, lng, callback) {
      //var result = await this.getClose({ lat, lng });
      //callback(result.data);
    },

    addOriginMarkers(data) {
      const mapDiv = this.$refs["map"];

      if (data && data.length) {
        if (Object.keys(this.destinationMarkers).length) {
          for (var key in this.destinationMarkers) {
            if (this.destinationMarkers[key]) {
              this.destinationMarkers[key].setMap(null);

              if (this.destinationMarkers[key].isSelected === false) {
                delete this.destinationMarkers[key];
              }
            }
          }
        }

        if (Object.keys(this.originMarkers).length) {
          for (var key in this.originMarkers) {
            if (this.originMarkers[key]) {
              this.originMarkers[key].setMap(null);
              delete this.originMarkers[key];
            }
          }
        }

        var index = 0;

        for (var res of data) {
          var myLatlng = new google.maps.LatLng(res.latitude, res.longitude);

          if (index === 0) {
            if (this.map === null) {
              this.map = new google.maps.Map(mapDiv, {
                zoom: 10,
                center: myLatlng,
              });
            }
          }

          var marker = new google.maps.Marker({
            position: myLatlng,
            title: res.name,
            icon: require("../assets/cegonha.png"),
          });

          marker.setMap(this.map);

          (function (data) {
            marker.addListener(
              "click",
              (() => {
                this.onMarkerDetailsClick("origin", data);
              }).bind(this)
            );
          }.bind(this)(res));

          this.originMarkers[res.id] = marker;
          this.originMarkers[res.id].isSelected = false;
          index++;
        }
      }
    },
    addDestinationMarkers(data) {
      const mapDiv = this.$refs["map"];

      if (data && data.length) {
        if (Object.keys(this.originMarkers).length) {
          for (var key in this.originMarkers) {
            if (this.originMarkers[key]) {
              this.originMarkers[key].setMap(null);

              if (this.originMarkers[key].isSelected === false) {
                delete this.originMarkers[key];
              }
            }
          }
        }

        if (Object.keys(this.destinationMarkers).length) {
          for (var key in this.destinationMarkers) {
            if (this.destinationMarkers[key]) {
              this.destinationMarkers[key].setMap(null);
              delete this.destinationMarkers[key];
            }
          }
        }

        var index = 0;

        for (var res of data) {
          var myLatlng = new google.maps.LatLng(res.latitude, res.longitude);

          if (index === 0) {
            if (this.map === null) {
              this.map = new google.maps.Map(mapDiv, {
                zoom: 10,
                center: myLatlng,
              });
            }
          }

          var marker = new google.maps.Marker({
            position: myLatlng,
            title: res.name,
            icon: require("../assets/cegonha_d.png"),
          });

          (function (data) {
            marker.addListener(
              "click",
              (() => {
                this.onMarkerDetailsClick("destination", data);
              }).bind(this)
            );
          }.bind(this)(res));

          marker.setMap(this.map);

          this.destinationMarkers[res.id] = marker;
          this.destinationMarkers[res.id].isSelected = false;
          index++;
        }
      }
    },

    addressChanged(from, fromMarkers) {
      const mapDiv = this.$refs["map"];

      if (google && google.maps) {
        const o = this.origin;
        const d = this.destination;

        if (!fromMarkers) {
          if (from === "origin") {
            this.getCloseProfessionals(
              this.origin.lat,
              this.origin.lng,
              this.addOriginMarkers.bind(this)
            );
          } else if (from === "destination") {
            this.getCloseProfessionals(
              this.destination.lat,
              this.destination.lng,
              this.addDestinationMarkers.bind(this)
            );
          }
        }

        if (o && o.city && o.country && d && d.city && d.country) {
          if (this.map === null) {
            this.map = new google.maps.Map(mapDiv);
          }

          if (this.lastMapDirection) {
            this.lastMapDirection.setMap(null);
          }

          const mapDir = new google.maps.DirectionsService();

          this.lastMapDirection = new google.maps.DirectionsRenderer({
            map: this.map,
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

          mapDir.route(
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
                this.lastMapDirection.setDirections(response);
              } else {
                console.log("google maps error " + status);
              }
            }.bind(this)
          );
        }
      }
    },

    isMarkerSelected() {
      var from = this.selectedMarker.from;
      var marker = null;

      if (from == "origin") {
        marker = this.originMarkers[this.selectedMarker.id];
      } else if (from == "destination") {
        marker = this.destinationMarkers[this.selectedMarker.id];
      }

      return marker.isSelected;
    },

    onMarkerDetailsClick(from, data) {
      this.selectedMarker = data;
      this.selectedMarker.from = from;
      this.dialogs.details.visible = true;
    },

    onSelectMarkerClick() {
      var from = this.selectedMarker.from;

      if (!this.isMarkerSelected()) {
        var data = {
          id: "",
          country: "Brasil",
          state: this.selectedMarker.uf,
          city: this.selectedMarker.city,
          district: this.selectedMarker.district,
          address: "",
          postalCode: this.selectedMarker.cep,
          street: this.selectedMarker.street,
          number: this.selectedMarker.number,
          complement: this.selectedMarker.complement,
          lat: this.selectedMarker.latitude,
          lng: this.selectedMarker.longitude,
          professionalId: this.selectedMarker.id,
        };

        if (from === "origin") {
          this.origin = data;

          for (var key in this.originMarkers) {
            this.originMarkers[key].setMap(null);

            if (this.originMarkers[key] && key != this.selectedMarker.id) {
              delete this.originMarkers[key];
            } else if (key == this.selectedMarker.id) {
              this.originMarkers[key].isSelected = true;
            }
          }
        } else {
          this.destination = data;

          for (var key in this.destinationMarkers) {
            this.destinationMarkers[key].setMap(null);

            if (this.destinationMarkers[key] && key != this.selectedMarker.id) {
              delete this.destinationMarkers[key];
            } else if (key == this.selectedMarker.id) {
              this.destinationMarkers[key].isSelected = true;
            }
          }
        }

        this.addressChanged(from, true);
      } else {
        this.onRemoveProfPointClick(from);
      }

      this.selectedMarker = null;
      this.dialogs.details.visible = false;
    },

    onRemoveProfPointClick(from) {
      var empty = {
        id: "",
        country: "",
        state: "",
        city: "",
        district: "",
        address: "",
        postalCode: "",
        street: "",
        number: "",
        complement: "",
        lat: "",
        lng: "",
        professionalId: null,
      };

      if (from === "origin") {
        if (Object.keys(this.originMarkers).length) {
          for (var key in this.originMarkers) {
            if (this.originMarkers[key]) {
              this.originMarkers[key].setMap(null);
              delete this.originMarkers[key];
            }
          }
        }

        this.origin = empty;
      } else {
        if (Object.keys(this.destinationMarkers).length) {
          for (var key in this.destinationMarkers) {
            if (this.destinationMarkers[key]) {
              this.destinationMarkers[key].setMap(null);
              delete this.destinationMarkers[key];
            }
          }
        }

        this.destination = empty;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.quote-form {
  width: 85%;
  margin: 40px auto;
}

.q-table__bottom {
  .q-table__control {
    color: #00519b !important;
  }
  .q-field,
  .q-field__native {
    color: #00519b !important;
  }
}
.pageloader {
  text-align: center;
  margin-top: 200px;
}

.quote-page {
  position: relative;
}
.quote-page-ceg {
  background-color: white;
}
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/fundomapa.png");
  background-position: center center;
  background-size: cover;
}

.quote-card {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  border-radius: 5px !important;
  min-height: 400px;
  overflow: hidden;
}

.origin-destination-container {
  position: relative;

  .origin-destination-remove {
    position: absolute;
    right: 10px;
    top: 15px;
  }
}

.details-dialog-container {
  position: relative;
  background-color: white;
  max-height: 320px;
  max-width: 600px;
  height: 50%;
  width: 90%;

  .close-details-dialog {
    position: absolute;
    top: 5px;
    right: 10px;
  }

  .title-details-dialog {
    font-size: 18px;
    margin: 0px 10px;
    padding: 10px 0px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    line-height: inherit;
    display: inline-block;
    font-weight: bold;
    border-bottom: 1px solid black;
    width: calc(100% - 20px);
  }

  .details-dialog-content {
    padding: 10px;
  }
}
</style>
