<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      <q-table flat
        :data           ="items"
        :columns        ="settings.columns"
        :visible-columns="settings.visibleColumns"
        row-key         ="id"
        :loading        ="isLoading"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      >
        <template v-slot:top>
          <div class="col-3 q-mb-md text-h6">
            {{ $t('Addresses') }}
          </div>
          <div class="col-9 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label="$t('Add')"
                icon  ="add"
                size  ="md"
                color ="primary"
                class ="q-ml-sm"
                @click="dialog = !dialog"
              />
            </div>
          </div>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nickname"   :props="props">{{ props.row.nickname    }}</q-td>
            <q-td key="postalCode" :props="props">{{ props.cols[1].value   }}</q-td>
            <q-td key="street"     :props="props">{{ props.row.street      }}</q-td>
            <q-td key="number"     :props="props">{{ props.row.number      }}</q-td>
            <q-td key="complement" :props="props">{{ props.row.complement  }}</q-td>
            <q-td key="district"   :props="props">{{ props.row.district    }}</q-td>
            <q-td key="city"       :props="props">{{ props.row.city        }}</q-td>
            <q-td key="state"      :props="props">{{ props.row.state       }}</q-td>
            <q-td key="country"    :props="props">{{ props.row.country     }}</q-td>
            <q-td auto-width>
              <q-btn flat round dense
                color   ="red"
                icon    ="delete"
                @click  ="removeItem(props.row)"
                :disable="items.length == 1"
                :loading="props.row._bussy"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('New Address') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form
            ref    ="myForm"
            @submit="onSubmit"
          >
            <div class="row q-col-gutter-xs q-pb-xs">
              <div class="col-xs-12">
                <q-input stack-label lazy-rules
                  v-model    ="item.nickname"
                  type       ="text"
                  :label     ="$t('Reference')"
                  :rules     ="[isInvalid('nickname')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <SearchCEPAddress
                  :api  ="api"
                  @found="onCEPFound"
                  @error="(error) => {
                    this.item.postalCode = error.postalCode;

                    this.$q.notify({
                      message : error.message,
                      position: 'bottom',
                      type    : 'warning',
                    });
                  }"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <q-input stack-label lazy-rules
                  v-model    ="item.street"
                  type       ="text"
                  :label     ="$t('Street')"
                  :rules     ="[isInvalid('street')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <q-input stack-label lazy-rules reverse-fill-mask
                  v-model    ="item.number"
                  type       ="text"
                  :label     ="$t('Number')"
                  :rules     ="[isInvalid('number')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                  mask       ="#"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <q-input stack-label
                  v-model    ="item.complement"
                  type       ="text"
                  :label     ="$t('Complement')"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <q-input stack-label lazy-rules
                  v-model    ="item.district"
                  type       ="text"
                  :label     ="$t('District')"
                  :rules     ="[isInvalid('district')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-grow">
                <q-input stack-label lazy-rules
                  v-model    ="item.city"
                  type       ="text"
                  :label     ="$t('City')"
                  :rules     ="[isInvalid('city')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input stack-label lazy-rules
                  v-model    ="item.state"
                  type       ="text"
                  :label     ="$t('State')"
                  mask       ="AA"
                  :rules     ="[isInvalid('state')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input stack-label lazy-rules
                  v-model    ="item.country"
                  type       ="text"
                  :label     ="$t('Country')"
                  :rules     ="[isInvalid('country')]"
                  class      ="q-mb-sm"
                  :outlined  ="true"
                />
              </div>
            </div>

            <div class="row justify-end">
              <q-btn
                :loading="saving"
                icon    ="save"
                type    ="submit"
                :label  ="$t('Save')"
                size    ="md"
                color   ="primary"
                class   ="q-mt-md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Api              from '@freteclick/quasar-common-ui/src/utils/api';
import { formatCEP }    from '@freteclick/quasar-common-ui/src/utils/formatter';
import SearchCEPAddress from '@freteclick/quasar-common-ui/src/components/common/SearchCEPAddress.vue';

const SETTINGS = {
  visibleColumns: [
    'nickname'  ,
    'postalCode',
    'street'    ,
    'number'    ,
    'complement',
    'district'  ,
    'city'      ,
    'state'     ,
    'country'   ,
    'action'    ,
  ],
  columns       : [
    {
      name : 'nickname',
      align: 'left',
      label: 'Referência'
    },
    {
      name  : 'postalCode',
      field : 'postalCode',
      format: (val, row) => {
        return formatCEP(`${val}`);
      },
      align : 'left',
      label : 'CEP'
    },
    {
      name : 'street',
      align: 'left',
      label: 'Rua'
    },
    {
      name : 'number',
      align: 'left',
      label: 'Número'
    },
    {
      name : 'complement',
      align: 'left',
      label: 'Complemento'
    },
    {
      name : 'district',
      align: 'left',
      label: 'Bairro'
    },
    {
      name : 'city',
      field: row => row.city,
      align: 'left',
      label: 'Cidade'
    },
    {
      name : 'state',
      field: row => row.state,
      align: 'left',
      label: 'Estado'
    },
    {
      name : 'country',
      field: row => row.country,
      align: 'left',
      label: 'País'
    },
    { name: 'action' },
  ],
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

  components: {
    SearchCEPAddress,
  },

  data() {
    return {
      items    : [],
      dialog   : false,
      settings : SETTINGS,
      saving   : false,
      isLoading: false,
      item     : {
        nickname  : '',
        country   : '',
        state     : '',
        city      : '',
        district  : '',
        postalCode: '',
        street    : '',
        number    : '',
        complement: '',
      },
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `trainers/${this.id}/addresses`;
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

      let endpoint = `trainers/${this.id}/addresses`;
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

    // store method
    delete(id) {
      let options = {
        method : 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify({ id }),
      };

      let endpoint = `trainers/${this.id}/addresses`;
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
      this.$refs.myForm.validate()
        .then(success => {
          if (success) {
            this.saving = true;

            this.save({
              nickname   : this.item.nickname,
              country    : this.item.country,
              state      : this.item.state,
              city       : this.item.city,
              district   : this.item.district,
              postal_code: this.item.postalCode,
              street     : this.item.street,
              number     : this.item.number,
              complement : this.item.complement,
            })
              .then (data => {
                if (data) {
                  this.$refs.myForm.reset();

                  this.onRequest();

                  this.$emit('saved', data);
                }
              })
              .catch(error => {
                this.$refs.myForm.reset();

                this.$emit('error', { message: error.message });
              })
              .finally(() => {
                this.saving = false;
              });
          }
      })
    },

    removeItem(item) {
      if (window.confirm(this.$t('Are you sure about to remove this element?'))) {
        item._bussy = true;

        this.delete(item.id)
          .then (data => {
            if (data) {
              this.cleanItem(item.id);
            }
          })
          .catch(error => {
            this.$emit('error', { message: error.message });
          })
          .finally(() => {
            item._bussy = false;
          });
      }
    },

    cleanItem(id) {
      let item   = this.items.find(obj => obj['id'] == id);
      let indx   = this.items.indexOf(item);
      this.items = [...this.items.slice(0, indx), ...this.items.slice(indx + 1)];
    },

    onRequest() {
      if (this.isLoading)
        return;

      this.isLoading = true;

      this.getItems()
        .then(data => {
          let _items = [];

          if (data.members.length) {
            for (let index in data.members) {
              _items.push({
                id        : data.members[index].id,
                nickname  : data.members[index].nickname,
                country   : data.members[index].country,
                state     : data.members[index].state,
                city      : data.members[index].city,
                district  : data.members[index].district,
                postalCode: data.members[index].postalCode,
                street    : data.members[index].street,
                number    : data.members[index].number,
                complement: data.members[index].complement,
                _bussy    : false,
              });
            }
          }

          this.items = _items;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onCEPFound(address) {
      this.item.id         = null;
      this.item.country    = address.country;
      this.item.state      = address.state;
      this.item.city       = address.city;
      this.item.district   = address.district;
      this.item.postalCode = address.postalCode;
      this.item.street     = address.street;
      this.item.number     = '';
      this.item.complement = '';
    },

    isInvalid(key) {
      return val => {
        switch (key) {
          case 'email'   :
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
              return his.$t('The email is not valid');
          break;
          default:
            if (!(val && val.length > 0))
              return this.$t('messages.fieldRequired');
        }
        return true;
      };
    },
  },
};
</script>
