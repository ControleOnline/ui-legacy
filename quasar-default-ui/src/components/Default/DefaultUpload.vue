<template>
  <q-uploader ref="uploader" no-thumbnails square flat :url="endpoint" :headers="headers" :accept="accepted"
    field-name="file" color="white" @uploaded="fileUploaded" @failed="uploadFailed" @removed="filesRemoved"
    :multiple="multiple" :class="myClass" :auto-upload="autoupd" :form-fields="getFields">
    <template v-slot:header="scope">
      <div class="row no-wrap items-center justify-end q-pa-sm q-gutter-xs">
        <q-spinner v-if="scope.isUploading" color="primary" class="q-uploader__spinner" />
        <q-btn flat dense rounded v-if="scope.canAddFiles" type="a" icon="add_box" color="primary">
          <q-uploader-add-trigger />
          <q-tooltip>{{translate( 'select','tooltip')}}</q-tooltip>
        </q-btn>
        <q-btn v-if="scope.isUploading" round dense flat icon="clear" color="red" @click="scope.abort">
          <q-tooltip>{{translate( 'cancel','tooltip')}}</q-tooltip>
        </q-btn>
      </div>
    </template>

    <template v-slot:list="scope">
      <div class="row items-center" style="min-height: 100%">
        <div v-if="scope.files.length == 0" class="text-center text-camelcase" style="min-width: 100%; min-height: 100%">
          <span class="text-bold text-uppercase">{{translate( 'upload_area','tooltip')}}</span>
          <br>{{translate( 'upload_description','tooltip')}}
        </div>

        <q-list separator v-if="scope.files.length > 0" style="min-width: 100%">
          <q-item v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>

              <q-item-label caption>
                {{translate( 'status','tooltip')}}
                : {{ file.__status }}
              </q-item-label>

              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <q-btn flat dense round class="gt-xs" size="12px" icon="clear" color="red"
                @click="scope.removeFile(file)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>
  </q-uploader>
</template>

<script>
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';
import * as DefaultMethods from './DefaultMethods.js';

export default {
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: true,
    },
    autoupd: {
      type: Boolean,
      required: false,
      default: true,
    },
    extraData: {
      type: Array,
      required: false,
      default: () => []
    },
    maximized: {
      type: Boolean,
      required: false,
      default: false,
    },
    accepted: {
      type: String,
      required: false,
      default: () => '.jpg, .pdf, image/*'
    },
    endpoint: {
      type: String,
      required: false,
      default: () => `${ENTRYPOINT}/media_objects`
    },
    showError: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      headers: [
        {
          name: 'API-TOKEN',
          value: this.$store.getters['auth/user'].token
        },
      ],
    };
  },
  computed: {
    myClass() {
      return (`q-upd ${this.multiple ? 'q-upd-multiple' : 'q-upd-single'}`) +
        (` ${this.maximized ? 'q-upd-maximized' : ''}`);
    }
  },
  methods: {
    ...DefaultMethods,

    getFields() {
      return this.extraData;
    },
    filesRemoved() {
      this.$emit('filesRemoved');
    },
    fileUploaded(info) {
      let response = JSON.parse(info.xhr.response);
      this.$refs.uploader.removeUploadedFiles();
      this.$emit('fileUploaded', (response));
    },
    uploadFailed(info) {

      let response = JSON.parse(info.xhr.response);

      if (this.showError) {
        this.$q.notify({
          message:  translate(response.error, 'message'),
          position: 'bottom',
          type: 'negative',
        });
      }

      this.$emit('uploadFailed', (response));
    },
  },
};
</script>

<style lang="stylus">
  .q-upd
    min-width : 100% !important
    width     : 100% !important
    &-multiple, &-single
      border    : 1px dashed #cccccc !important
  .q-upd-maximized
    min-height: calc(100vh - 150px)!important    
</style>