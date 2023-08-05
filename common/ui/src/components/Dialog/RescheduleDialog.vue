<template>
  <q-dialog>
    <div class="bg-white full-width column" style="max-height: 70%;">
      <q-btn
        icon="close"
        size="1rem"
        round
        color="secondary"
        flat
        style="align-self: end;"
        v-close-popup>
      </q-btn>

      <q-item class="column text-center q-pa-lg">
        <q-item-section>
          <q-item-label>{{ translate('attention') }}</q-item-label>
          <q-item-label class="q-py-sm">
            {{ translate('first_desc_reschedule') }}
          </q-item-label>
          <q-item-label class="q-py-sm">
            {{ translate('second_desc_reschedule') }}
          </q-item-label>
          <q-item-label class="q-py-sm">
            {{ translate('third_desc_reschedule') }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-pa-lg">
        <q-btn
          class="q-py-sm q-px-md text-capitalize"
          outline
          color="secondary"
          :label="translate('cancel_reschedule')"
          v-close-popup
        >
        </q-btn>
        <q-space></q-space>
        <q-btn
          class="q-py-sm q-px-md text-capitalize"
          color="secondary"
          :label="translate('confirm_reschedule')"
          v-close-popup
        >
        </q-btn>
      </q-item>
    </div>
  </q-dialog>
</template>
