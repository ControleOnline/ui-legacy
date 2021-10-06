<template>
  <q-card class="text-white" style="background-color: #00519b">
    <q-card-section>
      <div class="text-h6 text-center">Taxas</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tax, index) in quoteTaxes" :key="index">
            <td class="text-left">
              {{ tax.name }}
            </td>
            <td class="text-right">
              {{ formatMoney(tax.total) }}
            </td>
          </tr>
        </tbody>        
      </q-markup-table>
    </q-card-section>

    <q-card-section>
      <q-separator />
      <div class="text-subtitle2 q-mt-sm q-mb-sm text-center">
        Taxas opcionais
      </div>
      <q-select
        outlined
        filled
        stack-label
        v-model="newTax"
        label="Taxa"
        @input="onSelect"
        :options="deliveryTaxes"
        :loading="isloadingTaxes"
      >
      </q-select>
      <q-input
        lazy-rules
        stack-label
        reverse-fill-mask
        prefix="R$"
        v-model="taxValue"
        type="text"
        label="Valor"
        mask="#,##"
        fill-mask="0"
        placeholder="Digite um valor"
        :loading="isloadingTaxes"
      />
      <div class="row q-mt-sm justify-end">
        <q-btn
          color="primary"
          label="Adicionar"
          :loading="isSaving"
          @click="addnewTax"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { fetch } from "../../../../../../src/boot/myapi";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";

export default {
  props: {
    quote: {
      type: Object,
      required: true,
      default: () => {
        return {
          id: null,
          taxes: [],
        };
      },
    },
  },

  created() {
    this.loadDeliveryTaxes();
  },

  data() {
    return {
      isSaving: false,
      taxValue: 0,
      quoteTaxes: this.quote.taxes,
      isloadingTaxes: false,
      deliveryTaxes: [],
      newTax: null,
    };
  },

  methods: {
    onSelect(item) {      
        this.taxValue = this.newTax.price;
    },
    addnewTax() {
      if (!this.newTax) {
        this.$emit("error", { message: "A taxa não foi selecionada" });
        return;
      }

      this.isSaving = true;

      this.createQuoteTax({
        id: this.newTax.value,
        value: this.taxValue.replace(',', '.') ,
      })
        .then((quotation) => {
          if (quotation["@id"]) {
            this.quoteTaxes.push({
              name: this.newTax.label,
              total: this.taxValue.replace(',', '.') ,
            });

            this.$emit("added", {
              id: this.quote.id,
              tax: {
                id: this.newTax.value,
                name: this.newTax.label,
                price: this.taxValue.replace(',', '.') ,
              },
            });
          }
        })
        .catch((error) => {
          this.$emit("error", error);
        })
        .finally(() => {
          this.isSaving = false;
          this.newTax = null;
        });
    },

    loadDeliveryTaxes() {
      if (this.isloadingTaxes) return;

      this.isloadingTaxes = true;

      this.getDeliveryTaxes()
        .then((taxes) => {
          if (taxes) {
            taxes.forEach((element) => {
              this.deliveryTaxes.push({
                label: element.name,
                value: element.id,
                price: element.value,
              });
            });
          }
        })
        .finally(() => {
          this.isloadingTaxes = false;
        });
    },

    getDeliveryTaxes() {
      return fetch(`/quotations/${this.quote.id}/optional-taxes`)
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw Error(data.response.error);

            return data.response.data !== null ? data.response.data : null;
          }

          return null;
        });
    },

    createQuoteTax(tax) {
      let options = {
        method: "PUT",
        body: JSON.stringify({
          id: tax.id,
          value: tax.value,
        }),
      };

      return fetch(`/quotations/${this.quote.id}/add-deliverytax`, options)
        .then((response) => response.json())
        .then((quotation) => {
          return quotation;
        })
        .catch((e) => {
          if (e instanceof SubmissionError) {
            throw Error(e.errors._error);
            return;
          }

          throw Error(e.message);
        });
    },

    formatMoney(value) {
      let format = new Intl.NumberFormat(this.$i18n.locale, {
        style: "currency",
        currency: "BRL",
      });

      return value;
      /*
       * @todo Arrumar a formatação.
       */
      //format.format(value);
    },
  },
};
</script>
