<template>
  <q-dialog>
    <div class="bg-white full-width" style="max-height: 70%">
      <q-item class="bg-secondary items-center">
        <q-item-label class="text-bold text-white">
          {{ title }}
        </q-item-label>
        <q-space></q-space>
        <q-btn icon="close" size="1rem" round color="white" flat v-close-popup> </q-btn>
      </q-item>

      <div class="flex items-center full-width">
        <q-item class="q-px-md q-py-sm column full-width">
          <q-item-section class="section-no-margin q-py-xs">
            <q-item-label class="text-bold text-secondary">
              {{ subtitle }}
            </q-item-label>
            <q-input
              dense
              outlined
              v-model="text"
              label-color="secondary"
              color="secondary"
              autogrow
              placeholder="Ex: item..."
              class="q-pa-none full-width"
            />
          </q-item-section>

          <q-item-section class="section-no-margin q-py-xs items-end">
            <q-btn
              dense
              class="q-pa-xs text-capitalize bg-secondary"
              outline
              color="white"
              :label="translate('send_included')"
              @click="addIncluded(text)"
              v-close-popup
              style="width: 4rem"
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
  emits: "ok",

  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      text: null,
    };
  },

  methods: {
    addIncluded(value) {
      this.$emit("add-included", value);

      this.text = null;
    },
  },
};
</script>
