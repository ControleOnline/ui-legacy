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
            {{ $t('Documents') }}
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
            <q-td key="type"     :props="props">{{ props.cols[0].value }}</q-td>
            <q-td key="document" :props="props">{{ props.cols[1].value }}</q-td>
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

    <div v-if="particulars.length > 0" class="col-12">
      <q-separator />
      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-12 q-mb-md text-h6">
          {{ $t('Files') }} <span class="text-caption text-weight-light">{{ fileing ? `${$t('loading')}...` : '' }}</span>
        </div>
        <div
          v-for="(field, index) in particulars"
          :key ="index"
          class="col-xs-12 col-sm-grow"
        >
          <q-file outlined stack-label bottom-slots
            v-model   ="field.file"
            :label    ="$t(field.label)"
            @input    ="(file) => {
              field._updated = true;
              uploadFile(field, file);
            }"
            :accept   ="field.accept"
            :loading  ="field._isUpld"
            :clearable="field.id === null && field._isUpld === false"
          >
            <template v-slot:append>
              <q-icon
                v-if ="field.id === null"
                name ="attachment"
                color="primary"
              />
              <q-btn flat round dense
                v-if    ="field.id !== null && field._updated === false"
                color   ="red"
                icon    ="delete"
                @click  ="removeFile(field)"
                :loading="field._isDelet"
              />
              <q-btn flat round dense
                v-if    ="field.id !== null"
                color   ="blue"
                icon    ="cloud_download"
                @click  ="downloadFile({ id: field.fileId, name: field.name })"
              />
            </template>
          </q-file>
        </div>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('New Document') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="myForm" @submit="onSubmit" class="q-mt-md">
            <q-select stack-label
              label   ="Tipo de documento"
              v-model="item.type"
              :options="settings.select.doctypes"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                  {{ $t('No results') }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input lazy-rules stack-label unmasked-value
              v-model="item.document"
              type   ="text"
              :label ="$t('professionals.form.document')"
              class  ="q-mt-md"
              :rules ="[isInvalid('document')]"
              :mask  ="docMask"
            />

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
import Api                from '@controleonline/quasar-common-ui/src/utils/api';
import { formatDocument } from '@controleonline/quasar-common-ui/src/utils/formatter';
import { exportFile }     from 'quasar';

const SETTINGS = {
  visibleColumns: [
    'type'    ,
    'document',
    'action'  ,
  ],
  columns       : [
    {
      name : 'type',
      field: row => row.type,
      align: 'left',
      label: 'Tipo de Documento'
    },
    {
      name  : 'document',
      field : row => row.document,
      align : 'left',
      format: (val) => {
        return formatDocument(val);
      },
      label : 'Documento'
    },
    { name: 'action' },
  ],
  select        : {
    doctypes: [
      {
        label: 'R.G.',
        value: 1,
      },
      {
        label: 'CPF',
        value: 2,
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
      items    : [],
      dialog   : false,
      settings : SETTINGS,
      saving   : false,
      isLoading: false,
      fileing  : false,
      docMask  : '',
      item     : {
        type    : null,
        document: null,
      },
      particulars: [],
    };
  },

  created() {
    this.onRequest();
    this.loadParticulars();
  },

  watch: {
    'item.type'(type) {
      if (type.value == 3) {
        this.docMask = '##.###.###/####-##';
        return;
      }

      if (type.value == 2) {
        this.docMask = '###.###.###-##';
        return;
      }

      this.docMask = '';
    }
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `trainers/${this.id}/documents`;
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

      let endpoint = `trainers/${this.id}/documents`;
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

      let endpoint = `trainers/${this.id}/documents`;
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
        'fieldType' : 'file'
      };

      return this.api.private('particulars_types', { params })
        .then(response => response.json())
        .then(result => {
          return result['hydra:member'];
        });
    },

    // store method
    getFiles() {
      return this.api.private(`trainers/${this.id}/files`)
        .then(response => response.json())
        .then(result => {
          return result.response.data;
        });
    },

    // store method
    deleteFile(id) {
      let options = {
        method : 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify({ id }),
      };

      return this.api.private(`trainers/${this.id}/files`, options)
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
    saveFile(data) {
      const dataForm = new FormData();

      dataForm.append('customer', this.id  );
      dataForm.append('type'    , data.type);
      dataForm.append('file'    , data.file);

      if (data.id !== null) {
        dataForm.append('id', data.id);
      }

      return this.api.private('trainers/files', { method: 'POST', body: dataForm })
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
    downloadFile(file) {
      return this.api.private(`trainers/${this.id}/files/${file.id}`)
        .then(response => response.blob())
        .then((blob) => {
          if (!exportFile(file.name, blob, blob.type)) {
            throw new Error(this.$t('Download error'));
          }
        });
    },

    onSubmit() {
      this.$refs.myForm.validate()
        .then(success => {
          if (success) {
            this.saving = true;

            this.save({
              "type"    : this.item.type.value,
              "document": this.item.document,
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

    removeFile(data) {
      if (window.confirm(this.$t('Are you sure about to remove this file?'))) {
        data._isDelet = true;

        this.deleteFile(data.id)
          .then(result => {
            if (result === true) {
              let field = this.particulars.find(f => f.id == data.id);
              let index = this.particulars.indexOf(field);
              if (field) {
                this.particulars[index].id       = null;
                this.particulars[index].file     = null;
                this.particulars[index].value    = null;
                this.particulars[index].name     = null;
                this.particulars[index]._updated = false;
              }
            }
          })
          .catch(error => {
            this.$emit('error', { message: error.message });
          })
          .finally(() => {
            data._isDelet = false;
          });
      }
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
                id      : data.members[index].id,
                type    : data.members[index].type,
                document: data.members[index].document,
                _bussy  : false,
              });
            }
          }

          this.items = _items;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    loadParticulars() {
      this.fileing = true;

      this.getParticulars()
        .then(types => {
          if (!types.length) {
            return;
          }

          this.getFiles()
            .then(files => {
              let _types = [];

              types.forEach(type => {
                let item = {
                  id      : null,
                  typeId  : type['@id'].replace(/\D/g, ''),
                  label   : type.typeValue,
                  value   : null,
                  required: type.required === null ? false : ((type.required.split(':')).includes('trainers')),
                  type    : type.fieldType,
                  file    : null,
                  name    : null,
                  fileId  : null,
                  accept  : type.fieldConfigs ? (JSON.parse(type.fieldConfigs)).accept : null,
                  _updated: false,
                  _isDelet: false,
                  _isUpld : false,
                };

                if (files.length) {
                  let particular = files.find(p => p.type.id == item.typeId);
                  if (particular) {
                    item.id     = particular.id;
                    item.value  = particular.value;
                    item.name   = particular.value ? particular.value.name : null;
                    item.file   = new File(["foo"], item.name, { type: "text/plain" });
                    item.fileId = particular.value ? particular.value.file : null;
                  }
                }

                _types.push(item);
              });

              this.particulars = _types;
          })
          .finally(() => {
              this.fileing = false;
          });
        });
    },

    uploadFile(item, file) {
      if (!file) {
        return;
      }

      item._isUpld = true;

      this.saveFile({
        id  : item.id,
        type: item.typeId,
        file: file
      })
        .then (data => {
          if (data) {

            // update particular

            let field = this.particulars.find(f => f.typeId == data.type.id);
            let index = this.particulars.indexOf(field);
            if (field) {
              this.particulars[index].id       = data.id;
              this.particulars[index]._updated = false;
            }

            this.$emit('saved', data);
          }
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          item._isUpld = false;
        });
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        return true;
      };
    },
  },
};
</script>
