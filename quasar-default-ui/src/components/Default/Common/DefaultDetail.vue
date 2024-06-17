<template>
  <q-card :class="cardClass">
    <q-card-section :class="sectionClass">
      <DefaultForm
        :configs="configs"
        @saved="saved"
        @error="error"
        :data="data"
        :index="index"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import DefaultForm from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultForm";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    configs: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
    sectionClass: {
      required: false,
      default() {
        return "row items-center";
      },
    },
    cardClass: {
      required: false,
      default() {
        return "q-pa-md";
      },
    },
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  components: {
    DefaultForm,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },
  watch: {},
  methods: {},
};
</script>
