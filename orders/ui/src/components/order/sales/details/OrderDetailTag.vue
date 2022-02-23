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
          <q-input
            v-model.number="pkgs"
            type="number"
            :min="1"
            filled
            label="Total de volumes"
          />
          <div class="row justify-center">
            <iframe
              v-if="!isJadlog"
              ref="docviewer"
              :src="urlCarrierTagInit"
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
  watch: {
    pkgs(pkgs) {
      let p = pkgs > 0 ? pkgs : this.total_packages;
      this.urlCarrierTag(p);
      return p;
    },
  },
  created() {
    this.isJadlog = this.integrationType === "jadlog";
  },

  data() {
    return {
      pkgs: this.total_packages,
      isLoading: false,
      isJadlog: false,
    };
  },

  computed: {
    urlCarrierTagInit() {
      let url = encodeURI(
        `/carrier_tags/${this.orderId}/download-tag?pkg-total=${this.total_packages}`
      );
      return `${ENTRYPOINT}${
        ENTRYPOINT.endsWith("/") ? "" : "/"
      }vendor/pdf.js/web/viewer.html?file=${url}`;
    },
  },

  methods: {
    ...mapActions({
      createNewLabelTag: "salesOrder/createNewLabelTag",
    }),
    urlCarrierTag(pkg) {
      let url = encodeURI(
        `/carrier_tags/${this.orderId}/download-tag?pkg-total=${pkg}`
      );
      this.$refs.docviewer.src = `${ENTRYPOINT}${
        ENTRYPOINT.endsWith("/") ? "" : "/"
      }vendor/pdf.js/web/viewer.html?file=${url}`;
    },
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
