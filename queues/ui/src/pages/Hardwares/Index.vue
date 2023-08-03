<template>
    <q-page padding>
      <div class="row">
        <div class="col-12 flex justify-end q-pb-md">
          <q-btn
            dense
            color="primary"
            :label="$t(`Add`)"
            @click="newHardware = true"
          ></q-btn>
        </div>
        <Hardware></Hardware>
      </div>

      <q-dialog v-model="newHardware">
        <q-card>
          <q-card-section>
            <span class="text-h6"> {{ $t(`Add`) }}</span>
          </q-card-section>
          <HardwareCreate></HardwareCreate>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  
  import HardwareCreate from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareCreate.vue';
import Hardware from '@controleonline/quasar-queues-ui/src/components/hardware/HardwareList.vue';
  
  import { mapGetters } from "vuex";
  
  export default {
  
    components: {
      Hardware,
      HardwareCreate,
},
  
    data() {
      return {
        
        newHardware: false,
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
  