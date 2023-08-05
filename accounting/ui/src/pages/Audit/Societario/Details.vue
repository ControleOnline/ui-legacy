<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-h6 text-left">
            {{ $t('Revisão Guia de Imposto') }}
          </div>
          <div class="col-12 q-mb-md bg-grey" style="height: 500px">

          </div>
          <div class="col-12">
            <div class="row justify-between">
              <q-btn
                icon    ="cancel"
                type    ="submit"
                :label  ="$t('Recusar')"
                size    ="md"
                color   ="negative"
                class   ="q-mt-md"
              />
              <q-btn
                icon    ="check"
                type    ="submit"
                :label  ="$t('Aprovar')"
                size    ="md"
                color   ="positive"
                class   ="q-mt-md"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

export default {
  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);
    }
  },

  data () {
    return {
      id: null,
    }
  },
}
</script>
