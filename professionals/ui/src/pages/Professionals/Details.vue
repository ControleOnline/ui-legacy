<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pa-md text-h6">
            {{ $t('professionals.information') }}
          </div>

          <div class="col-12">
            <div class="q-pa-md text-subtitle1 text-center">
              {{ trainer.name || `${$t('loading')}...` }}
            </div>
          </div>

          <div class="col-12">
            <q-tabs
              :horizontal="$q.screen.gt.xs"
              align      ="justify"
              v-model    ="currentTab"
              class      ="bg-white text-primary"
            >
              <q-tab
                name  ="summary"
                :label="$t('Summary')"
              />
              <q-tab
                name  ="address"
                :label="$t('Addresses')"
              />
              <q-tab
                name  ="documents"
                :label="$t('Documents')"
              />
              <q-tab
                name  ="emails"
                :label="$t('Emails')"
              />
              <q-tab
                name  ="phones"
                :label="$t('Phones')"
              />
              <q-tab
                name  ="billing"
                :label="$t('Financial')"
              />
              <q-tab
                name  ="users"
                :label="$t('Users')"
              />
              <q-tab
                name  ="companies"
                :label="$t('Company')"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="currentTab"
            >
              <q-tab-panel name="summary">
                <ProfessionalSummary
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="emails">
                <ProfessionalEmails
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="address">
                <ProfessionalAddresses
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="phones">
                <ProfessionalPhones
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="documents">
                <ProfessionalDocuments
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="billing">
                <ProfessionalBilling
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="users">
                <ProfessionalUsers
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>

              <q-tab-panel name="companies">
                <ProfessionalCompany
                  :api  ="API"
                  :id   ="trainerId"
                  @error="(error) => {
                    this.$q.notify({
                      message : this.$t(error.message),
                      position: 'bottom',
                      type    : 'negative',
                    });
                  }"
                  @saved="(data) => {
                    this.$q.notify({
                      message : this.$t('Data saved successfully'),
                      position: 'bottom',
                      type    : 'positive',
                    });
                  }"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api                   from '@freteclick/quasar-common-ui/src/utils/api';
import ProfessionalEmails    from '../../components/professionals/ProfessionalEmails';
import ProfessionalAddresses from '../../components/professionals/ProfessionalAddresses';
import ProfessionalPhones    from '../../components/professionals/ProfessionalPhones';
import ProfessionalDocuments from '../../components/professionals/ProfessionalDocuments';
import ProfessionalBilling   from '../../components/professionals/ProfessionalBilling';
import ProfessionalSummary   from '../../components/professionals/ProfessionalSummary';
import ProfessionalUsers     from '../../components/professionals/ProfessionalUsers';
import ProfessionalCompany   from '../../components/professionals/ProfessionalCompany';

export default {
  components: {
    ProfessionalEmails   ,
    ProfessionalAddresses,
    ProfessionalPhones   ,
    ProfessionalDocuments,
    ProfessionalBilling  ,
    ProfessionalSummary  ,
    ProfessionalUsers    ,
    ProfessionalCompany  ,
  },

  created() {
    this.getTrainer();
  },

  data () {
    return {
      API       : new Api(this.$store.getters['auth/user'].token),
      currentTab: 'summary',
      trainerId : this.$route.params.id,
      trainer    : {
        name: null,
        type: null,
      }
    }
  },

  methods: {
    getTrainer() {
      return this.API.private(`trainers/${this.trainerId}`)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.trainer.name = data.peopleType == 'J' ? `${data.name} / ${data.alias}` : `${data.name} ${data.alias}`;
          }
        });
    }
  },
}
</script>
