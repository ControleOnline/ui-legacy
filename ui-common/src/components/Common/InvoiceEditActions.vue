<template>
  <div class="row q-gutter-xs items-center justify-end q-mt-sm">
    <q-btn
      flat
      color="primary"
      label="Reenviar Fatura"
      @click="sendInvoice"
      :loading="isSaving"
    />
  </div>
</template>

<script>
import { api } from "app/modules/controleonline/ui-common/src/api";
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
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    sendInvoice() {
      if (this.isSaving) return;

      this.isSaving = true;

      let options = {
        method: "PUT",
        body: ({ notified: false }),
        params: {
          myCompany: this.myCompany.id,
        },
      };

      return api
        .fetch(`${this.invoice["@id"]}/update-notified`, options)

        .then((invoice) => {
          if (invoice !== null) {
            this.$q.notify({
              message: "A solicitação foi enviada com sucesso",
              position: "bottom",
              type: "positive",
            });

            this.$emit("ready", invoice);
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
  },
};
</script>
