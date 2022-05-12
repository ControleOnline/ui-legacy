<template>
  <q-form @submit="onSubmit" ref="myForm">
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input
          stack-label
          lazy-rules
          v-model="item.name"
          type="text"
          class="q-mb-sm"
          label="Nome *"
          placeholder="Digite o nome"
          :rules="[isInvalid('name')]"
          :outlined="true"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-select
          stack-label
          lazy-rules
          v-model="item.taskCategory"
          class="q-mb-sm"
          label="Categoria *"
          :options="categoryArray"
          :rules="[isInvalid('category')]"
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
        <q-select
          stack-label
          lazy-rules
          v-model="item.taskStatus"
          class="q-mb-sm"
          label="Status *"
          :options="statusArray"
          :rules="[isInvalid('status')]"
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
        <q-input
          stack-label
          v-model="item.dueDate"
          label="Data de Vencimento"
          mask="##/##/####"
          :outlined="true"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy1"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="item.dueDate"
                  mask="DD/MM/YYYY"
                  @input="() => $refs.qDateProxy1.hide()"
                />
              </q-popup-proxy>
            </q-icon>
            <q-btn
              round
              flat
              v-if="item.dueDate !== ''"
              @click="removeDueDateClick()"
            >
              <q-icon name="close" />
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <PeopleAutocomplete
          :source="searchPeople"
          :isLoading="isSearching"
          label="Definir o responsável"
          @selected="onSelectTaskFor"
          placeholder="Pesquisar..."
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <PeopleAutocomplete
          :source="searchPeople"
          :isLoading="isSearching"
          label="Definir o cliente"
          @selected="onSelectClient"
          placeholder="Pesquisar..."
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-md-6 flex items-center">
        <div
          v-if="taskData && taskData.order && taskData.order.contract"
          class="row items-center full-width q-col-gutter-sm"
        >
          <div class="col-auto q-pl-none">
            <q-btn
              flat
              class="bg-primary q-py-sm"
              color="white"
              icon="north_west"
              @click="goContract()"
            >
              <q-tooltip>Ver contrato</q-tooltip>
            </q-btn>
          </div>
          <div class="col">
            <q-input
              v-model="item.id"
              label="Definir Contrato"
              class="q-my-md"
              outlined
              prefix="#"
              disable
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-6 flex items-center">
        <div class="row items-center full-width q-col-gutter-sm">
          <div class="col-auto q-pl-none">
            <q-btn
              flat
              class="bg-primary q-py-sm"
              color="white"
              icon="north_west"
              @click="goOrder()"
            >
              <q-tooltip>Ver pedido</q-tooltip>
            </q-btn>
          </div>
          <div class="col">
            <q-select
              v-model="searchOrder"
              :options="searchOrder"
              :loading="isSearchingOrder"
              label="Definir Pedido"
              class="q-my-md"
              outlined
              placeholder="Digite o id do pedido"
              :disabled="!editTask"
            />
          </div>
          <div class="col-auto q-pr-none">
            <q-btn
              flat
              class="q-py-sm"
              color="primary"
              :icon="editTask ? 'cancel' : 'edit'"
              @click="editTask = !editTask"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12">
        <q-input
          stack-label
          lazy-rules
          v-model="item.description"
          type="textarea"
          class="q-mb-sm"
          label="Descrição"
          placeholder="Digite a descrição"
          :outlined="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
        class="col-xs-12 col-md-2"
        type="submit"
        color="primary"
        label="Salvar"
        :loading="isSaving"
      />
    </div>
  </q-form>
</template>

<script>
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/common/PeopleAutocomplete";
import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";

export default {
  components: {
    PeopleAutocomplete,
  },
  props: {
    api: {
      type: Api,
      required: true,
    },
    statuses: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    taskId: {
      type: Number,
      required: false,
    },
    client: {
      type: Object,
      required: false,
    },
    orderId: {
      type: String,
      required: false,
    },
    taskData: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      editTask: false,
      searchTaskFor: "",
      timeSearch: "",
      taskForSelected: "",
      isSearching: false,
      isSearchingTaskFor: false,
      searchClient: "",
      clientSelected: "",
      isSearchingClient: false,
      contractSelected: "",
      isSearchingContract: false,
      searchOrder: null,
      orderSelected: "",
      isSearchingOrder: false,
      item: {
        id: null,
        name: null,
        description: null,
        dueDate: this.getDueDate(),
        taskFor: null,
        client: null,
        taskStatus: this.statuses[1],
        taskCategory: null,
        order: null,
      },
      isSaving: false,
      statusArray: [],
      categoryArray: [],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },

  created() {
    if (this.statuses) {
      var itens = Object.assign([], this.statuses);
      itens.splice(0, 1);
      this.statusArray = itens;
      this.taskStatus = this.statuses[1];
    }

    if (this.categories) {
      var itens = Object.assign([], this.categories);

      this.categoryArray = itens;
    }

    if (this.client) {
      var clientVal = "(#" + this.client.id + ") " + this.client.name;
      this.searchClient = clientVal;
      this.clientSelected = this.client;
      this.item.client = this.client.id;
    }

    if (this.orderId) {
      var inputVal =
        "(#" + this.orderId + ") " + (this.client ? this.client.alias : "");
      this.orderSelected = this.orderId;
      this.searchOrder = inputVal;
      this.item.order = this.orderId;
    }

    if (this.user) {
      var taskForVal = "(#" + this.user.people + ") " + this.user.realname;
      this.searchTaskFor = taskForVal;
      this.taskForSelected = this.user.people;
      this.item.taskFor = this.user.people;
    }

    if (this.taskData) {
      this.item.id = this.taskId;
      this.item.name = this.taskData.name;
      this.item.description = this.taskData.description;

      if (this.taskData.dueDate) {
        this.item.dueDate = formatDateYmdTodmY(this.taskData.dueDate);
      }

      var taskForVal =
        "(#" + this.taskData.taskFor.id + ") " + this.taskData.taskFor.name;
      this.searchTaskFor = taskForVal;
      this.taskForSelected = this.taskData.taskFor;
      this.item.taskFor = this.taskData.taskFor.id;

      var clientVal =
        "(#" + this.taskData.client.id + ") " + this.taskData.client.name;
      this.searchClient = clientVal;
      this.clientSelected = this.taskData.client;
      this.item.client = this.taskData.client.id;

      this.item.taskStatus = {
        label: this.taskData.taskStatus.name,
        value: this.taskData.taskStatus.id,
      };

      this.item.taskCategory = {
        label: this.taskData.taskCategory.name,
        value: this.taskData.taskCategory.id,
      };

      if (this.taskData.order) {
        var orderVal =
          "(#" +
          this.taskData.order.id +
          ") " +
          (this.taskData.order.client ? this.taskData.order.client.alias : "");

        this.searchOrder = orderVal;
        this.orderSelected = this.taskData.order;
        this.item.order = this.taskData.order.id;
      }
    }
  },

  watch: {
    statuses: function (statuses) {
      if (statuses) {
        var itens = Object.assign([], statuses);
        itens.splice(0, 1);
        this.statusArray = itens;
        this.taskStatus = statuses[1];
      }
    },
    categories: function (categories) {
      if (categories) {
        var itens = Object.assign([], categories);

        this.categoryArray = itens;
      }
    },

    searchOrder: function (search) {
      if (this.orderSelected === "") {
        if (this.timeSearch !== "") {
          this.isSearchingTaskFor = false;
          this.isSearchingClient = false;
          this.isSearchingContract = false;
          this.isSearchingOrder = false;

          clearTimeout(this.timeSearch);
          this.timeSearch = "";
        }

        this.timeSearch = setTimeout(
          (() => this.searchData.bind(this)(search, "order")).bind(this),
          2000
        );
      }
    },
  },

  methods: {
    ...mapActions({
      search: "people/searchPeople",
    }),

    goContract() {
      this.$router.push({
        name: "ContractDetails",
        params: { id: this.taskData.order.contract.id },
      });
    },

    goOrder() {
      this.$router.push({
        name: "OrderDetails",
        params: { id: this.item.order },
      });
    },

    removeDueDateClick() {
      this.item.dueDate = "";
    },

    removeTaskForClick() {
      this.taskForSelected = "";
      this.searchTaskFor = "";
    },

    removeClientClick() {
      this.clientSelected = "";
      this.searchClient = "";
    },

    removeOrderClick() {
      this.orderSelected = "";
      this.searchOrder = "";
      this.item.order = "";
    },
    onSelectTaskFor(item) {
      this.taskForSelected = item;
    },

    onSelectClient(item) {
      this.clientSelected = item;
    },

    searchPeople(input) {
      this.isSearching = true;

      return this.search(input).then((result) => {
        this.isSearching = false;

        if (result && result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label:
                result.data[i].id +
                " - " +
                result.data[i].name +
                " - " +
                result.data[i].alias,
              value: result.data[i],
            });
          }
          return items;
        } else {
          this.isSearching = false;
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            position: "bottom",
            type: "negative",
          });
        }
      });
    },
    getGeoPlaces(input) {},
    getPeople(params) {
      return this.api
        .private("/people/client-company", { params })
        .then((response) => response.json())
        .then((result) => {
          if (result.response.count == 0) {
            this.$q.notify({
              message: result.response.error,
              position: "bottom",
              type: "negative",
            });
          }

          return {
            members: result.response.data,
            totalItems: result.response.count,
          };
        });
    },

    getOrder(orderId) {
      return this.api
        .private("/sales/orders/" + orderId)
        .then((response) => response.json())
        .then((result) => {
          if (!result["@id"]) {
            this.$q.notify({
              message: "Pedido não encontrado!",
              position: "bottom",
              type: "negative",
            });
          }

          return {
            members: result,
            totalItems: result["@id"] ? 1 : 0,
          };
        });
    },

    searchData(search, fromField) {
      this.timeSearch = "";

      if (search) {
        switch (fromField) {
          case "order":
            this.isSearchingOrder = true;
            break;
        }

        var query = {};
        var method = "getPeople";

        if (fromField == "order") {
          query = search.replace("#", "");
          method = "getOrder";
        } else {
          if (search.indexOf("@") > 0) {
            query.email = encodeURIComponent(search);
          } else {
            var fixed = search.replace(/[.-\s]+/g, "");
            if (!isNaN(fixed)) {
              query.document = fixed;
            } else {
              query.name = encodeURIComponent(search);
            }
          }
        }

        var reset = () => {
          switch (fromField) {
            case "order":
              this.searchOrder = "";
              break;
          }
        };

        this[method](query)
          .then((result) => {
            if (result.totalItems) {
              var inputVal =
                "(#" + result.members.id + ") " + result.members.name;

              switch (fromField) {
                case "order":
                  var orderId = result.members["@id"].split("/")[3];
                  inputVal =
                    "(#" +
                    orderId +
                    ") " +
                    (result.members.client ? result.members.client.alias : "");

                  this.orderSelected = result.members;
                  this.searchOrder = inputVal;
                  this.item.order = orderId;
                  break;
              }
            } else {
              reset();
            }

            this.isSearchingOrder = false;
          })
          .catch((e) => {
            this.$q.notify({
              message: "Não foi possível encontrar...",
              position: "bottom",
              type: "negative",
            });

            reset();

            this.isSearchingOrder = false;
          });
      }
    },

    saveTask(payload) {
      return this.api
        .private("/task" + (this.taskId ? "/" + this.taskId : ""), {
          body: JSON.stringify(payload),
          method: this.taskId ? "PUT" : "POST",
        })
        .then((response) => response.json())
        .then((result) => {
          if (
            result.response &&
            result.response.data &&
            result.response.data.id
          ) {
            return {
              success: true,
              id: result.response.data.id,
            };
          } else {
            return {
              success: false,
            };
          }
        });
    },
    getNextBusinessDay(date) {
      date = new Date(+date);
      do {
        date.setDate(date.getDate() + 1);
      } while (!(date.getDay() % 6));
      return date;
    },
    getDueDate() {
      let today = new Date();
      let tomorrow = this.getNextBusinessDay(today);
      return date.formatDate(tomorrow, "DD/MM/YYYY");
    },
    onSubmit() {
      this.isSaving = true;

      var payload = {
        name: this.item.name,
        registeredBy: this.user.people,
        provider: this.myCompany.id,
        taskFor: this.item.taskFor,
        client: this.item.client,
        taskStatus: this.item.taskStatus.value,
        taskCategory: this.item.taskCategory.value,
      };

      if (this.taskId) {
        payload.id = this.taskId;
      }

      if (this.item.description) {
        payload.description = this.item.description;
      }

      if (this.item.dueDate) {
        var dueDate = this.item.dueDate.split("/");
        payload.dueDate =
          dueDate[2] + "-" + dueDate[1] + "-" + dueDate[0] + " 00:00:00";
      }

      if (this.item.order) {
        payload.order = this.item.order;
      }

      var error = () => {
        this.$q.notify({
          message: "Não foi possível cadastrar, tente novamente mais tarde.",
          position: "bottom",
          type: "negative",
        });
      };

      this.saveTask(payload)
        .then((res) => {
          if (res.success) {
            this.$emit("saved", res.id);
          } else {
            error();
          }
          this.isSaving = false;
        })
        .catch((e) => {
          error();
          this.isSaving = false;
        });
    },

    isInvalid(key) {
      return (val) => {
        if (
          !(
            val &&
            (val.length > 0 ||
              (typeof val === "object" && Object.keys(val).length))
          )
        )
          return this.$t("messages.fieldRequired");

        return true;
      };
    },
  },
};
</script>
