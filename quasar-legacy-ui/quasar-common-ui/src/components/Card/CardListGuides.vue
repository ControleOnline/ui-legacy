<template>
  <div>
    <div class="q-pa-lg full-width">
      <q-item class="q-px-xs q-pt-sm full-width">
        <q-item-label class="title-list q-ma-none">{{ title_guide }}</q-item-label>
      </q-item>

      <q-card class="q-my-sm cursor-pointer" @click="goGuide">
        <q-carousel
          animated
          v-model="slide"
          navigation
          swipeable
          height="15rem"
          infinite
          class="custom-carousel"
        >
          <q-carousel-slide
            v-for="img in images_slide"
            :key="img.name"
            :name="img.name"
            class="q-pa-none teste"
          >
            <q-img :src="img.src" class="full-height">
              <div
                class="text-bold absolute-bottom text-subtitle1 text-secondary text-right bg-positive color-label"
              >
                R$ {{  formatMoney(price) }}
              </div>

              <div
                class="profile-radius q-ma-sm flex profile-container items-center bg-positive"
              >
                <q-avatar size="2.3rem">
                  <img :src="image_profile" />
                </q-avatar>
                <div class="q-px-sm">
                  <p class="q-ma-none text-caption text-bold text-primary">
                    {{ user_name }}
                  </p>
                  <div class="flex items-center">
                    <p class="q-ma-none text-caption text-bold text-primary">
                      {{ assessment }}
                    </p>
                    <q-icon name="star" color="orange-5"></q-icon>
                  </div>
                </div>
              </div>

              <div
                class="full-width absolute-top bg-transparent flex justify-end favorite-container"
              >
                <q-btn
                  v-if="!edit"
                  flat
                  dense
                  round
                  class=" text-center"
                  @click.stop="favoriteItem"
                  :color="!favorite ? 'secondary' : 'orange-5'"
                  icon="favorite"
                />
                <q-btn
                  v-else-if="edit"
                  flat
                  dense
                  color="secondary"
                  class=" text-center"
                  icon="o_edit"
                  @click.stop="editGuide"
                />
              </div>
            </q-img>
          </q-carousel-slide>
        </q-carousel>

        <div class="flex q-pa-sm items-center">
          <p
            :class="`bg-${difficulty.color} text-white text-center q-ma-none text-caption q-pa-sm`"
            style="min-width: 85px; text-transform: none"
          >
            {{ $t(difficulty.label) }}
          </p>
          <p class="q-ma-none text-caption q-px-sm">
            {{ distance }} {{ distance_option }} | {{ duration }} {{ duration_option }} |
            {{ vacancies }} vagas
          </p>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    title_guide: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    images_slide: {
      type: Array,
      default: () => Array,
    },
    image_profile: {
      type: String,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    user_name: {
      type: String,
      default: "",
    },
    assessment: {
      type: String,
      default: "",
    },
    difficulty: {
      type: Object,
      default: () => {},
    },
    distance_option: {
      type: String,
      default: "",
    },
    distance: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    duration_option: {
      type: String,
      default: "",
    },
    vacancies: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      slide: "mountains",
    };
  },

  computed: {
    list: {
      get() {
        return this.$store.getters["Guides/getGuidesList"];
      },
      set(value) {
        this.$store.commit("Guides/setGuidesList", { list: value });
      },
    },
  },

  methods: {
    favoriteItem() {
      this.$store.commit("Guides/favoriteClick", {
        index: this.index,
        favorite: !this.favorite,
      });
    },
     formatMoney(value) {
      const moneyFormated = value.toLocaleString("pt-br", { minimumFractionDigits: 2 });

      return moneyFormated;
    },
    goGuide() {
      this.$router.push({ name: "guide", params: { id: this.id } });
    },
    editGuide() {
      this.$router.push({ name: "add-guide", query: { id: this.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.title-list {
  font-size: 1.25rem;
  font-weight: 700;
  color: #323232;
  display: block;
}
.favorite-container {
  padding: 8px 8px;
}
.profile-container {
  padding: 4px 4px;
}
.avatar-container {
  padding: 4px 4px;
}
.profile-radius {
  border-radius: 25px;
}
.color-label {
  padding: 10px 10px 10px 10px !important;
}
</style>
