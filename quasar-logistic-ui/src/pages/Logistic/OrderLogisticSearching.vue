<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <StretchSearching />
      </div>
    </div>
  </q-page>
</template>

<script>
 import StretchSearching from '@controleonline/quasar-logistic-ui/src/components/Logistic/stretchTable.vue';

export default {
  name      : 'OrderIndexPage',

  components: {
    StretchSearching,
  },

  data () {
    return {

    }
  }
}
</script>