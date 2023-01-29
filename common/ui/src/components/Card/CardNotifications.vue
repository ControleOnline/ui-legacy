<template>
  <q-card
    class="q-pa-sm border-card q-mx-md"
    square
    flat
  >
    <q-card-section horizontal>
      <q-avatar class="profile-radius q-mr-md" size="3rem">
        <img :src="image_profile">
      </q-avatar>

      <div>
        <q-card-section class="q-pa-none flex">
          <q-item-label class="q-ma-none">
            <strong>{{ user_name }}</strong>
            {{ event }}
            <strong>{{ action_notification }}</strong>
          </q-item-label>
        </q-card-section>

        <q-card-section class="q-pa-none q-pt-md justify-end text-caption text-grey-8">
          {{ date }}
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    image_profile: {
      type: String,
      default: '',
    },
    user_name: {
      type: String,
      default: '',
    },
    event: {
      type: String,
      default: '',
    },
    action_notification: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-radius {
  border-radius: 25px!important;
}
.border-card {
  border-bottom: 1px solid $grey-5;
}
</style>
