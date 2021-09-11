<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-end q-mb-md">
        <q-btn
          label ="Cadastrar"
          icon  ="add"
          size  ="md"
          color ="primary"
          class ="q-ml-sm"
          @click="dialog = !dialog"
        />
      </div>
    </div>

    <div class="col-12">
      <PageSearchProviders
        ref    ="searchPageRef"
        :config="{
          endpoint: config.endpoint,
          token   : config.token
        }"
        :fetchs="fetchs"
      />
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Cadastro de fornecedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <FormCreateProviders
            ref    ="myForm"
            :api   ="api"
            @before="(params) => {
              if (this.fetchs.createClient) {
                this.fetchs.createClient
                  .before(params);
              }
            }"
            @saved ="(data) => {
              this.$q.notify({
                message : 'Os dados foram salvos com sucesso',
                position: 'bottom',
                type    : 'positive',
              });

              if (this.events.onSaved) {
                this.events.onSaved(data);
              }
            }"
            @error ="(error) => {
              this.$q.notify({
                message : error.message,
                position: 'bottom',
                type    : 'warning',
              });
            }"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Api                 from '@controleonline/quasar-common-ui/src/utils/api';
import FormCreateProviders from '../../components/FormCreateProviders.vue';
import PageSearchProviders from '../PageSearchProviders/Index.vue';

export default {
  props: {
    config: {
      type    : Object,
      required: true
    },
    fetchs: {
      type    : Object,
      required: false
    },
    events: {
      type    : Object,
      required: false,
      default : {}
    },
  },

  components: {
    FormCreateProviders,
    PageSearchProviders,
  },

  created() {
    this.api = new Api(
      this.config.token
    );
  },

  data () {
    return {
      dialog: false,
      api   : null,
    }
  },

  methods: {
    loadClientsDataRows() {
      this.$refs.searchPageRef.loadCurrentTabRows();
    },
  },
}
</script>