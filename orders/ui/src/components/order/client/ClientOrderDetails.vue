<template>
  <q-card style="min-height: 90vh">
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="orderStatus !== null" class="row q-pa-sm q-col-gutter-sm" key="order_status">
        <div class="col-xs-12 col-sm-4">
          <q-markup-table flat dense separator="none" class="bg-grey-4">
            <tbody>
              <tr>
                <td class="text-left text-bold">Número do pedido</td>
                <td class="text-left">
                  {{
                      `#${this.orderStatus["@id"].match(
                        /^\/purchasing\/orders\/([a-z0-9-]*)$/
                      )[1]
                      }`
                  }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Valor do pedido</td>
                <td class="text-left">
                  {{ formatMoney(this.orderStatus.price) }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Previsão de entrega</td>
                <td class="text-left">
                  {{ this.deliveryDueDate || "-" }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-xs-12 col-sm-8">
          <q-markup-table flat dense separator="none" class="text-white"
            :style="`background-color: ${this.orderStatus.orderStatus.color}`">
            <tbody>
              <tr>
                <td class="text-center">
                  <div class="text-h6">
                    {{ $t(`order.statuses.${orderStatus.orderStatus.status}`) }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="text-center text-bold">
                  <div class="row q-gutter-xs items-center justify-center">
                    <q-btn v-if="orderStatus.orderStatus.realStatus == 'canceled'" color="positive"
                      label="Revalidar Cotação" @click="remakeQuote" :loading="isUpdating" />
                    <q-btn v-if="
                      orderStatus.orderStatus.status == 'waiting retrieve'
                    " color="positive" label="Coleta realizada" @click="addRetrieve" :loading="isUpdating" />
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

        </div>
        <div v-if="hasRural(other_informations) == true" class="row warning  q-pa-sm q-col-gutter-sm">
          <h6>
            <q-icon name="agriculture" size="30px" /> {{ $t(`order.warning.rural`) }}
          </h6>
        </div>
      </div>

      <div v-if="orderStatus !== null" class="row" key="order_tabs">
        <div class="col-12">
          <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab" class="bg-white text-primary">
            <q-tab name="resumo" label="Resumo" />
            <q-tab name="quotation" label="Cotação" />
            <q-tab name="notafiscal" label="Nota Fiscal" />
            <q-tab name="invoice" label="Fatura" />
            <!--<q-tab name="tasks" label="Ocorrências" />-->
            <q-tab name="tracking" label="Rastreamento" />
            <q-tab name="tag" label="Etiqueta" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="resumo" class="q-pa-none">
              <ClientOrderDetailsummary @quote-details="setQuoteDetails" :orderId="orderId" />
            </q-tab-panel>

            <q-tab-panel name="quotation" class="q-pa-none">
              <ClientOrderDetailQuotation :orderId="orderId" @finished="onCheckoutFinished" />
            </q-tab-panel>

            <q-tab-panel name="notafiscal" class="q-pa-none">
              <ClientOrderDetailNotaFiscal :orderId="orderId" @fileUploaded="onInvoiceTaxUploaded" />
            </q-tab-panel>
            <q-tab-panel name="invoice" class="q-pa-none">
              <ClientOrderDetailInvoice :orderId="orderId" />
            </q-tab-panel>
            <!--
            <q-tab-panel name="tasks" class="q-pa-none">
              <OrderTasks :orderId="orderId" :client="client" />
            </q-tab-panel>
            -->
            <q-tab-panel name="tracking" class="q-pa-none">
              <ClientOrderDetailTracking :orderId="orderId" />
            </q-tab-panel>
            <q-tab-panel name="tag" class="q-pa-none">
              <OrderDetailTag :total_packages="total_packages" :orderId="orderId" :orderStatus="orderStatus" />
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
import { mapActions, mapGetters } from "vuex";
import ClientOrderDetailsummary from "./details/ClientOrderDetailSummary";
import ClientOrderDetailQuotation from "./details/ClientOrderDetailQuotation";
import ClientOrderDetailNotaFiscal from "./details/ClientOrderDetailNotaFiscal";
import ClientOrderDetailInvoice from "./details/ClientOrderDetailInvoice";
import ClientOrderDetailTracking from "./details/ClientOrderTracking";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";
import OrderTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/client/TasksSearchingAll";
import OrderDetailTag from "../sales/details/OrderDetailTag";

export default {
  components: {
    ClientOrderDetailsummary,
    ClientOrderDetailQuotation,
    ClientOrderDetailNotaFiscal,
    ClientOrderDetailInvoice,
    ClientOrderDetailTracking,
    OrderTasks,
    OrderDetailTag,
  },

  created() {
    if (this.$route.params.id)
      this.orderId = decodeURIComponent(this.$route.params.id);

    if (this.myCompany !== null && this.orderId !== null) {
      this.requestOrderStatus(this.orderId);
    }
  },

  data() {
    return {
      other_informations: [],
      total_packages: null,
      client: null,
      currentTab: "resumo",
      orderId: null,
      orderStatus: null,
      deliveryDueDate: null,
      notFound: false,
      isLoading: false,
      isUpdating: false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
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
      getStatus: "purchasingOrder/getDetailStatus",
      updateStatus: "purchasingOrder/updateStatus",
    }),

    hasRural(other_informations) {
      let has = false;
      if (
        other_informations &&
        other_informations.rural
      ) {
        has = true;
      }
      return has;
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
          this.requestOrderStatus(this.orderId);
        })
        .catch((error) => {
          this.$q.notify({
            message: "O status do pedido não pode ser atualizado",
            position: "bottom",
            type: "negative",
          });
        })
        .finally((data) => {
          this.isUpdating = false;
        });
    },
    setQuoteDetails(quoteDetails) {
      this.quoteDetails = quoteDetails;
    },
    remakeQuote() {
      this.isUpdating = true;
      this.quote({
        values: this.quoteDetails,
      })
        .then((response) => {
          this.$router.push({
            name: "ClientOrderDetails",
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

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    requestOrderStatus(orderId) {
      if (this.isLoading) return;

      let params = {};

      params["myCompany"] = this.myCompany.id;

      this.isLoading = true;

      this.getStatus({ orderId, params })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.orderStatus = data;
            this.deliveryDueDate = data.deliveryDueDate;
            this.notFound = false;
            this.total_packages = data.total_packages;
            this.other_informations = data.other_informations;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.orderStatus = null;
          this.deliveryDueDate = null;
          this.notFound = true;
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
  margin-left: 8px;
  border-radius: 3px;
}

.warning h6 {
  padding: 10px !important;
  margin: 0 auto !important;
}
</style>
