<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress :indeterminate="isLoading"
        size ="sm"
        color="primary"
        class="q-ma-md"
      />
      {{ `${$t('loading')}...` }}
    </div>

    <div class="col-12 q-mt-md" :style="isLoading ? 'visibility:hidden' : 'visibility:visible'">
      <q-markup-table v-if="item !== null">
        <tbody>
          <tr>
            <td class="text-left text-bold">{{ $t('Billing amount') }}</td>
            <td class="text-left">
              <q-input lazy-rules stack-label reverse-fill-mask
                v-model  ="item.billing"
                prefix   ="R$"
                type     ="text"
                class    ="q-mt-md"
                :rules   ="[isInvalid('money')]"
                mask     ="#,##"
                fill-mask="0"
              />
            </td>
          </tr>
          <tr>
            <td class="text-left text-bold">{{ $t('Billing period') }}</td>
            <td class="text-left">
              <q-select stack-label map-options
                v-model ="item.billingDays"
                :options="settings.select.periods"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ $t('No results') }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </td>
          </tr>
          <tr>
            <td class="text-left text-bold">{{ $t('Billing day') }}</td>
            <td class="text-left">
              <q-input lazy-rules stack-label reverse-fill-mask
                v-model="item.paymentTerm"
                type   ="text"
                class  ="q-mt-md"
                :rules ="[isInvalid('monthday')]"
                mask   ="#"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="row justify-end">
        <q-btn
          :loading="saving"
          icon    ="save"
          :label  ="$t('Save')"
          size    ="md"
          color   ="primary"
          class   ="q-mt-md"
          @click  ="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';

const SETTINGS = {
  select: {
    periods: [
      {
        label: 'Diariamente',
        value: 'daily',
      },
      {
        label: 'Semanalmente',
        value: 'weekly',
      },
      {
        label: 'Quinzenal',
        value: 'biweekly',
      },
      {
        label: 'Mensal',
        value: 'monthly',
      },
    ],
  },
};

Object.freeze(SETTINGS);

export default {
  props: {
    id: {
      required: true,
    },
    api: {
      type    : Api,
      required: true
    },
  },

  data() {
    return {
      saving   : false,
      settings : SETTINGS,
      isLoading: false,
      item     : {
        billing    : null,
        billingDays: null,
        paymentTerm: null,
      }
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `trainers/${this.id}/billing`;
      return this.api.private(endpoint)
        .then(response => response.json())
        .then(result => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method : 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify(values),
      };

      let endpoint = `trainers/${this.id}/billing`;
      return this.api.private(endpoint, options)
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
      this.saving = true;

      this.save({
        "billing"    : parseFloat(this.item.billing.replace(',', '.')),
        "billingDays": this.item.billingDays.value,
        "paymentTerm": parseInt(this.item.paymentTerm)
      })
        .then (data => {
          if (data) {
            this.$emit('saved', data);
          }
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          this.saving = false;
        });
    },

    onRequest() {
      if (this.isLoading)
        return;

      this.isLoading = true;

      this.getItems()
        .then(data => {
          this.item.billing     = (parseFloat(data.billing) + 0.001).toFixed(2);
          this.item.billingDays = data.billingDays;
          this.item.paymentTerm = data.paymentTerm;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    isInvalid(key) {
      return val => {
        if (key == 'money') {
          if (!val || !(parseFloat(val.replace(',', '.')) > 0))
            return this.$t('messages.fieldRequired');

          return true;
        }

        if (key == 'monthday') {
          if (!val || !(parseInt(val) > 0 && parseInt(val) < 32))
            return this.$t('messages.fieldRequired');

          return true;
        }

        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        return true;
      };
    },
  },
};
</script>
