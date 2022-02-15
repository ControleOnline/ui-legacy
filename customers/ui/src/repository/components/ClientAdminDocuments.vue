<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      <q-table flat
        :data           ="items"
        :columns        ="settings.columns"
        :visible-columns="settings.visibleColumns"
        row-key         ="id"
        :loading        ="isLoading"
      >
        <template v-slot:top>
          <div class="col-3 q-mb-md text-h6">
            Lista de documentos
          </div>
          <div class="col-9 q-mb-md">
            <div class="row justify-end">
              <q-btn
                label ="Adicionar"
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
          <div class="text-h6">Novo documento</div>
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
                  Sem resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input lazy-rules stack-label unmasked-value
              v-model="item.document"
              type   ="text"
              label  ="Documento"
              class  ="q-mt-md"
              :rules ="[isInvalid('document')]"
              :mask  ="docMask"
            />

            <div class="row justify-end">
              <q-btn
                :loading="saving"
                icon    ="save"
                type    ="submit"
                label   ="Salvar"
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
      label: 'Tipo de documento'
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
      {
        label: 'CNPJ',
        value: 3,
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
      docMask  : '',
      item     : {
        type    : null,
        document: null,
      }
    };
  },

  created() {
    this.onRequest();
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
      let endpoint = `customers/${this.id}/documents`;
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

      let endpoint = `customers/${this.id}/documents`;
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

      let endpoint = `customers/${this.id}/documents`;
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
      if (window.confirm('Tem certeza que deseja eliminar este registro?')) {
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

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return 'Este campo é obrigatório';

        return true;
      };
    },
  },
};
</script>