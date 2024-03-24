<template>
  <q-page padding>
    <div class="row">
      <div
        v-for="(month, index) in dre"
        :key="month"
        class="col-2 q-mb-md q-pa-sm"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">
              {{ getMonthName(index) }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item-label header
                >Receitas
                <q-btn
                  class="btn-primary"
                  label="Detalhes"
                  @click="showDetails(month.receive.parent_categories)"
              /></q-item-label>

              <q-item
                v-for="(parentCategory, parentId) in month.receive
                  .parent_categories"
                :key="parentId"
              >
                <q-item-section
                  >{{ parentCategory.parent_category_name }} :{{
                    parentCategory.total_parent_category_price
                  }}</q-item-section
                >
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item-label header
                >Despesas
                <q-btn
                  class="btn-primary"
                  label="Detalhes"
                  @click="showDetails(month.pay.parent_categories)"
              /></q-item-label>
              <q-item
                v-for="(parentCategory, parentId) in month.pay
                  .parent_categories"
                :key="parentId"
              >
                <q-item-section
                  >{{ parentCategory.parent_category_name }} :{{
                    parentCategory.total_parent_category_price
                  }}</q-item-section
                >
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <div>Total de Despesas: {{ month.pay.total_month_price }}</div>
            <div>Total de Receitas: {{ month.receive.total_month_price }}</div>
            <div>
              Saldo:
              {{
                (month.receive.total_month_price || 0) -
                (month.pay.total_month_price || 0)
              }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="modalVisible">
      <q-card v-for="parent_category in parent_categories">
        <q-card-section>
          <div class="text-h6">{{ parent_category.parent_category_name }}</div>
        </q-card-section>
        <q-card-section v-for="category in parent_category.categories_childs">
          <!-- Conteúdo do modal com detalhes do mês selecionado -->
          <div>
            {{ category.category_name }} : {{ category.category_price }}
          </div>
          <!-- Outros detalhes aqui -->
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "FinancePage",
  data() {
    return {
      modalVisible: false,
      parent_categories: null,
      dre: {
        1: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        2: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        3: {
          receive: {
            total_month_price: 280,
            parent_categories: {
              158: {
                total_parent_category_price: 280,
                categories_childs: {
                  158: {
                    category_id: 158,
                    category_name: "Venda",
                    category_price: 100,
                  },
                  159: {
                    category_id: 159,
                    category_name: "Sistemas",
                    category_price: 30,
                  },
                },
                parent_id: 158,
                parent_category_name: "Venda",
              },
            },
          },
          pay: {
            total_month_price: 2025,
            parent_categories: {
              141: {
                total_parent_category_price: 825,
                categories_childs: {
                  145: {
                    category_id: 145,
                    category_name: "Infraestrutura",
                    category_price: 325,
                  },
                },
                parent_id: 141,
                parent_category_name: "Despesas Fixas",
              },
              143: {
                total_parent_category_price: 1200,
                categories_childs: {
                  150: {
                    category_id: 150,
                    category_name: "Programador",
                    category_price: 1200,
                  },
                },
                parent_id: 143,
                parent_category_name: "T.I.",
              },
            },
          },
        },
        4: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        5: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        6: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        7: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        8: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        9: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        10: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        11: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
        12: {
          receive: [],
          pay: {
            total_month_price: 0,
            parent_categories: {
              "": {
                total_parent_category_price: 0,
                categories_childs: {
                  "": {
                    category_id: null,
                    category_name: null,
                    category_price: 0,
                  },
                },
                parent_id: null,
                parent_category_name: null,
              },
            },
          },
        },
      },
    };
  },
  methods: {
    showDetails(parent_categories) {
      this.parent_categories = parent_categories;
      this.modalVisible = true;
    },
    getMonthName(monthIndex) {
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return monthNames[monthIndex - 1];
    },
  },
};
</script>
