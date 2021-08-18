<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <q-card-section class="text-h5">
          {{ $t('professionals.title') }}
        </q-card-section>
        <div class="row">
          <div class="col-12">
            <div class="row justify-end q-mb-md">
              <q-btn
                :label="$t('Add')"
                icon  ="add"
                size  ="md"
                color ="primary"
                class ="q-ml-sm"
                @click="dialog = !dialog"
              />
            </div>
          </div>

          <div class="col-12">
            <ProfessionalSearching />
          </div>

          <q-dialog v-model="dialog">
            <q-card style="width: 700px; max-width: 80vw;">
              <q-card-section class="row items-center">
                <div class="text-h6">{{ $t('professionals.new') }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
              <q-card-section>
                <FormProfessionalCreate
                  @saved ="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });

                    this.$router.push({
                      name  : 'Professionals.Details',
                      params: {
                        id: data.trainerId
                      }
                    });
                  }"
                  @error ="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'warning',
                    });
                  }"
                />
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ProfessionalSearching  from '../../components/professionals/ProfessionalSearching';
import FormProfessionalCreate from '../../components/professionals/FormProfessionalCreate';
import { mapGetters }         from 'vuex';

export default {
  name      : 'ProfessionalIndexPage',

  components: {
    ProfessionalSearching,
    FormProfessionalCreate,
  },

  data () {
    return {
      dialog: false,
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },
}
</script>
