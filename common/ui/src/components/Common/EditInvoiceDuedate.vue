<template>
  <div class="cursor-pointer">
    {{ dueDateValue }}

    <q-btn round flat color="primary" icon="edit" size="xs" :loading="isSaving" />

    <q-popup-edit v-model="dueDateValue" :validate="validateDate" @save="onSave">
      <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
        <q-input
          dense
          outlined
          autofocus
          :value="dueDateValue"
          :rules="[(val) => validate(value) || 'A data não é válida']"
          @input="emitValue"
          mask="##/##/####"
        >
          <template v-slot:after>
            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
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
  </div>
</template>

<script>
import { isDateGreaterThanToday } from "@controleonline/quasar-common-ui/src/utils/mydate";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    invoiceId: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dueDateValue: this.dueDate,
      isSaving: false,
      invoiceType: this.invoiceId.replace(/^\/finance\/([a-z]+)\/\d+$/, "\$1"),
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    ...mapActions({
      receive: "receiveInvoice/updateInvoiceDuedate",
      pay: "payInvoice/updateInvoiceDuedate",
    }),

    onSave(newDate) {
      const dueDate = newDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, "\$3\-\$2\-\$1");

      this.isSaving = true;

      this[this.invoiceType]({
        id: this.invoiceId,
        dueDate: dueDate,
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((invoice) => {
          if (invoice !== null)
            this.$q.notify({
              message: "Os dados foram salvos com sucesso",
              position: "bottom",
              type: "positive",
            });

          this.$emit("saved", invoice);
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    validateDate(val) {
      return isDateGreaterThanToday(val);
    },
  },
};
</script>
