<template>
  <div>
    <div class="row q-mb-md q-gutter-sm justify-end">
      <q-btn
        label="Cadastrar fornecedor"
        icon="add"
        size="sm"
        color="secondary"
        @click="dialogs.provider.visible = true"
      />
      <q-btn
        label="Cadastrar categoria"
        icon="add"
        size="sm"
        color="secondary"
        @click="dialogs.category.visible = true"
      />
    </div>
    <q-form @submit="addExpense">
      <div class="row">
        <div class="col-xs-12 q-mb-md">
          <q-select
            dense
            outlined
            stack-label
            emit-value
            map-options
            lazy-rules
            v-model="item.category"
            :label="translate('Categoria da despesa')"
            :options="categories"
            :rules="[(val) => val !== null || 'Selecione uma categoria']"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            lazy-rules
            stack-label
            v-model="item.description"
            type="text"
            :label="translate('Descrição da despesa')"
            class="q-mt-md"
            :rules="[isInvalid()]"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <PeopleAutocomplete
            :source="searchPeople"
            :isLoading="isSearching"
            label="Definir o fornecedor"
            @selected="onSelectClient"
            placeholder="Pesquisar..."
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            lazy-rules
            stack-label
            reverse-fill-mask
            v-model="item.amount"
            prefix="R$"
            type="text"
            :label="translate('Valor')"
            class="q-mt-md"
            :rules="[isInvalid()]"
            mask="#,##"
            fill-mask="0"
          />
        </div>
        <div class="col-xs-12 q-mb-md text-center">
          <q-radio
            v-model="item.recurrence"
            val="single"
            :label="translate('Pagamento único')"
          />
          <q-radio
            v-model="item.recurrence"
            val="monthly"
            :label="translate('Pagamento recorrente')"
          />
        </div>
        <div v-if="item.recurrence == 'single'" class="col-xs-12 q-mb-md">
          <q-select
            dense
            outlined
            stack-label
            emit-value
            map-options
            lazy-rules
            v-model="item.parcels"
            :label="translate('Número de parcelas')"
            :options="parcels"
            class="q-mb-sm"
            :rules="[(val) => val !== null || 'Selecione um número']"
          />
        </div>
        <div class="col-xs-12 q-mb-md">
          <q-input
            dense
            outlined
            stack-label
            v-model="item.dueDate"
            :label="translate('Data primeiro vencimento')"
            mask="##/##/####"
            class="q-mb-sm"
            :rules="[isInvalid('date')]"
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
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end">
        <q-btn
          :loading="saving"
          icon="save"
          type="submit"
          :label="translate('Salvar')"
          size="md"
          color="primary"
          class="q-mt-md"
        />
      </div>
    </q-form>

    <q-dialog v-model="dialogs.category.visible" @before-show="resetCategory">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Cadastro de categoria</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="addCategory" class="q-mb-md">
            <div class="row">
              <div class="col-xs-12 q-mb-md">
                <q-select
                  dense
                  outlined
                  stack-label
                  emit-value
                  map-options
                  v-model="dialogs.category.expense.parent"
                  :label="translate('Categoria pai')"
                  :options="categories"
                />
              </div>
              <div class="col-xs-12 q-mb-md">
                <q-input
                  dense
                  outlined
                  lazy-rules
                  stack-label
                  v-model="dialogs.category.expense.name"
                  type="text"
                  :label="translate('Nome sub-categoria')"
                  class="q-mt-md"
                  :rules="[isInvalid()]"
                />
              </div>
            </div>
            <div class="row justify-end">
              <q-btn
                :loading="dialogs.category.saving"
                icon="save"
                type="submit"
                :label="translate('Salvar')"
                size="md"
                color="primary"
                class="q-mt-md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogs.provider.visible">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Cadastro de fornecedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="addProvider" class="q-mb-md">
            <div class="row">
              <div class="col-xs-12 q-mb-md">
                <div class="row justify-center">
                  <q-btn-toggle
                    no-caps
                    v-model="dialogs.provider.item.type"
                    toggle-color="primary"
                    :options="[
                      { label: 'Pessoa Jurídica', value: 'J' },
                      { label: 'Pessoa Física', value: 'F' },
                    ]"
                  />
                </div>
              </div>
              <div class="col-xs-12">
                <q-input
                  dense
                  outlined
                  stack-label
                  lazy-rules
                  unmasked-value
                  v-model="dialogs.provider.item.document"
                  type="text"
                  :label="dialogs.provider.item.type == 'J' ? translate('CNPJ') : translate('CPF')"
                  :mask="
                    dialogs.provider.item.type == 'J'
                      ? '##.###.###/####-##'
                      : '###.###.###-##'
                  "
                />
              </div>
              <div class="col-xs-12">
                <q-input
                  dense
                  outlined
                  stack-label
                  lazy-rules
                  v-model="dialogs.provider.item.name"
                  type="text"
                  class="q-mb-sm"
                  :label="
                    dialogs.provider.item.type == 'J' ? translate('Razão social') : translate('Nome')
                  "
                  :rules="[isInvalid('name')]"
                />
              </div>
              <div class="col-xs-12">
                <q-input
                  dense
                  outlined
                  stack-label
                  lazy-rules
                  v-model="dialogs.provider.item.alias"
                  type="text"
                  class="q-mb-sm"
                  :label="
                    dialogs.provider.item.type == 'J'
                      ? translate('Nome Fantasia')
                      : translate('Sobrenome')
                  "
                  :rules="[isInvalid('alias')]"
                />
              </div>
            </div>
            <div class="row justify-end">
              <q-btn
                :loading="dialogs.provider.saving"
                icon="save"
                type="submit"
                :label="translate('Salvar')"
                size="md"
                color="primary"
                class="q-mt-md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    PeopleAutocomplete,
  },
  created() {
    this.loadSelectableOptions();
  },

  data() {
    return {
      isSearching: false,
      saving: false,
      item: {
        parent: null,
        category: null,
        description: null,
        provider: null,
        amount: null,
        parcels: null,
        dueDate: null,
        recurrence: "single",
      },
      categories: [],
      providers: [],
      parcels: [],
      dialogs: {
        category: {
          visible: false,
          expense: {
            name: null,
            context: "expense",
            parent: null,
          },
          saving: false,
        },
        provider: {
          visible: false,
          saving: false,
          item: {
            name: null,
            alias: null,
            type: "J",
            document: null,
          },
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  methods: {
    ...mapActions({
      getStatuses: "payInvoice/getStatuses",
      getCategories: "categories/getCategories",
      getProviders: "expense/getProviders",
      createInvoice: "expense/createInvoice",
      createCategory: "expense/createCategory",
      createProvider: "expense/createProvider",
      search: "people/searchPeople",
    }),
    resetCategory() {
      this.dialogs.category.expense.name = null;
      this.dialogs.category.expense.context = "expense";
      this.dialogs.category.expense.parent = null;
    },

    onSelectClient(item) {
      this.item.provider = item.id;
    },

    searchPeople(input) {
      this.isSearching = true;

      return this.search(input)
        .then((result) => {
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
          }
        })
        .finally(() => {
          this.isSearching = false;
        });
    },
    loadSelectableOptions() {
      // load parcels
      for (let num = 1; num <= 12; num++) {
        this.parcels.push({
          label: `${num}x`,
          value: num,
        });
      }
      this.item.parcels = this.parcels[0].value;

      // load categories
      this.loadCategories();
    },

    addCategory() {
      this.dialogs.category.saving = true;

      this.createCategory({
        values: {
          name: this.dialogs.category.expense.name,
          context: this.dialogs.category.expense.context,
          parent: this.dialogs.category.expense.parent,
          company: `/people/${this.myCompany.id}`,
        },
      })
        .then((response) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });

          this.loadCategories();
        })
        .finally(() => {
          this.dialogs.category.saving = false;
        });
    },

    addProvider() {
      this.dialogs.provider.saving = true;

      this.createProvider({
        values: {
          name: this.dialogs.provider.item.name,
          alias: this.dialogs.provider.item.alias,
          peopleType: this.dialogs.provider.item.type,
          document: this.dialogs.provider.item.document,
        },
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((response) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });
        })
        .finally(() => {
          this.dialogs.provider.saving = false;
        });
    },

    loadCategories() {
      this.getCategories({
        params: {
          context: "expense",
          company: this.myCompany.id,
        },
      }).then((members) => {
        if (members.length) {
          let items = [];

          items.push({
            label: null,
            value: null,
          });

          members.forEach((item, i) => {
            items.push({
              label: item.name,
              value: item["@id"],
            });
          });
          this.categories = items;
        }
      });
    },

    addExpense() {
      this.saving = true;

      this.createInvoice({
        values: {
          company: this.myCompany.id,
          category: parseInt(this.item.category.replace(/\D/g, "")),
          provider: parseInt(this.item.provider),
          paymentMode: this.item.recurrence == "monthly" ? 0 : this.item.parcels,
          amount: parseFloat(this.item.amount.replace(",", ".")),
          dueDate: this.item.dueDate
            ? this.item.dueDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "$3-$2-$1")
            : null,
          description: this.item.description,
        },
        params: {
          myCompany: this.myCompany.id,
        },
      })
        .then((data) => {
          this.$q.notify({
            message: this.translate("Dados salvos com sucesso!"),
            position: "bottom",
            type: "positive",
          });

          this.$emit("created", data);
        })

        .finally(() => {
          this.saving = false;
        });
    },

    isInvalid(field) {
      return (val) => {
        if (field == "date") {
          if (!/^\d{2}\/\d{2}\/\d{4}$/g.test(val)) return this.translate("A data não é válida");
        }

        if (!(val && val.length > 0)) return this.translate("Este campo é obrigatório");

        return true;
      };
    },
  },
};
</script>
