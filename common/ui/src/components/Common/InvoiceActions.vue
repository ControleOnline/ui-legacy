<template>
  <div class="row q-gutter-xs items-center justify-center">
    <q-btn
      v-if="invoice.status.status !== 'canceled'"
      color="negative"
      label="Cancelar"
      @click="changeStatus('canceled')"
      :loading="isSaving"
    />

    <q-btn
      v-if="invoice.status.status === 'canceled'"
      color="primary"
      label="Reativar"
      @click="changeStatus('open')"
      :loading="isSaving"
    />

    <q-btn
      v-if="invoice.status.status === 'open'"
      color="primary"
      label="Fechar"
      @click="changeStatus('waiting payment')"
      :loading="isSaving"
    />

    <q-btn
      v-if="['waiting payment', 'outdated billing'].includes(invoice.status.status)"
      color="positive"
      label="Marcar como paga"
      @click="changeStatus('paid')"
      :loading="isSaving"
    />
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import { mapGetters } from "vuex";

export default {
  props: {
    invoice: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isSaving: false,
      newStatus: null,
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    newStatus(status) {
      if (!status) return;

      this.save();
    },
  },

  methods: {
    changeStatus(newStatus) {
      if (window.confirm("Realmente deseja mudar o status da fatura?")) {
        this.newStatus = newStatus;
      }
    },

    save() {
      this.isSaving = true;

      this.updateStatus({
        id: this.invoice["@id"],
        status: this.newStatus,
      })
        .then((invoice) => {
          if (invoice !== null) {
            this.$q.notify({
              message: "Os dados foram salvos com sucesso",
              position: "bottom",
              type: "positive",
            });

            this.$emit("changed", invoice);
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    updateStatus(params) {
      let options = {
        method: "PUT",
        body: ({ status: params.status }),
        params: {
          myCompany: this.myCompany.id,
        },
      };

      return api.fetch(`${params.id}/update-status`, options).then((invoice) => {
        return invoice;
      });
    },
  },
};
</script>
