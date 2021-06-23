<template>
  <q-form @submit="onSubmit">
    <div class="row items-center q-mb-md">
      <div class="text-h6">
        {{ item.id === null ? $t('Nova despesa') : $t('Edição despesa') }}
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 q-mb-md">
        <q-select stack-label emit-value map-options lazy-rules
          v-model ="item.category"
          :label  ="$t('Categoria da despesa')"
          :options="categories"
          :rules  ="[val => val !== null || 'Selecione uma categoria']"
        />
      </div>
      <div class="col-xs-12 q-mb-md">
        <q-input lazy-rules stack-label
          v-model="item.description"
          type   ="text"
          :label ="$t('Descrição da despesa')"
          class  ="q-mt-md"
          :rules ="[isInvalid()]"
        />
      </div>
      <div class="col-xs-12 q-mb-md">
        <q-select stack-label emit-value map-options lazy-rules
          v-model ="item.provider"
          :label  ="$t('Fornecedor')"
          :options="providers"
          :rules  ="[val => val !== null || 'Selecione um fornecedor']"
        />
      </div>
      <div class="col-xs-12 q-mb-md">
        <q-input lazy-rules stack-label reverse-fill-mask
          v-model  ="item.amount"
          prefix   ="R$"
          type     ="text"
          :label   ="$t('Valor')"
          class    ="q-mt-md"
          :rules   ="[isInvalid()]"
          mask     ="#,##"
          fill-mask="0"
        />
      </div>
      <div class="col-xs-12 q-mb-md text-center">
        <q-radio v-model="item.recurrence" val="single"  :label="$t('Pagamento único')" />
        <q-radio v-model="item.recurrence" val="monthly" :label="$t('Pagamento recorrente')" />
      </div>
      <div v-if="item.recurrence == 'single'"
        class="col-xs-12 q-mb-md"
      >
        <q-select stack-label emit-value map-options lazy-rules
          v-model ="item.parcels"
          :label  ="$t('Número de parcelas')"
          :options="parcels"
          class   ="q-mb-sm"
          :rules  ="[val => val !== null || 'Selecione um número']"
        />
      </div>
      <div class="col-xs-12 q-mb-md">
        <q-input stack-label
          v-model="item.dueDate"
          :label ="$t('Data primeiro vencimento')"
          mask   ="##/##/####"
          class  ="q-mb-sm"
          :rules ="[isInvalid('date')]"
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
          </template>
        </q-input>
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
import { mapActions, mapGetters } from 'vuex';
import { formatDateYmdTodmY }     from '@freteclick/quasar-common-ui/src/utils/formatter';
import { Api }                    from '@freteclick/quasar-common-ui/src/utils/api';

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
    this.loadSelectableOptions();

    if (this.id !== null) {
      this.getItem(this.id)
        .then(item => {
          this.item.category    = item.category['@id'];
          this.item.description = item.description;
          this.item.provider    = item.provider['@id'];
          this.item.amount      = (parseFloat(item.amount) + 0.001).toFixed(2);
          this.item.parcels     = item.parcels;
          this.item.dueDate     = formatDateYmdTodmY(item.dueDate);
          this.item.recurrence  = item.parcels == null ? 'monthly' : 'single';
        });
    }
  },

  data() {
    return {
      saving: false,
      item  : {
        "id"         : this.id,
        "category"   : null,
        "description": null,
        "provider"   : null,
        "amount"     : null,
        "parcels"    : null,
        "dueDate"    : null,
        "recurrence" : 'single',
      },
      categories: [],
      providers : [],
      parcels   : [],
    }
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  methods: {
    ...mapActions({
      getStatuses  : 'payInvoice/getStatuses',
      getCategories: 'expense/getCategories',
      getProviders : 'expense/getProviders',
    }),

    // store method
    getItem(id) {
      return this.api.private(`company_expenses/${id}`)
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

      let endpoint = this.id === null ?
        'company_expenses' : `company_expenses/${this.id}`;

      return this.api.private(endpoint, options)
        .then(response => response.json())
        .then(data => {
          this.$q.notify({
            message : this.$t('Dados salvos com sucesso!'),
            position: 'bottom',
            type    : 'positive',
          });

          return data;
        })
        .catch(error => {
          this.$q.notify({
            message : this.$t(error.message),
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    loadProviders() {
      this.getProviders({
        params: {
          'myCompany': this.myCompany.id
        }
      }).then(members => {
        if (members.length) {
          let items = [];
          members.forEach((item, i) => {
            items.push({
              label: item.name,
              value: item['@id']
            });
          });
          this.providers = items;
        }
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

      // load providers
      this.loadProviders();
    },

    loadCategories() {
      this.getCategories({
        params: {
          'context': 'expense',
          'company': this.myCompany.id,
        }
      }).then(members => {
        if (members.length) {
          let items = [];

          items.push({
            label: null,
            value: null
          });

          members.forEach((item, i) => {
            items.push({
              label: item.name,
              value: item['@id']
            });
          });
          this.categories = items;
        }
      });
    },

    onSubmit() {
      this.saving = true;

      this.save(
        {
          "company"    : `/people/${this.myCompany.id}`,
          "category"   : this.item.category,
          "description": this.item.description,
          "provider"   : this.item.provider,
          "amount"     : parseFloat(this.item.amount.replace(',', '.')),
          "parcels"    : this.item.recurrence == 'monthly' ? null : this.item.parcels,
          "dueDate"    : this.item.dueDate ? this.item.dueDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "\$3\-\$2\-\$1") : null,
          "paymentDay" : parseInt(this.item.dueDate.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "\$1")),
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
        if (field == 'date') {
          if (!/^\d{2}\/\d{2}\/\d{4}$/g.test(val))
            return this.$t('A data não é válida');
        }

        if (!(val && val.length > 0))
          return this.$t('Este campo é obrigatório');

        return true;
      };
    },
  },
};
</script>
