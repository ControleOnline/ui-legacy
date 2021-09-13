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
      <div class="col-xs-12 col-sm-4">
        <q-markup-table flat dense
          separator="none"
          class    ="bg-grey-4"
        >
          <tbody>
            <tr>
              <td class="text-left text-bold">Número do pedido</td>
              <td class="text-left">
                {{ `#${this.orderStatus['@id'].match(/^\/purchasing\/orders\/([a-z0-9-]*)$/)[1]}` }}
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
          :style   ="`background-color: ${this.orderStatus.orderStatus.color}`"
        >
          <tbody>
            <tr>
              <td class="text-center">
                <div class="text-h6">{{ $t(`order.statuses.${orderStatus.orderStatus.status}`) }}</div>
              </td>
            </tr>
            <tr>
              <td class="text-center text-bold">
                <div class="row q-gutter-xs items-center justify-center">
                <q-btn v-if="orderStatus.orderStatus.status == 'waiting retrieve'"
                    color   ="positive"
                    label   ="Coleta realizada"
                    @click  ="addRetrieve"
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
import OrderDetailSummary         from './details/OrderDetailSummary.vue';
import OrderDetailQuotation       from './details/OrderDetailQuotation.vue';
import OrderDetailNotaFiscal      from './details/OrderDetailNotaFiscal.vue';
import OrderDetailInvoice         from './details/OrderDetailInvoice.vue';
import OrderDetailTracking        from './details/OrderTracking.vue';
import { formatMoney }            from '@controleonline/quasar-common-ui/src/@controleonline/quasar-common-ui/src/utils/formatter';

export default {
  components: {
    OrderDetailSummary   ,
    OrderDetailQuotation ,
    OrderDetailNotaFiscal,
    OrderDetailInvoice   ,
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
      notFound       : false,
      isLoading      : false,
      isUpdating     : false,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
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
      getStatus: 'purchasingOrder/getDetailStatus',
      updateStatus: 'purchasingOrder/updateStatus',
    }),
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

    formatMoney(value) {
      return formatMoney(value, 'BRL', 'pt-br');
    },

    requestOrderStatus(orderId) {
      if (this.isLoading)
        return;

      let params = {};

      params['myCompany'] = this.myCompany.id;

      this.isLoading = true;

      this.getStatus({ orderId, params })
        .then(data => {
          this.isLoading = false;

          if (data['@id']) {
            this.orderStatus     = data;
            this.deliveryDueDate = data.deliveryDueDate;
            this.notFound        = false;
          }
        })
        .catch(error => {
          this.isLoading       = false;
          this.orderStatus     = null;
          this.deliveryDueDate = null;
          this.notFound        = true;
        });
    },
  },
};
</script>
