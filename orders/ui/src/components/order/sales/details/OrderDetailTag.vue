<template>
  <div class="row items-center justify-center">
    <div v-if="isJadlog" class="col-12">
      <div class="row justify-end margin-top-right">
        <q-btn
          @click="onCreateTagClick"
          label="Liberar Etiqueta"
          icon="add"
          size="md"
          color="primary"
          class="q-ml-sm"
        />
      </div>
    </div>

    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress
        :indeterminate="isLoading"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <div class="col-12" v-else>
      <!-- NF VIEWER -->

      <div class="row" v-if="orderStatus.realStatus != 'closed'">
        <div class="col-12">
          <h6 class="q-mb-md q-mt-md">Pedido: #{{ orderId }}</h6>
          <div class="row justify-center">
            <iframe
              v-if="!isJadlog"
              ref="docviewer"
              :src="urlCarrierTag"
              name="carrier-tag"
              class="carrier-tag"
              width="100%"
              height="100%"
              frameBorder="0"
            ></iframe>
            <div v-else ref="jadlogViewer"></div>
          </div>
        </div>
      </div>
      <div v-else>
        <h6>A etiqueta não está disponível no momento!</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { ENTRYPOINT } from "../../../../../../../../src/config/entrypoint";
import { mapActions } from "vuex";

export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: Object,
      required: true,
    },
    integrationType: {
      type: String,
      required: false,
    },
    total_packages: {
      type: Number,
      required: false,
    },
  },

  created() {
    this.isJadlog = this.integrationType === "jadlog";
  },

  data() {
    return {
      isLoading: false,
      isJadlog: false,
    };
  },

  computed: {
    urlCarrierTag() {
      return `${ENTRYPOINT}${
        ENTRYPOINT.endsWith("/") ? "" : "/"
      }vendor/pdf.js/web/viewer.html?file=/carrier_tags/${
        this.orderId
      }/download-tag/pkg-total/${this.total_packages}`;

    },
  },

  methods: {
    ...mapActions({
      createNewLabelTag: "salesOrder/createNewLabelTag",
    }),

    onCreateTagClick() {
      if (this.isJadlog) {
        this.createNewLabelTag({ id: this.orderId }).then((result) => {
          if (
            result.response &&
            result.response.data &&
            result.response.data.template
          ) {
            var template = result.response.data.template;

            this.$refs.jadlogViewer.innerHTML = template;
          }
        });
      }
    },
  },
};
</script>

<style>
.carrier-tag {
  min-height: 100vh;
}

.margin-top-right {
  margin-top: 15px;
  margin-right: 15px;
}
</style>
