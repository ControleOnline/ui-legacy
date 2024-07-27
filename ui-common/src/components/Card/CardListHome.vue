<template>
  <div v-if="list_items.length" class="q-pa-sm">
    <h6 class="q-ma-none q-pa-sm q-px-md title-list">{{ title_category }}</h6>
    <q-scroll-area
      style="height: 170px; max-width: 100%"
      :thumb-style="{ background: 'transparent' }"
    >
      <div class="row no-wrap q-px-sm">
        <q-card
          v-for="(item, index) in list_items"
          :key="index"
          @click="GuidesCategory(item.id)"
          class="q-mx-sm"
          style="width: 200px"
        >
          <q-img :src="item.image" class="full-height">
            <div class="absolute-bottom color-label text-bold text-center title-card">
              {{ $t(item.name_item) }}
            </div>
            <div
              class="full-width absolute-top bg-transparent flex justify-end favorite-container"
            >
              <q-btn
                flat
                dense
                round
                @click.stop="favoriteItem(item.favorite, index)"
                :color="!item.favorite ? 'white' : 'orange-5'"
                icon="o_favorite"
              />
            </div>
          </q-img>
        </q-card>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  props: {
    title_category: {
      type: String,
      default: "Category",
    },
    list_items: {
      type: Array,
      default: () => Array,
    },
    id_category: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    list: {
      get() {
        return this.$store.getters["categories/getCategoryList"];
      },
      set(value) {
        this.$store.commit("categories/setCategoryList", { list: value });
      },
    },
  },

  methods: {
    favoriteItem(favorite, index) {
      const indexCategory = this.list.findIndex(
        (category) => category.id === this.id_category
      );

      this.$store.commit("categories/favoriteClick", {
        indexCategory,
        index,
        favorite: !favorite,
      });
    },
    GuidesCategory(id) {
      this.$router.push({
        name: "guides",
        params: { id, id_category: this.id_category },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title-list {
  font-size: 1.5rem;
  font-weight: 700;
  color: #323232;
  display: block;
}
.title-card {
  font-size: 1.125rem;
}
.favorite-container {
  padding: 4px 4px;
}
.color-label {
  padding: 3px 0 3px !important;
  background: rgba(18, 103, 154, 0.7);
}
</style>
