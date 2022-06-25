<template>
  <q-card style="min-height: 90vh">
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="orderStatus !== null" class="row q-pa-sm q-col-gutter-sm" key="order_status">
        <div class="col-xs-12">
          <div class="text-h5 q-pt-sm q-pb-sm">
            <q-btn flat dense :to="{ name: 'CustomersDetails', params: { id: client.id } }" :label="client.name"
              class="full-width" />
          </div>
        </div>
        <div class="col-12 row bg-grey-4">
          <div class="col-xs-12 col-sm-4">
            <q-markup-table flat dense separator="none" class="bg-grey-4">
              <tbody>
                <tr v-if="this.mainOrderId">
                  <td class="text-left text-bold">Pedido de Origem</td>
                  <td class="text-left text-bold">
                    <router-link v-bind:to="'/sales/order/id/' + this.mainOrderId">
                      (#{{ this.mainOrderId }})
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Número do pedido</td>
                  <td class="text-left">
                    {{ `#${this.orderId}` }}
                  </td>
                </tr>
                <tr v-if="this.childOrders.length > 0">
                  <td class="text-left text-bold">Pedidos vinculados</td>
                  <td class="text-left text-bold">
                    <router-link v-for="order in childOrders" :key="order.id" v-ripple
                      v-bind:to="'/sales/order/id/' + order.id">
                      (#{{ order.id }})
                    </router-link>
                  </td>
                </tr>

                <tr v-if="this.royaltiesOrders.length > 0">
                  <td class="text-left text-bold">Royalties</td>
                  <td class="text-left text-bold">
                    <router-link v-for="order in royaltiesOrders" :key="order.id" v-ripple
                      v-bind:to="'/sales/order/id/' + order.id">
                      (#{{ order.id }})
                    </router-link>
                  </td>
                </tr>
                <tr v-if="this.comissionOrders.length > 0">
                  <td class="text-left text-bold">Comissões</td>
                  <td class="text-left text-bold">
                    <router-link v-for="order in comissionOrders" :key="order.id" v-ripple
                      v-bind:to="'/sales/order/id/' + order.id">
                      (#{{ order.id }})
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Valor do pedido</td>
                  <td class="text-left">
                    {{ formatMoney(this.price) }}
                  </td>
                </tr>
                <tr v-if="this.purchasingOrderId">
                  <td class="text-left text-bold">
                    Valor do fornecedor
                    <router-link v-bind:to="
                      '/purchasing/order/id/' + this.purchasingOrderId
                    ">
                      (#{{ this.purchasingOrderId }})
                    </router-link>
                  </td>
                  <td class="text-left">
                    {{ formatMoney(this.purchasingPrice) }}
                  </td>
                </tr>
                <tr v-if="this.purchasingOrderId">
                  <td :class="
                    this.price - this.purchasingPrice < this.correctValue
                      ? 'red text-left text-bold'
                      : 'green text-left text-bold'
                  ">
                    Valor do ticket
                  </td>
                  <td :class="
                    this.price - this.purchasingPrice < this.correctValue
                      ? 'red text-left text-bold'
                      : 'green text-left text-bold'
                  ">
                    {{ formatMoney(this.price - this.purchasingPrice) }}
                    ({{ parseFloat(this.realPecentage).toFixed(2) }}
                    %)
                  </td>
                </tr>
                <tr v-if="this.purchasingOrderId">
                  <td class="text-left text-bold">Valor correto do ticket</td>
                  <td class="text-left">
                    {{ formatMoney(this.correctValue) }}
                    ({{ parseFloat(this.correctPercentage).toFixed(2) }}
                    %)
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-markup-table flat dense separator="none" class="text-white"
              :style="`background-color: ${this.orderStatus.color}`">
              <tbody>
                <tr>
                  <td class="text-center">
                    <div class="text-h6">
                      {{ $t(`order.statuses.${orderStatus.status}`) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-markup-table flat dense separator="none" v-if="this.carrier" style="background-color: transparent">
              <tbody>
                <tr>
                  <td class="text-center">
                    <q-btn flat dense :to="{
                      name: 'CarrierDetails',
                      params: { id: carrier.id },
                    }" :label="carrier.alias" class="full-width" />
                  </td>
                </tr>
                <tr>
                  <td class="text-center">
                    <q-icon v-if="hasRural(other_informations) == true" name="agriculture" color="red" size="30px" />
                    <q-icon v-if="hasDificult(other_informations) == true" name="fmd_bad" color="red" size="30px" />
                    <q-icon v-if="app == 'app' || app == 'Cota Fácil' || app == 'Gestor'" name="touch_app" color="blue"
                      size="30px" />
                    <q-icon v-else name="electrical_services" color="green" size="30px" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-markup-table flat dense separator="none" class="bg-grey-4">
              <tbody>
                <tr>
                  <td class="text-left text-bold">Data do pedido</td>
                  <td class="text-left">
                    {{
                        this.orderDate
                          ? this.formatDate(this.orderDate, "DD/MM/YYYY")
                          : "-"
                    }}
                  </td>
                </tr>
                <tr v-if="
                  other_informations &&
                  other_informations.schedule &&
                  other_informations.schedule.retrieve
                ">
                  <td class="text-left text-bold text-red">
                    Retirada à partir de
                  </td>
                  <td class="text-left text-bold text-red">
                    {{
                        this.formatDate(
                          this.other_informations.schedule.retrieve,
                          "DD/MM/YYYY"
                        )
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Última alteração</td>
                  <td class="text-left">
                    {{
                        this.alterDate
                          ? this.formatDate(this.alterDate, "DD/MM/YYYY")
                          : "-"
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-bold">Previsão de entrega</td>
                  <td class="text-left">
                    {{ this.deliveryDueDate || "-" }}
                    <q-btn v-if="deliveryDueDate && isEditable" class="btn-edit" icon="edit" color="black" flat round
                      dense />
                    <q-popup-edit v-if="deliveryDueDate && isEditable" v-model="inputDeadline" @save="onSaveDeadline">
                      <template v-slot="{
                        initialValue,
                        value,
                        emitValue,
                        validate,
                        set,
                        cancel,
                      }">
                        <q-input autofocus dense :value="inputDeadline" @input="emitValue" mask="##/##/####">
                          <template v-slot:after>
                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                            <q-btn flat dense color="positive" icon="check_circle" @click.stop="set" :disable="
                              validate(value) === false ||
                              initialValue === value
                            " />
                          </template>
                        </q-input>
                      </template>
                    </q-popup-edit>
                  </td>
                </tr>
                <tr v-if="clientInvoiceTax">
                  <td class="text-left text-bold">Nota Fiscal</td>
                  <td class="text-left">
                    #{{
                        this.clientInvoiceTax
                          ? this.clientInvoiceTax.invoiceNumber
                          : "-"
                    }}
                  </td>
                </tr>
                <tr v-if="invoiceTax">
                  <td class="text-left text-bold">CTE</td>
                  <td class="text-left">
                    #{{ this.invoiceTax ? this.invoiceTax.invoiceNumber : "-" }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

        </div>
        <div v-if="hasRural(other_informations) == true" class="row warning">
          <h6>
            <q-icon name="agriculture" size="30px" /> {{ $t(`order.warning.rural`) }}
          </h6>
        </div>
        <div v-if="hasDificult(other_informations) == true" class="row warning">
          <h6>
            <q-icon name="fmd_bad" size="30px" /> {{ $t(`order.warning.dificult`) }}
          </h6>
        </div>
        <div class="row items-center justify-center buttons-container bg-primary">
          <div class="col-xs-12 col-sm-4">
            <center>
              <q-btn v-if="orderStatus.status == 'analysis'" color="positive" label="Aprovar Pedido"
                @click="approveOrder" :loading="isUpdating" />
              <q-btn v-if="orderStatus.status == 'waiting retrieve'" color="positive" label="Coleta realizada"
                @click="addRetrieve" :loading="isUpdating" />
              <q-btn v-if="orderStatus.status == 'on the way'" color="positive" label="Entrega realizada"
                @click="addDelivered" :loading="isUpdating" />
              <q-btn v-if="orderStatus.status == 'retrieved'" color="negative" label="Coleta não Realizada"
                @click="backToWaitingRetrieve" :loading="isUpdating" />
              <q-btn v-if="['waiting payment'].includes(orderStatus.status)" color="positive" label="Liberar Pagamento"
                @click="releasePayment" :loading="isUpdating" />

              <q-btn v-if="(orderStatus.realStatus == 'open' || orderStatus.realStatus == 'pending') &&
              orderStatus.status != 'pending'" color="negative" label="Aguardar Documentação" @click="stopOrder"
                :loading="isUpdating" />
              <q-btn v-if="orderStatus.status == 'pending'" color="positive" label="Aprovar Pedido"
                @click="restartOrder" :loading="isUpdating" />
            </center>
          </div>
          <div class="col-xs-12 col-sm-4">
            <q-list padding bordered class="rounded-borders">
              <q-expansion-item dense dense-toggle expand-separator icon="receipt" header-class="text-white"
                label="Novos pedidos">
                <q-card class="bg-primary">
                  <q-card-section>
                    <center>
                      <q-btn v-if="orderStatus.realStatus != 'canceled'" color="positive" label="Gerar Reentrega"
                        @click="remakeRoute" :loading="isUpdating" />
                      <q-btn v-if="orderStatus.realStatus != 'canceled'" color="positive" label="Gerar Reenvio"
                        @click="resendQuote" :loading="isUpdating" />
                      <q-btn v-if="orderStatus.realStatus != 'canceled'" color="warning" label="Gerar Devolução"
                        @click="devolutionQuote" :loading="isUpdating" />
                    </center>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
          <div class="col-xs-12 col-sm-4">
            <center>
              <q-btn v-if="orderStatus.realStatus == 'canceled'" color="positive" label="Revalidar Cotação"
                @click="remakeQuote" :loading="isUpdating" />
              <q-btn v-if="orderStatus.realStatus != 'canceled'" color="negative" label="Cancelar Pedido"
                @click="cancelOrder" :loading="isUpdating" />
            </center>
          </div>
        </div>
      </div>

      <div v-if="orderStatus !== null" class="row" key="order_tabs">
        <div class="col-12">
          <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab" class="bg-white text-primary">
            <q-tab name="resumo" label="Resumo" />
            <q-tab name="quotation" label="Cotação" />
            <q-tab name="notafiscal" label="Nota Fiscal" />
            <q-tab name="invoice" label="Fatura" />
            <q-tab v-if="showDacteTab" name="dacte" label="DACTE" />

            <q-tab name="tasks" label="Ocorrências" />
            <q-tab name="tracking" label="Rastreamento" />

            <q-tab name="tag" label="Etiqueta" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="resumo" class="q-pa-none">
              <OrderDetailSummary @quote-details="setQuoteDetails" :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel name="quotation" class="q-pa-none">
              <OrderDetailQuotation :orderId="orderId" @finished="onCheckoutFinished" />
            </q-tab-panel>

            <q-tab-panel name="notafiscal" class="q-pa-none">
              <OrderDetailNotaFiscal :orderId="orderId" @fileUploaded="onInvoiceTaxUploaded" />
            </q-tab-panel>

            <q-tab-panel name="invoice" class="q-pa-none">
              <OrderDetailInvoice :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel v-if="showDacteTab" name="dacte" class="q-pa-none">
              <OrderDetailDACTE :orderId="orderId" @fileUploaded="onDacteUploaded" />
            </q-tab-panel>
            <q-tab-panel name="tasks" class="q-pa-none">
              <OrderTasks :task_type="'support'" :orderId="orderId"
                :client="client" />
            </q-tab-panel>
            <q-tab-panel name="tracking" class="q-pa-none">
              <OrderDetailTracking :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel name="tag" class="q-pa-none">
              <OrderDetailTag :total_packages="total_packages" :orderId="orderId" :orderStatus="orderStatus"
                :integrationType="integrationType" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </transition-group>

    <div v-if="orderStatus === null && notFound" class="row items-center justify-center" style="min-height: 90vh">
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
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
import {
  formatMoney,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

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
      this.requestOrderStatus(this.orderId);
    }
  },

  data() {
    return {
      showQuoteDetails: false,
      integrationType: null,
      currentTab: "resumo",
      orderId: null,
      orderStatus: null,
      deliveryDueDate: null,
      clientInvoiceTax: null,
      orderDate: null,
      alterDate: null,
      other_informations: null,
      invoiceTax: null,
      carrier: null,
      mainOrderId: null,
      childOrders: null,
      royaltiesOrders: null,
      comissionOrders: null,
      app: null,
      total_packages: null,
      invoices: [],
      client: {
        name: "",
      },
      quoteDetails: {},
      price: null,
      correctValue: 0,
      correctPercentage: 0,
      isEditable: false,
      inputDeadline: date.formatDate(Date.now(), "DD/MM/YYYY"),
      purchasingPrice: null,
      realPecentage: null,
      purchasingOrderId: null,
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
      }
    },
    $route(to, from) {
      if (from.fullPath != to.fullPath) {
        location.reload();
      }
    },
  },

  methods: {
    ...mapActions({
      quote: "quote/quote",
      remakeOrder: "salesOrder/remakeOrder",
      getStatus: "salesOrder/getDetailStatus",
      updateStatus: "salesOrder/updateStatus",
      updateDeadline: "salesOrder/updateDeadline",
      choose: "quote/choose_quote",
      email: "people/email",
      contact: "people/createContact",
    }),
    formatDate(date) {
      return formatDateYmdTodmY(date, true);
    },

    hasDificult(o_i) {
      let other_informations = typeof o_i == 'object' ? o_i : JSON.parse(o_i);
      let has = false;
      if (
        other_informations &&
        other_informations.dificult
      ) {
        has = true;
      }
      return has;
    },
    hasRural(o_i) {
      let other_informations = typeof o_i == 'object' ? o_i : JSON.parse(o_i);
      let has = false;
      if (
        other_informations &&
        other_informations.rural
      ) {
        has = true;
      }
      return has;
    },
    stopOrder() {


      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "stop_order",
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
    restartOrder() {

      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;

      this.updateStatus({
        id: this.orderId,
        values: {
          update: "restart_order",
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
    backToWaitingRetrieve() {
      let params = {
        myCompany: this.myCompany.id,
      };

      this.isUpdating = true;
      this.updateStatus({
        id: this.orderId,
        values: {
          update: "waiting_retrieve",
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

    remakeQuote() {
      this.isUpdating = true;
      this.quote({
        values: this.quoteDetails,
      })
        .then((response) => {
          this.$router.push({
            name: "OrderDetails",
            params: { id: response.response.data.order.id },
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser refeito",
            position: "bottom",
            type: "negative",
          });
        })
        .finally((data) => {
          this.isUpdating = false;
        });
    },
    devolutionQuote() {
      this.isUpdating = true;
      let details = Object.assign(this.quoteDetails);
      details.quoteType = "devolution";
      this.quote({
        values: details,
      })
        .then((response) => {
          this.$router.push({
            name: "OrderDetails",
            params: { id: response.response.data.order.id },
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser refeito",
            position: "bottom",
            type: "negative",
          });
        })
        .finally((data) => {
          this.isUpdating = false;
        });
    },

    resendQuote() {
      this.isUpdating = true;
      let details = Object.assign(this.quoteDetails);
      details.quoteType = "resend";
      this.quote({
        values: details,
      })
        .then((response) => {
          this.$router.push({
            name: "OrderDetails",
            params: { id: response.response.data.order.id },
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser refeito",
            position: "bottom",
            type: "negative",
          });
        })
        .finally((data) => {
          this.isUpdating = false;
        });
    },

    remakeRoute() {
      this.isUpdating = true;
      let details = Object.assign(this.quoteDetails);
      details.quoteType = "re-delivery";
      this.quote({
        values: details,
      })
        .then((response) => {
          this.$router.push({
            name: "OrderDetails",
            params: { id: response.response.data.order.id },
          });
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser refeito",
            position: "bottom",
            type: "negative",
          });
        })
        .finally((data) => {
          this.isUpdating = false;
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
        // this.currentTab = 'resumo';
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
            this.client = data.client;
            this.price = data.price;
            this.purchasingPrice = data.purchasingPrice;
            this.realPecentage = data.realPecentage;
            this.orderDate = data.orderDate;
            this.alterDate = data.alterDate;
            this.other_informations = data.other_informations;
            this.carrier = data.carrier;
            this.app = data.app;
            this.total_packages = data.total_packages;

            data.invoiceTax.forEach((invoice) => {
              if (invoice.invoiceType == 55) {
                this.clientInvoiceTax = invoice;
              }

              if (invoice.invoiceType == 57) {
                this.invoiceTax = invoice;
              }
            });

            this.correctValue = data.correctValue;
            this.correctPercentage = data.correctPercentage;
            this.purchasingOrderId = data.purchasingOrderId;
            this.mainOrderId = data.mainOrderId;
            this.childOrders = data.childOrders;
            this.royaltiesOrders = data.royaltiesOrders;
            this.comissionOrders = data.comissionOrders;

            this.notFound = false;
            this.isEditable =
              data.orderStatus.status === "delivered" ||
              data.orderStatus.status === "on the way" ||
              data.orderStatus.status === "retrieved";
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
          this.notFound = true;
          this.isEditable = false;
          this.integrationType = null;
        });
    },
    setQuoteDetails(quoteDetails) {
      //if (this.orderStatus.status == "canceled" ||this.orderStatus.status == "expired") {
      this.showQuoteDetails = true;
      //}
      this.quoteDetails = quoteDetails;
    },
    onSaveDeadline(input) {
      let params = {
        myCompany: this.myCompany.id,
      };
      this.isUpdating = true;
      this.updateDeadline({
        id: this.orderId,
        newDeadline: input,
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

.warning {
  background-color: red;
  width: 100%;
  color: white;
  padding: 0;
  margin: auto;
}

.warning h6 {
  padding: 10px !important;
  margin: 0 auto !important;
}

.buttons-container {
  width: 100%;
}
</style>