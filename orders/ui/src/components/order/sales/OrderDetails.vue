<template>
  <q-card style="min-height: 90vh;">
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <transition-group appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >

    <div v-if="orderStatus !== null"
      class="row q-pa-sm q-col-gutter-sm"
      key  ="order_status"
    >
      <div class="col-xs-12">
        <div class="text-h5 q-pt-sm q-pb-sm">
          <q-btn flat dense
            :to   ="{ name: 'ClientsDetails', params: { id: client.id }}"
            :label="client.name"
            class ="full-width"
          />
        </div>
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-markup-table flat dense
          separator="none"
          class    ="bg-grey-4"
        >
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
            <tr v-if="this.mainOrderId">
              <td class="text-left text-bold">
                Valor do fornecedor
                <router-link v-bind:to="'/purchasing/order/id/' + this.mainOrderId">
                  (#{{ this.mainOrderId }})
                </router-link>
              </td>
              <td class="text-left">
                {{ formatMoney(this.mainPrice) }}
              </td>
            </tr>
            <tr v-if="this.mainOrderId">
              <td class="text-left text-bold">
                Valor do ticket
              </td>
              <td class="text-left">
                {{ formatMoney(this.price - this.mainPrice) }}
              </td>
            </tr>
            <tr>
              <td class="text-left text-bold">Previsão de entrega</td>
              <td class="text-left">
                {{ this.deliveryDueDate || '-' }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
      <div class="col-xs-12 col-sm-8">
        <q-markup-table flat dense
          separator="none"
          class    ="text-white"
          :style   ="`background-color: ${this.orderStatus.color}`"
        >
          <tbody>
            <tr>
              <td class="text-center">
                <div class="text-h6">{{ $t(`order.statuses.${orderStatus.status}`) }}</div>
              </td>
            </tr>
            <tr>
              <td class="text-center text-bold">
                <div class="row items-center justify-around">
                  <q-btn v-if="orderStatus.status == 'analysis'"
                    color   ="positive"
                    label   ="Aprovar Pedido"
                    @click  ="approveOrder"
                    :loading="isUpdating"
                  />
                  <q-btn v-if="orderStatus.status == 'waiting retrieve'"
                    color   ="positive"
                    label   ="Coleta realizada"
                    @click  ="addRetrieve"
                    :loading="isUpdating"
                  />
                  <q-btn v-if="orderStatus.status == 'on the way'"
                    color   ="positive"
                    label   ="Entrega realizada"
                    @click  ="addDelivered"
                    :loading="isUpdating"
                  />
                  <q-btn v-if="['open', 'pending'].includes(orderStatus.realStatus)"
                    color   ="negative"
                    label   ="Cancelar Pedido"
                    @click  ="cancelOrder"
                    :loading="isUpdating"
                  />
                  <q-btn v-if="['waiting payment'].includes(orderStatus.status)"
                    color   ="positive"
                    label   ="Liberar Pagamento"
                    @click  ="releasePayment"
                    :loading="isUpdating"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <div v-if="orderStatus !== null"
      class="row"
      key  ="order_tabs"
    >
      <div class="col-12">
        <q-tabs
          :horizontal="$q.screen.gt.xs"
          align      ="justify"
          v-model    ="currentTab"
          class      ="bg-white text-primary"
        >
          <q-tab
            name ="resumo"
            label="Resumo"
          />
          <q-tab
            name ="quotation"
            label="Cotação"
          />
          <q-tab
            name ="notafiscal"
            label="Nota Fiscal"
          />
          <q-tab
            name ="invoice"
            label="Fatura"
          />
          <q-tab v-if="showDacteTab"
            name ="dacte"
            label="DACTE"
          />
          <q-tab
            name ="tracking"
            label="Rastreamento"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="currentTab"
        >
          <q-tab-panel name="resumo"     class="q-pa-none">
            <OrderDetailSummary    :orderId="orderId" />
          </q-tab-panel>

          <q-tab-panel name="quotation"  class="q-pa-none">
            <OrderDetailQuotation
              :orderId ="orderId"
              @finished="onCheckoutFinished"
            />
          </q-tab-panel>

          <q-tab-panel name="notafiscal" class="q-pa-none">
            <OrderDetailNotaFiscal
              :orderId     ="orderId"
              @fileUploaded="onInvoiceTaxUploaded"
            />
          </q-tab-panel>

          <q-tab-panel name="invoice"    class="q-pa-none">
            <OrderDetailInvoice    :orderId="orderId"/>
          </q-tab-panel>

          <q-tab-panel v-if="showDacteTab"
            name ="dacte"
            class="q-pa-none"
          >
            <OrderDetailDACTE
              :orderId     ="orderId"
              @fileUploaded="onDacteUploaded"
            />
          </q-tab-panel>

          <q-tab-panel name="tracking"    class="q-pa-none">
            <OrderDetailTracking   :orderId="orderId"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    </transition-group>

    <div v-if="orderStatus === null && notFound"
      class="row items-center justify-center"
      style="min-height: 90vh;"
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
import { mapActions, mapGetters } from 'vuex';
import OrderDetailSummary         from './details/OrderDetailSummary';
import OrderDetailQuotation       from './details/OrderDetailQuotation';
import OrderDetailNotaFiscal      from './details/OrderDetailNotaFiscal';
import OrderDetailInvoice         from './details/OrderDetailInvoice';
import OrderDetailDACTE           from './details/OrderDetailDACTE';
import OrderDetailTracking        from './details/OrderTracking';
import { formatMoney }            from '../../../utils/formatter';

export default {
  components: {
    OrderDetailSummary   ,
    OrderDetailQuotation ,
    OrderDetailNotaFiscal,
    OrderDetailInvoice   ,
    OrderDetailDACTE     ,
    OrderDetailTracking  ,
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
      currentTab     : 'resumo',
      orderId        : null,
      orderStatus    : null,
      deliveryDueDate: null,
      invoices       : [],
      client     : {
        name: '',
      },
      price          : null,
      mainPrice      : null,
      mainOrderId    : null,
      notFound       : false,
      isLoading      : false,
      isUpdating     : false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),

    showDacteTab() {
      return (this.orderStatus !== null && (this.orderStatus.status == 'waiting retrieve' || this.orderStatus.status == 'retrieved'))
        || this.invoices.find(inv => inv.invoiceType == 57);
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.requestOrderStatus(this.orderId);
      }
    },
  },

  methods: {
    ...mapActions({
      getStatus   : 'salesOrder/getDetailStatus',
      updateStatus: 'salesOrder/updateStatus',
    }),

    releasePayment(){
      let params = {
        'myCompany': this.myCompany.id
      };

      this.isUpdating = true;

      this.updateStatus({
        id    : this.orderId,
        values: {
          "update": "release_payment"
        },
        params: params
      })
        .then (order => {
          this.requestOrderStatus(this.orderId)
            .finally(data => {
              this.isUpdating = false;
            });
        })
        .catch(error => {
          this.$q.notify({
            message : 'O status do pedido não pode ser atualizado',
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    cancelOrder() {
      let params = {
        'myCompany': this.myCompany.id
      };

      this.isUpdating = true;

      this.updateStatus({
        id    : this.orderId,
        values: {
          "update": "cancel_order"
        },
        params: params
      })
        .then (order => {
          this.requestOrderStatus(this.orderId)
            .finally(data => {
              this.isUpdating = false;
            });
        })
        .catch(error => {
          this.$q.notify({
            message : 'O status do pedido não pode ser atualizado',
            position: 'bottom',
            type    : 'negative',
          });
        });
    },
    addDelivered(){
       let params = {
        'myCompany': this.myCompany.id
      };

      this.isUpdating = true;
      this.updateStatus({
        id    : this.orderId,
        values: {
          "update": "add_delivered"
        },
        params: params
      })
        .then (order => {
          this.requestOrderStatus(this.orderId)
            .finally(data => {
              this.isUpdating = false;
            });
        })
        .catch(error => {
          this.$q.notify({
            message : 'O status do pedido não pode ser atualizado',
            position: 'bottom',
            type    : 'negative',
          });
        });
    },
    addRetrieve(){
       let params = {
        'myCompany': this.myCompany.id
      };

      this.isUpdating = true;

      this.updateStatus({
        id    : this.orderId,
        values: {
          "update": "add_retrieve"
        },
        params: params
      })
        .then (order => {
          this.requestOrderStatus(this.orderId)
            .finally(data => {
              this.isUpdating = false;
            });
        })
        .catch(error => {
          this.$q.notify({
            message : 'O status do pedido não pode ser atualizado',
            position: 'bottom',
            type    : 'negative',
          });
        });
    },
    approveOrder() {
      let params = {
        'myCompany': this.myCompany.id
      };

      this.isUpdating = true;

      this.updateStatus({
        id    : this.orderId,
        values: {
          "update": "approve_order"
        },
        params: params
      })
        .then (order => {
          this.requestOrderStatus(this.orderId)
            .finally(data => {
              this.isUpdating = false;
            });
        })
        .catch(error => {
          this.$q.notify({
            message : 'O status do pedido não pode ser atualizado',
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    onCheckoutFinished() {
      this.$q.notify({
        message : `Pedido #${this.orderId} foi salvo com sucesso`,
        position: 'bottom',
        type    : 'positive',
      });

      this.requestOrderStatus(this.orderId);
    },

    onInvoiceTaxUploaded() {
      this.requestOrderStatus(this.orderId);
    },

    onDacteUploaded() {
      this.requestOrderStatus(this.orderId)
        .then(data => {
          // this.currentTab = 'resumo';
        });
    },

    formatMoney(value) {
      return formatMoney(value, 'BRL', 'pt-br');
    },

    requestOrderStatus(orderId) {
      if (this.isLoading)
        return;

      let params = {};

      params['myCompany'] = this.myCompany.id;

      this.isLoading = true;

      return this.getStatus({ orderId, params })
        .then(data => {
          this.isLoading = false;

          if (data['@id']) {
            this.orderStatus     = data.orderStatus;
            this.invoices        = data.invoiceTax;
            this.deliveryDueDate = data.deliveryDueDate;
            this.client.name     = data.client.name;
            this.client.id       = data.client.id;
            this.price           = data.price;
            this.mainPrice       = data.mainPrice;
            this.mainOrderId     = data.mainOrderId;
            this.notFound        = false;
          }

          return data;
        })
        .catch(error => {
          this.isLoading       = false;
          this.orderStatus     = null;
          this.deliveryDueDate = null;
          this.invoices        = [];
          this.client.name     = '';
          this.price           = null;
          this.notFound        = true;
        });
    },
  },
};
</script>