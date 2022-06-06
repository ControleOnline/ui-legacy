<template>
  <q-dialog :value="value" @input="$emit('input', $event)" class="new-serice-modal">
    <q-card class="new-service-modal__box column q-pa-md">
      <q-card-section class="row items-center">
        <div class="text-h6">Novo atendimento</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="col">
        <q-form @submit="$emit('confirmNew', formData)" ref="newServiceForm">
          <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
            <q-select v-model="formData.customer" class="col-12" type="textarea" outlined label="Cliente" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
            <q-select v-model="formData.reason" class="col-12" outlined label="Motivo" :options="reasonOptions" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
            <q-select v-model="formData.status" class="col-12" outlined label="Status" :options="statusOptions" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md q-pt-none">
        <q-btn label="Cancelar" no-caps flat v-close-popup color="primary" class="q-mr-sm"  padding="sm lg"/>
        <q-btn label="Confirmar" no-caps color="primary" unelevated :disabled="!disable" :loading="loadingAction" @click="$refs.newServiceForm.submit()" padding="sm lg"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar';

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    loadingAction: {
      type: Boolean,
      required: false,
    }, 
  },

  emits: ['confirmNew', 'input'],

  data: () => ({
    model: true,
    disable: true,
    formData: {
      customer: '',
      reason: '',
      status: '',
    },
    reasonOptions: ['Compra de Veículo', 'Mudança', 'Transferência', 'Outros'],
    statusOptions: ['Em andamento', 'Vendido', 'Recusado'],
  }),

  methods: {
    formatDate(dateString) {
      return date.formatDate(date.extractDate(dateString, 'DD-MM-YYYY'), 'YYYY-MM-DD');
    },
  }
}
</script>

<style lang="scss" scoped>
.new-service-modal {
  &__box {
    max-height: calc(100vh - 2rem);
    min-width: 600px;
    max-width: calc(100vw - 2rem);
  }
}
</style>