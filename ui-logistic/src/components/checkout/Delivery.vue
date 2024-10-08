<template>
  <q-form @submit="save" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md">
      <div class="col-xs-12 text-center text-subtitle2 q-pb-sm">
        Onde devemos entregar sua carga?
      </div>
      <div class="col-xs-12 text-center">
        <q-btn-toggle
          v-model="item.whereDelivery"
          toggle-color="primary"
          :options="[
            { label: $t('order.inMyCompany'), value: 'MC' },
            { label: $t('order.inOtherPlace'), value: 'OP' },
          ]"
        />
      </div>
    </div>

    <div v-if="item.whereDelivery == 'OP'" class="row justify-center q-pb-md">
      <q-btn-toggle
        flat
        no-caps
        v-model="item.personType"
        toggle-color="primary"
        :options="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física', value: 'PF' },
        ]"
      />
    </div>
    <div class="col-xs-12 text-subtitle2 q-pb-sm">Contato de entrega</div>
    <q-separator spaced />

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          v-model="item.contact.email"
          type="text"
          :label="$t('Email')"
          @update:model-value="searchEmail"
          placeholder="Digite um e-mail"
          :loading="loadingContact"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          v-model="item.contact.name"
          type="text"
          :label="$t('Nome do responsável')"
          placeholder="Nome do responsável"
          class="q-mb-sm"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          unmasked-value
          v-model="item.contact.phone"
          type="text"
          :label="$t('Telefone')"
          mask="(##) #####-####"
          placeholder="Telefone"
        />
      </div>
      <div class="hidden">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          v-model="item.contact.email"
          type="text"
          :label="$t('E-mail')"
          placeholder="E-mail"
          :disable="!isNewPeople"
        />
      </div>
    </div>

    <div v-if="item.whereDelivery != 'MC'">
      <q-separator spaced />

      <div class="row q-col-gutter-xs q-pb-xs">
        <div class="col-xs-12 col-sm-6 q-mb-sm" v-if="item.personType == 'PJ'">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.name"
            type="text"
            label="Razão social"
            :disable="!isNewPeople && item.whereDelivery == 'MC'"
          />
        </div>
        <div class="col-xs-12 col-sm-6 q-mb-sm" v-if="item.personType == 'PJ'">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.alias"
            type="text"
            label="Nome fantasia"
            :disable="!isNewPeople && item.whereDelivery == 'MC'"
          />
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 text-subtitle1 text-left">
        Digite o endereço na caixa de busca
      </div>
      <div class="col-xs-12 q-mb-sm">
        <ListAutocomplete
          :source="getGeoPlaces"
          :isLoading="isSearching"
          label="Busca de endereço"
          @selected="onSelect"
          placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-pb-xs">
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          unmasked-value
          hide-bottom-space
          v-model="item.address.postal_code"
          type="text"
          :label="$t('CEP')"
          mask="#####-###"
          :rules="[isInvalid('postal_code')]"
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.postalCode.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.street"
          type="text"
          :label="$t('Rua')"
          :rules="[isInvalid('street')]"
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.street.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.number"
          type="text"
          :label="$t('Número')"
          :rules="[isInvalid('number')]"
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.number.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          hide-bottom-space
          v-model="item.address.complement"
          type="text"
          :label="$t('Complemento')"
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.complement.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.district"
          type="text"
          :label="$t('Bairro')"
          :rules="[isInvalid('district')]"
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.district.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.city"
          type="text"
          :label="$t('Cidade')"
          :rules="[isInvalid('city')]"
          :readonly="
            order.address.destination === null
              ? false
              : order.address.destination.city.length > 0
          "
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.city.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.state"
          type="text"
          :label="$t('UF')"
          mask="AA"
          :rules="[isInvalid('state')]"
          :readonly="
            order.address.destination === null
              ? false
              : order.address.destination.state.length > 0
          "
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.state.length > 0
          "
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.country"
          type="text"
          :label="$t('País')"
          :rules="[isInvalid('country')]"
          :readonly="
            order.address.destination === null
              ? false
              : order.address.destination.country.length > 0
          "
          :borderless="
            order.address.destination === null
              ? false
              : order.address.destination.country.length > 0
          "
        />
      </div>
    </div>

    <div class="row justify-end">
      <q-btn type="submit" color="primary" label="Seguinte" :loading="isLoading" />
    </div>
  </q-form>
</template>

<script>
import ListAutocomplete from "@controleonline/ui-legacy/ui-common/src/components/Common/ListAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    ListAutocomplete,
  },

  props: {
    order: {
      type: Object,
      required: true,
    },
    steps: {
      type: Object,
      required: true,
    },
    extra: {
      type: Object,
      required: true,
    },
    quoteContact: {
      type: Object,
      required: false,
    },
  },

  data() {
    let data = {
      isNewPeople: true,
      searchEmailTime: null,
      isSearching: false,
      loadingContact: false,
      contacts: [],
      contactSelected: {
        value: null,
        label: "",
      },
      item: {
        id: null,
        name: null,
        alias: null,
        document: null,
        personType: "PJ",
        whereDelivery: "MC",
        contact: {
          id: null,
          name: null,
          email: null,
          phone: null,
        },
        address: {
          id: null,
          country: "",
          state: "",
          city: "",
          district: "",
          postal_code: "",
          street: "",
          number: "",
          complement: "",
        },
      },
    };

    if (this.steps.delivery.id !== null) {
      if (
        !this.quoteContact ||
        (!this.quoteContact.name && !this.quoteContact.email && !this.quoteContact.phone)
      ) {
        data.item.whereDelivery = this.extra.whereDelivery;

        data.item.contact.id = this.steps.delivery.contact.id;
        data.item.contact.name = this.steps.delivery.contact.name;
        data.item.contact.email = this.steps.delivery.contact.email;
        data.item.contact.phone = this.steps.delivery.contact.phone;
      }

      data.contacts = this.extra.contacts;
      data.searchEmail = this.quoteContact.email;
      data.item.id = this.steps.delivery.id;
      data.item.name = this.steps.delivery.name;
      data.item.alias = this.steps.delivery.alias;
      data.item.document = this.steps.delivery.document;
      data.item.personType = this.steps.personType;
      if (this.steps.delivery.address) {
        data.item.address.id = this.steps.delivery.address.id;
        data.item.address.country = this.steps.delivery.address.country;
        data.item.address.state = this.steps.delivery.address.state;
        data.item.address.city = this.steps.delivery.address.city;
        data.item.address.district = this.steps.delivery.address.district;
        data.item.address.postal_code = this.steps.delivery.address.postal_code;
        data.item.address.street = this.steps.delivery.address.street;
        data.item.address.number = this.steps.delivery.address.number;
        data.item.address.complement = this.steps.delivery.address.complement;
      }
    }

    return data;
  },

  created() {
    // if there no data in memo

    if (this.steps.delivery.id === null) {
      this.setAddress(this.order.address.destination);
      if (
        this.order.contact &&
        this.order.id &&
        (!this.quoteContact ||
          (!this.quoteContact.name &&
            !this.quoteContact.email &&
            !this.quoteContact.phone))
      ) {
        this.item.contact = this.order.contact;
        //this.search(this.order.id);
      }
    }
    this.setContactData();
    this.checkDelivery();
  },

  computed: {
    ...mapGetters({
      isLoading: "people/isLoading",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),

    logged() {
      return this.$store.getters["auth/user"];
    },

    quoteAddressIsFull() {
      if (this.order.address.destination === null) return null;

      return (
        this.order.address.destination.country.length > 0 &&
        this.order.address.destination.state.length > 0 &&
        this.order.address.destination.city.length > 0 &&
        this.order.address.destination.district.length > 0 &&
        this.order.address.destination.postalCode.length > 0 &&
        this.order.address.destination.street.length > 0 &&
        this.order.address.destination.number.length > 0
      );
    },
  },

  watch: {
    quoteContact: function (newValue) {
      if (newValue) {
        this.setContactData();
      }
    },
    contactSelected: function (data) {
      if (data.value) {
        this.item.contact = data.value;
      } else {
        this.item.contacts = {
          id: null,
          name: null,
          email: null,
          phone: null,
        };
      }
    },
    "item.whereDelivery"(where) {
      this.whereDelivery(where);
    },
  },

  methods: {
    ...mapActions({
      contact: "people/contact",
      geoplace: "gmaps/geoplace",
    }),
    whereDelivery(where) {
      this.checkDelivery();
    },
    checkDelivery() {
      if (this.item.whereDelivery == "MC") {
        this.item.personType = "PJ";
      } else {
        this.reset();
        this.item.personType = "PF";
      }
    },

    searchEmail: function (email) {
      if (email) {
        if (email.indexOf("@") > -1) {
          if (this.searchEmailTime !== null) {
            clearTimeout(this.searchEmailTime);
            this.searchEmailTime = null;
          }
          this.searchEmailTime = setTimeout(
            function () {
              this.search(this.logged.people, email);
            }.bind(this),
            1000
          );
        }
      }
      return email;
    },

    retira_acentos(str) {
      let com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";

      let sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
      let novastr = "";
      let troca = false;
      for (let i = 0; i < str.length; i++) {
        troca = false;
        for (let a = 0; a < com_acento.length; a++) {
          if (str.substr(i, 1) == com_acento.substr(a, 1)) {
            novastr += sem_acento.substr(a, 1);
            troca = true;
            break;
          }
        }
        if (troca == false) {
          novastr += str.substr(i, 1);
        }
      }
      return novastr;
    },
    setContactData() {
      if ((this.quoteContact && this.quoteContact.length > 0) || this.order.contact) {
        var contact = this.order.contact || this.quoteContact;
        if (contact.name) {
          this.item.contact.name = contact.name;
        }

        if (contact.phone) {
          this.item.contact.phone = contact.phone;
        }

        if (contact.email) {
          this.item.contact.email = contact.email;
        }

        if (contact.name || contact.phone || contact.email) {
          this.item.whereDelivery = "MC";
        }
      }
    },

    save() {
      let data = this.item;
      data.whereDelivery = this.item.whereDelivery;

      this.$emit("saved", {
        errors: false,
        data: data,
        extra: {
          whereDelivery: this.item.whereDelivery,
          personType: this.item.personType,
          contacts: this.contacts,
        },
      });
    },

    search(id, document = null) {
      let request = {
        id: id,
        params: {},
      };

      if (this.order.address.destination !== null) {
        request.params["address[city]"] = this.order.address.destination.city;
        request.params["address[state]"] = this.order.address.destination.state;
        request.params["address[country]"] = this.order.address.destination.country;
      }

      if (document && document.indexOf("@") > -1) {
        request.params.email = document;
      } else if (document !== null) {
        request.params.document = document;
      } else {
        if (this.myCompany !== null) {
          request.params.myCompany = this.myCompany.id;
        }
      }

      this.loadingContact = true;

      return this.contact(request)
        .then((response) => {
          let hasErrors = !(response && response.success === true);

          this.isNewPeople = true;
          this.item.contact = [];
          this.contacts = [];
          this.item.personType = response.data.peopleType === "PF" ? "PF" : "PJ";
          this.item.contact.email = document;

          if (!hasErrors) {
            this.isNewPeople = false;

            this.item.id = response.data.id;
            this.item.name = response.data.name;
            this.item.alias = response.data.alias;

            if (
              response.data.document &&
              (this.item.document == null || this.item.whereDelivery == "MC")
            ) {
              this.item.document = response.data.document.id;
            }

            if (response.data.contact.length > 0 && response.data.contact[0]) {
              for (let index = 0; index < response.data.contact.length; index++) {
                this.contacts.push({
                  label: `${response.data.contact[index].name} ${response.data.contact[index].alias}`,
                  value: response.data.contact[index],
                });
              }

              this.contactSelected = this.contacts[0];
            }

            // set the person type

            if (response.data.document) {
              this.item.personType = response.data.document.type == "PJ" ? "PJ" : "PF";
            }

            // set the address

            if (response.data.address) {
              if (this.order.address.destination !== null) {
                if (
                  response.data.address.country !=
                    this.order.address.destination.country ||
                  response.data.address.state != this.order.address.destination.state ||
                  response.data.address.city != this.order.address.destination.city
                ) {
                  return;
                }
              }

              this.setAddress(response.data.address);
            }
          }

          return hasErrors === false ? response.data : false;
        })
        .catch((error) => {
          this.isNewPeople = true;
          this.notifyError(error.message);
        })
        .finally(() => {
          this.loadingContact = false;
        });
    },

    notifyError(message) {
      this.$q.notify({
        message: message,
        position: "bottom",
        type: "negative",
      });
    },

    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace({input}).then((result) => {
        this.isSearching = false;

        if (result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label: result.data[i].description,
              value: result.data[i],
            });
          }
          return items;
        }
      });
    },

    onSelect(item) {
      this.$refs.myForm.resetValidation();
      /*
      if (item.country != this.order.address.destination.country) {
        this.notifyError("O país do contato é diferente da cotação");
        return;
      }
      */

      if (
        this.retira_acentos(item.state) !=
        (this.order.address.destination
          ? this.retira_acentos(this.order.address.destination.state)
          : this.retira_acentos(this.order.quote.destination.state))
      ) {
        this.notifyError("O estado do contato é diferente da cotação");
        return;
      }

      if (
        this.retira_acentos(item.city) !=
        (this.order.address.destination
          ? this.retira_acentos(this.order.address.destination.city)
          : this.retira_acentos(this.order.quote.destination.city))
      ) {
        this.notifyError("A cidade do contato é diferente da cotação");
        return;
      }

      this.setAddress({
        country: item.country,
        state: item.state,
        city: item.city,
        district: item.district,
        postalCode: item.postal_code,
        street: item.street,
        number: item.number,
      });
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.contactSelected = {
        value: null,
        label: "",
      };
      this.searchEmail = null;
      this.item.id = null;
      this.item.name = null;
      this.item.alias = null;
      this.item.document = null;
      this.item.contact.id = null;
      this.item.contact.name = null;
      this.item.contact.email = null;
      this.item.contact.phone = null;
    },

    setAddress(data) {
      if (!data) return;

      this.item.address.id = data.id ? data.id : null;
      this.item.address.country = data.country;
      this.item.address.state = data.state;
      this.item.address.city = data.city;
      this.item.address.district = data.district;
      this.item.address.postal_code = data.postalCode;
      this.item.address.street = data.street;
      this.item.address.number = data.number ? data.number.toString() : "";
      this.item.address.complement = data.complement ? data.complement : "";
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t("messages.emailInvalid");

        if (key == "phone" && !/^\d{10,11}$/.test(val))
          return this.$t("messages.phoneInvalid");

        return true;
      };
    },
  },
};
</script>
