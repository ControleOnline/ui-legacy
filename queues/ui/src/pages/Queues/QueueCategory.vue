<template>
    <q-page padding>
      <div class="row">
        <div class="col-12 flex justify-end q-pb-md">
          <q-btn
            dense
            color="primary"
            label="Novo"
            @click="newQueue = true"
          ></q-btn>
        </div>
        <QueueCategory></QueueCategory>
      </div>

      <q-dialog v-model="newQueue">
        <q-card>
          <q-card-section>
            <span class="text-h6">Adicionar</span>
          </q-card-section>
          <QueueCategoryCreate></QueueCategoryCreate>
        </q-card>
      </q-dialog>
    </q-page>
</template>
  
<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import QueueCategoryCreate from '@controleonline/quasar-queues-ui/src/components/queue/QueueCategoryCreate.vue';
import QueueCategory from '@controleonline/quasar-queues-ui/src/components/queue/QueueCategoryList.vue';

import { mapGetters } from "vuex";

export default {

  components: {
  QueueCategory,
  QueueCategoryCreate,
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
  