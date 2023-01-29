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
          <q-item-label>{{ $t('attention') }}</q-item-label>
          <q-item-label class="q-py-sm">
            {{ $t('first_desc_reschedule') }}
          </q-item-label>
          <q-item-label class="q-py-sm">
            {{ $t('second_desc_reschedule') }}
          </q-item-label>
          <q-item-label class="q-py-sm">
            {{ $t('third_desc_reschedule') }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-pa-lg">
        <q-btn
          class="q-py-sm q-px-md text-capitalize"
          outline
          color="secondary"
          :label="$t('cancel_reschedule')"
          v-close-popup
        >
        </q-btn>
        <q-space></q-space>
        <q-btn
          class="q-py-sm q-px-md text-capitalize"
          color="secondary"
          :label="$t('confirm_reschedule')"
          v-close-popup
        >
        </q-btn>
      </q-item>
    </div>
  </q-dialog>
</template>
