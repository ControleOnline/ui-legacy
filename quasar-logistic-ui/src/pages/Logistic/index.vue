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
 import StretchSearching from '@controleonline/quasar-logistic-ui/src/components/Logistic';

export default {
  components: {
    StretchSearching,
  },
  data () {
    return {
    }
  }
}
</script>