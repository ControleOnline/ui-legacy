<template>
  <div class="q-pa-lg customer-service-edit">
    <div class="row q-mb-md">
      <q-btn no-caps color="grey-2" icon="arrow_back" class="text-grey-9" unelevated label="Voltar" @click="goBack"/>
    </div>
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner
        color="primary"
        size="3em"
      />
    </div>

    <div class="column flex-center q-py-xl text-grey-8" v-else-if="error">
      <div class="text-center q-mb-md">
        <q-icon size="3rem" name="error"/>
      </div>
      Não foi possível carregar a página, tente novamente mais tarde.
    </div>

    <div v-else>
      <div class="row q-mb-lg">
        <h4 class="text-h4 q-mt-none q-mb-none text-weight-medium">Atendimento #ID {{ $route.params.id }}</h4>
        <q-space />
        <div>
          <q-btn label="Salvar" icon="save" no-caps unelevated color="primary" padding="md lg" @click="save" :loading="isSaving" :disable="isSaving"/>
        </div>
      </div>

      <q-form @submit="$emit('confirmNew', formData)" ref="newServiceForm">
        <div class="row q-col-gutter-x-md q-col-gutter-y-sm  q-mb-lg">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.customer" class="bg-transparent" outlined label="Cliente" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.reason" class="bg-transparent"  outlined label="Motivo" :options="reasonOptions" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.status" class="bg-transparent" outlined label="Status" :options="statusOptions" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.origin" class="bg-transparent" outlined label="Origem"  lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.destination" class="bg-transparent" outlined label="Destino" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4">
            <q-select v-model="formData.dropoutReason" class="bg-transparent" outlined label="Motivo da Recusa" :disable="formData.status !== 'Recusado'" :options="dropoutReasonOptions" lazy-rules="ondemand" :rules="[val => !!val || 'Campo de preenchimento obrigatório']"/>
          </div>

        </div>
        <div class="row">
          <h5 class="text-weight-medium q-mt-none q-mb-lg">
            Observações
          </h5>
        </div>
        <div class="row bg-grey-3 rounded-borders q-mb-md" v-for="(observation, index) in formData.observations" :key="index">
          <div class="col q-pa-md">
            {{ observation.text }}
          </div>
          <div class="col-auto q-pa-md">
            {{ formatDateToShow(observation.createdAt) }}
          </div>
        </div>

        <q-form @submit="addObservation" class="row q-col-gutter-x-md">
          <div class="col">
            <q-input v-model.trim="newObservation" type="text" outlined/>
          </div>
          <div class="col-auto">
            <q-btn class="full-height" icon="add" color="primary" :disable="!newObservation"  no-caps unelevated label="Adicionar Observação" type="submit"></q-btn>
          </div>
        </q-form>
      </q-form>
    </div>
  </div>
</template>

<script>
import NewServiceModal from '../components/NewServiceModal.vue';
import { date } from 'quasar';

export default {
  components: {
    NewServiceModal,
  },

  data: () => ({
    loading: false,
    error: false,
    newObservation: '',
    goBackRoute: null,
    formData: {
      id: 1,
      customer: {
          id: 7269,
          name: "Teste",
          register_date: "2022-06-01 19:58:02",
          alias: "Teste",
          enable: true,
          active: true,
          document: "31342452424242",
          email: null,
          phone: null
      },
      origin: {
        id: "ChIJX48DsG31xZQR8qfMVhqfeas",
        description: "Rua Vergueiro Steidel - Aparecida, 11040271, SP, Brasil",
        country: "Brasil",
        state: "SP",
        city: "Santos",
        district: "Aparecida",
        street: "Rua Vergueiro Steidel",
        number: "",
        postal_code: "11040271",
        provider: "viacep"
      },
      destination: {
        id: "ChIJX48DsG31xZQR8qfMVhqfeas",
        description: "Rua Vergueiro Steidel - Aparecida, 11040271, SP, Brasil",
        country: "Brasil",
        state: "SP",
        city: "Santos",
        district: "Aparecida",
        street: "Rua Vergueiro Steidel",
        number: "",
        postal_code: "11040271",
        provider: "viacep"
      },
      status: 'Em andamento',
      createdAt: '2022-06-01 19:58:02',
      reason: 'Compra de veículo',
      dropoutReason: null,
      observations: [
        {
          createdAt: '2022-06-01 19:58:02',
          text: 'Primeira observação',
        }
      ]
    },
    isSaving: false,
    reasonOptions: ['Compra de Veículo', 'Mudança', 'Transferência', 'Outros'],
    statusOptions: ['Em andamento', 'Vendido', 'Recusado'],
    dropoutReasonOptions: ['Fechou com concorrente', 'Não comprou', 'Não deu retorno', 'Prazo de entrega', 'Preço', 'Vendeu o carro', 'Outros']
  }),

  methods: {
		async save() {
			this.isSaving = true;

			// Utilizar o endpoint de save
			await setTimeout(() => {
				console.log('Salvo'); this.isSaving = false
			}, 3000)
	  },

    addObservation() {
      if(!this.newObservation.trim()) return;

      const timestamp = Date.now();
      const createdAt = date.formatDate(timestamp, 'YYYY-MM-DD HH:mm:ss');

      const observation = {
        createdAt,
        text: this.newObservation,
      }

      this.formData.observations.push(observation);

      this.newObservation = '';
    },
    formatDateToShow(dateString) {
      return date.formatDate(date.extractDate(dateString, 'YYYY-MM-DD HH:mm:ss'), 'DD/MM/YYYY HH:mm');
    },

    goBack() {
      if(this.goBackRoute) {
        this.$router.push(this.goBackRoute);
        return
      }

      this.$router.push({ name: 'customerServices' });
    }
  },

	watch: {
	  'formData.status'(value) {
	    if(this.formData.dropoutReason && value !== 'Recusado' ) {
				this.formData.dropoutReason = null;
			}
		}
	},

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if(from.name) {
        vm.goBackRoute = from;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
</style>
