<template>
  <q-dialog ref="NotificationDialog">
    <div class=" full-width" style="max-height: max-content;">
      <q-item class="column q-px-lg">
        <q-btn
          icon="close"
          size="1rem"
          round
          color="secondary"
          flat
          style="align-self: end;"
          v-close-popup>
        </q-btn>

        <q-item-section class="q-pb-sm">
          <q-item-label class="text-bold q-py-xs">
            {{ $t('hi') }}, {{ user.user_name }}!
          </q-item-label>
          <q-item-label class="q-py-xs">
            {{ message }}
          </q-item-label>
          <q-item-label class="text-bold q-py-xs">
            {{ $t('what_you_want') }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="row q-px-lg">
        <q-btn
          dense
          class="col-3 text-capitalize size-button"
          color="secondary"
          :label="$t('accept')"
          v-close-popup
        >
        </q-btn>
        <q-space></q-space>
        <q-btn
          dense
          class="col-3 text-capitalize size-button"
          color="secondary"
          outline
          :label="$t('refuse')"
          v-close-popup
        >
        </q-btn>
        <q-space></q-space>
        <q-btn
          dense
          class="col-3 text-capitalize"
          color="secondary"
          style="margin-top: -0.4rem;"
          :label="$t('negotiate')"
          flat
          stack
          icon="o_forum"
          v-close-popup
        >
        </q-btn>
      </q-item>
    </div>
  </q-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },

  computed: {
    user: {
      get() { return this.$store.getters['User/getUser']; },
    },
  },

  methods: {
    show() {
      this.$refs.NotificationDialog.show();
    },
    hide() {
      this.$refs.NotificationDialog.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.size-button {
  max-height: 2.5rem;
}
</style>
