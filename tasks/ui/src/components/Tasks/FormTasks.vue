<template>

  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules
          v-model    ="item.name"
          type       ="text"
          class      ="q-mb-sm"
          label      ="Nome *"
          placeholder="Digite o nome"
          :rules     ="[isInvalid('name')]"
          :outlined  ="true"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-select stack-label lazy-rules
          v-model  ="item.taskCategory"
          class    ="q-mb-sm"
          label    ="Categoria *"
          :options ="categoryArray"
          :rules   ="[isInvalid('category')]"
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
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-select stack-label lazy-rules
          v-model  ="item.taskStatus"
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
            <q-btn round flat v-if="contractSelected !== ''" @click="removeContractClick()">
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
import Api                   from '@freteclick/quasar-common-ui/src/utils/api';
import { formatDateYmdTodmY }from '@freteclick/quasar-common-ui/src/utils/formatter';
import { mapGetters }        from 'vuex';

export default {
  props: {
    api: {
      type    : Api,
      required: true
    },
    statuses: {
      type    : Array,
      required: true
    },
    categories: {
      type    : Array,
      required: true
    },
    taskId: {
      type    : Number,
      required: false
    },
    taskData: {
      type    : Object,
      required: false
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
        id          : null,
        name        : null,
        description : null,
        dueDate     : '',
        taskFor     : null,
        client      : null,
        taskStatus  : null,
        taskCategory: null,
        contract    : null,
        order       : null
      },
      isSaving     : false,
      statusArray  : [],
      categoryArray: []
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
    
    if (this.categories) {
        var itens = Object.assign([], this.categories);

        this.categoryArray = itens;
    }

    if (this.taskData) {
      this.item.id          = this.taskId;
      this.item.name        = this.taskData.name;
      this.item.description = this.taskData.description;
      
      if (this.taskData.dueDate) {
        this.item.dueDate = formatDateYmdTodmY(this.taskData.dueDate);
      }
      
      var taskForVal       = '(#' + this.taskData.taskFor.id + ') ' + this.taskData.taskFor.name;
      this.searchTaskFor   = taskForVal;
      this.taskForSelected = this.taskData.taskFor;
      this.item.taskFor    = this.taskData.taskFor.id;
      
      var clientVal       = '(#' + this.taskData.client.id + ') ' + this.taskData.client.name;
      this.searchClient   = clientVal;
      this.clientSelected = this.taskData.client;
      this.item.client    = this.taskData.client.id;

      this.item.taskStatus = {
        label: this.taskData.taskStatus.name,
        value: this.taskData.taskStatus.id
      };

      this.item.taskCategory = {
        label: this.taskData.taskCategory.name,
        value: this.taskData.taskCategory.id
      };

      if (this.taskData.contract) {
        var contractVal       = '(#' + this.taskData.contract.id + ') ' + (
          this.taskData.contract.peoples[0] ? this.taskData.contract.peoples[0].alias : ''
        );

        this.searchContract   = contractVal;
        this.contractSelected = this.taskData.contract;
        this.item.contract    = this.taskData.contract.id;
      }

      if (this.taskData.order) {
        var orderVal       = '(#' + this.taskData.order.id + ') ' + (
          this.taskData.order.client ? this.taskData.order.client.alias : ''
        );

        this.searchOrder   = orderVal;
        this.orderSelected = this.taskData.order;
        this.item.order    = this.taskData.order.id;
      }
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
    categories: function (categories) {
      if (categories) {
        var itens = Object.assign([], categories);

        this.categoryArray = itens;
      }
    },
    searchTaskFor: function (search) {
      if (this.taskForSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;

          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchData.bind(this)(search, 'taskFor')
        ).bind(this), 2000);
      }
    },
    searchClient: function (search) {
      if (this.clientSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;

          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchData.bind(this)(search, 'client')
        ).bind(this), 2000);
      }
    },
    searchContract: function (search) {
      if (this.contractSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;

          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchData.bind(this)(search, 'contract')
        ).bind(this), 2000);
      }
    },
    searchOrder: function (search) {
      if (this.orderSelected === '') {
        if (this.timeSearch !== '') {
          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;

          clearTimeout(this.timeSearch);
          this.timeSearch = '';
        }

        this.timeSearch = setTimeout((
          () => this.searchData.bind(this)(search, 'order')
        ).bind(this), 2000);
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

    removeContractClick() {
      this.contractSelected = '';
      this.searchContract   = '';
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

    getContract(contractId) {
      return this.api.private('/my_contracts/' + contractId + '?myCompany=' + this.myCompany.id)
        .then(response => response.json())
        .then(result => {
          
          if (!result["@id"]) {
            this.$q.notify({
              message : "Contrato não encontrado!",
              position: 'bottom',
              type    : 'negative',
            });
          }

          return {
            members   : result,
            totalItems: result["@id"] ? 1 : 0
          };
        });
    },

    getOrder(orderId) {
      return this.api.private('/sales/orders/' + orderId)
        .then(response => response.json())
        .then(result => {
          
          if (!result["@id"]) {
            this.$q.notify({
              message : "Pedido não encontrado!",
              position: 'bottom',
              type    : 'negative',
            });
          }

          return {
            members   : result,
            totalItems: result["@id"] ? 1 : 0
          };
        });
    },

    searchData(search, fromField) {
      this.timeSearch = '';

      if (search) {
        switch(fromField) {
          case 'taskFor': 
            this.isSearchingTaskFor  = true;
            break;
          case 'client': 
            this.isSearchingClient   = true;
            break;
          case 'contract': 
            this.isSearchingContract = true;
            break;
          case 'order': 
            this.isSearchingOrder    = true;
            break;
        }
        
        var query  = {};
        var method = "getPeople";

        if (fromField == "order") {
          query = search.replace('#', "");
          method = "getOrder";
        }
        else if (fromField == "contract") {
          query = search.replace('#', "");
          method = "getContract";
        }
        else {
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
        }

        var reset = () => {
          switch(fromField) {
            case 'taskFor': 
              this.searchTaskFor  = '';
              break;
            case 'client': 
              this.searchClient   = '';
              break;
            case 'contract': 
              this.searchContract = '';
              break;
            case 'order': 
              this.searchOrder    = '';
              break;
          }
        };
        
        this[method](query).then(result => {
          if (result.totalItems) {
            var inputVal = '(#' + result.members.id + ') ' + result.members.name;

            switch(fromField) {
              case 'taskFor': 
                this.taskForSelected = result.members;
                this.searchTaskFor   = inputVal;
                this.item.taskFor    = result.members.id;
                break;
              case 'client': 
                this.clientSelected = result.members;
                this.searchClient   = inputVal;
                this.item.client    = result.members.id;
                break;
              case 'contract': 
                var contractId = result.members['@id'].split('/')[2];

                inputVal = '(#' + (
                  contractId
                ) + ') ' + (
                  result.members.contractPeople[0] ? result.members.contractPeople[0].people.alias : ''
                );

                this.contractSelected = result.members;
                this.searchContract   = inputVal;
                this.item.contract    = contractId;
                break;
              case 'order': 
                var orderId = result.members['@id'].split('/')[3];

                inputVal = '(#' + (
                  orderId
                ) + ') ' + (
                  result.members.client ? result.members.client.alias : ''
                );

                this.orderSelected = result.members;
                this.searchOrder   = inputVal;
                this.item.order    = orderId;
                break;
            }

          }
          else {
            reset();
          }

          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;
        }).catch(e => {
          this.$q.notify({
            message : "Não foi possível encontrar...",
            position: 'bottom',
            type    : 'negative',
          });
          
          reset();

          this.isSearchingTaskFor  = false;
          this.isSearchingClient   = false;
          this.isSearchingContract = false;
          this.isSearchingOrder    = false;
        });
      }
    },

    saveTask(payload) {
      
      return this.api.private('/tasks' + (this.taskId ? "/" + this.taskId : ""), { 
        body: JSON.stringify(payload),
        method: this.taskId ? "PUT" : "POST"
       })
        .then(response => response.json())
        .then(result => {
          if (result['@id']) {
            return {
              success: true,
              id: result['@id'].split('/')[2]
            };
          }
          else {
            return {
              success: false
            };
          }
        });

    },

    onSubmit() {
      this.isSaving = true;
      
      var payload = {
        name        : this.item.name,
        registeredBy: '/people/' + this.user.people,
        provider    : '/people/' + this.myCompany.id,
        taskFor     : '/people/' + this.item.taskFor,
        client      : '/people/' + this.item.client,
        taskStatus  : '/task_statuses/' + this.item.taskStatus.value,
        taskCategory: '/task_categories/' + this.item.taskCategory.value,
      };

      if (this.taskId) {
        payload.id = this.taskId;
      }

      if (this.item.description){
        payload.description = this.item.description;
      }

      if (this.item.dueDate){
        var dueDate = this.item.dueDate.split('/');
        payload.dueDate = dueDate[2] + '-' + dueDate[1] + '-' + dueDate[0] + ' 00:00:00';
      }
      
      if (this.item.contract){
        payload.contract = '/contracts/' + this.item.contract;
      }

      if (this.item.order) {
        payload.order = '/sales/orders/' + this.item.order;
      }

      var error = () => {
          this.$q.notify({
            message : "Não foi possível cadastrar, tente novamente mais tarde.",
            position: 'bottom',
            type    : 'negative',
          });
      };

      this.saveTask(payload).then(res => {
        if (res.success) {
          this.$emit('saved', res.id);
        }
        else {
          error();
        }
        this.isSaving = false;
      }).catch(e => {
        error();
        this.isSaving = false;
      });
    },

    isInvalid(key) {
      return val => {

        if (!(val && (val.length > 0 || (typeof val === "object" && Object.keys(val).length))))
          return this.$t('messages.fieldRequired');
          
        return true;
      };
    },
  },
};
</script>
