<template>
  <div class="row">
    <div class="col-12">
      <div class="row q-col-gutter-xs">
        <div class="col-xs-12 col-md-6 q-mb-sm">
          <q-input outlined stack-label lazy-rules
            v-model="values.type"
            type   ="text"
            :label ="$t('form.labels.type')"
            placeholder="Digite o tipo do produto"
          />
        </div>
        <div class="col-xs-12 col-md-6 q-mb-sm">
          <q-input outlined stack-label lazy-rules reverse-fill-mask
            prefix   ="R$"
            v-model  ="values.totalPrice"
            type     ="text"
            :label   ="$t('form.labels.price')"
            mask     ="#,##"
            fill-mask="0"
          />
        </div>
      </div>

      <div class="row justify-center q-pa-md" style="border: 1px solid #cccccc">
        <div class="col-12 text-subtitle2 text-center q-pb-md">
          {{ $t('form.section01') }}
        </div>

        <div v-if="cubage == 0" class="col-12">
          <div
            v-for="(myPackage, index) in values.packages"
            :key ="index"
            class="row"
          >
            <div class="col-xs-12 col-sm-11">
                <div class="row justify-between">
                  <div class="col-xs-12 col-sm-2">
                    <q-input outlined stack-label lazy-rules reverse-fill-mask
                      v-model  ="myPackage.qtd"
                      type     ="text"
                      :label   ="$t('form.labels.qtty')"
                      mask     ="#"
                      fill-mask="0"
                      @change  ="getTotalCubageAndWeight"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input outlined stack-label lazy-rules reverse-fill-mask
                      suffix   ="kg"
                      v-model  ="myPackage.weight"
                      type     ="text"
                      :label   ="$t('form.labels.weight')"
                      @change  ="getTotalCubageAndWeight"
                      mask     ="#,###"
                      fill-mask="0"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input outlined stack-label lazy-rules reverse-fill-mask
                      suffix   ="m"
                      v-model  ="myPackage.height"
                      type     ="text"
                      :label   ="$t('form.labels.height')"
                      @change  ="getTotalCubageAndWeight"
                      mask     ="#,##"
                      fill-mask="0"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input outlined stack-label lazy-rules reverse-fill-mask
                      suffix   ="m"
                      v-model  ="myPackage.width"
                      type     ="text"
                      :label   ="$t('form.labels.width')"
                      @change  ="getTotalCubageAndWeight"
                      mask     ="#,##"
                      fill-mask="0"
                    />
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input outlined stack-label lazy-rules reverse-fill-mask
                      suffix   ="m"
                      v-model  ="myPackage.depth"
                      type     ="text"
                      :label   ="$t('form.labels.depth')"
                      @change  ="getTotalCubageAndWeight"
                      mask     ="#,##"
                      fill-mask="0"
                    />
                  </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-1 q-pb-md">
              <div class="row justify-end">
                <div class="col-xs-12 col-sm-5 text-center">
                  <q-btn flat round v-if="index == 0"
                    icon     ="delete"
                    color    ="red"
                    :disabled="true"
                  />
                  <q-btn flat round v-else
                    icon  ="delete"
                    color ="red"
                    @click="removeProduct(index)"
                  />
                </div>
                <div class="col-xs-12 col-sm-5 text-center">
                  <q-btn flat round v-if="index == (values.packages.length - 1)"
                    icon    ="add_circle"
                    size    ="md"
                    color   ="green"
                    @click  ="addProduct"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xs-12 q-pt-sm" v-if="totalCubage == 0 && cubage == 0">
          <div class="text-subtitle2 text-center">{{ $t('Ou') }}</div>
        </div>

        <div class="col-xs-6 col-md-3 q-pa-sm" v-if="totalCubage == 0">
          <q-input outlined stack-label lazy-rules reverse-fill-mask
            suffix   ="kg"
            v-model  ="values.cubage"
            type     ="text"
            :label   ="$t('Total cubagem')"
            mask     ="#,##"
            fill-mask="0"
          />
        </div>

        <div class="col-12">
          <q-separator spaced />

          <div class="row justify-center items-center q-gutter-md q-pa-sm">
            <q-card class="my-card" flat bordered>
              <div class="row justify-center items-center q-pa-md">
                <div class="col-12">
                  <div class="text-caption">{{ $t('form.cubTotal') }}</div>
                  <div class="text-subtitle1">{{ totalCubage }} kg</div>
                </div>
              </div>
            </q-card>

            <q-card class="my-card" flat bordered>
              <div class="row justify-center items-center q-pa-md">
                <div class="col-12">
                  <div class="text-caption">{{ $t('form.weigTotal') }}</div>
                  <div class="text-subtitle1">{{ totalWeight }} kg</div>
                </div>
              </div>
            </q-card>

            <transition appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-card v-if="delivery.motoboy" class="my-card" style="background: #004aa9">
                <img src="./../assets/delivery_icons_D.png" >
              </q-card>
            </transition>

            <transition appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-card v-if="delivery.postal" class="my-card" style="background: #00e7c3">
                <img src="./../assets/delivery_icons_C.png" >
              </q-card>
            </transition>

            <transition appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-card v-if="delivery.aereo" class="my-card" style="background: #00a4ff">
                <img src="./../assets/delivery_icons_B.png" >
              </q-card>
            </transition>

            <transition appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-card v-if="delivery.fracion" class="my-card" style="background: #ffcb05">
                <img src="./../assets/delivery_icons_A.png" >
              </q-card>
            </transition>

            <transition appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-card v-if="delivery.lotacao" class="my-card" style="background: #cccb05">
                <img src="./../assets/delivery_icons_E.png" >
              </q-card>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MyPackage } from '../@controleonline/quasar-common-ui/src/utils/mypackage';

export default {
  props: {
    values       : {
      type    : Object,
      required: true,
    },
  },

  data() {
    return {
      sumCubage: 0,
      sumWeight: 0,
      delivery : {
        motoboy: true,
        postal : true,
        aereo  : true,
        fracion: true,
        lotacao: false
      }
    };
  },

  computed: {
    totalCubage() {
      return (new Intl.NumberFormat('pt-br')).format(this.sumCubage);
    },

    totalWeight() {
      return (new Intl.NumberFormat('pt-br')).format(this.sumWeight);
    },

    cubage() {
      return parseFloat(this.values.cubage.replace(',', '.'));
    },
  },

  watch: {
    'values.packages'() {
      this.getTotalCubageAndWeight();
      this.enableDeliveryOptions  ();
    },

    cubage   (value) {
      this.enableDeliveryOptions();
      this.values.sumCubage = value;
    },

    sumCubage(value) {
      this.enableDeliveryOptions();
      this.values.sumCubage = value;
    },
  },

  methods: {
    enableDeliveryOptions() {
      let options = {
        motoboy: true,
        postal : true,
        aereo  : true,
        fracion: true,
        lotacao: false,
      };

      // motoboy
      if (this.cubage > 0) {
        options.motoboy = this.cubage <= 19.21;
      }
      else {
        if (this.sumCubage > 19.21)
          options.motoboy = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery('motoboy')) {
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
        options.aereo  = this.cubage <= 300.1;
      }
      else {
        if (this.sumCubage > 300.1)
          options.postal = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery('postal') || !MyPackage.canDelivery('aereo')) {
              options.postal = false;
              options.aereo  = false;
              break;
            }
          }
          MyPackage.clean();
        }
      }

      // fracion
      if (this.cubage > 0) {
        options.fracion = this.cubage <= 5000.1;
      }
      else {
        if (this.sumCubage > 5000.1 || this.sumWeight > 5000.1)
          options.fracion = false;
        else {
          for (let index in this.values.packages) {
            MyPackage._package = this.values.packages[index];
            if (!MyPackage.canDelivery('fracion')) {
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
      }
      else {
        if (this.sumCubage > 3000.1 || this.sumWeight > 3000.1)
          options.lotacao = true;
      }

      this.delivery.motoboy = options.motoboy;
      this.delivery.postal  = options.postal;
      this.delivery.aereo   = options.aereo;
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
      this.values.cubage = '0';

      this.values.packages
        .push({
          qtd   : '0',
          weight: '0,000',
          height: '0,00',
          width : '0,00',
          depth : '0,00'
        });
    },

    removeProduct(index) {
      this.values.packages = [...this.values.packages.slice(0, index), ...this.values.packages.slice(index + 1)];
    },

    isInvalid(key) {
      return val => {
        if (key == 'cubage' && this.sumCubage == 0) {
          if (!(val && val.length > 0))
            return this.$t('messages.fieldRequired');

          return true;
        }

        if (key == 'package' && this.cubage == 0) {
          if (!val || !(parseFloat(val.replace(',', '.')) > 0))
            return this.$t('messages.fieldRequired');

          return true;
        }

        if (key == 'price') {
          if (!val || !(parseFloat(val.replace(',', '.')) > 0))
            return this.$t('messages.fieldRequired');

          return true;
        }

        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        return true;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .my-card {
    width     : 100%;
    max-width : 98px;
    height    : 98px;
    min-height: 100%;
    text-align: center;
  }
</style>
