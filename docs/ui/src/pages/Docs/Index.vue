<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-4 q-mb-md text-h6 text-left">
            {{ translate(docs_type+'.tittle') }}
          </div>
          <div class="col-12 col-md-8 q-mb-md">
            <div class="row justify-end">
              <q-btn :label="translate(docs_type+'.new')" icon="add" size="md" color="primary" :to="{
                name: 'DocsCreate'
              }" />
            </div>
          </div>
        </div>
      </q-card-section>

      <DocsTable :docs_type="docs_type" />

    </q-card>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import DocsTable from './../../components/docs/DocsTable';

export default { //
  components: {
    DocsTable,
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'] || {};
    },
  },

  data() {
    return {
      docs_type: 'docs'
    }
  },

  methods: {},
}
</script>
