<template>

  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12">
        <q-input stack-label lazy-rules
          v-model    ="item.name"
          type       ="text"
          class      ="q-mb-sm"
          label      ="Nome"
          placeholder="Digite a nome *"
          :rules     ="[isInvalid('name')]"
          :outlined  ="true"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-select stack-label lazy-rules
          v-model  ="item.status"
          class    ="q-mb-sm"
          label    ="Status *"
          :options ="statusArray"
          :rules   ="[isInvalid('status')]"
          :outlined="true"
        >
          <template v-slot:no-option>
              <q-item>
                  <q-item-section class="text-grey">
                  Sem resultados
                  </q-item-section>
              </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label
          v-model  ="item.dueDate"
          label    ="Data de Vencimento"
          mask     ="##/##/####"
          :outlined="true"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                <q-date
                  v-model ="item.dueDate"
                  mask    ="DD/MM/YYYY"
                  @input  ="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
            <q-btn round flat v-if="item.dueDate !== ''" @click="removeDueDateClick()">
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input outlined stack-label
          v-model    ="searchTaskFor"
          type       ="text"
          label      ="Definir para * "
          :loading   ="isSearchingTaskFor"
          debounce   ="700"
          placeholder="Digite um e-mail ou documento..."
          class      ="q-mb-sm"
          :readonly  ="taskForSelected !== '' || isSearchingTaskFor"
          :rules     ="[isInvalid('taskFor')]"
        >
          <template v-slot:append>
            <q-btn round flat v-if="taskForSelected !== ''" @click="removeTaskForClick()">
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input outlined stack-label
          v-model    ="searchClient"
          type       ="text"
          label      ="Definir cliente *"
          :loading   ="isSearchingClient"
          debounce   ="700"
          placeholder="Digite um e-mail ou documento..."
          class      ="q-mb-sm"
          :readonly  ="clientSelected !== '' || isSearchingClient"
          :rules     ="[isInvalid('client')]"
        >
          <template v-slot:append>
            <q-btn round flat v-if="clientSelected !== ''" @click="removeClientClick()">
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input outlined stack-label
          v-model    ="searchContract"
          type       ="text"
          label      ="Definir contrato"
          :loading   ="isSearchingContract"
          debounce   ="700"
          placeholder="Digite o id do contrato"
          class      ="q-mb-sm"
          :readonly  ="contractSelected !== '' || isSearchingContract"
        >
          <template v-slot:append>
            <q-btn round flat v-if="contractSelected !== ''" @click="removeTaskForClick()">
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input outlined stack-label
          v-model    ="searchOrder"
          type       ="text"
          label      ="Definir Pedido"
          :loading   ="isSearchingOrder"
          debounce   ="700"
          placeholder="Digite o id do pedido"
          class      ="q-mb-sm"
          :readonly  ="orderSelected !== '' || isSearchingOrder"
        >
          <template v-slot:append>
            <q-btn round flat v-if="orderSelected !== ''" @click="removeOrderClick()">
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12">
        <q-input stack-label lazy-rules
          v-model    ="item.description"
          type       ="textarea"
          class      ="q-mb-sm"
          label      ="Descrição"
          placeholder="Digite a descrição"
          :outlined  ="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         label    ="Salvar"
         :loading ="isSaving"
      />
    </div>

  </q-form>
</template>

<script>
import Api            from '@freteclick/quasar-common-ui/src/utils/api';
import { mapGetters } from 'vuex';

export default {
  props: {
    api: {
      type    : Api,
      required: true
    },
    statuses: {
      type    : Array,
      required: true
    }
  },

  data() {
    return {
      searchTaskFor      : '',
      timeSearch         : '',
      taskForSelected    : '',
      isSearchingTaskFor : false,
      searchClient       : '',
      clientSelected     : '',
      isSearchingClient  : false,
      searchContract     : '',
      contractSelected   : '',
      isSearchingContract: false,
      searchOrder        : '',
      orderSelected      : '',
      isSearchingOrder   : false,
      item: {
        id         : null,
        name       : null,
        description: null,
        dueDate    : '',
        taskFor    : null,
        client     : null,
        taskStatus : null,
        contract   : null,
        order      : null
      },
      isSaving          : false,
      statusArray       : []
    };
  },

  computed: {
    ...mapGetters({
      user      : 'auth/user',
      myCompany : 'people/currentCompany',
    }),
  },

  created() {
    if (this.statuses) {
        var itens = Object.assign([], this.statuses);

        itens.splice(0, 1);

        this.statusArray = itens;
    }
  },

  watch: {
    statuses: function (statuses) {
      if (statuses) {
        var itens = Object.assign([], statuses);

        itens.splice(0, 1);

        this.statusArray = itens;
      }
    },
    searchTaskFor: function (search) {
      if (this.taskForSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor = false;
          this.isSearchingClient  = false;
          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchPeople.bind(this)(search, 'taskFor')
        ).bind(this), 700);
      }
    },
    searchClient: function (search) {
      if (this.clientSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor = false;
          this.isSearchingClient  = false;
          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchPeople.bind(this)(search, 'client')
        ).bind(this), 700);
      }
    }
  },

  methods: {
    removeDueDateClick() {
      this.item.dueDate = '';
    },
    
    removeTaskForClick() {
      this.taskForSelected = '';
      this.searchTaskFor   = '';
    },
    
    removeClientClick() {
      this.clientSelected = '';
      this.searchClient   = '';
    },
    
    removeContractClick() {
      this.contractSelected = '';
      this.searchContract   = '';
    },
    
    removeOrderClick() {
      this.orderSelected = '';
      this.searchOrder   = '';
    },

    getPeople(params) {
      return this.api.private('/people/client-company', { params })
        .then(response => response.json())
        .then(result => {
          if (result.response.count == 0) {
            this.$q.notify({
              message : result.response.error,
              position: 'bottom',
              type    : 'negative',
            });
          }

          return {
            members   : result.response.data,
            totalItems: result.response.count
          };
        });
    },

    searchPeople(search, fromField) {
      this.timeSearch = '';

      if (search) {
        switch(fromField) {
          case 'taskFor': 
            this.isSearchingTaskFor = true;
            break;
          case 'client': 
            this.isSearchingClient  = true;
            break;
        }
        
        var query = {};

        if (search.indexOf('@') > 0) {
          query.email = encodeURIComponent(search);
        }
        else { 
          var fixed = search.replace(/[.-\s]+/g, '');
          if (!isNaN(fixed)) {
            query.document = fixed;
          }
          else {
            query.name = encodeURIComponent(search);
          }
        }
        
        this.getPeople(query).then(result => {
          if (result.totalItems) {
            var inputVal = '(' + result.members.id + ') ' + result.members.name;

            switch(fromField) {
              case 'taskFor': 
                this.taskForSelected = result.members;
                this.searchTaskFor   = inputVal;
                break;
              case 'client': 
                this.clientSelected  = result.members;
                this.searchClient    = inputVal;
                break;
            }

          }
          else {
            switch(fromField) {
              case 'taskFor': 
                this.searchTaskFor = '';
                break;
              case 'client': 
                this.searchClient  = '';
                break;
            }
          }
          this.isSearchingTaskFor = false;
          this.isSearchingClient  = false;
        });
      }
    },

    saveProvider(values) {
      let params = {};

      this.$emit('before', params);

      let options = {
        method: 'POST',
        body  : JSON.stringify(values),
        params: params
      };

      options.params.table = "provider";

      return this.api.private('/customers', options)
        .then(response => response.json())
        .then(data => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    onSubmit() {
      this.isSaving = true;

      this.saveProvider(this.getValues())
        .then(data => {
          this.$emit('saved', data);
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    getValues() {
      return {
        "name"    : this.item.name,
        "alias"   : this.item.alias,
        "document": this.item.document,
        "email"   : this.item.email
      };
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

        return true;
      };
    },
  },
};
</script>
