<template>
  <q-card style="min-height: 90vh">
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        v-if="orderStatus !== null"
        class="row q-pa-sm q-col-gutter-sm"
        key="order_status"
      >
        <div class="col-xs-12">
          <div class="text-h5 q-pt-sm q-pb-sm">
            <q-btn
              flat
              dense
              :to="{ name: 'ClientsDetails', params: { id: client.id } }"
              :label="client.name"
              class="full-width"
            />
          </div>
        </div>
        <div class="col-xs-12 col-sm-4">
          <q-markup-table flat dense separator="none" class="bg-grey-4">
            <tbody>
              <tr>
                <td class="text-left text-bold">Número do pedido</td>
                <td class="text-left">
                  {{ `#${this.orderId}` }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Valor do pedido</td>
                <td class="text-left">
                  {{ formatMoney(this.price) }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Previsão de entrega</td>
                <td class="text-left">
                  {{ this.deliveryDueDate || "-" }}
                  <q-btn
                    v-if="deliveryDueDate && isEditable"
                    class="btn-edit"
                    icon="edit"
                    color="black"
                    flat
                    round
                    dense
                  />
                  <q-popup-edit
                    v-if="deliveryDueDate && isEditable"
                    v-model="inputDeadline"
                    @save="onSaveDeadline"
                  >
                    <template
                      v-slot="{
                        initialValue,
                        value,
                        emitValue,
                        validate,
                        set,
                        cancel,
                      }"
                    >
                      <q-input
                        autofocus
                        dense
                        :value="inputDeadline"
                        @input="emitValue"
                        mask="##/##/####"
                      >
                        <template v-slot:after>
                          <q-btn
                            flat
                            dense
                            color="negative"
                            icon="cancel"
                            @click.stop="cancel"
                          />
                          <q-btn
                            flat
                            dense
                            color="positive"
                            icon="check_circle"
                            @click.stop="set"
                            :disable="
                              validate(value) === false ||
                              initialValue === value
                            "
                          />
                        </template>
                      </q-input>
                    </template>
                  </q-popup-edit>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-xs-12 col-sm-8">
          <q-markup-table
            flat
            dense
            separator="none"
            class="text-white"
            :style="`background-color: ${this.orderStatus.color}`"
          >
            <tbody>
              <tr>
                <td class="text-center">
                  <div class="text-h6">
                    {{ $t(`order.statuses.${orderStatus.status}`) }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center text-bold">
                  <div class="row q-gutter-xs items-center justify-center">
                    <q-btn
                      v-if="orderStatus.status == 'analysis'"
                      color="positive"
                      label="Aprovar pedido"
                      @click="approveOrder"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="orderStatus.status == 'waiting retrieve'"
                      color="positive"
                      label="Coleta realizada"
                      @click="addRetrieve"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="orderStatus.status == 'on the way'"
                      color="positive"
                      label="Entrega realizada"
                      @click="addDelivered"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="
                        ['open', 'pending'].includes(orderStatus.realStatus)
                      "
                      color="negative"
                      label="Cancelar pedido"
                      @click="cancelOrder"
                      :loading="isUpdating"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div v-if="orderStatus !== null" class="row" key="order_tabs">
        <div class="col-12">
          <q-tabs
            :horizontal="$q.screen.gt.xs"
            align="justify"
            v-model="currentTab"
            class="bg-white text-primary"
          >
            <q-tab name="resumo" label="Resumo" />
            <q-tab name="quotation" label="Cotação" />
            <q-tab name="etiqueta" label="Etiqueta" />
            <q-tab name="notafiscal" label="Nota Fiscal" />
            <q-tab name="invoice" label="Fatura" />
            <q-tab v-if="showDacteTab" name="dacte" label="DACTE" />
            <q-tab name="tracking" label="Rastreamento" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="resumo" class="q-pa-none">
              <OrderDetailSummary :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel name="quotation" class="q-pa-none">
              <OrderDetailQuotation
                :orderId="orderId"
                @finished="onCheckoutFinished"
              />
            </q-tab-panel>

            <q-tab-panel name="etiqueta" class="q-pa-none">
              <OrderDetailTag
                :orderId="orderId"
                :orderStatus="orderStatus"
                :integrationType="integrationType"
              />
            </q-tab-panel>

            <q-tab-panel name="notafiscal" class="q-pa-none">
              <OrderDetailNotaFiscal
                :orderId="orderId"
                @fileUploaded="onInvoiceTaxUploaded"
              />
            </q-tab-panel>

            <q-tab-panel name="invoice" class="q-pa-none">
              <OrderDetailInvoice :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel v-if="showDacteTab" name="dacte" class="q-pa-none">
              <OrderDetailDACTE
                :orderId="orderId"
                @fileUploaded="onDacteUploaded"
              />
            </q-tab-panel>

            <q-tab-panel name="tracking" class="q-pa-none">
              <div class="row justify-end q-mb-md">
                <q-btn
                  label="Cadastrar"
                  icon="add"
                  size="md"
                  color="primary"
                  class="q-ml-sm"
                  @click="dialog = !dialog"
                />
              </div>
              <OrderDetailTracking :orderId="orderId" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </transition-group>

    <div
      v-if="orderStatus === null && notFound"
      class="row items-center justify-center"
      style="min-height: 90vh"
    >
      <q-banner class="text-white bg-red text-center text-h3" rounded>
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        O pedido não foi encontrado
      </q-banner>
    </div>
    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Cadastro de rastreamento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.Ocorrência"
                type="text"
                class="q-mb-sm"
                :label="$t('Ocorrência')"
                :placeholder="'Digite a ocorrência'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.status"
                type="text"
                class="q-mb-sm"
                :label="$t('Status')"
                :placeholder="'Status da ocorrência'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.cidade"
                type="text"
                class="q-mb-sm"
                :label="$t('Cidade')"
                :placeholder="'Digite a cidade da ocorrência'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.data_efetiva"
                type="text"
                class="q-mb-sm"
                :label="$t('Data efetiva')"
                :placeholder="'Informe a data efetiva'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm" v-show="false">
            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.dominio"
                type="text"
                class="q-mb-sm"
                :label="$t('Domínio')"
                :placeholder="'Domínio'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>

            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.data"
                type="text"
                class="q-mb-sm"
                :label="$t('Data')"
                :placeholder="'Informe a data'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                stack-label
                lazy-rules
                v-model="form.descricao"
                type="text"
                class="q-mb-sm"
                :label="$t('Descrição')"
                :placeholder="'Descreva a ocorrência'"
                :rules="[isInvalid('name')]"
                :outlined="true"
              />
            </div>

            <div class="col-sm-6 col-xs-12 q-pa-md">
              <q-select
                stack-label
                label="Tipo"
                v-model="form.type"
                :options="types"
                class="full-width"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sem resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn type="submit" color="primary" label="Salvar" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";
import OrderDetailSummary from "./details/OrderDetailSummary.vue";
import OrderDetailQuotation from "./details/OrderDetailQuotation.vue";
import OrderDetailNotaFiscal from "./details/OrderDetailNotaFiscal.vue";
import OrderDetailInvoice from "./details/OrderDetailInvoice.vue";
import OrderDetailDACTE from "./details/OrderDetailDACTE.vue";
import OrderDetailTracking from "./details/OrderTracking.vue";
import OrderDetailTag from "./details/OrderDetailTag.vue";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";

export default {
  components: {
    OrderDetailSummary,
    OrderDetailQuotation,
    OrderDetailNotaFiscal,
    OrderDetailInvoice,
    OrderDetailDACTE,
    OrderDetailTracking,
    OrderDetailTag,
  },

  created() {
    if (this.$route.params.id)
      this.orderId = decodeURIComponent(this.$route.params.id);

    if (this.myCompany !== null && this.orderId !== null) {
      this.requestOrderStatus(this.orderId);
      if (this.myCompany.domains[0]) {
        this.setDomainValue(this.myCompany.domains[0].domain);
      }
    }

    this.setDateValue();
  },

  data() {
    return {
      currentTab: "resumo",
      orderId: null,
      orderStatus: null,
      deliveryDueDate: null,
      invoices: [],
      client: {
        name: "",
      },
      price: null,
      notFound: false,
      isLoading: false,
      isUpdating: false,
      isEditable: false,
      inputDeadline: date.formatDate(Date.now(), "DD/MM/YYYY"),
      integrationType: null,
      dialog: false,
      form: {
        Ocorrência: "",
        status: "",
        cidade: "",
        dominio: "",
        filial: "",
        data_efetiva: "",
        data: "",
        descricao: "",
        tipo: "",
      },

      types: [
        { label: "Informativo", value: "Informativo" },
        { label: "Pendência", value: "Pendência" },
        { label: "Entrega", value: "Entrega" },
        { label: "Cliente", value: "Cliente" },
        { label: "Pre-entrega", value: "Pre-entrega" },
        { label: "Baixa", value: "Baixa" },
        { label: "Solucionada", value: "Solucionada" },
      ],
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),

    showDacteTab() {
      return (
        (this.orderStatus !== null &&
          (this.orderStatus.status == "waiting retrieve" ||
            this.orderStatus.status == "retrieved")) ||
        this.invoices.find((inv) => inv.invoiceType == 57)
      );
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.requestOrderStatus(this.orderId);

        if (this.myCompany.domains && this.myCompany.domains[0]) {
          this.setDomainValue(this.myCompany.domains[0].domain);
        }
      }
    },
  },

  methods: {
    ...mapActions({
      getStatus: "salesOrder/getDetailStatus",
      updateStatus: "salesOrder/updateStatus",
      updateDeadline: "salesOrder/updateDeadline",
    }),

    setDomainValue(value) {
      this.form.dominio = value;
    },

    setDateValue() {
      var date = new Date();

      var dia = date.getDate();
      var mes = date.getMonth() + 1;
      var ano = date.getFullYear();

      if (dia < 10) {
        dia = "0" + dia;
      }

      if (mes < 10) {
        mes = "0" + mes;
      }

      var hoje = dia + "/" + mes + "/" + ano;

      this.form.data = hoje;
    },

    cancelOrder() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "cancel_order",
        },
        params: params,
      })
        .then((order) => {
          this.requestOrderStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser atualizado",
            position: "bottom",
            type: "negative",
          });
        });
    },

    approveOrder() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "approve_order",
        },
        params: params,
      })
        .then((order) => {
          this.requestOrderStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser atualizado",
            position: "bottom",
            type: "negative",
          });
        });
    },
    addDelivered() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;
      this.updateStatus({
        id: this.orderId,
        values: {
          update: "add_delivered",
        },
        params: params,
      })
        .then((order) => {
          this.requestOrderStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser atualizado",
            position: "bottom",
            type: "negative",
          });
        });
    },
    addRetrieve() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "add_retrieve",
        },
        params: params,
      })
        .then((order) => {
          this.requestOrderStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser atualizado",
            position: "bottom",
            type: "negative",
          });
        });
    },
    onCheckoutFinished() {
      this.$q.notify({
        message: `Pedido #${this.orderId} foi salvo com sucesso`,
        position: "bottom",
        type: "positive",
      });

      this.requestOrderStatus(this.orderId);
    },

    onInvoiceTaxUploaded() {
      this.requestOrderStatus(this.orderId);
    },

    onDacteUploaded() {
      this.requestOrderStatus(this.orderId).then((data) => {
        this.currentTab = "resumo";
      });
    },

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    requestOrderStatus(orderId) {
      if (this.isLoading) return;

      let params = {};

      params["myCompany"] = this.myCompany.id;

      this.isLoading = true;

      return this.getStatus({ orderId, params })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.orderStatus = data.orderStatus;
            this.invoices = data.invoiceTax;
            this.deliveryDueDate = data.deliveryDueDate;
            this.inputDeadline = data.deliveryDueDate;
            this.client.name = data.client.name;
            this.client.id = data.client.id;
            this.price = data.price;
            this.isEditable =
              data.orderStatus.status === "on the way" ||
              data.orderStatus.status === "retrieved";
            this.notFound = false;
            this.integrationType = data.integrationType;
          }

          return data;
        })
        .catch((error) => {
          this.isLoading = false;
          this.orderStatus = null;
          this.deliveryDueDate = null;
          this.invoices = [];
          this.client.name = "";
          this.price = null;
          this.isEditable = false;
          this.notFound = true;
          this.integrationType = null;
        });
    },

    onSaveDeadline() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateDeadline({
        id: this.orderId,
        newDeadline: this.inputDeadline,
        params,
      })
        .then((result) => {
          this.requestOrderStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "A previsão de entrega do pedido não pode ser atualizada",
            position: "bottom",
            type: "negative",
          });

          this.isUpdating = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (key == "money") {
          if (!val || !(parseFloat(val.replace(",", ".")) > 0))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (key == "monthday") {
          if (!val || !(parseInt(val) > 0 && parseInt(val) < 32))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        return true;
      };
    },
  },
};
</script>
<style>
.q-pa-none {
  margin-top: 2rem;
}
.btn-edit .q-icon {
  font-size: 16px !important;
}
.deadline-buttons {
  text-align: right;
}
</style>
