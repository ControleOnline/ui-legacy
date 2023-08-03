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
      <div v-if="invoice !== null" class="row q-pa-sm q-col-gutter-sm" key="status">
        <div class="col-xs-12">
          <div class="text-h5 q-pt-sm q-pb-sm">{{ this.provider.name }}</div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <q-markup-table flat dense separator="none" class="bg-grey-4 full-height">
            <tbody>
              <tr>
                <td class="text-left text-bold">Número da fatura</td>
                <td class="text-left">
                  {{
                    `#${this.invoice["@id"].match(/^\/finance\/pay\/([a-z0-9-]*)$/)[1]}`
                  }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Valor da fatura</td>
                <td class="text-left">
                  {{ formatMoney(this.invoice.price) }}
                </td>
              </tr>
              <tr>
                <td class="text-left text-bold">Vencimento</td>
                <td class="text-left">
                  {{ this.invoice.dueDate }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
          <div
            class="row items-center justify-center full-height rounded-borders"
            :style="`background-color: ${this.invoice.status.color}`"
          >
            <div class="text-white text-h6">
              {{ $t(`invoice.statuses.${invoice.status.status}`) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="invoice !== null" class="row" key="order_tabs">
        <div class="col-12">
          <q-tabs
            :horizontal="$q.screen.gt.xs"
            align="justify"
            v-model="currentTab"
            class="bg-white text-primary"
          >
            <q-tab name="details" label="Detalhes" />
            <q-tab name="orders" label="Despesa" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="details" class="q-pa-none">
              <InvoiceDetail
                :id="invoiceId"
                @deleted="$router.push({ name: 'Admin.InvoicePay.Index' })"
                @updated="requestInvoice(invoiceId)"
              />
            </q-tab-panel>
            <q-tab-panel name="orders" class="q-pa-none">
              <InvoiceOrders :invoiceId="invoiceId" />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </transition-group>
    <div
      v-if="invoice === null && notFound"
      class="row items-center justify-center"
      style="min-height: 90vh"
    >
      <q-banner class="text-white bg-red text-center text-h3" rounded>
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        A fatura não foi encontrada
      </q-banner>
    </div>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import InvoiceOrders from "./details/InvoiceOrders";

import InvoiceDetail from "./details/InvoiceDetail";

import {
formatDateYmdTodmY,
formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

export default {
  components: {
    InvoiceDetail,
    InvoiceOrders,
  },

  created() {
    if (this.$route.params.id) this.invoiceId = decodeURIComponent(this.$route.params.id);

    if (this.myCompany !== null && this.invoiceId !== null) {
      this.requestInvoice(this.invoiceId);
    }
  },

  data() {
    return {
      currentTab: "details",
      invoiceId: null,
      orderId: null,
      invoice: null,
      isLoading: false,
      notFound: false,
      provider: {
        name: "",
      },
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
        this.requestInvoice(this.invoiceId);
      }
    },
  },

  methods: {
    ...mapActions({
      getInvoice: "payInvoice/getInvoice",
    }),

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },

    requestInvoice(invoiceId) {
      let params = {};

      params["myCompany"] = this.myCompany.id;

      this.isLoading = true;

      this.getInvoice({ invoiceId, params })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.invoice = data;
            this.notFound = false;

            // format date

            if (this.invoice.dueDate)
              this.invoice.dueDate = formatDateYmdTodmY(this.invoice.dueDate);

            // set order

            if (this.invoice.order.length > 0) {
              this.orderId = this.invoice.order[0].order["@id"].replace(/[^0-9]/g, "");
              this.provider.name = `${this.invoice.order[0].order.provider.name} ${this.invoice.order[0].order.provider.alias}`;
            }
          }
        })
        .catch((error) => {
          this.provider.name = "";
          this.isLoading = false;
          this.invoice = null;
          this.notFound = true;
        });
    },
  },
};
</script>
