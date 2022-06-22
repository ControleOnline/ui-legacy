<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress
        :indeterminate="isLoading"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <div class="col-12 q-pa-md" v-if="summary !== null">
      <!-- WHO IS THE PAYER -->

      <div class="row justify-center q-mb-md">
        <div class="col-xs-12 text-center text-subtitle2 q-mb-md">
          Quem pagará pelo frete?
        </div>
        <div class="col-xs-12 text-center q-mb-md">
          <q-btn-toggle
            no-caps
            v-model="payer"
            toggle-color="primary"
            :options="options"
            :disable="!editable"
          />
        </div>
      </div>

      <ContactForm
        v-if="payer === null"
        :itemData="payerContact"
        :withSave="false"
        :canEdit="editable"
      />

      <q-separator />

      <div v-if="payer !== false">
        <!-- RETRIEVE DATA -->

        <div class="row justify-center items-stretch q-mt-lg">
          <div class="col-xs-12 col-sm-5">
            <q-markup-table
              flat
              separator="none"
              class="bg-grey-2 q-mb-md full-height"
            >
              <thead>
                <tr>
                  <th colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da coleta</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="this.retrieve.name">
                  <td class="text-left text-bold">Nome</td>
                  <td class="text-left">
                    {{ this.retrieve.name }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.contact.email">
                  <td class="text-left text-bold">E-Mail</td>
                  <td class="text-left">
                    {{ `${this.retrieve.contact.email}` }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.contact.phone">
                  <td class="text-left text-bold">Telefone</td>
                  <td class="text-left">
                    {{ this.formatPhone(this.retrieve.contact.phone) }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.document">
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ this.formatDoc(this.retrieve.document) }}
                  </td>
                </tr>

                <tr v-if="this.retrieve.address.postal_code">
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{ this.formatCEP(this.retrieve.address.postal_code) }}
                  </td>
                </tr>

                <tr v-if="this.retrieve.address.street">
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.retrieve.address.street}, ${this.retrieve.address.number} ${this.retrieve.address.complement}`
                    }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.address.district">
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.retrieve.address.district}` }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.address.city">
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.retrieve.address.city} / ${this.retrieve.address.state}`
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
              flat
              separator="none"
              class="bg-grey-2 q-mb-md full-height"
            >
              <thead>
                <tr>
                  <th colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da entrega</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="this.delivery.name">
                  <td class="text-left text-bold">Nome</td>
                  <td class="text-left">
                    {{ this.delivery.name }}
                  </td>
                </tr>
                <tr v-if="this.delivery.contact.email">
                  <td class="text-left text-bold">E-Mail</td>
                  <td class="text-left">
                    {{ `${this.delivery.contact.email}` }}
                  </td>
                </tr>
                <tr v-if="this.delivery.contact.phone">
                  <td class="text-left text-bold">Telefone</td>
                  <td class="text-left">
                    {{ this.formatPhone(this.delivery.contact.phone) }}
                  </td>
                </tr>
                <tr v-if="this.delivery.document">
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ this.formatDoc(this.delivery.document) }}
                  </td>
                </tr>

                <tr v-if="this.delivery.address.postal_code">
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{ this.formatCEP(this.delivery.address.postal_code) }}
                  </td>
                </tr>

                <tr v-if="this.delivery.address.street">
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.delivery.address.street}, ${this.delivery.address.number} ${this.delivery.address.complement}`
                    }}
                  </td>
                </tr>
                <tr v-if="this.delivery.address.district">
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.delivery.address.district}` }}
                  </td>
                </tr>
                <tr v-if="this.delivery.address.city">
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.delivery.address.city} / ${this.delivery.address.state}`
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
                        this.product.sumCubage
                      )} kg`
                    }}
                  </td>
                  <td class="text-center">
                    {{ this.product.type }}
                  </td>
                  <td class="text-center">
                    {{ formatMoney(this.product.totalPrice) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div v-if="product.packages.length > 0" class="col-xs-12">
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
                <tr v-for="(myPackage, index) in product.packages" :key="index">
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
              outlined
              stack-label
              v-model="comments"
              type="textarea"
              label="Observações"
              :disable="!editable"
            />
          </div>
        </div>
      </div>

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
              <q-btn
                icon="close"
                color="white"
                flat
                round
                dense
                v-close-popup
              />
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContactForm from "@controleonline/quasar-common-ui/src/components/common/ContactForm.vue";
import {
  formatDocument,
  formatMoney,
  formatPhone,
  formatCEP,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

export default {
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },

  components: {
    ContactForm,
  },

  created() {
    if (this.myCompany !== null && this.orderId !== null) {
      this.requestSummary(this.orderId);
    }
  },

  data() {
    return {
      summary: null,
      isLoading: false,
      options: [],
      comments: "",
      editable: false,
      payerContact: null,
      product: {
        sumCubage: null,
        type: null,
        totalPrice: null,
        packages: [],
      },
      payer: -1,
      retrieve: {
        id: null,
        name: "",
        document: "",
        contact: {
          name: "",
          email: "",
          phone: "",
        },
        address: {
          district: "",
          postal_code: "",
          street: "",
          number: "",
          city: "",
          state: "",
          complement: "",
        },
      },
      delivery: {
        id: null,
        name: "",
        document: "",
        contact: {
          name: "",
          email: "",
          phone: "",
        },
        address: {
          district: "",
          postal_code: "",
          street: "",
          number: "",
          city: "",
          state: "",
          complement: "",
        },
      },
      dialogs: {
        details: {
          visible: false,
          data: {
            name: "",
            email: "",
            phone: "",
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
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),

    payerIsOther() {
      if (this.summary.payer == null) return null;

      return (
        this.summary.payer.id != this.summary.retrievePeople.id &&
        this.summary.payer.id != this.summary.deliveryPeople.id
      );
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.requestSummary(this.orderId);
      }
    },

    summary(data) {
      if (!data) return;

      this.options = this.getPayerOptions();
      this.payer =
        this.payerIsOther === null
          ? -1
          : this.payerIsOther
          ? null
          : this.summary.payer.id;

      if (this.summary.retrievePeople !== null) {
        let retrieveName = `${this.summary.retrievePeople.name} ${this.summary.retrievePeople.alias}`;
        let retrieveDocs = "";

        if (this.summary.retrievePeople.document !== null) {
          if (this.summary.retrievePeople.document.type == "CNPJ")
            retrieveName = this.summary.retrievePeople.alias;

          retrieveDocs = this.summary.retrievePeople.document.document;
        }

        this.retrieve.id = this.summary.retrievePeople.id;
        this.retrieve.name = retrieveName;
        this.retrieve.document = retrieveDocs;
        this.retrieve.contact.name = `${this.summary.retrievePeople.contact.name} ${this.summary.retrievePeople.contact.alias}`;
        this.retrieve.contact.email = this.summary.retrievePeople.contact.email;
        this.retrieve.contact.phone = this.summary.retrievePeople.contact.phone;
        this.retrieve.address.district =
          this.summary.retrievePeople.address.district;
        this.retrieve.address.postal_code =
          this.summary.retrievePeople.address.postalCode;
        this.retrieve.address.street =
          this.summary.retrievePeople.address.street;
        this.retrieve.address.number =
          this.summary.retrievePeople.address.number;
        this.retrieve.address.city =
          this.summary.retrievePeople.address.city ||
          data.quote.origin.city ||
          this.summary.quote.origin.city;
        this.retrieve.address.state =
          this.summary.retrievePeople.address.state ||
          data.quote.origin.state ||
          this.summary.quote.origin.state;
      } else {
        if (data.quote !== null) {
          this.retrieve.address.city = data.quote.origin.city;
          this.retrieve.address.state = data.quote.origin.state;
        }
      }

      if (this.summary.deliveryPeople != null) {
        let deliveryName = `${this.summary.deliveryPeople.name} ${this.summary.deliveryPeople.alias}`;
        let deliveryDocs = "";

        if (this.summary.deliveryPeople.document !== null) {
          if (this.summary.deliveryPeople.document.type == "CNPJ")
            deliveryName = this.summary.deliveryPeople.alias;

          deliveryDocs = this.summary.deliveryPeople.document.document;
        }

        this.delivery.id = this.summary.deliveryPeople.id;
        this.delivery.name = deliveryName;
        this.delivery.document = deliveryDocs;
        this.delivery.contact.name = `${this.summary.deliveryPeople.contact.name} ${this.summary.deliveryPeople.contact.alias}`;
        this.delivery.contact.email = this.summary.deliveryPeople.contact.email;
        this.delivery.contact.phone = this.summary.deliveryPeople.contact.phone;
        this.delivery.address.district =
          this.summary.deliveryPeople.address.district;
        this.delivery.address.postal_code =
          this.summary.deliveryPeople.address.postalCode;
        this.delivery.address.street =
          this.summary.deliveryPeople.address.street;
        this.delivery.address.number =
          this.summary.deliveryPeople.address.number;
        this.delivery.address.city =
          this.summary.deliveryPeople.address.city ||
          data.quote.destination.city ||
          this.summary.quote.destination.city;
        this.delivery.address.state =
          this.summary.deliveryPeople.address.state ||
          data.quote.destination.state ||
          this.summary.quote.destination.state;
      } else {
        if (data.quote !== null) {
          this.delivery.address.city = data.quote.destination.city;
          this.delivery.address.state = data.quote.destination.state;
        }
      }

      this.product.sumCubage = this.summary.cubage;
      this.product.type = this.summary.productType;
      this.product.totalPrice = this.summary.invoiceTotal;
      this.product.packages = this.summary.packages;
      this.retrieve.address.country =
        this.summary.quote.origin.country || "Brasil";
      this.delivery.address.country =
        this.summary.quote.destination.country || "Brasil";

      this.comments = this.summary.comments;

      Object.filter = (obj, predicate) =>
        Object.keys(obj)
          .filter((key) => predicate(obj[key]))
          .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});

      this.$emit("quote-details", {
        destination: Object.filter(
          this.delivery.address,
          (score) => score.length > 1
        ),
        origin: Object.filter(
          this.retrieve.address,
          (score) => score.length > 1
        ),
        mainOrder: this.orderId,
        packages:
          this.product.packages.length > 0
            ? this.product.packages
            : this.product.sumCubage,
        productTotalPrice: this.product.totalPrice,
        productType: this.product.type,
      });
    },

    payer(payerId) {
      if (payerId !== null || !this.payerIsOther) return;

      this.payerContact = {
        id: this.summary.payer.id,
        name: this.summary.payer.contact.name,
        alias: this.summary.payer.contact.alias,
        document: {
          document: this.summary.payer.document.document,
          type: this.summary.payer.document.type,
        },
        email: this.summary.payer.contact.email,
        phone: this.summary.payer.contact.phone,
        address: {
          id: this.summary.payer.address.id,
          country: "Brasil",
          state: this.summary.payer.address.state,
          city: this.summary.payer.address.city,
          district: this.summary.payer.address.district,
          postal_code: this.summary.payer.address.postalCode,
          street: this.summary.payer.address.street,
          number: this.summary.payer.address.number,
          complement: this.summary.payer.address.complement,
        },
      };
    },
  },

  methods: {
    ...mapActions({
      getSummary: "purchasingOrder/getDetailSummary",
    }),

    getPayerOptions() {
      let opts = [];

      if (
        this.summary.retrievePeople == null ||
        this.summary.deliveryPeople == null
      ) {
        opts.push({
          label: "Não definido",
          value: -2,
        });

        opts.push({
          label: "Não definido",
          value: -3,
        });

        opts.push({
          label: "Outra pessoa",
          value: -4,
        });

        return opts;
      }

      let retrieveName = `${this.summary.retrievePeople.name} ${this.summary.retrievePeople.alias}`;
      let deliveryName = `${this.summary.deliveryPeople.name} ${this.summary.deliveryPeople.alias}`;

      if (this.summary.retrievePeople.document !== null) {
        if (this.summary.retrievePeople.document.type == "CNPJ")
          retrieveName = this.summary.retrievePeople.alias;
      }

      if (this.summary.deliveryPeople.document !== null) {
        if (this.summary.deliveryPeople.document.type == "CNPJ")
          deliveryName = this.summary.deliveryPeople.alias;
      }

      if (this.summary.retrievePeople.id == this.summary.deliveryPeople.id)
        opts.push({
          label: `${retrieveName} (CIF)`,
          value: this.summary.retrievePeople.id,
        });
      else {
        opts.push({
          label: `${retrieveName} (CIF)`,
          value: this.summary.retrievePeople.id,
        });

        opts.push({
          label: `${deliveryName} (FOB)`,
          value: this.summary.deliveryPeople.id,
        });
      }

      opts.push({
        label: "Outra pessoa",
        value: null,
      });

      return opts;
    },
    formatPhone(document) {
      return formatPhone(document);
    },
    formatCEP(document) {
      return formatCEP(document);
    },
    formatDoc(document) {
      return formatDocument(document);
    },

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    seeDetails(data) {
      this.dialogs.details.data.name = data.contact.name;
      this.dialogs.details.data.email = data.contact.email;
      this.dialogs.details.data.phone = formatPhone(data.contact.phone);
      this.dialogs.details.data.state = data.address.state;
      this.dialogs.details.data.city = data.address.city;
      this.dialogs.details.data.district = data.address.district;
      this.dialogs.details.data.postal_code = formatCEP(
        data.address.postal_code
      );
      this.dialogs.details.data.street = data.address.street;
      this.dialogs.details.data.number = data.address.number;

      this.dialogs.details.visible = true;
    },

    requestSummary(orderId) {
      let params = {};

      params["myCompany"] = this.myCompany.id;

      this.isLoading = true;

      return this.getSummary({ orderId, params })
        .then((response) => {
          this.isLoading = false;

          if (response.success) {
            this.summary = response.data;

            return true;
          }

          return false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
  },
};
</script>
