<template>
    <q-page padding>
      <div class="row">
        <div class="col-12 flex justify-end q-pb-md">
          <q-btn
            dense
            color="primary"
            :label="translate(`Add`)"
            @click="newQueue = true"
          ></q-btn>
        </div>
        <QueuePeopleQueue></QueuePeopleQueue>
      </div>

      <q-dialog v-model="newQueue">
        <q-card>
          <q-card-section>
            <span class="text-h6"> {{ translate(`Add`) }}</span>
          </q-card-section>
          <QueuePeopleQueueCreate></QueuePeopleQueueCreate>
        </q-card>
      </q-dialog>
    </q-page>
</template>
  
<script>

import translate from "@controleonline/../../src/boot/translate";
import QueuePeopleQueueCreate from '@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleQueueCreate.vue';
import QueuePeopleQueue from '@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleQueueList.vue';

import { mapGetters } from "vuex";

export default {

  components: {
    QueuePeopleQueue,
    QueuePeopleQueueCreate,
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
  