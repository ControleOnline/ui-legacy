<template>
  <div class="row">
    <div class="col-12">
      <div class="row q-col-gutter-xs">
        <div v-if="domainType() !== 'simple'" class="col-xs-12 col-md-3 q-mb-sm">
          <ListAutocomplete v-if="isCeg()" :source="getCarItens" :isLoading="carItensLoading" label="Automóvel"
            @selected="onCarSelect" placeholder="Gol, Corsa, Uno..." :acceptInput="true" />
          <q-select dense outlined v-else :options="productCategory" :isLoading="false" v-model="values.type"
            label="Categoria do produto" placeholder="Selecione uma categoria" />
        </div>

        <div v-if="!isCeg()" class="col-xs-12 col-md-3 q-mb-sm">
          <q-input dense outlined stack-label lazy-rules v-model="values.product" type="text"
            :label="$t('form.labels.type')" placeholder="Digite o tipo do produto" />
        </div>

        <div v-if="isCeg()" :class="'col-xs-12 ' +
          (domainType() === 'simple' ? 'col-md-6' : 'col-md-3') +
          ' q-mb-sm'
          ">
          <q-select dense outlined v-if="isCeg()" :options="groupTables" :isLoading="false"
            @update:model-value="onGroupSelect" v-model="gTable" label="Tipo de Veículo"
            placeholder="Selecione uma opção" />
          <q-input dense outlined v-else stack-label lazy-rules v-model="values.type" type="text"
            :label="$t('form.labels.type')" placeholder="Digite o tipo do produto" />
        </div>
        <div class="col-xs-12 col-md-6 q-mb-sm">
          <q-input dense outlined stack-label lazy-rules reverse-fill-mask prefix="R$" v-model="values.totalPrice"
            type="text" :label="$t(
              domainType() === 'simple'
                ? 'form.labels.product_price'
                : 'form.labels.price'
            )
              " mask="#,##" fill-mask="0" />
        </div>
      </div>

      <div v-show="!isCeg()" class="row justify-center q-pa-md" style="border: 1px solid #cccccc">
        <div class="col-12 text-subtitle2 text-center q-pb-md">
          {{ $t("form.section01") }}
        </div>

        <div v-if="cubage == 0" class="col-12">
          <div v-for="(myPackage, index) in values.packages" :key="index" class="row">
            <div class="col-xs-12 col-sm-11">
              <div class="row justify-between">
                <div class="col-xs-12 col-sm-2">
                  <q-input dense outlined stack-label lazy-rules reverse-fill-mask v-model="myPackage.qtd" type="text"
                    :label="$t('form.labels.qtty')" mask="#" fill-mask="0" @change="getTotalCubageAndWeight" />
                </div>
                <div class="col-xs-12 col-sm-2">
                  <q-input dense outlined stack-label lazy-rules reverse-fill-mask suffix="kg" v-model="myPackage.weight"
                    type="text" :label="$t('form.labels.weight')" @change="getTotalCubageAndWeight" mask="#,###"
                    fill-mask="0" />
                </div>
                <div class="col-xs-12 col-sm-2">
                  <q-input dense outlined stack-label lazy-rules reverse-fill-mask suffix="m" v-model="myPackage.height"
                    type="text" :label="$t('form.labels.height')" @change="getTotalCubageAndWeight" mask="#,##"
                    fill-mask="0" />
                </div>
                <div class="col-xs-12 col-sm-2">
                  <q-input dense outlined stack-label lazy-rules reverse-fill-mask suffix="m" v-model="myPackage.width"
                    type="text" :label="$t('form.labels.width')" @change="getTotalCubageAndWeight" mask="#,##"
                    fill-mask="0" />
                </div>
                <div class="col-xs-12 col-sm-2">
                  <q-input dense outlined stack-label lazy-rules reverse-fill-mask suffix="m" v-model="myPackage.depth"
                    type="text" :label="$t('form.labels.depth')" @change="getTotalCubageAndWeight" mask="#,##"
                    fill-mask="0" />
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-1 q-pb-md">
              <div class="row justify-end">
                <div class="col-xs-12 col-sm-5 text-center">
                  <q-btn flat round v-if="index == 0" icon="delete" color="red" :disable="true" />
                  <q-btn flat round v-else icon="delete" color="red" @click="removeProduct(index)" />
                </div>
                <div class="col-xs-12 col-sm-5 text-center">
                  <q-btn flat round v-if="index == values.packages.length - 1" icon="add_circle" size="md" color="green"
                    @click="addProduct" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="!isCeg() && totalCubage == 0 && cubage == 0" class="col-xs-12 q-pt-sm">
          <div class="text-subtitle2 text-center">{{ $t("Ou") }}</div>
        </div>

        <div v-show="!isCeg() && totalCubage == 0" class="col-xs-6 col-md-3 q-pa-sm">
          <q-input dense outlined stack-label lazy-rules reverse-fill-mask suffix="kg" v-model="values.cubage" type="text"
            :label="$t('Total cubagem')" mask="#,##" fill-mask="0" />
        </div>

        <div v-if="!isCeg()" class="col-12">
          <q-separator spaced />

          <div class="row justify-center items-center q-gutter-md q-pa-sm">
            <q-card class="my-card" flat bordered>
              <div class="row justify-center items-center q-pa-md">
                <div class="col-12">
                  <div class="text-caption">{{ $t("form.cubTotal") }}</div>
                  <div class="text-subtitle1">{{ totalCubage }} kg</div>
                </div>
              </div>
            </q-card>

            <q-card class="my-card" flat bordered>
              <div class="row justify-center items-center q-pa-md">
                <div class="col-12">
                  <div class="text-caption">{{ $t("form.weigTotal") }}</div>
                  <div class="text-subtitle1">{{ totalWeight }} kg</div>
                </div>
              </div>
            </q-card>

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <q-card v-if="delivery.motoboy" class="my-card hidden" style="background: #004aa9">
                <img src="./../assets/delivery_icons_D.png" />
              </q-card>
            </transition>

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <q-card v-if="delivery.postal" class="my-card hidden" style="background: #00e7c3">
                <img src="./../assets/delivery_icons_C.png" />
              </q-card>
            </transition>

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <q-card v-if="delivery.aereo" class="my-card hidden" style="background: #00a4ff">
                <img src="./../assets/delivery_icons_B.png" />
              </q-card>
            </transition>

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <q-card v-if="delivery.fracion" class="my-card hidden" style="background: #ffcb05">
                <img src="./../assets/delivery_icons_A.png" />
              </q-card>
            </transition>

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <q-card v-if="delivery.lotacao" class="my-card hidden" style="background: #cccb05">
                <img src="./../assets/delivery_icons_E.png" />
              </q-card>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "app/modules/controleonline/ui-common/src/api";
import ListAutocomplete from "@controleonline/ui-legacy/ui-common/src/components/Common/ListAutocomplete";
import { MyPackage } from "@controleonline/ui-legacy/ui-common/src/utils/mypackage";
import { mapGetters } from "vuex";

export default {
  created() {
    this.loadGroupTables();
  },
  props: {
    values: {
      type: Object,
      required: true,
    },
  },

  components: {
    ListAutocomplete,
  },

  data() {
    return {
      gTable: "",
      carItens: [],
      loadMainGroupTable: true,
      loadGroupTable: false,
      groupTables: [],
      sumCubage: 0,
      sumWeight: 0,
      carItensLoading: false,
      delivery: {
        motoboy: true,
        postal: true,
        aereo: true,
        fracion: true,
        lotacao: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      defaultCompany: "people/defaultCompany",
    }),
    totalCubage() {
      return new Intl.NumberFormat("pt-br").format(this.sumCubage);
    },

    totalWeight() {
      return new Intl.NumberFormat("pt-br").format(this.sumWeight);
    },

    cubage() {
      return parseFloat(this.values.cubage.replace(",", "."));
    },

    productCategory() {
      let products = [
        "Alimentício não perecível",
        "Pneus",
        "Banheira",
        "Alimentício perecível",
        "Animais",
        "Armamento e munições",
        "Armário de Aço",
        "Artigo decoração",
        "Automotivo",
        "Automotivo (peças usadas)",
        "Baterias em geral",
        "Bebidas",
        "Brinquedos",
        "Carga Refrigerada",
        "Cigarro",
        "Construção em geral",
        "Construção - Piso de borracha",
        "Contrução - Pisos, Azulejos e Revestimentos",
        "Dinheiro (moeda e papel)",
        "Eletrodomésticos",
        "Eletrônicos",
        "Eletro-portátil",
        "Energia Solar",
        "Equipamentos",
        "Equipamentos esportivos",
        "Ferramentas",
        "Fios e Cabos",
        "Jóias e semi-jóias",
        "Livros",
        "Máquinas",
        "Metais preciosos",
        "Motores novos",
        "Motores usados",
        "Móveis",
        "Móveis usados",
        "Mudança (móveis e documentos)",
        "Objeto de Arte",
        "Papelaria",
        "Plantas",
        "Produto químico não-perigoso",
        "Produto químico perigoso",
        "Quadro",
        "Roupas e calçados",
        "Siderúrgia",
        "Tecido",
        "Tinta base água",
        "Tinta base solvente",
        "Utensílio plástico",
        "Vidro",
      ];

      products.sort();
      products.push("Outros");

      return products;
    },
  },

  watch: {
    "values.packages"() {
      this.getTotalCubageAndWeight();
      this.enableDeliveryOptions();
    },

    cubage(value) {
      this.enableDeliveryOptions();
      this.values.sumCubage = value;
    },

    sumCubage(value) {
      this.enableDeliveryOptions();
      this.values.sumCubage = value;
    },
  },

  methods: {
    loadGroupTables() {
      this.getGroupTables(this.$domain);
    },
    onCarSelect(item) {
      var text = item;
      var data = this.carItens.find((i) => i.value === item);

      if (data) {
        this.values.type = data.label;
        this.values.totalPrice = (data?.price).toString().replace(".", ",");
      } else {
        this.values.type = text;
      }
    },

    getCarItens(input) {
      return new Promise((success) => {
        this.carItensLoading = true;

        const result = [];

        function requestCarItens(text) {
          let params = {};
          params.search = text;
          let options = {
            method: "GET",
            params: params,
          };

          return api.fetch(`/car_models_search`, options)

            .then((data) => {
              if (data.response && data.response.data && data.response.data.length) {
                var itens = data.response.data;

                return itens.map((item) => {
                  return {
                    label: item.label,
                    value: item.value,
                    price: item.price,
                  };
                });
              }
              return [];
            });
        }

        let chars = [/[aáàãäâ]/g, /[eéèëê]/g, /[iíìïî]/g, /[oóòõöô]/g, /[uúùüû]/g];
        let inputFixed = input.trim().toLowerCase();

        inputFixed = inputFixed.replace(chars[0], "a");
        inputFixed = inputFixed.replace(chars[1], "e");
        inputFixed = inputFixed.replace(chars[2], "i");
        inputFixed = inputFixed.replace(chars[3], "o");
        inputFixed = inputFixed.replace(chars[4], "u");

        requestCarItens(inputFixed).then(
          ((res1) => {
            if (res1 && res1.length) {
              this.carItens = res1;
              success(res1);
              this.carItensLoading = false;
            } else {
              requestCarItens(input).then(
                ((res2) => {
                  if (res2 && res2.length) {
                    this.carItens = res2;
                    success(res2);
                  } else {
                    success([]);
                  }
                  this.carItensLoading = false;
                }).bind(this)
              );
            }
          }).bind(this)
        );
      });
    },
    getGroupTables(host) {
      if (host) {
        this.loadGroupTable = true;
        this.groupTables = [];
        const options = {
          method: "GET",
          params: {
            domain: host,
          },
        };

        return api.fetch(`/delivery_tax_groups_grouped`, options)

          .then((response) => {
            if (
              response &&
              response.response &&
              response.response.data &&
              response.response.data.members
            ) {
              response.response.data.members.forEach((element) => {
                if (this.groupTables.indexOf(element.groupName) == -1) {
                  this.groupTables.push(element.groupName);
                }
              });
              this.groupTables.sort();
            }
            this.loadGroupTable = false;
          });
      }
    },
    onGroupSelect(select) {
      this.values.groupTable = select;
    },
    isCeg() {
      const cegTypes = ["ceg", "simple"];
      return cegTypes.indexOf(this.domainType()) > -1;
    },
    domainType() {
      return this.defaultCompany ? this.defaultCompany.domainType : null;
    },
    enableDeliveryOptions() {
      let options = {
        motoboy: true,
        postal: true,
        aereo: true,
        fracion: true,
        lotacao: false,
      };

      // motoboy
      if (this.cubage > 0) {
        options.motoboy = this.cubage <= 19.21;
      } else {
        if (this.sumCubage > 19.21) options.motoboy = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery("motoboy")) {
              options.motoboy = false;
              break;
            }
          }
          MyPackage.clean();
        }
      }

      // postal && aereo
      if (this.cubage > 0) {
        options.postal = this.cubage <= 300.1;
        options.aereo = this.cubage <= 300.1;
      } else {
        if (this.sumCubage > 300.1) options.postal = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery("postal") || !MyPackage.canDelivery("aereo")) {
              options.postal = false;
              options.aereo = false;
              break;
            }
          }
          MyPackage.clean();
        }
      }

      // fracion
      if (this.cubage > 0) {
        options.fracion = this.cubage <= 5000.1;
      } else {
        if (this.sumCubage > 5000.1 || this.sumWeight > 5000.1) options.fracion = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery("fracion")) {
              options.fracion = false;
              break;
            }
          }
          MyPackage.clean();
        }
      }

      // lotacao
      if (this.cubage > 0) {
        options.lotacao = this.cubage >= 3000.1;
      } else {
        if (this.sumCubage > 3000.1 || this.sumWeight > 3000.1) options.lotacao = true;
      }

      this.delivery.motoboy = options.motoboy;
      this.delivery.postal = options.postal;
      this.delivery.aereo = options.aereo;
      this.delivery.fracion = options.fracion;
      this.delivery.lotacao = options.lotacao;
    },

    getTotalCubageAndWeight() {
      let totalCubage = 0;
      let totalWeight = 0;

      for (let index in this.values.packages) {
        MyPackage._package = this.values.packages[index];

        totalCubage += MyPackage.cubage();
        totalWeight += MyPackage.quantity() * MyPackage.weight();
      }

      MyPackage.clean();

      this.sumCubage = isNaN(totalCubage) ? 0 : totalCubage;
      this.sumWeight = isNaN(totalWeight) ? 0 : totalWeight;
    },

    addProduct() {
      this.values.cubage = "0";

      this.values.packages.push({
        qtd: "1",
        weight: "0,000",
        height: "0,00",
        width: "0,00",
        depth: "0,00",
      });
    },

    removeProduct(index) {
      this.values.packages = [
        ...this.values.packages.slice(0, index),
        ...this.values.packages.slice(index + 1),
      ];
    },

    isInvalid(key) {
      return (val) => {
        if (key == "cubage" && this.sumCubage == 0) {
          if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

          return true;
        }

        if (key == "package" && this.cubage == 0) {
          if (!val || !(parseFloat(val.replace(",", ".")) > 0))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (key == "price") {
          if (!val || !(parseFloat(val.replace(",", ".")) > 0))
            return this.$t("messages.fieldRequired");

          return true;
        }

        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        return true;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 98px;
  height: 98px;
  min-height: 100%;
  text-align: center;
}
</style>
