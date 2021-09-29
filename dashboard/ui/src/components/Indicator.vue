<template>
  <div class="col-12 col-md-4 column">
        <q-card
          class="q-mr-md-xs q-mb-xs-xs q-mb-md-none col column justify-around"
          :class="'bg-'+color+'-3'"
        >
          <q-card-section class="text-h5">
            <div class="flex row justify-between">
              <div class="col column">
                <q-skeleton v-if="!value" type="text" height="90px" width="50px" />
                <span v-else class="text-weight-bolder q-pa-md" style="font-size:2em"
                  >{{ value }}</span
                >
                <q-skeleton v-if="!label" type="text" height="70px" width="150px" />
                <span v-else class="text-weight-light" style="font-size:0.89em">{{ label }}</span>
              </div>
              <q-icon size="80px" :name="icon" class="col"
          :class="'text-'+color+'-2'"
               />
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              class="full-width"
              label="More information"
              icon-right="info"
              :to="to"
            />
          </q-card-actions>
        </q-card>
      </div>
</template>

<script>
export default {
  name: 'Indicator',
  data () {
    return {}
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    to: {
      type: Object,
      required: true
    }
  }
}
</script>
