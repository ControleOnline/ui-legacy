<template>
  <q-card style="min-height: 90vh">
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="receipt" color="primary" text-color="white" />
          <span class="q-ml-sm">Deseja gerar um novo número de fatura?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Alterar"
            color="primary"
            @click="renew(invoice)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        v-if="invoice !== null"
        class="row q-pa-sm q-col-gutter-sm"
        key="invoice_status"
      >
        <div class="col-xs-12">
          <div class="text-h5 q-pt-sm q-pb-sm">{{ this.client.name }}</div>
        </div>

        <div class="col-xs-12 col-sm-5">
          <div class="row">
            <div class="col-xs-12">
              <q-markup-table
                flat
                dense
                square
                separator="none"
                class="bg-grey-4"
              >
                <tbody>
                  <tr>
                    <td class="text-left text-bold">Número da fatura</td>
                    <td class="text-left">
                      {{
                        `#${
                          this.invoice["@id"].match(
                            /^\/finance\/receive\/([a-z0-9-]*)$/
                          )[1]
                        }`
                      }}

                      <q-btn
                        flat
                        round
                        dense
                        color="positive"
                        icon="autorenew"
                        @click="confirm = true"
                      />
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
                      <EditInvoiceDuedate
                        v-if="editDueDate"
                        :dueDate="invoice.dueDate"
                        :invoiceId="invoice['@id'] || ''"
                        @saved="(data) => (invoice = data)"
                      />
                      <div v-else>
                        {{ invoice.dueDate }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="col-xs-12">
              <InvoiceEditActions
                :invoice="invoice"
                @ready="(invoice) => (invoice = invoice)"
              />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-7">
          <div
            class="row text-white full-height items-center justify-center"
            :style="`background-color: ${this.invoice.invoiceStatus.color}`"
          >
            <div class="col-xs-12 text-h6 text-center">
              {{ $t(`invoice.statuses.${invoice.invoiceStatus.status}`) }}
            </div>
            <InvoiceActions
              :invoice="invoice"
              @changed="
                (newInvoice) => {
                  this.invoice = newInvoice;
                  this.$refs.invoiceBillet.refresh();
                }
              "
            />
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
            <q-tab name="invoice" label="Boleto" />
            <q-tab name="orders" label="Pedidos" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="currentTab">
            <q-tab-panel name="invoice" class="q-pa-none">
              <InvoiceInvoice
                ref="invoiceBillet"
                :invoiceId="invoiceId"
                :orderId="orderId"
                @billetStatus="
                  (status) => {
                    this.editDueDate = status.hasBillet === false;
                  }
                "
              />
            </q-tab-panel>

            <q-tab-panel name="orders" class="q-pa-none">
              <InvoiceOrders
                :invoiceId="invoiceId"
                :invoice="{
                  '@id': invoice ? invoice['@id'] : null,
                  status: invoice ? invoice.invoiceStatus.realStatus : null,
                  billet: editDueDate ? false : true,
                }"
              />
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
import InvoiceInvoice from "./details/InvoiceInvoice";
import InvoiceOrders from "./details/InvoiceOrders";
import {
  formatMoney,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import EditInvoiceDuedate from "@controleonline/quasar-common-ui/src/components/common/EditInvoiceDuedate.vue";
import InvoiceActions from "@controleonline/quasar-common-ui/src/components/common/InvoiceActions.vue";
import InvoiceEditActions from "@controleonline/quasar-common-ui/src/components/common/InvoiceEditActions.vue";

export default {
  components: {
    InvoiceInvoice,
    InvoiceOrders,
    EditInvoiceDuedate,
    InvoiceActions,
    InvoiceEditActions,
  },

  created() {
    if (this.$route.params.id)
      this.invoiceId = decodeURIComponent(this.$route.params.id);

    if (this.myCompany !== null && this.invoiceId !== null) {
      this.requestInvoice(this.invoiceId);
    }
  },

  data() {
    return {
      confirm: false,
      currentTab: "invoice",
      invoiceId: null,
      orderId: null,
      invoice: null,
      isLoading: false,
      editDueDate: false,
      notFound: false,
      client: {
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
      getInvoice: "receiveInvoice/getInvoice",
      renewInvoice: "receiveInvoice/renewInvoice",
    }),

    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },
    renew(invoice) {
      let invoiceId = invoice["@id"].replace(/\D/g, "");

      if (this.isLoading) return;

      let params = {};
      this.isLoading = true;

      this.renewInvoice({ invoiceId, params })
        .then((data) => {
          this.isLoading = false;

          if (data["@id"]) {
            this.invoice = data;
            this.notFound = false;

            // format date
            if (this.invoice.dueDate) {
              this.invoice.dueDate = formatDateYmdTodmY(this.invoice.dueDate);
            }

            // set order
            if (this.invoice.order.length > 0) {
              this.orderId = this.invoice.order[0].order["@id"].replace(
                /[^0-9]/g,
                ""
              );
              this.client.name = this.invoice.order[0].order.client.name;
            }
          }
        })
        .catch((error) => {
          this.client.name = "";
          this.isLoading = false;
          this.invoice = null;
          this.notFound = true;
        });
    },
    requestInvoice(invoiceId) {
      if (this.isLoading) return;

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
            if (this.invoice.dueDate) {
              this.invoice.dueDate = formatDateYmdTodmY(this.invoice.dueDate);
            }

            // set order
            if (this.invoice.order.length > 0) {
              this.orderId = this.invoice.order[0].order["@id"].replace(
                /[^0-9]/g,
                ""
              );
              this.client.name = this.invoice.order[0].order.client.name;
            }
          }
        })
        .catch((error) => {
          this.client.name = "";
          this.isLoading = false;
          this.invoice = null;
          this.notFound = true;
        });
    },
  },
};
</script>