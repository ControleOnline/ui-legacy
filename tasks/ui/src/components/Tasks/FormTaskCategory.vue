<template>
  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-12">
        <q-input stack-label lazy-rules
          v-model    ="item.name"
          type       ="text"
          class      ="q-mb-sm"
          label      ="Nome *"
          placeholder="Digite o nome"
          :rules     ="[isInvalid('name')]"
          :outlined  ="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         label    ="Salvar"
         :loading ="isSaving"
      />
    </div>

  </q-form>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';

export default {
  props: {
    api: {
      type    : Api,
      required: true
    },
    categoryId: {
      type    : Number,
      required: false
    },
    categoryData: {
      type    : Object,
      required: false
    }
  },
  
  data() {
    return {
      item: {
        id  : null,
        name: null,
      },
      isSaving: false,
    }
  },

  created() {
    if (this.categoryData) {
      this.item.id   = this.categoryId;
      this.item.name = this.categoryData.name;
    }
  },

  methods: {

    saveCategory(payload) {
      return this.api.private('/categories' + (this.categoryId ? "/" + this.categoryId : ""), { 
        body: JSON.stringify(payload),
        method: this.categoryId ? "PUT" : "POST"
       })
        .then(response => response.json())
        .then(result => {
          if (result['@id']) {
            return {
              success: true,
              id: result['@id'].split('/')[2]
            };
          }
          else {
            return {
              success: false
            };
          }
        });

    },
    
    onSubmit() {
      this.isSaving = true;
      
      var payload = {
        name: this.item.name,
      };

      if (this.categoryId) {
        payload.id = this.categoryId;
      }

      var error = () => {
          this.$q.notify({
            message : "Não foi possível cadastrar, tente novamente mais tarde.",
            position: 'bottom',
            type    : 'negative',
          });
      };

      this.saveCategory(payload).then(res => {
        if (res.success) {
          this.$emit('saved', res.id);
        }
        else {
          error();
        }
        this.isSaving = false;
      }).catch(e => {
        error();
        this.isSaving = false;
      });
    },

    isInvalid(key) {
      return val => {

        if (!(val && (val.length > 0 || (typeof val === "object" && Object.keys(val).length))))
          return this.$t('messages.fieldRequired');
          
        return true;
      };
    },
  }

}

</script>
