<template>
  <q-card class="text-white bg-color-primary">
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
              {{  formatMoney(tax.total) }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>

    <q-card-section :class="showTaxes == false ? 'hidden' : ''">
      <q-separator />
      <div class="text-subtitle2 q-mt-sm q-mb-sm text-center">Taxas dasdas opcionais</div>
      <q-select
        bg-color="white"
        color="black"
        dense
        outlined
        filled
        stack-label
        v-model="newTax"
        label="Taxa"
        :options="deliveryTaxes"
        :loading="isLoadingTaxes"
        @update:model-value="onSelect"
      >
      </q-select>
      <q-input
        bg-color="white"
        color="black"
        dense
        outlined
        lazy-rules
        stack-label
        reverse-fill-mask
        prefix="R$"
        v-model="taxValue"
        :class="showValues == false ? 'hidden' : ''"
        type="number"
        label="Valor"
        mask="#,##"
        fill-mask="0"
        placeholder="Digite um valor"
        :loading="isLoadingTaxes"
      />

      <q-checkbox
        :class="showValues == false ? 'hidden' : ''"
        v-model="taxProfit"
        label="Adicionar Lucro/Imposto?"
      />

      <div
        :class="
          showValues == false
            ? 'hidden row q-mt-sm justify-end'
            : 'row q-mt-sm justify-end'
        "
      >
        <q-btn
          :class="showValues == false ? 'hidden' : ''"
          color="secondary"
          label="Adicionar"
          :loading="isSaving"
          @click="addnewTax"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/quasar-legacy-ui/quasar-common-ui/src/error/SubmissionError";

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
      taxProfit: false,
      showValues: false,
      showTaxes: false,
      quoteTaxes: this.quote.taxes,
      isLoadingTaxes: false,
      deliveryTaxes: [],
      newTax: null,
    };
  },

  methods: {
    onSelect(item) {
      this.showValues = true;
      this.taxValue = this.newTax.price;
    },
    addnewTax() {
      if (!this.newTax) {
        this.$emit("error", { message: "A taxa não foi selecionada" });
        return;
      }

      let taxVal = parseFloat(this.taxValue ? this.taxValue.toString().replace(",", ".") : 0);

      if (this.newTax.label.toUpperCase() == "DESCONTO") {
        taxVal = parseFloat(taxVal) * -1;
      }
      this.isSaving = true;

      this.createQuoteTax({
        id: this.newTax.value,
        value: taxVal,
        taxProfit: this.taxProfit,
        price: taxVal,
      })
        .then((quotation) => {
          if (quotation["@id"]) {
            this.$emit("added", {
              id: this.quote.id,
              total: quotation.total,
              tax: {
                id: this.newTax.value,
                name: this.newTax.label,
                price: this.newTax.price,
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
      if (this.isLoadingTaxes) return;

      this.isLoadingTaxes = true;

      this.getDeliveryTaxes()
        .then((taxes) => {
          if (taxes) {
            this.showTaxes = true;
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
          this.isLoadingTaxes = false;
        });
    },

    getDeliveryTaxes() {
      return api.fetch(`/quotations/${this.quote.id}/optional-taxes`)
        .then((data) => {
          if (data.response) {
            if (data.response.success === false) throw Error(data.response.error);

            return data.response.data !== null ? data.response.data : null;
          }

          return null;
        });
    },

    createQuoteTax(tax) {
      let options = {
        method: "PUT",
        body: ({
          id: tax.id,
          value: tax.value,
          taxProfit: tax.taxProfit,
          price: tax.price,
        }),
      };

      return api.fetch(`/quotations/${this.quote.id}/add-deliverytax`, options)
        
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
<style scss>
.bg-color-primary{
  background-color: var(--primary);
}
</style>