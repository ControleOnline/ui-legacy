<template>
  <q-form
    ref    ="myForm"
    @submit="onSubmit"
  >
    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12">
        <q-input
      dense
      outlined stack-label lazy-rules
          v-model="item.empresa"
          type   ="text"
          :label ="$t('Empresa')"
          :rules ="[isInvalid()]"
        />
        <q-input
      dense
      outlined stack-label lazy-rules
          v-model="item.nomeArquivo"
          type   ="text"
          :label ="$t('Nome do arquivo')"
          :rules ="[isInvalid()]"
        />
      </div>
      <div class="col-xs-12">
        <q-file stack-label bottom-slots
          v-model   ="item.arquivo"
          :label    ="$t('Arquivo')"
          @input    ="(file) => {
            uploadFile(null, file);
          }"
          :accept   ="'.pdf'"
          :loading  ="false"
          :clearable="true"
        >
          <template v-slot:append>
            <q-icon
              v-if ="true"
              name ="attachment"
              color="primary"
            />
            <q-btn flat round dense
              v-if    ="true"
              color   ="red"
              icon    ="delete"
              @click  ="removeFile(null)"
              :loading="false"
            />
            <q-btn flat round dense
              v-if    ="true"
              color   ="blue"
              icon    ="cloud_download"
              @click  ="downloadFile({ id: 1, name: 'file.pdf' })"
            />
          </template>
        </q-file>
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

export default {
  props: {
    id: {
      required: false,
      default : null
    },
  },

  data() {
    return {
      saving    : false,
      loading   : false,
      item      : {
        empresa    : null,
        nomeArquivo: null,
        arquivo    : null,
      },
    };
  },

  methods: {
    onSubmit () {
      this.$refs.myForm.validate()
        .then(success => {
          if (success) {
            let payload = {};

            this.$emit('save', payload);
          }
      })
    },

    uploadFile(item, file) {
      if (!file) {
        return;
      }
    },

    removeFile(data) {
      if (window.confirm(this.$t('Tem certeza que deseja eliminar este arquivo?'))) {

      }
    },

    downloadFile(file) {
      /*
      return api.fetch(`download/${this.id}/files/${file.id}`)
        .then(response => response.blob())
        .then((blob) => {
          if (!exportFile(file.name, blob, blob.type)) {
            throw new Error(this.$t('Download error'));
          }
        });
      */
    },

    isInvalid(key) {
      return val => {
        switch (key) {
          case 'email'   :
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
              return 'O email informado não é válido';
          break;
          default:
            if (!(val && val.length > 0))
              return 'Este campo é obrigatório';
        }
        return true;
      };
    },
  },
};
</script>
