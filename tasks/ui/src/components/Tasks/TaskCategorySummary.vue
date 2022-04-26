<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress :indeterminate="isLoading"
        size ="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>
    
    <div class="col-12 q-mt-md" :style="(isLoading) ? 'visibility:hidden' : 'visibility:visible'">
        
        <FormTaskCategory 
            v-if         ="!isLoading"
            ref          ="myForm"
            :categoryId  ="id"
            :categoryData="category"
            :api         ="api"
            @saved       ="onCategorySave"
        />

    </div>

  </div>
</template>

<script>
import Api              from '@controleonline/quasar-common-ui/src/utils/api';
import FormTaskCategory from './FormTaskCategory.vue';

export default {

    components: {
        FormTaskCategory
    },
    
    props: {
        id      : {
            type    : Number,
            required: true
        },
        api     : {
            type    : Api,
            required: true
        },
        category: {
            type    : Object,
            required: true
        }
    },
    
    data() {
        return {
            saving   : false,
            isLoading: true,
        }
    },

    created() {
        if (this.category && this.category.name) {
            this.isLoading = false;
        }
    },

    watch: {
        category: function(data) {
            if (this.category && this.category.name) {
                this.isLoading = false;
            }
        }
    },

    methods: {

        onCategorySave() {
            this.$q.notify({
                message : this.$t('Data saved successfully'),
                position: 'bottom',
                type    : 'positive',
            });
        }
    }

}
</script>