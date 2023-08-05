<template>
  <!-- QUOTE FORM -->
  <q-card :class="isPublic ? 'quote-form' : ''">
    <!-- TITLE HEADER -->
    <q-card-section v-if="isPublic" class="q-pt-xl">
      <div class="text-h5 text-center text-uppercase text-primary">
        {{ translate("form.title") }}
      </div>
      <div v-if="isCompany || logged" class="text-caption text-center">
        {{ translate("form.subtitle") }}
      </div>
    </q-card-section>
    <q-card-section>
      <div
        v-if="!isCompany && !logged"
        class="row q-pa-md justify-center items-center"
      >
        <b>Haverá emissão de NOTA FISCAL para o transporte da mercadoria?</b>
      </div>
      <div
        v-if="!isCompany && !logged"
        class="row q-pa-md justify-center items-center"
      >
        <q-btn-toggle
          flat
          no-caps
          v-model="isCompany"
          toggle-color="primary"
          :options="[
            {
              label: 'Sim',
              value: true,
            },
            {
              label: 'Não',
              value: false,
            },
          ]"
        />
      </div>

      <q-form
        v-if="isCompany || logged"
        ref="form"
        @submit="onSubmit"
        autocorrect="off"
        autocomplete="off"
        spellcheck="false"
      >
        <ContactInputs v-if="!logged" :values="contact" />

        <div class="row q-col-gutter-xs q-pb-xs">
          <OriginInputs :values="origin" />
          <DestinationInputs :values="destination" />
        </div>

        <ProductInputs :values="product" :groupTable="groupTable" />

        <div class="row q-pa-md justify-center items-center">
          <q-btn
            :loading="isLoading"
            :label="translate('form.labels.submit')"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
      <div v-else-if="isCompany === false" class="text-caption">
        <h6 class="text-center">O que nossos parceiros não transportam:</h6>
        <ul class="ul-info">
          <li>Mercadorias com declaração</li>
          <li>Mercadorias sem nota fiscal</li>
          <li>Pessoa física para pessoa física</li>
        </ul>
        <h6 class="text-center">
          Em caso de dúvidas, entre em contato com a nossa Central de
          Relacionamento
        </h6>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { mapActions, mapGetters } from "vuex";

 import ContactInputs from "./ContactInputs";
import DestinationInputs from "./DestinationInputs";
import OriginInputs from "./OriginInputs";
import ProductInputs from "./ProductInputs";

import { formatPhone } from "@controleonline/quasar-common-ui/src/utils/formatter";
import { MyPackage } from "@controleonline/quasar-common-ui/src/utils/mypackage";
import { productName } from "../../../../../package.json";
import { DOMAIN } from "../../../../../src/config/domain";

export default {
  name: "PageContainer",

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
      groupTable: "",
      isCompany: null,
      //showContacts: true,
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "freight/isLoading",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),

    logged() {
      let logged = this.getLoggedUser();
      if (logged && logged.email) {
        this.contact.name = logged.username || logged.user;
        this.contact.email = logged.email;
        this.contact.phone = logged.phone;
      }
      return this.isLogged();
    },
  },

  methods: {
    ...mapActions({
      quote: "freight/quote",
    }),
    isLogged() {
      return this.getLoggedUser() !== null && this.getLoggedUser().user;
    },
    getLoggedUser() {
      return this.$store.getters["auth/user"];
    },
    isPublic() {
      return this.$route.name == "QuoteIndex";
    },
    formatPhone(phone) {
      return formatPhone(phone);
    },

    logout() {
      if (this.isPublic) {
        this.$store.dispatch("auth/logOut");
      } else {
        //this.showContacts = true;
      }
    },

    validate() {
      let isValid = true;
      let message = "";

      if (!this.logged) {
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
      else if (!this.product.product.length) {
        const label = this.productTypeLabel.toUpperCase();
        message = "O campo " + label + " não é válido";
        isValid = false;
      }
      // product type
      else if (!this.product.type.length) {
        const label = this.productTypeLabel.toUpperCase();
        message = "O campo " + label + " não é válido";
        isValid = false;
      }

      // product price
      else if (!(parseFloat(this.product.totalPrice.replace(",", ".")) > 0)) {
        const label = this.invoiceTaxLabel.toUpperCase();
        message = "O campo " + label + " não é válido";
        isValid = false;
      }

      // packages
      else if (!(parseFloat(this.product.cubage.replace(",", ".")) > 0)) {
        if (!this.product.packages.length) {
          message = "Os dados dos produtos não foram informados";
          isValid = false;
        } else {
          let row = 0;

          for (let index in this.product.packages) {
            MyPackage._package = this.product.packages[index];

            row = parseInt(index) + 1;

            if (!(MyPackage.quantity() > 0)) {
              message = `O campo QUANTIDADE da fila ${row} não é válido`;
              isValid = false;
              break;
            } else if (!(MyPackage.weight() > 0)) {
              message = `O campo PESO da fila ${row} não é válido`;
              isValid = false;
              break;
            } else if (!(MyPackage.height() > 0)) {
              message = `O campo ALTURA da fila ${row} não é válido`;
              isValid = false;
              break;
            } else if (!(MyPackage.width() > 0)) {
              message = `O campo LARGURA da fila ${row} não é válido`;
              isValid = false;
              break;
            } else if (!(MyPackage.depth() > 0)) {
              message = `O campo PROFUNDIDADE da fila ${row} não é válido`;
              isValid = false;
              break;
            }
          }
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
        app: productName,
        groupTable: this.groupTable,
        selectedCompany: this.myCompany ? this.myCompany.id : null,
        domain:
          this.myCompany && this.myCompany.domains
            ? this.myCompany.domains[0]?.domain
            : DOMAIN,
        origin: this.getAddress(this.origin),
        destination: this.getAddress(this.destination),
        productTotalPrice: parseFloat(
          this.product.totalPrice.replace(",", ".")
        ),
        packages: packages,
        productType: this.product.type + "," + this.product.product,
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

      if (this.myCompany !== null)
        payload.query = {
          selectedCompany: this.myCompany.id,
        };

      this.quote(payload);
    },
  },
};
</script>
<style>
.ul-info {
  margin: auto;
  max-width: 300px;
  font-size: 16px;
}
</style>