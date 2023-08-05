<template>
    <div class="col-xs-12 col-sm-6">
      <ListAutocomplete
        :source   ="getGeoPlaces"
        :isLoading="isLoading"
        :label    ="translate('form.section03')"
        @selected ="onSelect"
        placeholder="Digite o destino"
      />
    </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import ListAutocomplete from '@controleonline/quasar-common-ui/src/components/Common/ListAutocomplete';
import { mapActions } from 'vuex';

export default {
  props: {
    values       : {
      type    : Object,
      required: true,
    },
  },

  components: {
    ListAutocomplete,
  },

  data() {
    return {
      isLoading: false,
    }
  },

  methods: {
    ...mapActions({
      geoplace: 'gmaps/geoplace',
    }),

    getGeoPlaces(input) {
      this.isLoading = true;

      return this.geoplace(input)
        .then(result => {
          this.isLoading = false;

          if (result.success) {
            let items = [];
            for (let i = 0; i < result.data.length; i++) {
              items.push({
                label: result.data[i].description,
                value: result.data[i],
              });
            }
            return items;
          }
          else {
            this.$q.notify({
              message : this.translate('messages.gmapsReqNoData'),
              position: 'bottom',
              type    : 'negative',
            });
          }
        });
    },

    onSelect(item) {
      this.values.id         = item.id;
      this.values.country    = item.country;
      this.values.state      = item.state;
      this.values.city       = item.city;
      this.values.district   = item.district;
      this.values.postalCode = item.postal_code;
      this.values.street     = item.street;
      this.values.number     = item.number;
      this.values.lat        = item.lat;
      this.values.lng        = item.lng;
      
      this.$emit('selected', this.values);
    },

    isInvalid(key) {
      return val => {
        if (!val)
          return this.translate('messages.fieldRequired');

        return true;
      };
    },
  },
};
</script>
