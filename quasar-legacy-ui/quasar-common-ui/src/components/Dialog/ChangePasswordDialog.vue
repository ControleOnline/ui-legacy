<template>
  <div>
    <q-dialog v-if="!openConfirmChangeDialog">
      <div class="bg-white full-width" style="max-height: 75%;">
        <q-item class="column q-pa-lg">
          <q-item-section class="text-bold q-gutter-y-md">
            <q-item-label>{{ $t('old_password') }}</q-item-label>
            <q-input
      dense
      outlined
              v-model="password"
              type="password"
              color="secondary"
              outlined
              dense
            />
          </q-item-section>
          <q-item-section class="text-bold q-gutter-y-md section-no-margin">
            <q-item-label>{{ $t('new_password') }}</q-item-label>
            <q-input
      dense
      outlined
              v-model="password"
              type="password"
              color="secondary"
              outlined
              dense
            />
          </q-item-section>
          <q-item-section class="text-bold q-gutter-y-md section-no-margin">
            <q-item-label>{{ $t('repeat_password') }}</q-item-label>
            <q-input
      dense
      outlined
              v-model="password"
              type="password"
              color="secondary"
              outlined
              dense
            />
          </q-item-section>
          <div class="flex items-center q-pt-lg q-pb-md">
            <p class="q-ma-none text-bold">{{ $t('obervation_dialog') }}</p>
            <q-space></q-space>
            <q-icon size="1.25rem" name="o_report"></q-icon>
          </div>
          <q-item-section class="section-no-margin">
            <q-item-label class="text-italic">
              {{ $t('description_password') }}
            </q-item-label>
            <q-item-label class="text-italic q-pt-md">
              {{ $t('example_password') }}
            </q-item-label>
          </q-item-section>
          <div class="flex q-pt-md">
            <q-btn
              class="q-py-sm q-px-md text-capitalize"
              outline
              color="secondary"
              :label="$t('cancel_dialog')"
              v-close-popup
            >
            </q-btn>
            <q-space></q-space>
            <q-btn
              class="q-py-sm q-px-md text-capitalize"
              color="secondary"
              :label="$t('confirm_dialog')"
              @click="confirmChangePassword"
            >
            </q-btn>
          </div>
        </q-item>
      </div>
    </q-dialog>
    <q-dialog v-else>
      <div class="bg-white full-width" style="max-height: 75%;">
        <q-item class="column q-pa-lg">
          <q-item-section class="q-py-xl items-center">
            <q-icon name="o_lock" size="4rem" color="secondary"></q-icon>
            <q-item-label class="q-pt-xl text-center" style="font-size: 1.25rem; max-width: 70%;">
              {{ $t('change_password_sucess') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      openConfirmChangeDialog: false,
    };
  },

  methods: {
    confirmChangePassword() {
      this.openConfirmChangeDialog = true;
      setTimeout(() => {
        this.$router.go({ name: 'profile' });
      }, 2000);
    },
  },

  beforeRouteUpdate() {
    this.openConfirmChangeDialog = false;
  },

  created() {
    this.openConfirmChangeDialog = false;
  },
};
</script>

<style lang="scss" scoped>
.section-no-margin {
  margin: 0!important;
}
</style>
