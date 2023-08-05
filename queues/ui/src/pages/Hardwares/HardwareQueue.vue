<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 flex justify-end q-pb-md">
        <q-btn
          dense
          color="primary"
          :label="translate(`Add`)"
          @click="newHardwareQueue = true"
        ></q-btn>
      </div>
      <HardwareQueue></HardwareQueue>
    </div>

    <q-dialog v-model="newHardwareQueue">
      <q-card>
        <q-card-section>
          <span class="text-h6"> {{ translate(`Add`) }}</span>
        </q-card-section>
        <HardwareQueueCreate></HardwareQueueCreate>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import translate from "@controleonline/../../src/boot/translate";
import HardwareQueueCreate from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareQueueCreate.vue';
import HardwareQueue from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareQueueList.vue';

import { mapGetters } from "vuex";

export default {

  components: {
    HardwareQueue,
    HardwareQueueCreate,
},

  data() {
    return {
      
      newHardwareQueue: false,
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },

  created() {

  },
  watch: {

  },

  methods: {

  },

}
</script>
