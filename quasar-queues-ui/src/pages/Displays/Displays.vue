<template>
  <q-page>
    <div class="q-pa-md row q-gutter-md">

      <q-card v-for="hardware in hardwares" :key="hardware.id" @click="openHardware(hardware)"
        class=" hardware-card  col-4 col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
        <q-card-actions>
          <div class="q-gutter-sm items-center row full-width">
            <img :src="getCompanyLogo(hardware)" class="current-logo" v-if="getCompanyLogo(hardware)" />
            <span v-else> {{ hardware.company.alias }}</span>
          </div>
          <div class="col-auto justify-end icon-absolute-right">
            <q-btn v-if="hardware.hardwareType == 'delivery'" fab color="primary" icon="place"
              @click="openHardware(hardware)" />
            <q-btn v-if="hardware.hardwareType == 'hardware'" fab color="green" icon="done" @click="openHardware(hardware)" />
            <q-btn v-if="hardware.hardwareType == 'production'" fab color="primary" icon="receipt_long"
              @click="openHardware(hardware)" />

          </div>
        </q-card-actions>
        <q-separator />
        <q-card-section class="full-width">
          <div class="row no-wrap items-center q-col-gutter-md justify-between">
            <div class="col text-h6 ellipsis">
              {{ hardware.hardware }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="place" />
              250 ft
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ $t('hardware.types.' + hardware.hardwareType) }}
          </div>
          <div class="text-caption text-grey">
            {{ $t('hardware.messages.' + hardware.hardwareType) }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

export default {
  data() {
    return {
      isSearching: false,
      hardwares: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
    }),
  },
  created() {
    this.onRequest();
  },

  methods: {
    ...mapActions({
      getHardwares: "queues/getHardwares",
    }),

    getCompanyLogo(hardware) {
      if (hardware.company.file.id)
        return ENTRYPOINT + '/files/download/' + hardware.company.file.id

    },
    onRequest() {
      this.getMyHardwares();
    },
    openHardware(hardware) {
      this.$router.push({
        name: "displayDetails",
        params: { id: hardware.id },
      });
    },
    getMyHardwares() {
      this.isSearching = true;
      return this.getHardwares()
        .then((result) => {
          this.hardwares = result;
        })
        .finally(() => {
          this.isSearching = false;
        });
    },
  },
};
</script>


<style scoped>
.hardware-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.icon-absolute-right {
  position: absolute;
  right: 10px;
  top: 25px;
}

.hardware-card:hover {
  box-shadow: 0 4px 8px rgb(0 0 0 / 53%);
}
</style>