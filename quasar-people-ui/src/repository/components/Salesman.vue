<template>
  <div class="row form q-pa-md">
    <div class="col-3 text-h6">
      <div class="text-subtitle1 text-left">Lista de vendedores</div>
    </div>
    <div class="col-12 q-mt-md">
      <q-table dense  grid hide-header hide-pagination :loading="isLoading" :rows="items" row-key="id">
        <template v-slot:top>
          <div class="col-12 q-mb-md">
            <div class="row justify-end">
              <q-btn icon="add" size="sm" color="positive" class="q-ml-sm" @click="dialog = !dialog" />
            </div>
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3 col-lg-2">
            <q-card>
              <q-img basic :src="props.row.image">
                <div class="absolute-bottom text-subtitle1 text-center">
                  {{ props.row.name }}
                </div>
              </q-img>
              <q-card-section>
                <q-list>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="perm_identity" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.document }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="email" />
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-separator />
              <q-card-actions align="around">
                <!--
                <q-btn flat round dense
                  color   ="primary"
                  icon    ="edit"
                  @click  ="editItem(props.row)"
                  :disable="props.row._bussy"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                -->

                <q-btn flat round dense color="red" icon="delete" @click="removeItem(props.row)"
                  :loading="props.row._bussy" :disable="props.row.isProvider">
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Buscar vendedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form ref="myForm" @submit="onSubmit" class="q-mt-md">
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12">
                <q-input
      dense
      outlined  stack-label lazy-rules unmasked-value v-model="item.document" type="text"
                  class="q-mb-sm" :label="$t('CNPJ')" :mask="'##.###.###/####-##'" :placeholder="'Digite o CNPJ'"
                  :rules="[isInvalid('document')]" :loading="searching" @input="searchSalesman" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input
      dense
      outlined stack-label lazy-rules v-model="item.name" type="text" class="q-mb-sm"
                  :label="$t('Razão social')" :placeholder="'Razão social'" :rules="[isInvalid('name')]"
                   />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input
      dense
      outlined stack-label lazy-rules v-model="item.alias" type="text" class="q-mb-sm"
                  :label="$t('Nome Fantasia')" :placeholder="'Nome fantasia'" :rules="[isInvalid('alias')]"
                   />
              </div>
            </div>
            <div class="row justify-end">
              <q-btn :loading="saving" icon="save" type="submit" label="Salvar" size="md" color="primary"
                class="q-mt-md" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import { api } from "@controleonline/../../src/boot/api";
import { formatDocument } from '@controleonline/quasar-common-ui/src/utils/formatter';
import md5 from 'md5';
import { mapGetters } from 'vuex';

export default {
  props: {
    id: {
      required: true,
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
      saving: false,
      isLoading: false,
      searching: false,
      item: {
        document: '',
        name: '',
        alias: '',
      }
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      myProvider: 'people/currentCompany',
    }),
  },

  methods: {
    // store method
    getItems() {
      return api.fetch(`${this.people_type}/${this.id}/salesman`)
        
        .then(result => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method: 'PUT',
       
        body: (values),
        params: {
          myProvider: this.myProvider.id
        }
      };

      return api.fetch(`${this.people_type}/${this.id}/salesman`, options)
        
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
       
        body: ({ id }),
      };

      return api.fetch(`${this.people_type}/${this.id}/salesman`, options)
        
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
    getSalesman(id) {

      return api.fetch(`${this.people_type}/search-salesman`, { params: { document: id } })
        
        .then(data => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });


    },

    searchSalesman() {

      if (this.item.document.length != 14) {
        return;
      }

      this.searching = true;

      this.getSalesman(this.item.document)
        .then(data => {
          if (data) {
            this.item.name = data.name;
            this.item.alias = data.alias;
          }
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          this.searching = false;
        });
    },

    gravatar(email) {
      return 'https://www.gravatar.com/avatar/' + md5(email) + '?s=400';
    },

    onSubmit() {
      this.$refs.myForm.validate()
        .then(success => {
          if (success) {
            this.saving = true;

            this.save({
              "document": this.item.document,
              "name": this.item.name,
              "alias": this.item.alias,
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
              let image = data.members[index].image ? data.members[index].image.url : null;
              if (image == null) {
                image = this.gravatar(data.members[index].email ? data.members[index].email : 'email@gmail.com');
              }

              _items.push({
                id: data.members[index].id,
                name: data.members[index].type == 'J' ? data.members[index].name : `${data.members[index].name} ${data.members[index].alias}`,
                image: image,
                email: data.members[index].email,
                document: formatDocument(data.members[index].document),
                isProvider: data.members[index].is_provider,
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
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

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