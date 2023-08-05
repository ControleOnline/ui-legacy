<template>
  <div>
    <q-dialog v-if="!openSaveDataCard">
      <div class="bg-white full-width" style="max-height: 70%;">
        <div class="flex items-center full-width">
          <q-item class="q-px-md q-py-sm column full-width">
            <q-btn
              icon="close"
              size="1rem"
              round
              color="secondary"
              flat
              style="align-self: end;"
              v-close-popup>
            </q-btn>

            <q-item-section class="section-no-margin q-py-xs">
              <q-input
      dense
      outlined 
                v-model="payment.number_card"
                dense
                label-color="secondary"
                color="secondary"
                placeholder="Ex: 5555 5555 5555 5555"
                class="q-pa-sm full-width"
              />
              <q-input
      dense
      outlined 
                v-model="payment.name"
                dense
                label-color="secondary"
                color="secondary"
                placeholder="Ex: Juliano..."
                class="q-pa-sm full-width"
              />

              <div class="row">
                <q-input
      dense
      outlined 
                  v-model="payment.date"
                  dense
                  label-color="secondary"
                  color="secondary"
                  mask="##/##"
                  placeholder="Ex: 12/29"
                  class="col-4 q-pa-sm"
                />
                <q-input
      dense
      outlined 
                  v-model="payment.cvv"
                  dense
                  label-color="secondary"
                  color="secondary"
                  maxlength="3"
                  placeholder="Ex: 999"
                  class="col-4 q-pa-sm"
                />
                <q-select dense outlined 
                  outlined
                  v-model="payment.parcel"
                  dense
                  :label="$t('parcel')"
                  color="secondary"
                  :options="options"
                  class="col-4 q-pa-sm"
                />
              </div>
            </q-item-section>

            <div class="flex items-center q-pa-sm full-width ">
              <q-icon name="shopping_cart" color="secondary" size="2.3rem"></q-icon>
              <q-item-label class="q-mx-sm text-bold text-secondary title-list">
                {{ total }}
              </q-item-label>

              <q-space></q-space>

              <q-btn
                class="text-capitalize"
                color="secondary"
                :label="$t('confirm_payment')"
                @click="openSaveDataCard = true"
              >
              </q-btn>
            </div>
          </q-item>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-else>
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

        <q-item class="column q-pa-lg">
          <q-item-section>
            <q-item-label class="text-bold title-list">{{ $t('ready') }}</q-item-label>
            <q-item-label class="text-bold title-list">
              {{ $t('your_reservation') }}
            </q-item-label>
            <q-item-label class="q-py-sm message-text">
              {{ $t('save_card') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-lg">
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            outline
            color="secondary"
            :label="$t('no_save_card')"
            v-close-popup
          >
          </q-btn>
          <q-space></q-space>
          <q-btn
            class="q-py-sm q-px-md text-capitalize"
            color="secondary"
            :label="$t('yes_save_card')"
            v-close-popup
          >
          </q-btn>
        </q-item>
      </div>
    </q-dialog>
</div>
</template>

<script>

export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      openSaveDataCard: false,
      payment: {
        number_card: '',
        name: '',
        date: '',
        cvv: '',
        parcel: '',
      },
      options: [
        {
          label: '1x',
          value: 1,
        },
        {
          label: '2x',
          value: 2,
        },
        {
          label: '3x',
          value: 3,
        },
        {
          label: '4x',
          value: 4,
        },
        {
          label: '5x',
          value: 5,
        },
        {
          label: '6x',
          value: 6,
        },
        {
          label: '7x',
          value: 7,
        },
        {
          label: '8x',
          value: 8,
        },
        {
          label: '9x',
          value: 9,
        },
        {
          label: '10x',
          value: 10,
        },
        {
          label: '11x',
          value: 11,
        },
        {
          label: '12x',
          value: 12,
        },
      ],
    };
  },
};
</script>
