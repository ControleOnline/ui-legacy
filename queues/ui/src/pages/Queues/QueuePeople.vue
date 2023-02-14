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
        <QueuePeople></QueuePeople>
      </div>

      <q-dialog v-model="newQueue">
        <q-card>
          <q-card-section>
            <span class="text-h6"> {{ $t(`Add`) }} </span>
          </q-card-section>
          <QueuePeopleCreate></QueuePeopleCreate>
        </q-card>
      </q-dialog>
    </q-page>
</template>
  
<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import QueuePeopleCreate from '@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleCreate.vue';
import QueuePeople from '@controleonline/quasar-queues-ui/src/components/queue/QueuePeopleList.vue';

import { mapGetters } from "vuex";

export default {

  components: {
  QueuePeople,
  QueuePeopleCreate,
},

  data() {
    return {
      API: new Api(this.$store.getters['auth/user'].token),
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
  