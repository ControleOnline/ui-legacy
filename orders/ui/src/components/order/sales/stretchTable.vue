<template>
  <div class="q-gutter-y-md q-mx-sm q-mt-md">

    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress
        :indeterminate="isLoading"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <!-- Filtros -->
    <div>
      <div class="row items-end q-col-gutter-x-md">

        <div v-if="!hasOrderId" class="col-sm-3 col-xs-12">
          <q-input
            outlined
            stack-label
            label="Pedido"
            v-model="filters.order"
          ></q-input>
        </div>

        <div class="col-sm-3 col-xs-12">
          <ListAutocomplete
            :source="getGeoPlaces"
            :isLoading="isSearching"
            label="Origem"
            @selected="onSelectOriginFilter"
            placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
          />
        </div>
        <div class="col-sm-3 col-xs-12">
          <PeopleAutocomplete :source="searchPeople" :isLoading="isSearching" label="Fornecedor"
              @selected="onSelectOriginProviderFilter" placeholder="Pesquisar..." />
        </div>
        <div class="col-sm-3 col-xs-12 q-pb-sm">
          <q-select outlined stack-label label="Status" v-model="filters.status" :options="statusOptions"
            :loading="loadingStatuses">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-sm-6 col-xs-12">
          <DataFilter style="justify-content:flex-start" :fromDate="filters.dateFrom" :toDate="filters.dateTo" :showButton="false" @dateChanged="dateChanged" />
        </div>
        <div class="flex justify-end col-sm-6 col-xs-12 q-pb-md">
          <q-btn
            v-if="hasOrderId"
            class=""
            label="Novo"
            color="primary"
            @click="addModal = true"
          ></q-btn>
        </div>
      </div>
    </div>
    <!-- Filtros Fim -->

    <!-- Tabela-->
    <div class="table-container q-mt-none">
      <q-table ref="myTable" :loading="isLoading" :data="data" :columns="settings.columns" :pagination.sync="pagination"
      @request="onRequest" row-key="Id" selection="multiple">
      <template v-slot:header-selection="scope"></template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-btn
              dense
              flat
              icon="settings"
            >
              <q-menu>
                <q-list>
                  <q-item clickable @click="openEditModal(props)">
                    <q-item-section side>
                      <q-icon name="edit"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      Editar
                    </q-item-section>
                  </q-item>
                  <q-separator></q-separator>
                  <!-- <q-item clickable @click="deleteTrecho(props.rowIndex)">
                    <q-item-section side>
                      <q-icon name="delete"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      Excluir
                    </q-item-section>
                  </q-item> -->
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
          <q-td :props="props" key="Id">
            {{props.row.id}}
          </q-td>
          <q-td :props="props" key="trechostatus">
            {{$t(`logistic.statuses.${props.row.status}`)}}
          </q-td>
          <q-td :props="props" key="OrigemTipo">
            {{props.row.originType}}
          </q-td>
          <q-td :props="props" key="OrigemRegiao">
            {{props.row.originRegion}}
          </q-td>
          <q-td :props="props" key="OrigemEstado">
            {{props.row.originState}}
          </q-td>
          <q-td :props="props" key="OrigemCidade">
            {{props.row.originCity}}
          </q-td>
          <q-td :props="props" key="Fornecedor">
            {{props.row.provider}}
          </q-td>
          <q-td :props="props" key="OrigemEndereco">
            {{props.row.originAdress}}
          </q-td>
          <q-td :props="props" key="Valor">
            {{props.row.value}}
          </q-td>
          <q-td :props="props" key="DataEmbarque">
            {{formatDate(props.row.shippingDate)}}
          </q-td>
          <q-td :props="props" key="DataChegada">
            {{formatDate(props.row.arrivalDate)}}
          </q-td>
          <!-- <q-td :props="props" key="Localizador">
            {{props.row.locator}}
          </q-td> -->
          <!-- <q-td :props="props" key="LiberacaoCarro">
            {{formatDate(props.row.releaseCar)}}
          </q-td>
          <q-td :props="props" key="ValorVendido">
            {{props.row.soldValue}}
          </q-td>
          <q-td :props="props" key="ValorPago">
            {{props.row.paidValue}}
          </q-td> -->
          <!-- <q-td :props="props" key="FornecedorSaldo">
            {{props.row.providerBalance}}
          </q-td>
          <q-td :props="props" key="FornecedorStatus">
            {{props.row.providerStatus}}
          </q-td>
          <q-td :props="props" key="DataPatio">
            {{formatDate(props.row.carParkDate)}}
          </q-td>
          <q-td :props="props" key="FornecedorDataEmbarque">
            {{props.row.providerShippingDate}}
          </q-td>
          <q-td :props="props" key="DiasUteisDecorridosPatio">
            {{props.row.elapsedWorkingDays}}
          </q-td>
          <q-td :props="props" key="PrazoContrato">
            {{props.row.termContract}}
          </q-td>
          <q-td :props="props" key="CobrancaBaseEntrega">
            {{props.row.deliveryBaseTaxValue}}
          </q-td>
          <q-td :props="props" key="ValorFreteVendido">
            {{props.row.taxSoldValue}}
          </q-td> -->
          <!-- <q-td :props="props" key="ValorNegociado">
            {{props.row.dealedValue}}
          </q-td>
          <q-td :props="props" key="DataProvisaoPagamento">
            {{props.row.paymentProvisionDate}}
          </q-td>
          <q-td :props="props" key="PagamentoRealizado">
            {{props.row.paymentMade}}
          </q-td>
          <q-td :props="props" key="Saldo">
            {{props.row.balance}}
          </q-td>
          <q-td :props="props" key="Observacoes">
            {{props.row.notes}}
          </q-td> -->
        
        </q-tr>
      </template>
      </q-table>
    </div>
    <!-- Tabela Fim -->

    <!-- Modal Novo-->
    <div>
      <q-dialog v-model="addModal" auto-width>
            <q-card class="q-pa-md">
              <q-form
              class="row flex q-gutter-y-md"
              >

                <div class="row col-12 q-gutter-sm">
                    <q-select
                      class="col-12 flex items-end"
                      outlined
                      stack-label
                      label="Status"
                      :options="statusOptions"
                      v-model="trecho.status"
                    ></q-select>
                </div>

                <div class="row col-12 q-gutter-sm">
                  <div class="col-3">
                    <q-select
                      outlined
                      stack-label
                      label="Tipo"
                      :options="originTypeOptions"
                      v-model="trecho.originType"
                    ></q-select>
                  </div>
                  <div class="row col-12">
                  
                    <div class="col-xs-12 q-mb-sm">
                      <ListAutocomplete
                      :source="getGeoPlaces"
                      :isLoading="isSearching"
                      label="Busca de endereço"
                      @selected="onSelectOrigin"
                      placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                      />
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-12">
                    <PeopleAutocomplete v-if="trecho.originType == 'Base'" :source="searchPeople" :isLoading="isSearching" label="Fornecedor"
                      @selected="onSelectOriginProvider" placeholder="Pesquisar..." />
                  </div>
                </div>
                  
                <div class="row col-12 q-gutter-sm">
                  <div class="col-12">
                    <q-input
                      type="date"
                      outlined
                      stack-label
                      label="Embarque"
                      v-model="trecho.shippingDate"
                    ></q-input>
                  </div>
                </div>
              
                <div class="col-12 q-gutter-sm flex justify-end">
                  <q-btn
                    color="positive"
                    label="Salvar"
                    @click="saveStretch()"
                  ></q-btn>
                  <q-btn
                    color="negative"
                    label="Cancelar"
                    v-close-popup
                    @click="onReset"
                  ></q-btn>
                </div> 

              </q-form>
            </q-card>
      </q-dialog>
    </div>
    <!-- Modal Novo Fim -->

    <!-- Modal Edit-->
    <div>
      <q-dialog v-model="editModal" auto-width>
            <q-card class="q-pa-md">
              <q-form
              class="row flex q-gutter-y-md"
              >

                <div class="row col-12 q-gutter-sm">
                  <div class="col-12">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Status"
                      v-model="trecho.status"
                    ></q-input>
                  </div>

                  <div class="col-4">
                      <q-input
                        outlined
                        readonly
                        stack-label
                        label="Tipo"
                        v-model="trecho.originType"
                      ></q-input>
                  </div>

                  <div class="col-5">
                    <q-input
                      v-if="trecho.originType != 'Coleta' && trecho.originRegion != null"
                      outlined
                      readonly
                      stack-label
                      label="Região"
                      v-model="trecho.originRegion"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      v-if="trecho.originType != 'Coleta' && trecho.originState != null"
                      outlined
                      readonly
                      stack-label
                      label="UF"
                      v-model="trecho.originState"
                    ></q-input>
                  </div>
                  <div class="col-12">
                  
                    <div class="col-xs-12 col-sm-6">
                      <q-input 
                        v-if="trecho.originType == 'Base'" 
                        outlined
                        stack-label
                        readonly
                        label="Fornecedor"
                        v-model="trecho.provider"
                      />
                    </div>
                    <div class="col-xs-12 q-mb-sm" v-if="trecho.originType == 'Coleta'">
                      <ListAutocomplete
                        :source="getGeoPlaces"
                        :isLoading="isSearching"
                        label="Busca de endereço"
                        @selected="onSelectOrigin"
                        placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                      />
                    </div>
                  </div>
                </div>

                <div class="row col-12 q-gutter-sm">
                  <div class="col-12">
                    <q-input
                      type="date"
                      outlined
                      stack-label
                      label="Embarque"
                      v-model="trecho.shippingDate"
                    ></q-input>
                  </div>

                  <div class="col-12">
                    <q-input
                      type="date"
                      outlined
                      stack-label
                      label="Chegada"
                      v-model="trecho.arrivalDate"
                    ></q-input>
                  </div>
                </div>
              
                <div class="col-12 q-gutter-sm flex justify-end">
                  <q-btn
                    color="positive"
                    label="Salvar"
                    @click="saveStretch()"
                  ></q-btn>
                  <q-btn
                    color="negative"
                    label="Cancelar"
                    v-close-popup
                    @click="onReset"
                  ></q-btn>
                </div> 


                <!-- <div class="row col-12 q-gutter-sm" v-if="trecho.originType == 'Base'">
                
                  <div class="col-2">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Fornecedor endereço"
                      v-model="trecho.providerAddress"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      type="date"
                      outlined
                      stack-label
                      label="Liberação do carro"
                      v-model="trecho.locator"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Valor vendido"
                      v-model="trecho.soldValue"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Valor pago"
                      v-model="trecho.paidValue"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      readonly
                      outlined
                      stack-label
                      label="Saldo"
                      v-model="trecho.providerBalance"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-select
                      outlined
                      stack-label
                      label="Status"
                      :options="providerStatusOptions"
                      v-model="trecho.providerStatus"
                    ></q-select>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      type="date"
                      stack-label
                      label="Data pátio"
                      v-model="trecho.carParkDate"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Dias uteis decorridos (Patio)"
                      v-model="trecho.elapsedWorkingDays"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Prazo contrato"
                      v-model="trecho.termContract"
                    ></q-input>
                  </div>
                
                </div> -->

                <!-- <div class="row col-12 q-gutter-sm">
                  <div class="col-3">
                    <label>Cobrança de base de entrega?</label>
                    <q-radio
                      outlined
                      disable
                      stack-label
                      label="Sim"
                      v-model="trecho.deliveryBaseTax"
                      :val="true"
                    ></q-radio>
                    <q-radio
                      outlined
                      disable
                      stack-label
                      label="Não"
                      v-model="trecho.deliveryBaseTax"
                      :val="false"
                    ></q-radio>
                  </div>
                  <div class="col-4">
                    <q-input
                      v-if="trecho.deliveryBaseTax"
                      outlined
                      readonly
                      stack-label
                      label="Valor"
                      v-model="trecho.deliveryBaseTaxValue"
                      type="number"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-input
                      outlined
                      stack-label
                      label="Valor do frete vendido"
                      v-model="trecho.taxSoldValue"
                      type="number"
                    ></q-input>
                  </div>
                  <div class="col-4">
                    <q-input
                      outlined
                      stack-label
                      label="Valor negociado"
                      v-model="trecho.dealedValue"
                      type="number"
                    ></q-input>
                  </div>
                </div> -->

                <!-- <div class="row col-12 q-gutter-sm">

                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Data provisao pagamento"
                      v-model="trecho.paymentProvisionDate"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Pagamento realizado"
                      v-model="trecho.paymentMade"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Saldo"
                      v-model="trecho.balance"
                    ></q-input>
                  </div>
                </div> -->

              </q-form>
            </q-card>
      </q-dialog>
    </div>
    <!-- Modal Edit Fim -->
  </div>

</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { mapActions, mapGetters } from "vuex";
import { date } from "quasar";
import { formatMoney } from "@controleonline/quasar-common-ui/src/utils/formatter";
import DataFilter from "@controleonline/quasar-common-ui/src/components/common/DataFilter.vue";
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/common/ListAutocomplete";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/common/PeopleAutocomplete";
import fetch from '@controleonline/quasar-common-ui/src/utils/fetch';
import { LocalStorage } from "quasar";

const SETTINGS = {
  columns: [
          {
            name: 'Id',
            label: 'Id',
            align: 'center',
            field: row => row.id,
            format: val => `${val}`,
          },
          {
            name: 'trechostatus',
            label: 'Status',
            align: 'center',
            field: row => row.trechostatus,
            format: val => `${val}`,
          },
          {
            name: 'OrigemTipo',
            label: 'Origem Tipo',
            align: 'center',
            field: row => row.originType,
            format: val => `${val}`,
          },
          {
            name: 'OrigemRegiao',
            label: 'Origem Região',
            align: 'center',
            field: row => row.originRegion,
            format: val => `${val}`,
          },
          {
            name: 'OrigemEstado',
            label: 'Origem Estado',
            align: 'center',
            field: row => row.originState,
            format: val => `${val}`,
          },
          {
            name: 'OrigemCidade',
            label: 'Origem Cidade',
            align: 'center',
            field: row => row.originCity,
            format: val => `${val}`,
          },
          {
            name: 'Fornecedor',
            label: 'Fornecedor',
            align: 'left',
            field: row => row.provider,
            format: val => `${val}`,
          },
          {
            name: 'OrigemEndereco',
            label: 'Endereço de origem',
            align: 'center',
            field: row => row.originAdress,
            format: val => `${val}`,
          },
          {
            name: 'Valor',
            label: 'Valor',
            align: 'center',
            field: row => row.value,
            format: val => `${val}`,
          },
          {
            name: 'DataEmbarque',
            label: 'Data embarque',
            align: 'right',
            field: row => row.shippingDate,
            format: val => `${val}`,
          },
          {
            name: 'DataChegada',
            label: 'Data chegada',
            align: 'right',
            field: row => row.arrivalDate,
            format: val => `${val}`,
          },
        ],
};

Object.freeze(SETTINGS);

export default {
  
  props: {
    orderId: {
      type: Number,
      required: false,
    },
    orderPrice: {
      type: Number,
      required: false,
    }
  },
  
  components: {
    DataFilter,
    ListAutocomplete,
    PeopleAutocomplete,
  },

  created() {
    this.checkOrderId();
    if (this.myCompany !== null) {
      this.filters.company = this.myCompany;
      this.getValuesToLoad();
    }
  },

  beforeDestroy() {
  },

  data() {

    return {
      api: new Api(this.$store.getters["auth/user"].token),
      isLoading: false,
      isSearching: false,
      editShippingTax: true,
      shippingTax: null,
      hasOrderId: null,
      indexRowEdit: null,
      shippingDate: '2022-12-12',
      trecho: {
        id:null,
        status: null,
        shippingDate: null,
        arrivalDate: null,
        originType: null,
        originRegion: null,
        originState: null,
        provider: null,
        originCity: null,
        originAdress: null,
        value: null,
      },
      addModal: false,
      editModal: false,
      providerOptions: ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"],
      providerStatusOptions: ['Liberado para base', 'Aguardando cliente', 'Pátio'],
      statusOptions: [],
      originTypeOptions: ["Coleta", "Base"],
      destinationTypeOptions: ["Entrega", "Base", "Ponto de encontro"],
      originRegionOptions: ['Norte', 'Nordeste', 'Sul', 'Sudeste', 'Centro-Oeste'],
      destinationRegionOptions: ['Norte', 'Nordeste', 'Sul', 'Sudeste', 'Centro-Oeste'],
      collectionStateOptions: [
        ['Acre','AC','Norte'],
        ['Alagoas','AL','Nordeste'],
        ['Amapá','AP','Norte'],
        ['Amazonas','AM','Norte'],
        ['Bahia','BA','Nordeste'],
        ['Ceará','CE','Nordeste'],
        ['Distrito Federal','DF','Centro-Oeste'],
        ['Espírito Santo','ES','Sudeste'],
        ['Goiás','GO','Centro-Oeste'],
        ['Maranhão','MA','Nordeste'],
        ['Mato Grosso','MT','Centro-Oeste'],
        ['Mato Grosso do Sul','MS','Centro-Oeste'],
        ['Minas Gerais','MG','Sudeste'],
        ['Pará','PA','Norte'],
        ['Paraíba','PB','Nordeste'],
        ['Paraná','PR','Sul'],
        ['Pernambuco','PE','Nordeste'],
        ['Piauí','PI','Nordeste'],
        ['Rio de Janeiro','RJ','Sudeste'],
        ['Rio Grande do Norte','RN','Nordeste'],
        ['Rio Grande do Sul','RS','Sul'],
        ['Rondônia','RO','Norte'],
        ['Roraima','RR','Norte'],
        ['Santa Catarina','SC','Sul'],
        ['São Paulo','SP','Sudeste'],
        ['Sergipe','SE','Nordeste'],
        ['Tocantins','TO','Norte'],
      ],
      originUfRegionOptions: [],
      destinationUfRegionOptions: [],
      data: [],
      settings: SETTINGS,
      filters: {
        company: null,
        defaultCompany: null,
        order: null,
        origin: null,
        destination: null,
        provider: null,
        status: "Todos",
        dateFrom: "",
        dateTo: "",
      },
      pagination: {
        sortBy: "ultimaModificacao",
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      loadingStatuses: false,
    };
  },

  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      error: "salesOrder/error",
      violations: "salesOrder/violations",
      myCompany: "people/currentCompany",
      contact: "people/contact",
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.onRequest({
          pagination: this.pagination,
        });
      }
    },
  
    "filters.order"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  
    "filters.origin"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },

    "filters.destination"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },

    "filters.provider"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.status"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.dateFrom"(value) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.dateTo"(value) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "addModal"() {
      if (this.addModal == false) this.deliveryBaseTax = null;
    },
},

  methods: {
    ...mapActions({
      geoplace: "gmaps/geoplace",
      search: "people/searchPeople",
      }),

    // Componentes
    searchPeople(input) {
      this.isSearching = true;

      return this.search(input).then((result) => {
        this.isSearching = false;

        if (result && result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label:
                result.data[i].id +
                " - " +
                result.data[i].name +
                " - " +
                result.data[i].alias,
              value: result.data[i],
            });
          }
          return items;
        } else {
          this.isSearching = false;
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            position: "bottom",
            type: "negative",
          });
        }
      });
    },
    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace(input).then((result) => {
        this.isSearching = false;

        if (result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label: result.data[i].description,
              value: result.data[i],
            });
          }
          return items;
        } else {
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            type: "negative",
            position: "bottom",
          });
        }
      });
    },
    onSelectOrigin(item) {
      if (item.street) {
        this.getOriginRegion(item);
        this.trecho.originState = item.state;
        this.trecho.originCity = item.city;
      }
      this.trecho.originAdress = item.description;
    },
    onSelectOriginCity(item) {
      this.trecho.originCityMeeting = item.city;
      this.trecho.originState = item.state;
      this.getOriginRegion(item);
    },
    onSelectDestination(item) {
      if (item.street) {
        this.getDestinationRegion(item);
        this.trecho.destinationState = item.state;
        this.trecho.destinationCity = item.city;
      }
      this.trecho.destinationAdress = item.description;
    },
    onSelectDestinationCity(item) {
      this.trecho.destinationCityMeeting = item.city;
      this.trecho.destinationState = item.state;
      this.getDestinationRegion(item);
    },
    onSelectOriginProvider(item) {
      this.trecho.provider = {
        value: item.id,
        label: item.name,
      };
      // this.requestProvider(item.id);
    },
    onSelectDestinationProvider(item) {
      this.trecho.destinationProvider = item.name;
    },
    onSelectOriginFilter(item) {
      this.filters.origin = item.description;
    },
    onSelectDestinationFilter(item) {
      this.filters.destination = item.description;
    },
    onSelectOriginProviderFilter(item) {
      this.filters.provider = item.name
    },
    dateChanged(date) {
      if (date.from || date.to) {
        this.filters.from = date.from;
        this.filters.to = date.to;
        this.onRequest({
          pagination: this.pagination,
          filter: this.filters,
        });
      }
    },

    // Auxiliares
    checkOrderId() {
      this.hasOrderId = this.orderId ? true : false;
    },
    openEditModal(props) {
      this.editModal = true;
      this.trecho = structuredClone(props.row);
      this.trecho.shippingDate = this.formatDate(this.trecho.shippingDate);
      this.trecho.shippingDate = this.buildAmericanDate(this.trecho.shippingDate);
    },
    validateDate(dateString) {
      let today = new Date();
      dateString = dateString.split("-");
      let date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
      if (date >= today) return true;
    },
    getOriginRegion(locale) {
      let states = this.collectionStateOptions;
      for (let index in states) {
        if (states[index][1] == locale.state) {
          this.trecho.originRegion = states[index][2];
        }
      }
    },
    getDestinationRegion(locale) {
      let states = this.collectionStateOptions;
      for (let index in states) {
        if (states[index][1] == locale.state) this.trecho.destinationRegion = states[index][2];
      }
    },
    onReset() {
      this.editModal = false;
      this.trecho.id = null;
      this.trecho.status = null;
      this.trecho.shippingDate = null;
      this.trecho.arrivalDate = null;
      this.trecho.originType = null;
      this.trecho.originRegion = null;
      this.trecho.originState = null;
      this.trecho.provider = null;
      this.trecho.originCity = null;
      this.trecho.originAdress = null;
      this.trecho.value = null;
      // this.trecho.providerAddress = null;
      // this.trecho.locator = null;
      // this.trecho.releaseCar = null;
      // this.trecho.soldValue = null;
      // this.trecho.paidValue = null;
      // this.trecho.providerBalance = this.trecho.soldValue - this.trecho.paidValue || null;
      // this.trecho.providerStatus = null;
      // this.trecho.carParkDate = null;
      // this.trecho.providerShippingDate = null;
      // this.trecho.elapsedWorkingDays = null;
      // this.trecho.termContract = null;
      // this.trecho.deliveryBaseTax = null;
      // this.trecho.deliveryBaseTaxValue = null;
      // this.trecho.taxSoldValue = null;
      // this.trecho.dealedValue = null;
      // this.trecho.paymentProvisionDate = null;
      // this.trecho.paymentMade = null;
      // this.trecho.balance = null;
      // this.trecho.notes = null;
    },
    formatDate(dateString) {
      if (dateString)
        return date.formatDate(
          date.extractDate(dateString, "YYYY-MM-DD"),
          "DD/MM/YYYY"
        );
      else return null;
    },
    buildAmericanDate(dateString) {
      let formatedDate;

      if (dateString) {
        dateString = dateString.replaceAll("/", "-");
        formatedDate = date.formatDate(
          date.extractDate(dateString, "DD-MM-YYYY"),
          "YYYY-MM-DD"
        );
      } else {
        return null;
      }
      return formatedDate;
    },
    getStatuses() {
      const endpoint = "statuses";
      const options = {};
      options.params = {
        context: 'logistic'
      };
      return this.api
        .private(endpoint,  options )
        .then((response) => response.json())
        .then((result) => {
          let members = result["hydra:member"];
          if (members){
            this.statusOptions = [];
            for (let index in members) {
              this.statusOptions.push({
                value: (members[index]['@id'].replaceAll("/statuses/", "")),
                label: this.$t(`logistic.statuses.${members[index].status}`),
              })
            }
          }
        });
    },
    getValuesToLoad() {
      this.getStatuses();
      this.onRequest({pagination: this.pagination});
    },

    // CRUD
    saveStretch() {
      let endpoint = this.trecho.id == null ? `/logistics/order` : `/logistic/${this.trecho.id}`;

      let trecho = structuredClone(this.trecho);
      trecho.orderId = this.orderId;
      trecho.value = this.orderPrice;
      
      if (trecho.originType == "Base")
        trecho.originType = 'b';

      if (trecho.originType == "Coleta")
        trecho.originType = 'c';
      
      if (this.trecho.provider) {
      trecho.provider = this.trecho.provider.value;
      }

      if (this.trecho.status) {
        trecho.status = this.trecho.status.value;
      }
      let options = {
      method: this.trecho.id == null ? 'POST' : 'PUT',
      headers: new Headers({ "Content-Type": "application/ld+json" }),
      body  : JSON.stringify(trecho),
      };

      this.api
        .private(endpoint,  options )
        .then((response) => response.json())
        .then((result) => {
          if (result.response.success) {
            this.$q.notify({
              message: this.$t("Dados salvos com sucesso!"),
              position: "bottom",
              type: "positive",
            });
          } else {
            this.$q.notify({
              message: this.$t("Não foi possível salvar os dados!"),
              position: "bottom",
              type: "negative",
            });
          }
          return null;
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
        })
        .finally(() => {
          this.isSaving = false;
          this.onReset();
          this.getValuesToLoad();
        });
    },
    getStretchies(params) {
      const endpoint = this.hasOrderId ? "/logistic" : "";
      const options = {};
      options.params = params;
      return this.api
        .private(endpoint,  options )
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:totalItems"],
          };
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
        })
      .finally(() => {
        this.isSaving = false;
      });
    },
    onRequest(props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      // let params = { itemsPerPage: rowsPerPage, page };
      let params = {};

      if(!this.hasOrderId && this.filters.order != null) {
        params["order"] = this.filters.order;
      }

      if (this.filters.origin != null && this.filters.origin.length > 0) {

        params["origin"] = this.filters.origin;
      }

      if (this.filters.destination != null && this.filters.destination.length > 0) {
        params["destination"] = this.filters.destination
      }

      if (this.filters.provider != null && this.filters.provider.length > 0) {
        params["provider"] = this.filters.provider
      }

      if (this.filters.status != null && this.filters.status != "Todos") {
        params["status"] = this.filters.status
      }

      if (this.filters.from != null) {
        params.fromDate = this.buildAmericanDate(this.filters.from);
      }

      if (this.filters.to != null) {
        params.toDate = this.buildAmericanDate(this.filters.to)
      }

      if (this.filters.company != null) {
        params["myCompany"] = this.filters.company.id;
      }

      this.getStretchies(params).then((data) => {
        this.data = [];
        if (data.members) {
          for (let index in data.members) {
            let originType = '';
            
            if (data.members[index].originType == 'b')
              originType = "Base";

            if (data.members[index].originType == 'c')
              originType = "Coleta";
            this.data.push({
              id: data.members[index].id,
              status: data.members[index].status.status,
              shippingDate: data.members[index].shippingDate,
              arrivalDate: data.members[index].arrivalDate,
              originType: originType,
              originRegion: data.members[index].originRegion,
              originState: data.members[index].originState,
              provider: data.members[index].provider.alias,
              originCity: data.members[index].originCity,
              originAdress: data.members[index].originAdress,
              value: data.members[index].value,
            })
          }
        }
        // console.log(data)
        // this.pagination.page = page;
        // this.pagination.rowsPerPage = rowsPerPage;
        // this.pagination.sortBy = sortBy;
        // this.pagination.descending = descending;
      })
      .catch((error) => {
          this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
        })
        .finally(() => {
          this.isSaving = false;
        });
    },
  },
};
</script>

<style>
.table-container {
  overflow-x: scroll;
}
</style>
