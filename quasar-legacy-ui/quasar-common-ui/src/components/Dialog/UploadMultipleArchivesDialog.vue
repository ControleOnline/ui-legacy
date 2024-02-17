<template>
  <q-dialog>
    <div class=" full-width" style="max-height: 70%;">
      <q-item class="bg-secondary items-center">
        <q-item-label class="text-bold text-white">
          {{ $t('add_images_dialog') }}
        </q-item-label>
        <q-space></q-space>
        <q-btn
          icon="close"
          size="1rem"
          round
          color="white"
          flat
          v-close-popup>
        </q-btn>
      </q-item>

      <div class="flex items-center full-width">
        <q-item class="q-px-md q-py-sm column full-width">
          <q-item-section class="section-no-margin q-py-xs">
            <q-item-label class="text-bold text-secondary">
              {{ $t('images') }}
            </q-item-label>
            <q-file
              class="q-pa-none full-width"
              color="secondary"
              v-model="archive"
              multiple
              append
              :label="$t('upload_multiple_files')"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-item-section>

          <q-item-section class="section-no-margin q-py-xs items-end">
            <q-btn
              dense
              class="q-pa-xs text-capitalize bg-secondary"
              outline
              color="white"
              :label="$t('send_multiple_upload')"
              @click="sendArchive"
              v-close-popup
              style="width: 4rem;"
            >
            </q-btn>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  emits: 'ok',

  data() {
    return {
      archive: null,
    };
  },

  methods: {
    sendArchive() {
      this.$emit('ok', this.archive);
    },
  },
};
</script>

<style lang="scss" scoped>
.section-no-margin {
  margin: 0!important;
}
</style>
