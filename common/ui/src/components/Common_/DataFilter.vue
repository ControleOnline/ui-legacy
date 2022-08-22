<template>
  <div class="row q-py-md q-gutter-x-md container-filter" style="justify-content: right;">
    <q-input
      outlined
      id="date-initial"
      stack-label
      class="bg-transparent margin-filter element-filter"
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
    <q-input
      outlined
      stack-label
      class="bg-transparent margin-filter element-filter"
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
    <q-btn
      :loading="isLoading"
      :label="$t('dashboard.request')"
      class="element-filter margin-filter"
      color="primary"
      @click="$emit('dateChanged', date)"
    />
  </div>
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

<style lang="scss" scoped>
@media (max-width: 630px) {
  .container-filter {
    max-width: 100%;
    display: inherit;
  }

  .margin-filter {
    margin-top: 10px;
  }

  .element-filter {
    width: 100%;
  }
}
</style>