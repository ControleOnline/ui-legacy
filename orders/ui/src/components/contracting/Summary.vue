<template>
  <div>

    <q-form @submit="save" class="q-mt-sm" ref="myForm">

      <!-- WHO IS THE PAYER -->

      <div class="row justify-center q-mb-md">
        <div class="col-xs-12 text-center text-subtitle2 q-mb-sm">
          Quem pagará pelo frete?
        </div>
        <div class="col-xs-12 text-center">
          <q-btn-toggle no-caps
            v-model     ="item.payer"
            toggle-color="primary"
            :options    ="options"
          />
        </div>
      </div>

      <div v-if="item.payer !== false">
        <!-- WHEN PAYER IS OTHER PERSON -->

        <ContactForm v-if="item.payer === null" ref="contactForm" :withSave="false" />

        <!-- RETRIEVE DATA -->

        <div class="row justify-center items-stretch q-mt-lg">
          <div class="col-xs-12 col-sm-5">
            <q-markup-table bordered
              separator="none"
              class    ="bg-grey-3 q-mb-md full-height"
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
                    {{ this.steps.retrieve.name || this.steps.retrieve.contact.name }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ formatDoc(this.steps.retrieve.document) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{ `${this.steps.retrieve.address.city} / ${this.steps.retrieve.address.state}` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">
                    <q-btn
                      size  ="sm"
                      color ="primary"
                      label ="Detalhes da coleta"
                      @click="seeDetails(steps.retrieve)"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-xs-12 col-sm-2 gt-xs">
            <div class="row justify-center items-center full-height">
             <q-icon name="local_shipping" class="text-primary" style="font-size: 3em" />
            </div>
          </div>
          <div class="col-xs-12 col-sm-5">
            <q-markup-table bordered
              separator="none"
              class    ="bg-grey-3 q-mb-md full-height"
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
                    {{ this.steps.delivery.name || this.steps.delivery.contact.name }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Documento</td>
                  <td class="text-left">
                    {{ formatDoc(this.steps.delivery.document) }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Cidade</td>
                  <td class="text-left">
                    {{ `${this.steps.delivery.address.city} / ${this.steps.delivery.address.state}` }}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">
                    <q-btn
                      size  ="sm"
                      color ="primary"
                      label ="Detalhes da entrega"
                      @click="seeDetails(steps.delivery)"
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
                  <th>Cubagem</th>
                  <th>Tipo de material</th>
                  <th>Valor da nota fiscal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">
                    {{ `${ (new Intl.NumberFormat('pt-br')).format(this.order.product.sumCubage) } kg` }}
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
                  :key ="index"
                >
                  <td class="text-center">{{ myPackage.qtd    }}</td>
                  <td class="text-center">{{ `${myPackage.weight} kg` }}</td>
                  <td class="text-center">{{ `${myPackage.height} m`  }}</td>
                  <td class="text-center">{{ `${myPackage.width } m`  }}</td>
                  <td class="text-center">{{ `${myPackage.depth } m`  }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>

        <!-- SOME COMMENTS ABOUT THIS ORDER -->

        <div class="row q-mt-lg">
          <div class="col-xs-12">
            <q-input outlined stack-label
              v-model="item.comments"
              type   ="textarea"
              label  ="Observações"
            />
          </div>
        </div>

        <div class="row justify-end q-mt-lg">
          <q-btn
             type    ="submit"
             color   ="primary"
             label   ="Finalizar pedido"
             :loading="isLoading"
          />
        </div>
      </div>

    </q-form>

    <q-dialog v-model="dialogs.details.visible" transition-show="scale" transition-hide="scale">
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
                <td class="text-left">{{ dialogs.details.data.name        }}</td>
              </tr>
              <tr>
                <td class="text-left">Email</td>
                <td class="text-left">{{ dialogs.details.data.email       }}</td>
              </tr>
              <tr>
                <td class="text-left">Telefone</td>
                <td class="text-left">{{ dialogs.details.data.phone       }}</td>
              </tr>
              <tr>
                <td class="text-left">País</td>
                <td class="text-left">{{ dialogs.details.data.country     }}</td>
              </tr>
              <tr>
                <td class="text-left">Estado</td>
                <td class="text-left">{{ dialogs.details.data.state       }}</td>
              </tr>
              <tr>
                <td class="text-left">Cidade</td>
                <td class="text-left">{{ dialogs.details.data.city        }}</td>
              </tr>
              <tr>
                <td class="text-left">Bairro</td>
                <td class="text-left">{{ dialogs.details.data.district    }}</td>
              </tr>
              <tr>
                <td class="text-left">CEP</td>
                <td class="text-left">{{ dialogs.details.data.postal_code }}</td>
              </tr>
              <tr>
                <td class="text-left">Rua</td>
                <td class="text-left">{{ dialogs.details.data.street      }}</td>
              </tr>
              <tr>
                <td class="text-left">Número</td>
                <td class="text-left">{{ dialogs.details.data.number      }}</td>
              </tr>
              <tr>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { mapActions, mapGetters }                    from 'vuex';
import { formatDocument, formatPhone, formatCEP } from '@controleonline/quasar-common-ui/src/utils/formatter';
import ContactForm                                   from '@controleonline/quasar-common-ui/src/components/common/ContactForm'

export default {
  components: {
    ContactForm,
  },

  props     : {
    order: {
      type    : Object,
      required: true,
    },
    steps: {
      type    : Object,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      dialogs  : {
        details: {
          visible: false,
          data   : {
            name       : null,
            email      : null,
            phone      : null,
            country    : null,
            state      : null,
            city       : null,
            district   : null,
            postal_code: null,
            street     : null,
            number     : null,
          },
        },
      },
      item     : {
        payer   : false,
        comments: '',
      },
    };
  },

  computed: {
    options() {
      let opts = [];

      if (this.steps.retrieve.id == this.steps.delivery.id)
        opts.push({
          label: `${this.steps.retrieve.name || this.steps.retrieve.contact.name} (CIF)`,
          value: this.steps.retrieve.id,
        });

      else {
        opts.push({
          label: `${this.steps.retrieve.name || this.steps.retrieve.contact.name} (CIF)`,
          value: this.steps.retrieve.id,
        });

        opts.push({
          label: `${this.steps.delivery.name || this.steps.delivery.contact.name} (FOB)`,
          value: this.steps.delivery.id,
        });
      }

      opts.push({
        label: 'Outra pessoa',
        value: null,
      });

      return opts;
    },
  },

  methods: {
    seeDetails(data) {
      this.dialogs.details.data.name        = data.contact.name;
      this.dialogs.details.data.email       = data.contact.email;
      this.dialogs.details.data.phone       = formatPhone(data.contact.phone);
      this.dialogs.details.data.country     = data.address.country;
      this.dialogs.details.data.state       = data.address.state;
      this.dialogs.details.data.city        = data.address.city;
      this.dialogs.details.data.district    = data.address.district;
      this.dialogs.details.data.postal_code = formatCEP(data.address.postal_code);
      this.dialogs.details.data.street      = data.address.street;
      this.dialogs.details.data.number      = data.address.number;

      this.dialogs.details.visible = true;
    },

    save() {
      if (this.item.payer === null) {
        this.$refs.contactForm.getData()
          .then(data => {

            if (data !== false) {
              this.isLoading = true;

              this.$emit('saved', {
                errors: false,
                data  : {
                  comments: this.item.comments,
                  payer   : data
                }
              });
            }

          });
      }

      else {
        this.isLoading = true;

        this.$emit('saved', {
          errors: false,
          data  : this.item
        });
      }
    },

    formatDoc(document) {
      return formatDocument(document);
    },

    formatMoney(value) {
      let formatter = new Intl.NumberFormat(this.$i18n.locale, {
        style   : 'currency',
        currency: 'BRL',
      });

      if (typeof value == 'string')
        value = value.replace(',', '.');

      return formatter.format(value);
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

        if (key == 'phone' && !/^\d{10,11}$/.test(val))
          return this.$t('messages.phoneInvalid');

        if (key == 'password' && val.length < 6)
          return this.$t('A senha deve ter no mínimo 6 caracteres');

        if (key == 'confirm' && (this.item.password != this.item.confirmPassword))
          return this.$t('As senhas não coincidem');

        return true;
      };
    },
  },
};
</script>
