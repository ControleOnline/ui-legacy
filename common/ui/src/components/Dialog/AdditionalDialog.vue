<template>
  <q-dialog>
    <div class="bg-white full-width" style="max-height: 70%">
      <q-item class="bg-secondary items-center">
        <q-item-label class="text-bold text-white">
          {{ $t("additional_services_dialog") }}
        </q-item-label>
        <q-space></q-space>
        <q-btn icon="close" size="1rem" round color="white" flat v-close-popup>
        </q-btn>
      </q-item>
      <div class="flex items-center full-width">
        <q-item class="q-px-md q-py-sm column full-width">
          <q-item-section class="section-no-margin q-py-xs">
            <q-item-label class="text-bold text-secondary"> Item </q-item-label>
            <q-input
              dense
              outlined
              v-model="name"
              label-color="secondary"
              color="secondary"
              autogrow
              placeholder="Ex: Barraca..."
              class="q-pa-none full-width"
            />
            <q-input
              dense
              outlined
              v-model="quantity"
              label-color="secondary"
              color="secondary"
              autogrow
              placeholder="Ex: 1"
              class="q-pa-none full-width"
            />
            <q-input
              dense
              outlined
              v-model="price"
              label-color="secondary"
              color="secondary"
              autogrow
              placeholder="Ex: 12.00"
              class="q-pa-none full-width"
            />
          </q-item-section>

          <q-item-section class="section-no-margin q-py-xs items-end">
            <q-btn
              dense
              class="q-pa-xs text-capitalize bg-secondary"
              outline
              color="white"
              :label="$t('send')"
              @click="addItem(name, quantity, price)"
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

  data() {
    return {
      name: null,
      quantity: null,
      price: null,
    };
  },

  methods: {
    addItem(name, quantity, price) {
      const additional = {
        label: name,
        price,
        quantity,
      };

      this.$emit("add-item", additional);

      this.name = null;
      this.quantity = null;
      this.price = null;
    },
  },
};
</script>
