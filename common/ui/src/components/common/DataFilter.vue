<template>
  <q-card class="q-mb-sm">
    <q-card-section>
      <div class="row">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-input
            stack-label
            v-model="date.from"
            :label="$t('dashboard.from_date')"
            mask="##/##/####"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy1"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date.from"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy1.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-input
            stack-label
            v-model="date.to"
            :label="$t('dashboard.to_date')"
            mask="##/##/####"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy2"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date.to"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy2.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-card-actions v-if="showButton === true" align="center">
      <q-btn
        flat
        :loading="isLoading"
        :label="$t('dashboard.request')"
        color="primary"
        @click="$emit('dateChanged', date)"
      />
    </q-card-actions>
  </q-card>
</template>    
<script>
export default {
  props: {
    toDate: {
      type: String,
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    showButton: {
      type: Boolean,
      required: false,
    },
  },

  watch: {
    "date.to"() {
      if (!this.showButton) {
        this.$emit("dateChanged", this.date);
      }
    },
    "date.from"() {
      if (!this.showButton) {
        this.$emit("dateChanged", this.date);
      }
    },
  },

  data() {
    return {
      date: {
        from: this.fromDate,
        to: this.toDate,
      },
      isLoading: false,
    };
  },

  methods: {},
};
</script>