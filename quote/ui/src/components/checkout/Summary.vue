<template>
  <div>
    <q-form @submit="save" class="q-mt-sm" ref="myForm">
      <!-- WHO IS THE PAYER -->
      <div v-if="isCif === false" class="row justify-center q-mb-md">
        <div class="col-xs-12 text-center text-subtitle2 q-mb-sm">
          Quem pagará pelo frete?
        </div>
        <div class="col-xs-12 text-center">
          <q-btn-toggle
            no-caps
            v-model="item.payer"
            toggle-color="primary"
            :options="options"
          />
        </div>
      </div>

      <div v-if="loadingContact" class="row">
        <div class="col-12 pageloader">
          <q-spinner color="primary" class="q-uploader__spinner" />
        </div>
      </div>

      <div v-if="loadingContact === false && item.payer !== false">
        <!-- WHEN PAYER IS OTHER PERSON -->

        <div class="row" v-if="!hasDocument">
          <div class="col-xs-12 q-mb-sm">
            <q-input
      dense
      outlined 
              stack-label
              lazy-rules
              unmasked-value
              v-model="peopleDocument"
              type="text"
              :label="personType == 'PJ' ? $t('CNPJ') : $t('CPF')"
              :mask="
                personType == 'PJ' ? '##.###.###/####-##' : '###.###.###-##'
              "
              :placeholder="
                personType == 'PJ' ? 'Digite o CNPJ' : 'Digite o CPF'
              "
              :rules="[isInvalid('document')]"
            />
          </div>
        </div>

        <ContactForm
          v-if="item.payer === null"
          ref="contactForm"
          :withSave="false"
        />

        <!-- RETRIEVE DATA -->

        <div class="row justify-center items-stretch q-mt-lg">
          <div class="col-xs-12 col-sm-5">
            <q-markup-table
              bordered
              separator="none"
              class="bg-grey-3 q-mb-md full-height"
            >
              <thead>
                <tr>
                  <th colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da coleta</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left text-bold">Nome</td>
                  <td class="text-left">
                    {{ this.steps.retrieve.name }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">E-Mail</td>
                  <td class="text-left">
                    {{ `${this.steps.retrieve.contact.email}` }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Telefone</td>
                  <td class="text-left">
                    {{ this.fPhone(this.steps.retrieve.contact.phone) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ this.formatDoc(this.steps.retrieve.document) }}
                  </td>
                </tr>

                <tr>
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{
                      this.formatCEP(this.steps.retrieve.address.postal_code)
                    }}
                  </td>
                </tr>

                <tr>
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.steps.retrieve.address.street}, ${this.steps.retrieve.address.number} ${this.steps.retrieve.address.complement}`
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.steps.retrieve.address.district}` }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.steps.retrieve.address.city} / ${this.steps.retrieve.address.state}`
                    }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-xs-12 col-sm-2 gt-xs">
            <div class="row justify-center items-center full-height">
              <q-icon
                name="local_shipping"
                class="text-primary"
                style="font-size: 3em"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-5">
            <q-markup-table
              bordered
              separator="none"
              class="bg-grey-3 q-mb-md full-height"
            >
              <thead>
                <tr>
                  <th colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da entrega</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left text-bold">Nome</td>
                  <td class="text-left">
                    {{ this.steps.delivery.name }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">E-Mail</td>
                  <td class="text-left">
                    {{ `${this.steps.delivery.contact.email}` }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Telefone</td>
                  <td class="text-left">
                    {{ this.fPhone(this.steps.delivery.contact.phone) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ this.formatDoc(this.steps.delivery.document) }}
                  </td>
                </tr>

                <tr>
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{
                      this.formatCEP(this.steps.delivery.address.postal_code)
                    }}
                  </td>
                </tr>

                <tr>
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.steps.delivery.address.street}, ${this.steps.delivery.address.number} ${this.steps.delivery.address.complement}`
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.steps.delivery.address.district}` }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.steps.delivery.address.city} / ${this.steps.delivery.address.state}`
                    }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>

        <!-- PRODUCT INFO -->

        <div class="row q-mt-lg">
          <div class="col-xs-12">
            <q-markup-table flat class="q-mb-md">
              <thead>
                <tr>
                  <th>Cubagem</th>
                  <th>Tipo de material</th>
                  <th>Valor da nota fiscal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    {{
                      `${new Intl.NumberFormat("pt-br").format(
                        this.order.product.sumCubage
                      )} kg`
                    }}
                  </td>
                  <td class="text-center">
                    {{ this.order.product.type }}
                  </td>
                  <td class="text-center">
                    {{ formatMoney(this.order.product.totalPrice) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div v-if="order.product.packages.length > 0" class="col-xs-12">
            <div class="col-xs-12 text-subtitle2 q-mb-sm">
              Detalhes dos produtos
            </div>
            <q-markup-table class="q-mb-md">
              <thead>
                <tr>
                  <th>Quantidade</th>
                  <th>Peso</th>
                  <th>Altura</th>
                  <th>Largura</th>
                  <th>Profundidade</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(myPackage, index) in order.product.packages"
                  :key="index"
                >
                  <td class="text-center">{{ myPackage.qtd }}</td>
                  <td class="text-center">{{ `${myPackage.weight} kg` }}</td>
                  <td class="text-center">{{ `${myPackage.height} m` }}</td>
                  <td class="text-center">{{ `${myPackage.width} m` }}</td>
                  <td class="text-center">{{ `${myPackage.depth} m` }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>

        <!-- SOME COMMENTS ABOUT THIS ORDER -->

        <div class="row q-mt-lg">
          <div class="col-xs-12">
            <q-input
      dense
      outlined 
              stack-label
              v-model="item.comments"
              type="textarea"
              label="Observações"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-lg">
          <div class="col-12 q-mb-sm">
            <q-list>
              <q-item tag="label" v-ripple>
                <q-item-section avatar top>
                  <q-checkbox v-model="termsAccepted" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    Aceito os
                    <a href="/termos-e-condicoes" target="_blank"
                      >termos e condições</a
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-btn
            type="submit"
            color="primary"
            label="Finalizar pedido"
            :loading="isLoading"
          />
          <div class="col-12 q-mt-sm text-subtitle1 text-right">
            * Taxa de Dificuldade de Entrega e Zona Rural são repassadas à
            parte, por incidência.
          </div>
          <div class="col-12 q-mt-sm text-subtitle1 text-right">
            * Mercadorias frágeis, como: pisos, vidro, cerâmica, etc, embarque
            somente com carta de isensão de avarias.
          </div>
        </div>
      </div>
    </q-form>

    <q-dialog
      v-model="dialogs.details.visible"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="text-white" style="background-color: #00519b">
        <q-card-section>
          <div class="row items-center">
            <div class="text-h6">Detalhes</div>
            <q-space />
            <q-btn icon="close" color="white" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table>
            <tbody>
              <tr>
                <td class="text-left">Nome</td>
                <td class="text-left">{{ dialogs.details.data.name }}</td>
              </tr>
              <tr>
                <td class="text-left">Email</td>
                <td class="text-left">{{ dialogs.details.data.email }}</td>
              </tr>
              <tr>
                <td class="text-left">Telefone</td>
                <td class="text-left">{{ dialogs.details.data.phone }}</td>
              </tr>
              <tr>
                <td class="text-left">País</td>
                <td class="text-left">{{ dialogs.details.data.country }}</td>
              </tr>
              <tr>
                <td class="text-left">Estado</td>
                <td class="text-left">{{ dialogs.details.data.state }}</td>
              </tr>
              <tr>
                <td class="text-left">Cidade</td>
                <td class="text-left">{{ dialogs.details.data.city }}</td>
              </tr>
              <tr>
                <td class="text-left">Bairro</td>
                <td class="text-left">{{ dialogs.details.data.district }}</td>
              </tr>
              <tr>
                <td class="text-left">CEP</td>
                <td class="text-left">
                  {{ dialogs.details.data.postal_code }}
                </td>
              </tr>
              <tr>
                <td class="text-left">Rua</td>
                <td class="text-left">{{ dialogs.details.data.street }}</td>
              </tr>
              <tr>
                <td class="text-left">Número</td>
                <td class="text-left">{{ dialogs.details.data.number }}</td>
              </tr>
              <tr></tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  formatDocument,
  formatPhone,
  formatCEP,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import ContactForm from "@controleonline/quasar-common-ui/src/components/common/ContactForm";

export default {
  components: {
    ContactForm,
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
  },

  data() {
    return {
      isCif: false,
      isLoading: false,
      loadingContact: false,
      hasDocument: false,
      personType: "PF",
      peopleDocument: "",
      dialogs: {
        details: {
          visible: false,
          data: {
            name: null,
            email: null,
            phone: null,
            country: null,
            state: null,
            city: null,
            district: null,
            postal_code: null,
            street: null,
            number: null,
          },
        },
      },
      item: {
        payer: false,
        comments: "",
        paymentType: null,
      },
      termsAccepted: false,
    };
  },

  watch: {
    "item.payer": function (peopleId) {
      if (peopleId) {
        this.searchContact(peopleId).then((response) => {
          if (response && !response.document) {
            this.hasDocument = false;
          } else if (response && response.document) {
            this.hasDocument = true;
          }
        });
      }
    },
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
    }),
    options() {
      let opts = [];
      if (this.steps.retrieve.id == this.steps.delivery.id) {
        this.isCif = true;
        this.item.payer = this.steps.retrieve.id;
      } else {
        opts.push({
          label: `${
            this.steps.retrieve.name || this.steps.retrieve.contact.name
          } (CIF)`,
          value: this.steps.retrieve.id,
        });
        opts.push({
          label: `${
            this.steps.delivery.name || this.steps.delivery.contact.name
          } (FOB)`,
          value: this.steps.delivery.id,
        });
      }

      //opts.push({label: "Outra pessoa",value: null,});

      return opts;
    },
  },

  methods: {
    ...mapActions({
      contact: "people/contact",
    }),

    seeDetails(data) {
      this.dialogs.details.data.name = data.contact.name;
      this.dialogs.details.data.email = data.contact.email;
      this.dialogs.details.data.phone = this.fPhone(data.contact.phone);
      this.dialogs.details.data.country = data.address.country;
      this.dialogs.details.data.state = data.address.state;
      this.dialogs.details.data.city = data.address.city;
      this.dialogs.details.data.district = data.address.district;
      this.dialogs.details.data.postal_code = this.formatCEP(
        data.address.postal_code
      );
      this.dialogs.details.data.street = data.address.street;
      this.dialogs.details.data.number = data.address.number;

      this.dialogs.details.visible = true;
    },

    save() {
      if (
        !this.hasDocument &&
        (!this.peopleDocument || this.peopleDocument.length < 11)
      ) {
        this.$q.notify({
          message: "Não esqueça de digitar um documento válido!",
          position: "bottom",
          type: "negative",
        });
        return;
      } else if (
        this.termsAccepted === false &&
        this.defaultCompany.domainType != "ceg"
      ) {
        this.$q.notify({
          message: "Primeiro deve aceitar os termos e condições",
          position: "bottom",
          type: "negative",
        });
        return;
      }

      if (this.item.payer === null) {
        this.$refs.contactForm.getData().then((data) => {
          if (data !== false) {
            this.isLoading = true;

            this.$emit("saved", {
              errors: false,
              data: {
                comments: this.item.comments,
                peopleDocument: this.peopleDocument,
                payer: data,
              },
              hasCallback: function () {
                this.isLoading = false;
              }.bind(this),
            });
          }
        });
      } else {
        this.isLoading = true;

        this.$emit("saved", {
          errors: false,
          data: {
            ...this.item,
            peopleDocument: this.peopleDocument,
          },
          hasCallback: function () {
            this.isLoading = false;
          }.bind(this),
        });
      }
    },

    formatDoc(document) {
      return formatDocument(document);
    },
    fPhone(phone) {
      return formatPhone(phone);
    },
    formatCEP(cep) {
      return formatPhone(cep);
    },
    formatMoney(value) {
      let formatter = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });

      if (typeof value == "string") value = value.replace(",", ".");

      return formatter.format(value);
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t("messages.emailInvalid");

        if (key == "phone" && !/^\d{10,11}$/.test(val))
          return this.$t("messages.phoneInvalid");

        if (key == "password" && val.length < 6)
          return this.$t("A senha deve ter no mínimo 6 caracteres");

        if (key == "confirm" && this.item.password != this.item.confirmPassword)
          return this.$t("As senhas não coincidem");

        return true;
      };
    },

    searchContact(id) {
      let request = {
        id: id,
        params: { id: id },
      };

      this.loadingContact = true;

      return this.contact(request)
        .then((response) => {
          let hasErrors = !(response && response.success === true);

          return hasErrors === false ? response.data : false;
        })
        .catch((error) => {
          this.notifyError(error.message);
        })
        .finally(() => {
          this.loadingContact = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        return true;
      };
    },
  },
};
</script>

<style scoped>
.pageloader {
  text-align: center;
}
</style>