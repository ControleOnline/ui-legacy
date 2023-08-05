<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-4 q-mb-md text-h6 text-left">
            {{ translate('Depto Pro-Labore') }}
          </div>
          <div class="col-8 q-mb-md">
            <div class="row justify-end">
              <q-btn
                :label ="translate('Novo Pro-Labore')"
                icon   ="add"
                size   ="md"
                color  ="primary"
                class  ="q-ml-sm"
                :to    ="{
                  name: 'DeptoProLaboreCreate'
                }"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <DeptoProLaboreTabela />

    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import DeptoProLaboreTabela from './../../../components/depto/DeptoProLaboreTabela';

export default {
  components: {
    DeptoProLaboreTabela,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data () {
    return {

    }
  },

  methods: {

  },
}
</script>
