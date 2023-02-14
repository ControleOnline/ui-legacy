<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 flex justify-end q-pb-md">
        <q-btn
          dense
          color="primary"
          :label="$t(`Add`)"
          @click="newHardwareQueue = true"
        ></q-btn>
      </div>
      <HardwareQueue></HardwareQueue>
    </div>

    <q-dialog v-model="newHardwareQueue">
      <q-card>
        <q-card-section>
          <span class="text-h6"> {{ $t(`Add`) }}</span>
        </q-card-section>
        <HardwareQueueCreate></HardwareQueueCreate>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import HardwareQueue from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareQueueList.vue';
import HardwareQueueCreate from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareQueueCreate.vue';

import { mapGetters } from "vuex";

export default {

  components: {
    HardwareQueue,
    HardwareQueueCreate,
},

  data() {
    return {
      API: new Api(this.$store.getters['auth/user'].token),
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
