<template>
  <div class="row">
    <Indicator
      :key="indicator.label"
      :color="indicator.color"
      :icon="indicator.icon"
      :value="indicator.value"
      :label="indicator.label"
      :to="indicator.to"
    />

    <Indicator
      :key="indicator.label"
      :color="indicator.color"
      :icon="indicator.icon"
      :value="indicator.value"
      :label="indicator.label"
      :to="indicator.to"
    />

    <Indicator
      :key="indicator.label"
      :color="indicator.color"
      :icon="indicator.icon"
      :value="indicator.value"
      :label="indicator.label"
      :to="indicator.to"
    />

    <!-- <div class="col-12 col-md-4 column">
        <q-card
          class="bg-blue-3 q-mr-md-xs q-mb-xs-xs q-mb-md-none col column justify-around"
        >
          <q-card-section class="text-h5">
            <div class="flex row justify-between">
              <div class="col column">
                <span class="text-weight-bolder q-pa-md" style="font-size:2em"
                  >2</span
                >
                <span class="text-weight-light">Lessons Given</span>
              </div>
              <q-icon size="80px" name="event" class="col text-blue-2" />
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              class="full-width"
              label="More information"
              icon-right="info"
              :to="{ name: 'teacher.Lessons.Index' }"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4 column">
        <q-card
          class="bg-green-3 q-mr-md-xs q-mb-xs-xs q-mb-md-none col  column justify-around"
        >
          <q-card-section class="text-h5">
            <div class="flex row justify-between">
              <div class="col column">
                <span class="text-weight-bolder q-pa-md" style="font-size:2em"
                  >5</span
                >
                <span class="text-weight-light">Schendules</span>
              </div>
              <q-icon size="80px" name="schedule" class="col text-green-2" />
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              class="full-width"
              label="More information"
              icon-right="info"
              :to="{ name: 'teacher.Schedules.Index' }"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4 column">
        <q-card
          class="bg-orange-3 q-pr-md-xs q-mb-xs-xs q-mb-md-none col  column justify-around"
        >
          <q-card-section class="text-h5">
            <div class="flex row justify-between">
              <div class="col column">
                <span class="text-weight-bolder q-pa-md" style="font-size:2em"
                  >0</span
                >
                <span class="text-weight-light">Unrated Students</span>
              </div>
              <q-icon size="80px" name="book" class="col text-orange-2" />
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn
              class="full-width"
              label="More information"
              icon-right="info"
              :to="{ name: 'teacher.Schedules.Index' }"
            />
          </q-card-actions>
        </q-card>
      </div> -->
    <div class="col-12 col-md-4 column">
      <q-card
        class="q-mr-md-xs q-mb-xs-xs q-mb-md-none col column justify-around"
        :class="'bg-' + color + '-3'"
      >
        <q-card-section class="text-h5">
          <div class="flex row justify-between">
            <div class="col column">
              <q-skeleton
                v-if="!value"
                type="text"
                height="90px"
                width="50px"
              />
              <span
                v-else
                class="text-weight-bolder q-pa-md"
                style="font-size:2em"
                >{{ value }}</span
              >
              <q-skeleton
                v-if="!label"
                type="text"
                height="70px"
                width="150px"
              />
              <span v-else class="text-weight-light" style="font-size:0.89em">{{
                label
              }}</span>
            </div>
            <q-icon
              size="80px"
              :name="icon"
              class="col"
              :class="'text-' + color + '-2'"
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
  </div>
</template>

<script>
export default {
  name: 'Indicators',
  data () {
    return {
      indicators: [
        {
          color: 'blue',
          label: '', // 'Lessons Given',
          value: 0, // 2,
          icon: 'event',
          to: { name: 'teacher.Lessons.Index' }
        },
        {
          color: 'green',
          label: 'Schendules',
          value: 3,
          icon: 'schedule',
          to: { name: 'teacher.Schedules.Index' }
        },
        {
          color: 'orange',
          label: 'Unrated Students',
          value: 1,
          icon: 'book',
          to: { name: 'teacher.Schedules.Index' }
        }
      ]
    }
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
