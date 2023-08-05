<template>
  <div>
    <q-dialog v-if="!openConfirmCancellationDialog">
      <div class="bg-white full-width" style="max-height: 70%">
        <q-item class="column q-px-lg">
          <q-btn
            icon="close"
            size="1rem"
            round
            color="secondary"
            flat
            style="align-self: end"
            v-close-popup
          >
          </q-btn>
          <q-item-section class="q-pb-sm">
            <q-item-label>{{ translate("damn") }}</q-item-label>
            <q-item-label>
              {{ translate("why_do_you_cancel") }}
              <q-icon name="mood_bad" size="1.5rem"></q-icon>
            </q-item-label>
            <q-input
              dense
              outlined
              label-color="secondary"
              color="secondary"
              autogrow
              placeholder="Descreva.."
              class="q-pa-none full-width"
            />
          </q-item-section>
          <q-item-section class="section-no-margin q-py-sm">
            <div class="flex items-center q-pb-md">
              <q-item-label class="q-ma-none title-list text-secondary text-bold">
                {{ translate("import ant") }}
              </q-item-label>
              <q-space></q-space>
              <q-icon name="o_report"></q-icon>
            </div>
            <q-item-label>
              {{ translate("first_desc") }}
            </q-item-label>
            <q-item-label>
              {{ translate("second_desc") }}
            </q-item-label>
            <q-item-label class="q-pt-md">
              {{ translate("confirm_cancellation") }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="userRole === 'provider'" class="q-pa-lg">
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            outline
            color="secondary"
            :label="translate('yes_cancel_dialog')"
            @click="openConfirmCancellationDialog = true"
          >
          </q-btn>
          <q-space></q-space>
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            color="secondary"
            :label="translate('reschedule_cancel_dialog')"
            v-close-popup
          >
          </q-btn>
        </q-item>

        <q-item v-else class="q-pa-lg">
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            outline
            color="secondary"
            :label="translate('no_cancel_dialog')"
            v-close-popup
          >
          </q-btn>
          <q-space></q-space>
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            color="secondary"
            :label="translate('yes_confirm_dialog')"
            @click="openConfirmCancellationDialog = true"
          >
          </q-btn>
        </q-item>
      </div>
    </q-dialog>
    <q-dialog v-else>
      <div class="bg-white full-width text-center column" style="max-height: 70%">
        <q-btn
          icon="close"
          size="1rem"
          round
          color="secondary"
          flat
          style="align-self: end"
          v-close-popup
        >
        </q-btn>
        <q-item v-if="userRole === 'provider'" class="column q-pa-lg">
          <q-item-section class="q-pb-sm">
            <q-item-label>
              {{ translate("what_sad_day") }}
              <q-icon name="mood_bad" size="1.5rem"></q-icon>
            </q-item-label>
            <q-item-label class="q-pb-md">
              {{ translate("you_canceled_this_tour") }}
            </q-item-label>
            <q-item-label class="q-pb-md">
              {{ translate("make_payment") }}
            </q-item-label>
            <q-item-label>
              {{ translate("bank") }}
            </q-item-label>
            <q-item-label>
              {{ translate("ag") }}
            </q-item-label>
            <q-item-label>
              {{ translate("account") }}
            </q-item-label>
            <q-item-label>
              {{ translate("cnpj") }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-else class="column q-pa-lg">
          <q-item-label>
            {{ translate("what_sad_day") }}
            <q-icon name="mood_bad" size="1.5rem"></q-icon>
          </q-item-label>

          <q-item-label class="q-pb-md">
            {{ translate("you_canceled_your_trip") }}
          </q-item-label>

          <q-item-label class="q-pb-md">
            {{ translate("we_hope_to_see_you_soon") }}
          </q-item-label>

          <q-item-label class="q-pb-md">
            {{ translate("to_the_next") }}
          </q-item-label>
        </q-item>

        <q-item class="q-pa-lg column">
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            color="secondary"
            label="Ok"
            style="width: 30%; align-self: end"
            v-close-popup
            @click="close"
          >
          </q-btn>
        </q-item>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: null ?? "cliente",
      openConfirmCancellationDialog: false,
    };
  },

  created() {
    this.openConfirmCancellationDialog = false;

    this.userRole = this.$store.getters["User/getUser"].type_account;
  },
};
</script>

<style lang="scss" scoped>
.section-no-margin {
  margin: 0 !important;
}
</style>
