<template>
  <!-- QUOTE FORM -->
  <q-card :class="(isPublic ? 'quote-form' : '') + ' quote-card'">
    <!-- TITLE HEADER -->
    <q-card-section v-if="isPublic" class="q-pt-xl">
      <div class="text-h5 text-center text-uppercase text-primary">
        {{ $t("form.title") }}
      </div>
      <div class="text-caption text-center">
        {{ $t("form.subtitle") }}
      </div>
    </q-card-section>
    <q-card-section v-else class="q-pb-sm text-h6">
      Cotação de frete
    </q-card-section>

    <q-card-section>
      <q-form
        ref="form"
        @submit="onSubmit"
        autocorrect="off"
        autocomplete="off"
        spellcheck="false"
      >
        <!-- USER LOGGED INFO -->
        <ContactInputs v-if="!isLogged || showContacts" :values="contact" />

        <div class="row q-col-gutter-xs q-pb-xs">
          <OriginInputs
            v-if="!origin.professionalId"
            :values="origin"
            @selected="$emit('addressChanged', 'origin')"
          />
          <div v-else class="origin-destination-container col-xs-12 col-sm-6">
            <q-input
      dense
      outlined 
              stack-label
              lazy-rules
              v-model="origin.street"
              type="text"
              :disable="true"
              :label="$t('form.section02')"
              :placeholder="$t('form.section02')"
            />
            <q-btn
              icon="close"
              color="black"
              @click="onRemoveProfPointClick('origin')"
              class="origin-destination-remove"
              flat
              round
              dense
            />
          </div>
          <DestinationInputs
            v-if="!destination.professionalId"
            :values="destination"
            @selected="$emit('addressChanged', 'destination')"
          />
          <div v-else class="origin-destination-container col-xs-12 col-sm-6">
            <q-input
      dense
      outlined 
              stack-label
              lazy-rules
              v-model="destination.street"
              type="text"
              :disable="true"
              :label="$t('form.section03')"
              :placeholder="$t('form.section03')"
            />
            <q-btn
              icon="close"
              color="black"
              @click="onRemoveProfPointClick('destination')"
              class="origin-destination-remove"
              flat
              round
              dense
            />
          </div>
        </div>

        <ProductInputs :defaultCompany="defaultCompany" :values="product" />

        <div class="row q-pa-md justify-center items-center">
          <q-btn
            :loading="isLoading"
            :label="
              $t(
                defaultCompany.domainType === 'simple'
                  ? 'form.labels.minimumQuotation'
                  : 'form.labels.submit'
              )
            "
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

 import ContactInputs from "./ContactInputs";
import DestinationInputs from "./DestinationInputs";
import OriginInputs from "./OriginInputs";
import ProductInputs from "./ProductInputs";

import { MyPackage } from "@controleonline/quasar-common-ui/src/utils/mypackage";
import { DOMAIN } from "../../../../../src/config/domain";

export default {
  name: "CegPageContainer",

  components: {
    ContactInputs,
    ProductInputs,
    OriginInputs,
    DestinationInputs,
  },

  props: {
    contact: {
      type: Object,
      required: true,
    },
    product: {
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
    productTypeLabel: {
      type: String,
      required: true,
    },
    invoiceTaxLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showContacts: true,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: "quote/isLoading",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),

    isLogged() {
      return (
        this.$store.getters["auth/user"] !== null &&
        this.$store.getters["auth/user"].user
      );
    },

    isPublic() {
      return this.$route.name == "QuoteIndex";
    },
  },

  methods: {
    ...mapActions({
      quote: "quote/quote",
    }),

    validate() {
      let isValid = true;
      let message = "";

      if (!this.isLogged) {
        // name
        if (!this.contact.name.length) {
          message = "O campo NOME não é válido";
          isValid = false;
        }

        // email
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contact.email)) {
          message = "O campo E-MAIL não é válido";
          isValid = false;
        }

        // phone
        else if (!/^\d{10,11}$/.test(this.contact.phone)) {
          message = "O campo FONE não é válido";
          isValid = false;
        }
      }

      // origin
      if (
        !this.origin.city.length ||
        !this.origin.state.length ||
        !this.origin.country.length
      ) {
        message = "O campo ORIGEM não é válido";
        isValid = false;
      }

      // destination
      else if (
        !this.destination.city.length ||
        !this.destination.state.length ||
        !this.destination.country.length
      ) {
        message = "O campo DESTINO não é válido";
        isValid = false;
      }

      // product type
      else if (!this.product.type.length) {
        const label = this.productTypeLabel.toUpperCase();
        message = "O campo " + label + " não é válido";
        isValid = false;
      }

      // product price
      else if (!(parseFloat(this.product.totalPrice.toString().replace(",", ".")) > 0)) {
        const label = this.invoiceTaxLabel.toUpperCase();
        message = "O campo " + label + " não é válido";
        isValid = false;
      }

      // packages
      else if (!(parseFloat(this.product.cubage.replace(",", ".")) > 0)) {
        if (!this.product.packages.length) {
          message = "Os dados dos produtos não foram informados";
          isValid = false;
        }
      }

      if (isValid === false && message.length)
        this.$q.notify({
          message: message,
          type: "negative",
          position: "bottom",
        });

      return isValid;
    },

    payload() {
      let packages = null;
      this.product.cubage = "1";
      let cubage = parseFloat(this.product.cubage.replace(",", "."));

      if (cubage > 0) packages = cubage;
      else {
        if (this.product.packages.length) {
          packages = [];

          for (let index in this.product.packages) {
            MyPackage._package = this.product.packages[index];

            packages.push({
              qtd: MyPackage.quantity(),
              weight: MyPackage.weight(),
              height: MyPackage.height(),
              width: MyPackage.width(),
              depth: MyPackage.depth(),
            });
          }
        }
      }
      // if user is logged, contact can be null
      let contact = [];

      if (this.contact) {
        contact = {
          name: this.contact.name,
          email: this.contact.email,
          phone: this.contact.phone,
        };
      }
      return {
        app: '',
        routeType: "multiple",
        groupTable: this.product.groupTable,
        myCompany: this.myCompany ? this.myCompany.id : null,
        domain:
          this.myCompany && this.myCompany.domains
            ? this.myCompany.domains[0]?.domain
            : DOMAIN,
        origin: this.getAddress(this.origin),
        destination: this.getAddress(this.destination),
        productTotalPrice: parseFloat(
          this.product.totalPrice.toString().replace(",", ".")
        ),
        packages: packages,
        productType: this.product.type,
        contact: contact,
      };
    },

    getAddress(target) {
      let address = {
        country: target.country,
        state: target.state,
        city: target.city,
      };

      if (
        this.isNotEmpty(target.district) &&
        this.isNotEmpty(target.postalCode) &&
        this.isNotEmpty(target.street) &&
        this.isNotEmpty(target.number)
      ) {
        address["district"] = target.district;
        address["postal_code"] = target.postalCode;
        address["street"] = target.street;
        address["number"] = target.number;
        address["complement"] = target.complement;
      }

      return address;
    },

    isNotEmpty(target) {
      if (target !== null) return target.length > 0;

      return false;
    },

    onSubmit() {
      if (this.validate() === false) return;

      let payload = {
        values: this.payload(),
      };

      if (payload.values) {
        if (this.myCompany !== null) {
          payload.query = {
            myCompany: this.myCompany.id,
          };
        }

        this.quote(payload);
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
