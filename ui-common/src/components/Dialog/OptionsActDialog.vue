<template>
  <q-dialog>
    <div class=" full-width" style="max-height: 70%;">
      <q-item class="bg-secondary items-center">
        <q-item-label class="text-bold text-white">
          {{ $t('choose_your_area_of_expertise') }}
        </q-item-label>
        <q-space></q-space>
        <q-btn
          icon="close"
          size="1rem"
          round
          color="white"
          flat
          v-close-popup
        >
        </q-btn>
      </q-item>

      <q-btn
        v-for="option in options"
        :key="option.value"
        class="full-width border-division-dialog q-py-sm q-px-md"
        flat
        style="text-transform: none;"
        :label="$t(option.label)"
        align="left"
        @click="selectAct(option.label)"
        v-close-popup
      >
      </q-btn>
    </div>
  </q-dialog>
</template>

<script>
export default {
  computed: {
    options: {
      get() { return this.$store.getters['User/getOptionsAct']; },
      set(value) { this.$store.commit('User/setOptionsAct', { optionsAct: value }); },
    },
  },

  methods: {
    selectAct(act) {
      this.$emit('select-act', act);
    },
  },
};
</script>
