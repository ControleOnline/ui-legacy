<template>
  <div
    class="row q-gutter-xs items-center justify-end q-mt-sm"
  >
    <q-btn flat
      color   ="primary"
      label   ="Reenviar Fatura"
      @click  ="sendInvoice"
      :loading="isSaving"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetch }      from '@controleonline/quasar-common-ui/src/boot/myapi';

export default {
  props: {
    invoice: {
      type    : Object,
      required: true,
    },
  },

  data () {
    return {
      isSaving: false,
    }
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    sendInvoice() {
      if (this.isSaving)
        return;

      this.isSaving = true;

      let options = {
        method: 'PUT',
        body  : JSON.stringify({ notified: false }),
        params: {
          myCompany: this.myCompany.id
        }
      };

      return fetch(`${this.invoice['@id']}/update-notified`, options)
        .then(response => response.json())
        .then(invoice => {
          if (invoice !== null) {
            this.$q.notify({
              message : 'A solicitação foi enviada com sucesso',
              position: 'bottom',
              type    : 'positive',
            });

            this.$emit('ready', invoice);
          }
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
  },
};
</script>
