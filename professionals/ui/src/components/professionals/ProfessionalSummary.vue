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
      <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input stack-label lazy-rules outlined
              v-model     ="item.name"
              type        ="text"
              class       ="q-mb-sm"
              :label      ="$t('professionals.form.name')"
              :placeholder="$t('professionals.form.placeholder.name')"
              :rules      ="[isInvalid('name')]"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input stack-label lazy-rules outlined
              v-model     ="item.alias"
              type        ="text"
              class       ="q-mb-sm"
              :label      ="$t('professionals.form.lastname')"
              :placeholder="$t('professionals.form.placeholder.lastname')"
              :rules      ="[isInvalid('alias')]"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div v-show="false" class="col-xs-12 col-sm-grow">
            <q-input stack-label outlined
              v-model="item.birthday"
              mask   ="##/##/####"
              :label ="$t('professionals.form.birthday')"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model ="item.birthday"
                      mask    ="DD/MM/YYYY"
                      @input  ="() => $refs.qDateProxy1.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div
            v-for="(field, index) in particulars"
            :key ="index"
            class="col-xs-12 col-sm-grow"
          >
            <q-input stack-label lazy-rules outlined
              v-model="field.value"
              :prefix="field.type == 'money' ? 'R$' : null"
              type   ="text"
              :label ="$t(field.label)"
              :rules ="field.required ? [isInvalid(field.type)] : [true]"
              class  ="q-mb-sm"
              @input ="field._updated = true"
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            :loading="saving"
            type    ="submit"
            icon    ="save"
            :label  ="$t('Save')"
            size    ="md"
            color   ="primary"
            class   ="q-mt-md"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import Api from '@freteclick/quasar-common-ui/src/utils/api';

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
      saving     : false,
      isLoading  : false,
      particulars: [],
      item       : {
        name    : null,
        alias   : null,
        birthday: null,
      }
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getSummary() {
      return this.api.private(`trainers/${this.id}/summary`)
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

      let endpoint = `trainers/${this.id}/summary`;
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
    getParticulars() {
      let params = {
        'peopleType': 'F',
        'context'   : 'trainers',
        'fieldType' : ['text', 'money']
      };

      return this.api.private('particulars_types', { params })
        .then(response => response.json())
        .then(result => {
          return result['hydra:member'];
        });
    },

    onSubmit() {
      this.saving = true;

      this.save({
        "name"       : this.item.name,
        "alias"      : this.item.alias,
        "birthday"   : this.item.birthday.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/g, "\$3\-\$2\-\$1"),
        "particulars": this.particulars
          .filter(field => field._updated && field.value !== null)
          .map   (field => {
            return {
              "id"   : field.id,
              "type" : field.typeId,
              "value": field.value
            };
          })
      })
        .then (data => {
          if (data) {
            if (data.id) {
              this.updateParticularFields(data.particulars);
            }

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

      this.getSummary()
        .then(data => {
          this.item.name     = data.name;
          this.item.alias    = data.alias;
          this.item.type     = data.type;
          this.item.birthday = data.birthday.replace(/^(\d{4})\-(\d{2})\-(\d{2})[\W\w\d]*$/g, "\$3\-\$2\-\$1");

          this.getParticulars()
            .then(types => {
              let _types = [];

              types.forEach(type => {
                let item = {
                  id      : null,
                  typeId  : type['@id'].replace(/\D/g, ''),
                  label   : type.typeValue,
                  value   : null,
                  required: type.required === null ? false : ((type.required.split(':')).includes('trainers')),
                  type    : type.fieldType,
                  _updated: false
                };

                if (data.particulars.length) {
                  let particular = data.particulars.find(p => p.type.id == item.typeId);
                  if (particular) {
                    item.id    = particular.id;
                    item.value = particular.value;
                  }
                }

                _types.push(item);
              });

              this.particulars = _types;
            })
            .finally(() => {
              this.isLoading = false;
            });
        });
    },

    updateParticularFields(particulars) {
      if (particulars.length) {
        particulars.forEach(item => {
          let field = this.particulars.find(f => f.typeId == item.type.id);
          let index = this.particulars.indexOf(field);
          if (field) {
            this.particulars[index].id       = item.id;
            this.particulars[index]._updated = false;
          }
        });
      }
    },

    isInvalid(key) {
      return val => {
        if (key == 'money') {
          if (isNaN(val)) {
            return this.$t('Value is not valid');
          }

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
