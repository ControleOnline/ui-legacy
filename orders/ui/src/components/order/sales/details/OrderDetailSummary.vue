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

      <div class="row" style="margin: 10px">
        <div class="col-10 col-sm-7">
          <q-input
            stack-label
            lazy-rules
            unmasked-value
            hide-bottom-space
            v-if="editCompany === false"
            :value="
              summary.providerAlias +
              (summary.providerDocument
                ? ' (' + summary.providerDocument + ')'
                : '')
            "
            type="text"
            label="Responsável pelo pedido"
            :disable="true"
          />
          <ListAutocomplete
            v-else
            :source="getCompaniesSelect"
            :isLoading="false"
            label="Responsável pelo pedido"
            placeholder="Digite o nome da empresa responsável..."
            @selected="onCompanySelect"
          />
        </div>
        <div class="col-2 col-sm-1">
          <q-btn
            flat
            round
            dense
            style="margin-top: 13px"
            color="primary"
            :icon="editCompany ? 'cancel' : 'edit'"
            @click="editCompany = !editCompany"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            v-if="editCompany"
            style="margin-top: 13px"
            color="primary"
            icon="check"
            @click="onSaveCompany"
            :disable="updatedCompanyId === null"
          >
            <q-tooltip>Salvar</q-tooltip>
          </q-btn>
        </div>
        <div class="col-6 col-sm-2">
          <q-btn
            dense
            style="margin-top: 13px"
            color="primary"
            @click="onPropostaClick()"
          >
            Gerar Proposta
          </q-btn>
        </div>
        <div class="col-6 col-sm-2">
          <q-btn
            dense
            style="margin-top: 13px"
            color="primary"
            @click="createNewContract()"
          >
            {{ hasContract() ? "Ver" : "Gerar" }} Contrato
          </q-btn>
        </div>
      </div>

      <q-separator />

      <div v-if="payer !== false">
        <!-- RETRIEVE DATA -->

        <div class="row justify-center items-stretch q-mt-lg">
          <div class="col-xs-12 col-sm-5">
            <q-markup-table
              flat
              separator="none"
              class="bg-grey-2 q-mb-md"
            >
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da coleta</div>
                  </td>
                </tr>
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
                <tr
                  v-if="
                    this.retrieve.address && this.retrieve.address.postal_code
                  "
                >
                  <td colspan="2" class="text-right">
                    <q-btn
                      v-if="this.retrieve.id"
                      size="sm"
                      color="primary bt-edit"
                      label="Editar"
                      @click="btEditRem()"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-markup-table
              v-if="this.retrieve.address && this.retrieve.address.postal_code"
              flat
              separator="none"
              class="bg-grey-2 q-mb-md "
            >
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="text-subtitle2 text-blue">
                      Endereço da coleta
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    this.retrieve.address && this.retrieve.address.postal_code
                  "
                >
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{ this.formatCEP(this.retrieve.address.postal_code) }}
                  </td>
                </tr>

                <tr
                  v-if="this.retrieve.address && this.retrieve.address.street"
                >
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.retrieve.address.street}, ${this.retrieve.address.number} ${this.retrieve.address.complement}`
                    }}
                  </td>
                </tr>
                <tr
                  v-if="this.retrieve.address && this.retrieve.address.district"
                >
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.retrieve.address.district}` }}
                  </td>
                </tr>
                <tr v-if="this.retrieve.address && this.retrieve.address.city">
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.retrieve.address.city} / ${this.retrieve.address.state}`
                    }}
                  </td>
                </tr>
                <tr
                  v-if="
                    this.retrieve.address && this.retrieve.address.postal_code
                  "
                >
                  <td colspan="2" class="text-right">
                    <q-btn
                      size="sm"
                      color="primary"
                      label="Editar"
                      @click="seeDetails(retrieve, 'retrieve')"
                    />
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
              class="bg-grey-2 q-mb-md"
            >
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="text-subtitle2 text-blue">Dados da entrega</div>
                  </td>
                </tr>
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
                <tr
                  v-if="
                    this.delivery.address && this.delivery.address.postal_code
                  "
                >
                  <td colspan="2" class="text-right">
                    <q-btn
                      v-if="this.delivery.id"
                      size="sm"
                      color="primary bt-edit"
                      label="Editar"
                      @click="btEditDest()"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-markup-table
              v-if="this.delivery.address && this.delivery.address.postal_code"
              flat
              separator="none"
              class="bg-grey-2 q-mb-md "
            >
              <tbody>
                <tr>
                  <td colspan="2">
                    <div class="text-subtitle2 text-blue">
                      Endereço da entrega
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    this.delivery.address && this.delivery.address.postal_code
                  "
                >
                  <td class="text-left text-bold">CEP</td>
                  <td class="text-left">
                    {{ this.formatCEP(this.delivery.address.postal_code) }}
                  </td>
                </tr>

                <tr
                  v-if="this.delivery.address && this.delivery.address.street"
                >
                  <td class="text-left text-bold">Endereço</td>
                  <td class="text-left">
                    {{
                      `${this.delivery.address.street}, ${this.delivery.address.number} ${this.delivery.address.complement}`
                    }}
                  </td>
                </tr>
                <tr
                  v-if="this.delivery.address && this.delivery.address.district"
                >
                  <td class="text-left text-bold">Bairro</td>
                  <td class="text-left">
                    {{ `${this.delivery.address.district}` }}
                  </td>
                </tr>
                <tr v-if="this.delivery.address && this.delivery.address.city">
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{
                      `${this.delivery.address.city} / ${this.delivery.address.state}`
                    }}
                  </td>
                </tr>
                <tr
                  v-if="
                    this.delivery.address && this.delivery.address.postal_code
                  "
                >
                  <td colspan="2" class="text-right">
                    <q-btn
                      size="sm"
                      color="primary"
                      label="Editar"
                      @click="seeDetails(delivery, 'delivery')"
                    />
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
                  <th v-if="!isCeg()">Cubagem</th>
                  <th>{{ labels.productTypeLabel }}</th>
                  <th>{{ labels.invoiceTaxLabel }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-if="!isCeg()" class="text-center">
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
              :readonly="!editable"
            />
          </div>
        </div>
      </div>

      <q-dialog
        v-model="dialogs.details.visible"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="">
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
            <div :class="!isCeg() ? 'hidden' : 'row q-col-gutter-xs q-pb-xs'">
              <div class="col-xs-12 text-subtitle1 text-left"></div>
              <div class="col-xs-12 q-mb-sm">
                <q-select
                  outlined
                  @input="changeAddressType"
                  v-model="dialogs.details.data.address_type"
                  :options="address_type"
                  label="Tipo de embarque"
                />
              </div>
            </div>
            <div
              v-if="showByAddressType && !forceHidden"
              class="row q-col-gutter-xs q-pb-xs"
            >
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
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  unmasked-value
                  hide-bottom-space
                  v-model="dialogs.details.data.postal_code"
                  type="text"
                  :label="$t('CEP')"
                  mask="#####-###"
                  :rules="[isInvalid('postal_code')]"
                />
              </div>
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.street"
                  type="text"
                  :label="$t('Rua')"
                  :rules="[isInvalid('street')]"
                />
              </div>
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.number"
                  type="text"
                  :label="$t('Número')"
                  :rules="[isInvalid('number')]"
                />
              </div>
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  hide-bottom-space
                  v-model="dialogs.details.data.complement"
                  type="text"
                  :label="$t('Complemento')"
                />
              </div>
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.district"
                  type="text"
                  :label="$t('Bairro')"
                  :rules="[isInvalid('district')]"
                />
              </div>
              <div
                v-if="showByAddressType"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.city"
                  type="text"
                  :label="$t('Cidade')"
                  :rules="[isInvalid('city')]"
                />
              </div>
              <div
                v-if="showByAddressType"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.state"
                  type="text"
                  :label="$t('UF')"
                  mask="AA"
                  :rules="[isInvalid('state')]"
                />
              </div>
              <div
                v-if="showByAddressType && !forceHidden"
                class="col-xs-12 col-sm-grow q-mb-sm"
              >
                <q-input
                  stack-label
                  lazy-rules
                  hide-bottom-space
                  v-model="dialogs.details.data.country"
                  type="text"
                  :label="$t('País')"
                  :rules="[isInvalid('country')]"
                />
              </div>
              <div class="col-xs-12 col-sm-grow q-mb-sm">
                <q-btn
                  size="sm"
                  color="primary"
                  label="Salvar"
                  @click="saveAddress()"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import params from "@controleonline/quasar-contracts-ui/src/mixins/params";
import { mapActions, mapGetters } from "vuex";
import {
  formatDocument,
  formatMoney,
  formatPhone,
  formatCEP,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/common/ListAutocomplete.vue";
import ContactForm from "@controleonline/quasar-common-ui/src/components/common/ContactForm.vue";
import fetch from "@controleonline/quasar-common-ui/src/utils/fetch";

export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },

  components: {
    ContactForm,
    ListAutocomplete,
  },

  created() {
    if (this.myCompany !== null && this.orderId !== null) {
      this.requestSummary(this.orderId);
    }

    if (this.defaultCompany) {
      this.checkLabels();
    }
  },

  data() {
    return {
      isSearching: false,
      summary: null,
      isLoading: false,
      options: [],
      comments: "",
      orderStatus: null,
      editable: false,
      payerContact: null,
      showByAddressType: false,
      forceHidden: false,
      address_type: [
        { label: "Guincho", value: "winch" },
        { label: "Ponto de Encontro", value: "meeting" },
      ],
      labels: {
        productTypeLabel: "Tipo do Produto",
        invoiceTaxLabel: "Valor da Nota",
      },
      product: {
        sumCubage: null,
        type: null,
        totalPrice: null,
        packages: [],
      },
      payer: -1,
      companyId: null,
      updatedCompanyId: null,
      editCompany: false,
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
      myCompanies: "people/companies",
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),
    logged() {
      return this.$store.getters["auth/user"];
    },
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

    defaultCompany: function (value) {
      if (value) {
        this.checkLabels();
      }
    },

    summary(data) {
      if (!data) return;

      this.companyId = data.providerId;

      this.options = this.getPayerOptions();
      if (this.summary.payer) {
        this.payer = this.summary.payer.id;
      }

      //this.payerIsOther === null
      //? -1
      //: this.payerIsOther
      //? null
      //: this.summary.payer.id;

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

        if (this.summary.retrievePeople.address) {
          this.retrieve.address.district =
            this.summary.retrievePeople.address.district;
          this.retrieve.address.postal_code =
            this.summary.retrievePeople.address.postalCode;
          this.retrieve.address.street =
            this.summary.retrievePeople.address.street;
          this.retrieve.address.number =
            this.summary.retrievePeople.address.number;
          this.retrieve.address.city = this.summary.retrievePeople.address.city;
          this.retrieve.address.state =
            this.summary.retrievePeople.address.state;
          this.retrieve.address.complement =
            this.summary.retrievePeople.address.complement;
        }
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
        if (this.summary.deliveryPeople.address) {
          this.delivery.address.district =
            this.summary.deliveryPeople.address.district;
          this.delivery.address.postal_code =
            this.summary.deliveryPeople.address.postalCode;
          this.delivery.address.street =
            this.summary.deliveryPeople.address.street;
          this.delivery.address.number =
            this.summary.deliveryPeople.address.number;
          this.delivery.address.city = this.summary.deliveryPeople.address.city;
          this.delivery.address.state =
            this.summary.deliveryPeople.address.state;
          this.delivery.address.complement =
            this.summary.deliveryPeople.address.complement;
        }
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

      if (this.myCompany !== null && this.orderId !== null) {
        this.getOrderStatus(this.orderId);
      }
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
      getSummary: "salesOrder/getDetailSummary",
      changeAddress: "salesOrder/changeAddress",
      sendProposta: "quote/sendProposta",
      updateStatus: "salesOrder/updateRemote",
      getStatus: "salesOrder/getDetailStatus",
      geoplace: "gmaps/geoplace",
    }),
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
    onSelect(item) {
      this.dialogs.details.data.country = item.country;
      this.dialogs.details.data.state = item.state;
      this.dialogs.details.data.city = item.city;
      this.dialogs.details.data.district = item.district;
      this.dialogs.details.data.postal_code = item.postal_code;
      this.dialogs.details.data.street = item.street;
      this.dialogs.details.data.number = item.number;
    },
    changeAddressType() {
      if (
        this.dialogs.details.data.address_type &&
        this.dialogs.details.data.address_type.value == "winch"
      ) {
        this.showByAddressType = true;
      } else {
        this.showByAddressType = true;
      }

      if (
        this.dialogs.details.data.address_type &&
        this.dialogs.details.data.address_type.value == "meeting" &&
        this.isCeg() == true
      ) {
        this.forceHidden = true;
      } else {
        this.forceHidden = false;
      }
    },
    getOrderStatus(orderId) {
      this.getStatus({ orderId })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.orderStatus = data.orderStatus.status;
          }
          return data;
        })
        .catch((error) => {
          this.orderStatus = null;
        });
    },

    isCeg() {
      const cegTypes = ["ceg", "simple"];

      return cegTypes.indexOf(this.defaultCompany.domainType) > -1;
    },

    hasContract() {
      return this.summary ? (this.summary.contractId ? true : false) : false;
    },

    checkLabels() {
      if (this.isCeg()) {
        this.labels.productTypeLabel = "Automóvel";
        this.labels.invoiceTaxLabel = "Valor do Seguro";
      }
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
    createNewContract() {
      if (this.summary.contractId) {
        this.$router.push({
          name: "ContractDetails",
          params: {
            id: this.summary.contractId,
          },
        });
      } else if (this.summary.payer) {
        let params = {
          method: "POST",
          body: JSON.stringify({
            payerId: this.summary.payer.id,
          }),
          headers: new Headers(),
        };

        params.headers.set("API-TOKEN", this.logged.token);

        this.isLoading = true;

        fetch(
          "/my_contracts/provider/" +
            this.myCompany.id +
            "/order/" +
            this.summary.id,
          params
        )
          .then((response) => response.json())
          .then(
            ((data) => {
              this.isLoading = false;

              if (
                data.response &&
                data.response.success &&
                data.response.data.contractId
              ) {
                this.$router.push({
                  name: "ContractDetails",
                  params: {
                    id: data.response.data.contractId,
                  },
                });
              } else {
                this.$q.notify({
                  message:
                    "Não foi possível gerar um contrato para esse pedido!",
                  position: "bottom",
                  type: "negative",
                });
              }

              return data;
            }).bind(this)
          )
          .catch((e) => {
            this.isLoading = false;

            this.$q.notify({
              message: "Não foi possível gerar um contrato para esse pedido!",
              position: "bottom",
              type: "negative",
            });

            if (e instanceof SubmissionError) {
              return e.errors._error;
            }
            return e.message;
          });
      } else {
        this.$q.notify({
          message: "Para gerar um contrato, o pedido precisa ter um pagador!",
          position: "bottom",
          type: "negative",
        });
      }
    },

    onPropostaClick() {
      var quote = this.summary.quotations
        ? this.summary.quotations[0]
        : undefined;

      if (quote) {
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
      } else {
        this.$q.notify({
          message: "Não foi possível encontrar cotações nesse pedido!",
          position: "bottom",
          type: "negative",
        });
      }
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
    getCompaniesSelect(input) {
      return new Promise((success) => {
        const result = [];

        for (const item of this.myCompanies) {
          var value = input.trim().toLowerCase();

          if (
            item.alias.toLowerCase().indexOf(value) > -1 ||
            item.document.toLowerCase().indexOf(value) > -1
          ) {
            result.push({
              label: item.alias + " (" + item.document + ")",
              value: item.id,
            });
          }
        }

        success(result);
      });
    },

    onCompanySelect(item) {
      this.updatedCompanyId = item;
    },
    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace(input).then((result) => {
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
        } else {
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            type: "negative",
            position: "bottom",
          });
        }
      });
    },

    onSaveCompany() {
      if (this.updatedCompanyId !== null) {
        this.isLoading = true;

        this.updateStatus({
          id: this.orderId,
          providerId: this.updatedCompanyId,
          params: {
            myCompany: this.myCompany.id,
          },
        }).then((data) => {
          const companyData = this.myCompanies.find(
            (comp) => comp.id === this.updatedCompanyId
          );

          if (companyData) {
            this.summary.providerAlias = companyData.alias;
            this.summary.providerDocument = companyData.document;
          }

          this.updatedCompanyId = null;
          this.isLoading = false;
          this.editCompany = false;
        });
      }
    },

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

    formatDoc(document) {
      return formatDocument(document);
    },
    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    btEditRem() {
      const id = this.retrieve.id;
      this.$router.push({ name: "ClientsDetails", params: { id } });
    },

    btEditDest() {
      const id = this.delivery.id;
      this.$router.push({ name: "ClientsDetails", params: { id } });
    },
    saveAddress() {
      this.isLoading = true;
      let address = this.dialogs.details.data;
      let orderId = this.orderId;

      this.changeAddress({
        id: orderId,
        values: address,
      })
        .then((response) => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    seeDetails(data, type) {
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
      this.dialogs.details.data.type = type;

      this.dialogs.details.visible = true;

      if (!this.isCeg()) {
        this.changeAddressType();
      }
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

<style>
.bt-edit {
  margin-right: 15px;
}
</style>
