<template>
  <q-form @submit="onSubmit">
    <div class="row items-center q-mb-md">
      <div class="text-h6">
        {{ item.id === null ? $t('Novo fornecedor') : $t('Edição fornecedor') }}
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 q-mb-md">
        <div class="row justify-center">
          <q-btn-toggle no-caps
            v-model     ="item.type"
            toggle-color="primary"
            :options    ="[
              { label: 'Pessoa Jurídica', value: 'J' },
              { label: 'Pessoa Física'  , value: 'F' },
            ]"
          />
        </div>
      </div>
      <div class="col-xs-12">
        <q-input stack-label lazy-rules unmasked-value
          v-model="item.document"
          type   ="text"
          :label ="item.type == 'J' ? $t('CNPJ') : $t('CPF')"
          :mask  ="item.type == 'J' ? '##.###.###/####-##' : '###.###.###-##'"
        />
      </div>
      <div class="col-xs-12">
        <q-input stack-label lazy-rules
          v-model="item.name"
          type   ="text"
          class  ="q-mb-sm"
          :label ="item.type == 'J' ? $t('Razão social') : $t('Nome')"
          :rules ="[isInvalid('name')]"
        />
      </div>
      <div class="col-xs-12">
        <q-input stack-label lazy-rules
          v-model="item.alias"
          type   ="text"
          class  ="q-mb-sm"
          :label ="item.type == 'J' ? $t('Nome Fantasia') : $t('Sobrenome')"
          :rules ="[isInvalid('alias')]"
        />
      </div>
    </div>
    <div class="row justify-end">
      <q-btn
        :loading="saving"
        icon    ="save"
        type    ="submit"
        :label  ="$t('Salvar')"
        size    ="md"
        color   ="primary"
        class   ="q-mt-md"
      />
    </div>
  </q-form>
</template>

<script>
import { mapGetters } from 'vuex';
import Api            from '@freteclick/quasar-common-ui/src/utils/api';

export default {
  props: {
    id : {
      required: false,
      default : null
    },
    api: {
      type    : Api,
      required: true
    },
  },

  created() {
    if (this.id !== null) {
      this.getItem(this.id)
        .then(item => {
          this.item.name     = item.name;
          this.item.alias    = item.alias;
          this.item.type     = item.peopleType;
          this.item.document = item.document ? item.document.document : '';
        });
    }
  },

  data() {
    return {
      saving: false,
      item  : {
        "id"      : this.id,
        "name"    : null,
        "alias"   : null,
        "type"    : 'J',
        "document": null,
      },
    }
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    // store method
    getItem(id) {
      let params = {
        "myCompany": this.myCompany.id
      };

      return this.api.private(`providers/${id}`, { params })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    },

    // store method
    save(values, params = {}) {
      let options = {
        method : this.id === null ? 'POST' : 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify(values),
        params : params,
      };

      let endpoint = this.id === null ? 'providers' : `providers/${this.id}`;

      return this.api.private(endpoint, options)
        .then(response => response.json())
        .then(data => {
          if (data.response) {
            if (data.response.success === true) {
              this.$q.notify({
                message : this.$t('Dados salvos com sucesso!'),
                position: 'bottom',
                type    : 'positive',
              });

              return data.response.data;
            }
          }

          return null;
        })
        .catch(error => {
          this.$q.notify({
            message : this.$t(error.message),
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    onSubmit() {
      this.saving = true;

      this.save(
        {
          "name"      : this.item.name,
        	"alias"     : this.item.alias,
        	"peopleType": this.item.type,
        	"document"  : this.item.document,
        },
        {
          "myCompany"  : this.myCompany.id
        }
      )
      .finally(() => {
        this.saving = false;
      });
    },

    isInvalid(field) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('Este campo é obrigatório');

        return true;
      };
    },
  },
};
</script>
