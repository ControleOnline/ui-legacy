<template>
  <template v-for="(field, index) in extraFields" v-if="loaded">
    <div :class="(field.formClass || getFilterSize()) + ' q-pa-xs'">
      <FormInputs
        :editable="true"
        :inputType="field.fieldType"
        :rules="field.rules"
        :labelType="'outer-label'"
        :label="field.label"
        :initialValue="extraData[field.id]"
        @changed="
          (value) => {
            extraData[field.id] = value;
          }
        "
      />
    </div>
  </template>
</template>

<script>
import FormInputs from "@controleonline/quasar-default-ui/src/components/Default/Common/FormInputs";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    configs: {
      type: Object,
      required: true,
    },
    entity: {
      type: Object,
      required: true,
    },
  },
  components: {
    FormInputs,
  },
  data() {
    return {
      loaded: false,
      extraFields: null,
      extraData: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {},

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },
  watch: {
    extraData: {
      handler: function (current, preview) {
        this.$emit("changedExtraData", this.extraData);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      getExtraFields: "extra_fields/getItems",
      getExtraData: "extra_data/getItems",
    }),
    init() {
      if (this.configs.extraFields)
        this.getExtraFields({
          context: this.configs?.extraFields?.context || configs.store,
        }).then((result) => {
          this.extraFields = result;
          if (this.extraFields)
            this.getExtraData({
              entity_id: this.entity.id,
              entity_name: this.entity["@type"],
              "extra_fields.context":
                this.configs?.extraFields?.context || configs.store,
            })
              .then((data) => {
                data.forEach((element) => {
                  this.extraData[element.extra_fields.id] = element.value;
                });
              })
              .finally(() => {
                this.loaded = true;
              });
        });
    },
    getFilterSize() {
      let size = 0;
      let number = this.extraFields.length;

      if (number > 0) size = Math.floor(12 / (number + 1));

      if (this.$q.screen.gt.sm) {
        if (size < 4) size = 4;
      } else {
        if (size < 6) size = 6;
      }

      return (
        "col-xs-12 col-sm-4 col-md-" +
        size +
        " col-lg-" +
        size +
        " col-xl-" +
        size
      );
    },
  },
};
</script>
