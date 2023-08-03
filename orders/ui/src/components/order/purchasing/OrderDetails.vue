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
      <div v-if="status !== null" class="row q-pa-sm q-col-gutter-sm" key="status">
        <div class="col-xs-12">
          <div class="text-h5 q-pt-sm q-pb-sm">
            <q-btn
              flat
              dense
              :to="{ name: 'CarrierDetails', params: { id: provider.id } }"
              :label="provider.alias"
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
              <tr v-if="this.mainOrderId">
                <td class="text-left text-bold">
                  Valor do pedido
                  <router-link v-bind:to="'/sales/order/id/' + this.mainOrderId">
                    (#{{ this.mainOrderId }})
                  </router-link>
                </td>
                <td class="text-left">
                  {{ formatMoney(this.mainPrice) }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Valor do Fornecedor</td>
                <td class="text-left">
                  {{ formatMoney(this.price) }}
                </td>
              </tr>
              <tr v-if="this.mainOrderId">
                <td
                  :class="
                    this.mainPrice - this.price < this.correctValue
                      ? 'red text-left text-bold'
                      : 'green text-left text-bold'
                  "
                >
                  Valor do ticket
                </td>
                <td
                  :class="
                    this.mainPrice - this.price < this.correctValue
                      ? 'red text-left text-bold'
                      : 'green text-left text-bold'
                  "
                >
                  {{ formatMoney(this.mainPrice - this.price) }}
                  ({{ parseFloat(this.realPecentage).toFixed(2) }}
                  %)
                </td>
              </tr>
              <tr v-if="this.mainOrderId">
                <td class="text-left text-bold">Valor correto do ticket</td>
                <td class="text-left">
                  {{ formatMoney(this.correctValue) }}
                  ({{ parseFloat(this.correctPercentage).toFixed(2) }}
                  %)
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
                      v-slot="{ initialValue, value, emitValue, validate, set, cancel }"
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
                            :disable="validate(value) === false || initialValue === value"
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
            :style="`background-color: ${this.status.color}`"
          >
            <tbody>
              <tr>
                <td class="text-center">
                  <div class="text-h6">
                    {{ $t(`order.statuses.${status.status}`) }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center text-bold">
                  <div class="row items-center justify-around">
                    <q-btn
                      v-if="status.status == 'analysis'"
                      color="positive"
                      label="Aprovar Pedido"
                      @click="approveOrder"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="status.status == 'waiting retrieve'"
                      color="positive"
                      label="Coleta realizada"
                      @click="addRetrieve"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="status.status == 'on the way'"
                      color="positive"
                      label="Entrega realizada"
                      @click="addDelivered"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="['open', 'pending'].includes(status.realStatus)"
                      color="negative"
                      label="Cancelar Pedido"
                      @click="cancelOrder"
                      :loading="isUpdating"
                    />
                    <q-btn
                      v-if="['waiting payment'].includes(status.status)"
                      color="positive"
                      label="Liberar Pagamento"
                      @click="releasePayment"
                      :loading="isUpdating"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div v-if="status !== null" class="row" key="order_tabs">
        <div class="col-12">
          <q-tabs
            :horizontal="$q.screen.gt.xs"
            align="justify"
            v-model="currentTab"
            class="bg-white text-primary"
          >
            <q-tab name="resumo" label="Resumo" />
            <!-- <q-tab name="quotation" label="Cotação" /> -->
            <!-- <q-tab name="notafiscal" label="Nota Fiscal" /> -->
            <q-tab name="invoice" label="Fatura" />
            <!-- <q-tab v-if="showDacteTab" name="dacte" label="DACTE" /> -->
            <q-tab name="tasks" label="Ocorrências" />
            <!-- <q-tab name="tracking" label="Rastreamento" /> -->
            <!-- <q-tab name="tag" label="Etiqueta" /> -->
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="resumo" class="q-pa-none">
              <OrderDetailSummary :orderId="orderId" />
            </q-tab-panel>

            <!-- <q-tab-panel name="quotation" class="q-pa-none">
              <OrderDetailQuotation :orderId="orderId" @finished="onCheckoutFinished" />
            </q-tab-panel> -->

            <!-- <q-tab-panel name="notafiscal" class="q-pa-none">
              <OrderDetailNotaFiscal :orderId="orderId" @fileUploaded="onInvoiceTaxUploaded" />
            </q-tab-panel> -->

            <q-tab-panel name="invoice" class="q-pa-none">
              <OrderDetailInvoice :orderId="orderId" />
            </q-tab-panel>

            <!-- <q-tab-panel v-if="showDacteTab" name="dacte" class="q-pa-none">
              <OrderDetailDACTE :orderId="orderId" @fileUploaded="onDacteUploaded" />
            </q-tab-panel> -->
            <q-tab-panel name="tasks" class="q-pa-none">
              <OrderTasks :task_type="'support'" :orderId="orderId" :client="provider" />
            </q-tab-panel>
            <!-- <q-tab-panel name="tracking" class="q-pa-none">
              <OrderDetailTracking :orderId="orderId" />
            </q-tab-panel> -->

            <!-- <q-tab-panel name="tag" class="q-pa-none">
              <OrderDetailTag :orderId="orderId" :status="status" :integrationType="integrationType" />
            </q-tab-panel> -->
          </q-tab-panels>
        </div>
      </div>
    </transition-group>

    <div
      v-if="status === null && notFound"
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
  </q-card>
</template>

<script>
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";
import OrderDetailSummary from "./details/OrderDetailSummary";
import OrderDetailQuotation from "./details/OrderDetailQuotation";
import OrderDetailNotaFiscal from "./details/OrderDetailNotaFiscal";
import OrderDetailInvoice from "./details/OrderDetailInvoice";
import OrderDetailDACTE from "./details/OrderDetailDACTE";
import OrderDetailTracking from "./details/OrderTracking";
import OrderDetailTag from "./details/OrderDetailTag";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";

export default {
  components: {
    OrderDetailSummary,
    OrderDetailQuotation,
    OrderDetailNotaFiscal,
    OrderDetailInvoice,
    OrderDetailDACTE,
    OrderDetailTracking,
    OrderDetailTag,
    OrderTasks,
  },

  created() {
    if (this.$route.params.id)
      this.orderId = parseInt(decodeURIComponent(this.$route.params.id));

    if (this.myCompany !== null && this.orderId !== null) {
      this.requestStatus(this.orderId);
    }
  },

  data() {
    return {
      integrationType: null,
      currentTab: "resumo",
      orderId: null,
      status: null,
      deliveryDueDate: null,
      invoices: [],
      provider: {},
      client: {
        name: "",
      },
      price: null,
      correctValue: 0,
      correctPercentage: 0,
      isEditable: false,
      inputDeadline: date.formatDate(Date.now(), "DD/MM/YYYY"),
      mainPrice: null,
      realPecentage: null,
      mainOrderId: null,
      notFound: false,
      isLoading: false,
      isUpdating: false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),

    showDacteTab() {
      return (
        (this.status !== null &&
          (this.status.status == "waiting retrieve" ||
            this.status.status == "retrieved")) ||
        this.invoices.find((inv) => inv.invoiceType == 57)
      );
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.requestStatus(this.orderId);
      }
    },
  },

  methods: {
    ...mapActions({
      getStatus: "purchasingOrder/getDetailStatus",
      updateStatus: "purchasingOrder/updateStatus",
      updateDeadline: "purchasingOrder/updateDeadline",
      choose: "quote/choose_quote",
      email: "people/email",
      contact: "people/createContact",
    }),

    releasePayment() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "release_payment",
        },
        params: params,
      }).then((order) => {
        this.requestStatus(this.orderId).finally((data) => {
          this.isUpdating = false;
        });
      });
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
          this.requestStatus(this.orderId).finally((data) => {
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
      }).then((order) => {
        this.requestStatus(this.orderId).finally((data) => {
          this.isUpdating = false;
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
      }).then((order) => {
        this.requestStatus(this.orderId).finally((data) => {
          this.isUpdating = false;
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
      }).then((order) => {
        this.requestStatus(this.orderId).finally((data) => {
          this.isUpdating = false;
        });
      });
    },

    onCheckoutFinished() {
      this.$q.notify({
        message: `Pedido #${this.orderId} foi salvo com sucesso`,
        position: "bottom",
        type: "positive",
      });

      this.requestStatus(this.orderId);
    },

    onInvoiceTaxUploaded() {
      this.requestStatus(this.orderId);
    },

    onDacteUploaded() {
      this.requestStatus(this.orderId).then((data) => {
        // this.currentTab = 'resumo';
      });
    },

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    requestStatus(orderId) {
      if (this.isLoading) return;

      let params = {};

      params["myCompany"] = this.myCompany.id;

      this.isLoading = true;

      return this.getStatus({ orderId, params })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.status = data.status;
            this.invoices = data.invoiceTax;
            this.deliveryDueDate = data.deliveryDueDate;
            this.client = data.client;
            this.provider = data.provider;
            this.price = data.price;
            this.mainPrice = data.mainPrice;
            this.realPecentage = data.realPecentage;
            this.correctValue = data.correctValue;
            this.correctPercentage = data.correctPercentage;
            this.mainOrderId = data.mainOrderId;
            this.notFound = false;
            this.isEditable =
              data.status.status === "on the way" || data.status.status === "retrieved";
            this.integrationType = data.integrationType;
          }

          return data;
        })
        .catch((error) => {
          this.isLoading = false;
          this.status = null;
          this.deliveryDueDate = null;
          this.invoices = [];
          this.client.name = "";
          this.price = null;
          this.notFound = true;
          this.isEditable = false;
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
          this.requestStatus(this.orderId).finally((data) => {
            this.isUpdating = false;
          });
        })
        .finally(() => {
          this.isUpdating = false;
        });
    },
  },
};
</script>
<style scoped>
.red {
  color: red !important;
}

.green {
  color: rgb(75, 110, 5) !important;
}
</style>
