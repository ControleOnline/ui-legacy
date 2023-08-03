<template>
    <q-page padding>
      <div class="row">
        <div class="col-12 flex justify-end q-pb-md">
          <q-btn
            dense
            color="primary"
            :label="$t(`Add`)"
            @click="newQueue = true"
          ></q-btn>
        </div>
        <Queue></Queue>
      </div>

      <q-dialog v-model="newQueue">
        <q-card>
          <q-card-section>
            <span class="text-h6"> {{ $t(`Add`) }}</span>
          </q-card-section>
          <QueueCreate></QueueCreate>
        </q-card>
      </q-dialog>
    </q-page>
</template>
  
<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import QueueCreate from '@controleonline/quasar-queues-ui/src/components/queue/QueueCreate.vue';
import Queue from '@controleonline/quasar-queues-ui/src/components/queue/QueueList.vue';

import { mapGetters } from "vuex";

export default {

  components: {
  Queue,
  QueueCreate,
},

  data() {
    return {
      
      newQueue: false,
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
  