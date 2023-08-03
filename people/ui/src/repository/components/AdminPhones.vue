<template>
  <div class="row form q-pa-md">
    <div class="col-3 text-h6">
      <div class="text-subtitle1 text-left">{{ $t('Phones') }}</div>
    </div>
    <div class="col-9">
      <div class="row justify-end">
        <q-btn  no-caps icon="add" size="sm" color="positive" class="q-ml-sm" @click="dialog = !dialog" />
      </div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table dense  :data="items" :columns="settings.columns" :visible-columns="settings.visibleColumns" row-key="id"
        :loading="isLoading" bordered>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="ddd" :props="props">{{ props.cols[0].value }}</q-td>
            <q-td key="phone" :props="props">{{ props.cols[1].value }}</q-td>
            <q-td auto-width>
              <q-btn flat round dense unelevated color="red" icon="delete" @click="removeItem(props.row)"
                :loading="props.row._bussy" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Novo telefone</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="myForm" @submit="onSubmit" class="q-mt-md">
            <q-input
      dense
      outlined lazy-rules stack-label v-model="item.ddd" type="text" label="DDD" class="q-mt-md"
              :rules="[isInvalid('ddd')]" mask="##" />
            <q-input
      dense
      outlined lazy-rules stack-label v-model="item.phone" type="text" label="Número" class="q-mt-md"
              :rules="[isInvalid('phone')]" mask="#########" />

            <div class="row justify-end">
              <q-btn unelevated no-caps :loading="saving" icon="save" type="submit" label="Salvar" size="md"
                color="primary" class="q-mt-md" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>


const SETTINGS = {
  visibleColumns: [
    'ddd',
    'phone',
    'action',
  ],
  columns: [
    {
      name: 'ddd',
      field: row => row.ddd,
      align: 'left',
      label: 'DDD'
    },
    {
      name: 'phone',
      field: row => row.phone,
      align: 'left',
      label: 'Número'
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
      type: Api,
      required: true
    },
    people_type: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      items: [],
      dialog: false,
      settings: SETTINGS,
      saving: false,
      isLoading: false,
      item: {
        ddd: null,
        phone: null,
      }
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getItems() {
      let endpoint = `${this.people_type}/${this.id}/phones`;
      return api.fetch(endpoint)
        
        .then(result => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify(values),
      };

      let endpoint = `${this.people_type}/${this.id}/phones`;
      return api.fetch(endpoint, options)
        
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
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body: JSON.stringify({ id }),
      };

      let endpoint = `${this.people_type}/${this.id}/phones`;
      return api.fetch(endpoint, options)
        
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
              "ddd": this.item.ddd,
              "phone": this.item.phone,
            })
              .then(data => {
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
          .then(data => {
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
      let item = this.items.find(obj => obj['id'] == id);
      let indx = this.items.indexOf(item);
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
                id: data.members[index].id,
                ddd: data.members[index].ddd,
                phone: data.members[index].phone,
                _bussy: false,
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

<style lang="scss" scoped>
.form {
  background-color: white;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>
