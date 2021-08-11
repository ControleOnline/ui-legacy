<template>
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
      <q-table
          :loading        ="isLoading"
          :data           ="data"
          :columns        ="settings.columns"
          :pagination.sync="pagination"
          @request        ="onRequest"
          row-key         ="id"
          :visible-columns="settings.visibleColumns"
          style           ="min-height: 90vh;"
          :flat           ="true"
          :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <q-btn outline dense
                :to   ="{
                  name  : 'TaskCategoryDetails',
                  params: {
                    id: props.row.id
                  }
                }"
                :label="`#${props.row.id}`"
                class ="full-width"
              />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name      }}</q-td>
          </q-tr>
        </template>
      </q-table>
      
      <q-dialog v-model="dialog">
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section class="row items-center">
            <div class="text-h6">{{ $t('Add') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <FormTaskCategory
              ref      ="myForm"
              :api     ="API"
              @saved   ="onCategorySave"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import Api              from '@freteclick/quasar-common-ui/src/utils/api';
import FormTaskCategory from './FormTaskCategory.vue';
import { mapGetters }   from 'vuex';

export default {

  components: {
    FormTaskCategory
  },
    
  data() {

    return {
      API    : new Api(this.$store.getters['auth/user'].token),
      dialog : false,
      settings: {
          visibleColumns: [
              'id'      ,
              'name'    ,
          ],
          columns       : [
              {
                  name  : 'id',
                  field : 'id',
                  align : 'left',
                  label : 'ID'
              },
              {
                  name  : 'name',
                  field : 'name',
                  align : 'left',
                  label : 'Nome'
              },
          ],
      },
      data     : [],
      isLoading: false,
      searchBy : '',
      pagination     : {
          sortBy     : 'name',
          descending : false,
          page       : 1,
          rowsPerPage: 10,
          rowsNumber : 10,
      },
    }
  },

  created() {
    this.onRequest({
      pagination: this.pagination
    });
  },

  computed: {
    ...mapGetters({
      user : 'auth/user',
    }),
  },

  methods: {
    // store method
    getTaskCategories(params) {
      return this.API.private('/task_categories', { params })
        .then(response => response.json())
        .then(result => {
          return {
            members   : result['hydra:member'],
            totalItems: result['hydra:totalItems']
          };
        });
    },

    onRequest(props) {
      if (this.isLoading)
        return;

      this.isLoading = true;

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      }          = props.pagination;
      let params = { limit: rowsPerPage, page };

      this.getTaskCategories(params)
        .then(data => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              'id'      : item.id,
              'name'    : item.name,
            });
          }

          this.data                   = _data;
          this.pagination.page        = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy      = sortBy;
          this.pagination.descending  = descending;
          this.pagination.rowsNumber  = data.totalItems;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    onCategorySave(id) {
      this.dialog = false;
      
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    }
  }
}

</script>