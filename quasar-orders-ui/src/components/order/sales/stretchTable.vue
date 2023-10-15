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
      <div>
        <div class="row">
          <div v-if="!hasOrderId" class="row col-12 q-col-gutter-sm">
            <div class="col-xs-12 col-sm-2 col-md-2 q-pb-sm">
              <q-input
                dense
                outlined
                stack-label
                label="Pedido"
                v-model="filters.order"
              ></q-input>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-4">
              <ListAutocomplete
                ref="originAddress"
                :source="getGeoPlaces"
                :isLoading="originAddressFilterLoading"
                label="Origem"
                @selected="onSelectOriginFilter"
                placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-4">
              <ListAutocomplete
                ref="destinationAddress"
                :source="getGeoPlaces"
                :isLoading="destinationAddressFilterLoading"
                label="Destino"
                @selected="onSelectDestinationFilter"
                placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-2 q-pb-sm">
              <q-select
                dense
                outlined
                stack-label
                label="Status"
                v-model="filters.status"
                :options="filterStatusOptions"
                :loading="loadingStatuses"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> Sem resultados </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xs-12 col-sm-2 col-md-3">
              <PeopleAutocomplete
                ref="originProvider"
                :source="searchPeople"
                :isLoading="originProviderFilterLoading"
                label="Fornecedor de origem"
                @selected="onSelectOriginPeopleFilter"
                placeholder="Pesquisar..."
              />
            </div>
            <div class="col-xs-12 col-sm-2 col-md-3">
              <PeopleAutocomplete
                ref="destinationProvider"
                :source="searchPeople"
                :isLoading="destinationProviderFilterLoading"
                label="Fornecedor de destino"
                @selected="onSelectDestinationPeopleFilter"
                placeholder="Pesquisar..."
              />
            </div>
            <div class="col-xs-12 col-sm-7 col-md-6 q-pb-sm">
              <DataFilter
                ref="myDataFilter"
                class="data-filter"
                style="justify-content: flex-start"
                :labels="['Embarque', 'Chegada']"
                :fromDate="filters.from"
                :toDate="filters.to"
                :showButton="false"
                @dateChanged="dateChanged"
              />
            </div>
            <div class="col-xs-12 col-sm-4 col-md-3 q-pb-sm">
              <q-select
                dense
                outlined
                stack-label
                label="Pendentes"
                v-model="filters.pendings"
                :options="[{label: 'Sim', value: true}, {label: 'Não', value: false},{label: 'Todos', value: 'Todos'}]"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 flex justify-end q-gutter-x-md">
            <div v-if="!hasOrderId" class="col-sm-3 flex items-end col-xs-12 q-pb-md">
              <q-btn color="primary" label="Limpar filtro" @click="cleanFilter()"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Filtros Fim -->

    <div class="flex justify-end col-12 q-ma-sm">
      <q-btn
        v-if="hasOrderId"
        class=""
        label="Novo Trecho"
        color="primary"
        :disabled="isLoading"
        @click="openModal = true"
      ></q-btn>
    </div>

    <!-- Tabela-->
    <div class="q-mt-none">
      <q-table
        ref="myTable"
        flat
        :loading="isLoading"
        :rows="data"
        :columns="columns"
        :pagination.sync="pagination"
        @request="onRequest"
        row-key="Id"
        :rows-per-page-options="[0]"
      >
        <!-- <template v-slot:header-selection="scope"></template> -->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="acoes">
              <q-btn dense flat icon="settings">
                <q-menu>
                  <q-list>
                    <q-item clickable @click="openEditModal(props)">
                      <q-item-section side>
                        <q-icon name="edit"></q-icon>
                      </q-item-section>
                      <q-item-section> Editar </q-item-section>
                    </q-item>
                    <q-separator></q-separator>

                    <q-item
                      clickable
                      @click="finish(props)"
                      v-if="props.row.status.label != 'Finalizado'"
                    >
                      <q-item-section side>
                        <q-icon name="check"></q-icon>
                      </q-item-section>
                      <q-item-section> Finalizar </q-item-section>
                    </q-item>
                    <q-separator></q-separator>
                    <q-item
                      clickable
                      @click="addSurvey(props)"
                      v-if="!props.row.surveyId"
                    >
                      <q-item-section side>
                        <q-icon name="checklist"></q-icon>
                      </q-item-section>
                      <q-item-section> Vistoria </q-item-section>
                    </q-item>
                    <q-separator></q-separator>
                    <q-item clickable @click="deleteTrecho(props)">
                      <q-item-section side>
                        <q-icon name="delete"></q-icon>
                      </q-item-section>
                      <q-item-section> Excluir </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
            <q-td :props="props" key="Vistoria">
              <q-btn
                v-if="props.row.surveyId"
                outline
                dense
                :to="{
                  name: 'ChecklistDetails',
                  params: { id: props.row.surveyId, token_url: props.row.surveyToken },
                }"
                label="Vistoria Id"
                class="full-width"
              />
            </q-td>
            <q-td :props="props" key="Id">
              {{ props.row.id }}
            </q-td>
            <q-td :props="props" key="IdPedido">
              <q-btn
                outline
                dense
                :to="{ name: 'OrderDetails', params: { id: props.row.order } }"
                :label="props.row.order"
                class="full-width"
              />
            </q-td>
            <q-td :props="props" key="IdContrato">
              <q-btn
                v-if="props.row.contract"
                outline
                dense
                :to="{ name: 'ContractDetails', params: { id: props.row.contract } }"
                :label="props.row.contract"
                class="full-width"
              />
              <div v-else>-</div>
            </q-td>
            <q-td :props="props" key="IdFatura">
              <q-btn
                v-if="props.row.orderInvoice"
                outline
                dense
                :to="{ name: 'PayDetails', params: { id: props.row.orderInvoice } }"
                :label="props.row.orderInvoice"
                class="full-width"
              />
              <div v-else>-</div>
            </q-td>
            <q-td
              key="stretchstatus"
              :props="props"
              :style="{ color: getStatusColor(props.row.status.label) }"
            >
              {{ props.row.status.label }}
            </q-td>
            <q-td :props="props" key="OrigemTipo">
              {{ props.row.originType }}
            </q-td>
            <q-td :props="props" key="OrigemRegiao">
              {{ props.row.originRegion }}
            </q-td>
            <q-td :props="props" key="OrigemEstado">
              {{ props.row.originState }}
            </q-td>
            <q-td :props="props" key="OrigemCidade">
              {{ props.row.originCity }}
            </q-td>
            <q-td :props="props" key="OrigemEndereco">
              {{ props.row.originAdress }}
            </q-td>
            <q-td :props="props" key="OrigemLocalizador">
              {{ props.row.originLocator }}
            </q-td>
            <q-td :props="props" key="Fornecedor">
              {{ props.row.provider ? props.row.provider.label : "" }}
            </q-td>
            <q-td :props="props" key="DestinoTipo">
              {{ props.row.destinationType }}
            </q-td>
            <q-td :props="props" key="DestinoRegiao">
              {{ props.row.destinationRegion }}
            </q-td>
            <q-td :props="props" key="DestinoEstado">
              {{ props.row.destinationState }}
            </q-td>
            <q-td :props="props" key="DestinoCidade">
              {{ props.row.destinationCity }}
            </q-td>
            <q-td :props="props" key="DestinoEndereco">
              {{ props.row.destinationAdress }}
            </q-td>
            <q-td :props="props" key="DestinoLocalizador">
              {{ props.row.destinationLocator }}
            </q-td>
            <q-td :props="props" key="DestinoFornecedor">
              {{
                props.row.destinationProvider ? props.row.destinationProvider.label : ""
              }}
            </q-td>
            <q-td :props="props" key="Valor">
              {{ formatMoney(props.row.price) }}
            </q-td>
            <q-td :props="props" key="ValorPago">
              {{ formatMoney(props.row.amountPaid) }}
            </q-td>
            <q-td :props="props" key="Saldo">
              {{ formatMoney(props.row.balance) }}
            </q-td>
            <q-td :props="props" key="PrevisaoDataEmbarque">
              {{ formatDate(props.row.estimatedShippingDate) }}
            </q-td>
            <q-td :props="props" key="DataEmbarque">
              {{ formatDate(props.row.shippingDate) }}
            </q-td>
            <q-td :props="props" key="PrevisaoDataChegada">
              {{ formatDate(props.row.estimatedArrivalDate) }}
            </q-td>
            <q-td :props="props" key="DataChegada">
              {{ formatDate(props.row.arrivalDate) }}
            </q-td>
            <q-td :props="props" key="UltimaModificacao">
              {{ formatFullDateTime(props.row.lastModified, "DD/MM/YYYY") }}
            </q-td>
            <q-td :props="props" key="Responsavel">
              {{ props.row.inCharge }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <q-dialog persistent v-model="openModal">
        <div style="max-width: 90vw">
          <StrechModal 
            :orderId="orderId" :myCompany="myCompany" :vehicle="car" :collectionAddress="collectionAddress"
            :destinationAddress="destinationAddress" :invoiceTotal="invoiceTotal"
            :statusOptions="statusOptions" :stretchValueOptions="stretchValueOptions"
            :stretchToEdit="stretchToEdit" @close="() => { openModal = false; stretchToEdit = {}}" @loadLogistics="openModal = false; stretchToEdit = {}; getValuesToLoad()"
            >
          </StrechModal>

        </div>
      </q-dialog>

    <!-- Modal Add new  -->
    <!-- <div>
      <q-dialog v-model="editModal">
        <q-card class="q-pa-md" style="max-width: 900px; width: 90vw;">
          <q-card-section class="row items-center">
            <label class="text-h5">Editar Trecho</label>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <q-input
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                dense
                outlined
                readonly
                stack-label
                label="Franquia"
                v-model="myCompany.alias"
              ></q-input>
              <q-input
                class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                dense
                outlined
                readonly
                stack-label
                label="Automóvel"
                v-model="car"
              ></q-input>
              <q-input
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                dense
                outlined
                readonly
                stack-label
                label="Endereço da coleta"
                v-model="collectionAddress"
              ></q-input>
              <q-input
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                dense
                outlined
                readonly
                stack-label
                label="Endereço da entrega"
                v-model="destinationAddress"
              ></q-input>
              <q-input
                class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
                dense
                outlined
                readonly
                stack-label
                label="Valor do seguro"
                v-model="invoiceTotal"
              ></q-input>
            </div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-form class="row q-col-gutter-sm" ref="myForm" @submit="onSubmit">
                <q-select class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                  dense
                  outlined
                  stack-label
                  label="Status"
                  :options="statusOptions"
                  v-model="stretch.status"
                  :rules="[(val) => val != null]"
                  hide-bottom-space
                ></q-select>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div class="row q-col-gutter-sm">      
                  <label class="col-12">Origem</label>                                                     
                  <q-select
                    class="col-12"
                    dense
                    outlined
                    stack-label
                    label="Tipo de origem"
                    :options="originTypeOptions"
                    v-model="stretch.originType"
                    :rules="[(val) => val != null]"
                    hide-bottom-space
                  ></q-select>

                  <PeopleAutocomplete
                    class="col-12 reset-padding-bottom"
                    :source="searchPeople"
                    :isLoading="originProviderLoading"
                    label="Fornecedor de origem"
                    @selected="onSelectOriginPeople"
                    placeholder="Pesquisar..."
                    :input="stretch.provider"
                  />                    
                  <div v-if="stretch.originType == 'Base'" class="col-12">
                  <q-select
                    v-if="originProviderHasAddress"
                    :options="originProviderAddressOptions"
                    dense
                    outlined
                    stack-label
                    label="Origem endereço"
                    v-model="tempOriginAddressAdd"
                  ></q-select>
                  <ListAutocomplete
                    v-else
                    class="reset-padding-bottom"
                    :source="getGeoPlaces"
                    :isLoading="originAddressLoading"
                    label="Busca de endereço"
                    @selected="onSelectOrigin"
                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                  />
                </div>
                <div v-else class="col-12">
                  <div class="col-12">
                    <q-input
                      v-if="editAdress == false"
                      dense
                      outlined
                      readonly
                      stack-label
                      label="Endereço de origem"
                      v-model="stretch.originAdress"
                    >
                      <template v-slot:append>
                        <q-btn
                          dense
                          flat
                          icon="edit"
                          color="primary"
                          @click="editAdress = true"
                        ></q-btn>
                      </template>
                    </q-input>
                  </div>
                  <div class="row flex items-center" v-if="editAdress == true">
                    <ListAutocomplete
                      class="col-11"
                      :source="getGeoPlaces"
                      :isLoading="originAddressLoading"
                      label="Busca de endereço"
                      @selected="onSelectOriginEdit"
                      placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                    />
                    <div class="col-1">
                      <q-btn
                        dense
                        flat
                        icon="cancel"
                        color="negative"
                        @click="cancelEditAdress()"
                      ></q-btn>
                    </div>
                  </div>
                </div>
                <q-input
                  class="col-12"
                  dense
                  outlined
                  readonly
                  stack-label
                  label="Localizador de origem"
                  v-model="stretch.originLocator"
                />
                </div>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div class="row q-col-gutter-sm">
                  <label class="col-12">Destino</label>                     
                  <q-select
                    class="col-12"
                    dense
                    outlined
                    stack-label
                    label="Tipo de destino"
                    :options="destinationTypeOptions"
                    v-model="stretch.destinationType"
                    :rules="[(val) => val != null]"
                    hide-bottom-space
                  ></q-select>
                  <PeopleAutocomplete
                    class="col-12 reset-padding-bottom"
                    :source="searchPeople"
                    :isLoading="destinationProviderLoading"
                    label="Fornecedor de destino"
                    @selected="onSelectDestinationPeople"
                    placeholder="Pesquisar..."
                    :input="stretch.destinationProvider"
                  />
                  <div v-if="stretch.destinationType != 'Base'" class="col-12">
                    <ListAutocomplete
                      class="reset-padding-bottom"
                      :source="getGeoPlaces"
                      :isLoading="destinationAddressLoading"
                      label="Busca de endereço"
                      @selected="onSelectDestination"
                      placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                    />
                  </div>
                  <div v-if="stretch.destinationType == 'Base'" class="col-12">
                    <q-select
                      v-if="destinationProviderHasAddress"
                      :options="destinationProviderAddressOptions"
                      dense
                      outlined
                      stack-label
                      label="Destino endereço"
                      v-model="tempDestinationAddressAdd"
                    ></q-select>
                    <ListAutocomplete
                      v-else
                      class="reset-padding-bottom"
                      :source="getGeoPlaces"
                      :isLoading="destinationAddressLoading"
                      label="Busca de endereço"
                      @selected="onSelectDestination"
                      placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                    />
                  </div>
                  <q-input
                    class="col-12"
                    dense
                    outlined
                    readonly
                    stack-label
                    label="Localizador de destino"
                    v-model="stretch.destinationLocator"
                  />
                  </div>
              </div>
              <div class="col-12">
                  <div class="row q-col-gutter-sm">
                      <q-select  class="col-3" dense outlined stack-label label="Taxa"
                      :options="stretchValueOptions" v-model="stretchValueSelected"></q-select>
                              
                      <q-input class="col-3" dense type="number" outlined stack-label
                      label="Valor" v-model="stretch.price" :rules="[(val) => val != null]"
                      hide-bottom-space></q-input>
          
                      <q-input class="col-3" dense type="number" outlined stack-label
                      label="Valor Pago" v-model="stretch.amountPaid"></q-input>
                  
                      <q-input class="col-3" dense type="number" outlined readonly stack-label
                      label="Saldo" v-model="stretch.balance"></q-input>
                  </div>                            
              </div>
              <div class="col-12">
                  <div class="row q-col-gutter-sm">
                      <q-input class="col-3" dense type="date" outlined stack-label
                          label="Previsão de embarque" v-model="stretch.estimatedShippingDate"
                          :rules="[(val) => val != null]" hide-bottom-space></q-input>

                      <q-input class="col-3" dense type="date" outlined stack-label
                          label="Embarque" v-model="stretch.shippingDate"></q-input>
                                      
                      <q-input class="col-3" dense type="date" outlined stack-label
                          label="Previsão de Chegada" v-model="stretch.estimatedArrivalDate"
                          :rules="[(val) => val != null]" hide-bottom-space></q-input>

                      <q-input class="col-3" dense type="date" outlined stack-label
                          label="Chegada" v-model="stretch.arrivalDate"></q-input>
                  </div>
              </div>
              <div class="row justify-end col-12 q-gutter-sm q-mt-md">
                  <q-btn color="positive" label="Salvar" @click="saveStretch()"></q-btn>
                  <q-btn color="negative" label="Cancelar" v-close-popup></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div> -->
    <!-- End -->
    <!-- Begin -->
    <q-dialog v-model="confirmDelete" persistent>
      <q-card style="width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="delete" color="red" text-color="white" />
          <div class="text-h6 q-ml-md">Excluir Trecho</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Sim" color="primary" @click="nowDelete()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import DataFilter from "@controleonline/quasar-common-ui/src/components/Common/DataFilter.vue";
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/ListAutocomplete";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
// import StrechModal from "@controleonline/quasar-orders-ui/src/components/order/sales/";
import StrechModal from "./stretchAddEdit.vue";
import {
formatDateYmdTodmY,
formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    orderId: {
      type: Number,
      required: false,
    },
    orderPrice: {
      type: Number,
      required: false,
    },
  },

  components: {
    DataFilter,
    ListAutocomplete,
    PeopleAutocomplete,
    StrechModal,
  },

  created() {
    if (this.defaultCompany.permissions) {
      let permissions = this.defaultCompany.permissions;
      this.isSuper = permissions.includes("super") ? true : false;
    }

    this.verifySuper();

    this.checkOrderId();

    // this.isInOrder();

    if (this.myCompany !== null) {
      this.filters.company = this.myCompany;
      this.getValuesToLoad();
      if (this.hasOrderId) {
        this.getSummaryInfo();
      }
    }
  },

  beforeDestroy() {},

  data() {
    return {
      isLoading: false,
      isSearching: false,
      originAddressFilterLoading: false,
      destinationAddressFilterLoading: false,
      originProviderFilterLoading: false,
      destinationProviderFilterLoading: false,
      originProviderLoading: false,
      originAddressLoading: false,
      destinationProviderLoading: false,
      destinationAddressLoading: false,
      editShippingTax: true,
      stretchToEdit: {},
      shippingTax: null,
      hasOrderId: null,
      isSuper: null,
      testes: true,
      confirmDelete: false,
      idRowToDelete: false,
      isFirstStretch: null,
      addNewStretch: false,
      originProviderHasAddress: true,
      destinationProviderHasAddress: true,
      toggleAddStretch: false,
      indexRowEdit: null,
      car: null,
      invoiceTotal: null,
      collectionAddress: null,
      destinationAddress: null,
      selectedStatus: null,
      selectedProvider: null,
      tempProvider: {},
      tempAdress: {},
      tempDestinationAdress: {},
      tempDestinationProvider: {},
      tempOriginAddressAdd: null,
      tempDestinationAddressAdd: null,
      editAdress: false,
      editProvider: false,
      editDestinationAdress: false,
      editDestinationProvider: false,
      stretch: { price: 0 },
      // stretch: {
      //   id: null,
      //   order: null,
      //   status: null,
      //   originType: null,
      //   originRegion: null,
      //   originState: null,
      //   originCity: null,
      //   originAdress: null,
      //   provider: null,
      //   destinationType: null,
      //   destinationRegion: null,
      //   destinationState: null,
      //   destinationCity: null,
      //   destinationAdress: null,
      //   destinationProvider: null,
      //   price: null,
      //   shippingDate: null,
      //   arrivalDate: null,
      //   lastModified: null,
      //   inCharge: null,
      // },
      openModal: false,
      editModal: false,
      peopleOptions: ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"],
      peopleStatusOptions: ["Liberado para base", "Aguardando cliente", "Pátio"],
      statusOptions: [],
      stretchValueOptions: [],
      stretchValueSelected: null,
      originProviderAddressOptions: [],
      destinationProviderAddressOptions: [],
      filterStatusOptions: [],
      originTypeOptions: ["Coleta", "Base", "Ponto de encontro"],
      destinationTypeOptions: ["Entrega", "Base", "Ponto de encontro"],
      originRegionOptions: ["Norte", "Nordeste", "Sul", "Sudeste", "Centro-Oeste"],
      destinationRegionOptions: ["Norte", "Nordeste", "Sul", "Sudeste", "Centro-Oeste"],
      collectionStateOptions: [
        ["Acre", "AC", "Norte"],
        ["Alagoas", "AL", "Nordeste"],
        ["Amapá", "AP", "Norte"],
        ["Amazonas", "AM", "Norte"],
        ["Bahia", "BA", "Nordeste"],
        ["Ceará", "CE", "Nordeste"],
        ["Distrito Federal", "DF", "Centro-Oeste"],
        ["Espírito Santo", "ES", "Sudeste"],
        ["Goiás", "GO", "Centro-Oeste"],
        ["Maranhão", "MA", "Nordeste"],
        ["Mato Grosso", "MT", "Centro-Oeste"],
        ["Mato Grosso do Sul", "MS", "Centro-Oeste"],
        ["Minas Gerais", "MG", "Sudeste"],
        ["Pará", "PA", "Norte"],
        ["Paraíba", "PB", "Nordeste"],
        ["Paraná", "PR", "Sul"],
        ["Pernambuco", "PE", "Nordeste"],
        ["Piauí", "PI", "Nordeste"],
        ["Rio de Janeiro", "RJ", "Sudeste"],
        ["Rio Grande do Norte", "RN", "Nordeste"],
        ["Rio Grande do Sul", "RS", "Sul"],
        ["Rondônia", "RO", "Norte"],
        ["Roraima", "RR", "Norte"],
        ["Santa Catarina", "SC", "Sul"],
        ["São Paulo", "SP", "Sudeste"],
        ["Sergipe", "SE", "Nordeste"],
        ["Tocantins", "TO", "Norte"],
      ],
      originUfRegionOptions: [],
      destinationUfRegionOptions: [],
      data: [],
      filters: {
        company: null,
        defaultCompany: null,
        order: null,
        origin: null,
        provider: null,
        destination: null,
        destinationProvider: null,
        status: {
          value: 46,
          label: "Aberto",
        },
        pendings: {label: 'Todos', value: 'Todos'},
        from: "",
        to: "",
      },
      pagination: {
        sortBy: "ultimaModificacao",
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
      loadingStatuses: false,
      columns: [
        {
          name: "acoes",
          label: "",
        },
        {
          name: "Vistoria",
          label: "Vistoria",
          align: "center",
          format: (val) => `${val}`,
        },
        {
          name: "Id",
          label: "Id",
          align: "center",
          field: (row) => row.id,
          format: (val) => `${val}`,
        },
        {
          name: "IdPedido",
          label: "Id Pedido",
          align: "center",
          classes: this.hideOrderIdColumn() ? "hidden" : "",
          headerClasses: this.hideOrderIdColumn() ? "hidden" : "",
          field: (row) => row.order,
          format: (val) => `${val}`,
        },
        {
          name: "IdContrato",
          label: "Id Contrato",
          align: "center",
          field: (row) => row.contract,
          format: (val) => `${val}`,
        },
        {
          name: "IdFatura",
          label: "Id Fatura",
          align: "center",
          field: (row) => row.orderInvoice,
          format: (val) => `${val}`,
        },
        {
          name: "stretchstatus",
          label: "Status",
          align: "center",
          field: (row) => row.stretchstatus,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemTipo",
          label: "Origem Tipo",
          align: "center",
          field: (row) => row.originType,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemRegiao",
          label: "Origem Região",
          align: "center",
          field: (row) => row.originRegion,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemEstado",
          label: "Origem Estado",
          align: "center",
          field: (row) => row.originState,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemCidade",
          label: "Origem Cidade",
          align: "center",
          field: (row) => row.originCity,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemEndereco",
          label: "Endereço de origem",
          align: "center",
          field: (row) => row.originAdress,
          format: (val) => `${val}`,
        },
        {
          name: "OrigemLocalizador",
          label: "Localizador de origem",
          align: "center",
          field: (row) => row.originLocator,
          format: (val) => `${val}`,
        },
        {
          name: "Fornecedor",
          label: "Fornecedor",
          align: "left",
          field: (row) => row.people,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoTipo",
          label: "Destino Tipo",
          align: "center",
          field: (row) => row.destinationype,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoRegiao",
          label: "Destino Região",
          align: "center",
          field: (row) => row.destinationRegion,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoEstado",
          label: "Destino Estado",
          align: "center",
          field: (row) => row.destinationState,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoCidade",
          label: "Destino Cidade",
          align: "center",
          field: (row) => row.destinationCity,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoEndereco",
          label: "Endereço de destino",
          align: "center",
          field: (row) => row.destinationAdress,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoLocalizador",
          label: "Localizador de destino",
          align: "center",
          field: (row) => row.destinationLocator,
          format: (val) => `${val}`,
        },
        {
          name: "DestinoFornecedor",
          label: "Fornecedor de destino",
          align: "center",
          field: (row) => row.destinationProvider,
          format: (val) => `${val}`,
        },
        {
          name: "Valor",
          label: "Valor",
          align: "center",
          field: (row) => row.price,
          format: (val) => `${val}`,
        },
        {
          name: "ValorPago",
          label: "Valor Pago",
          align: "center",
          field: (row) => row.amountPaid,
          format: (val) => `${val}`,
        },
        {
          name: "Saldo",
          label: "Saldo",
          align: "center",
          field: (row) => row.balance,
          format: (val) => `${val}`,
        },
        {
          name: "PrevisaoDataEmbarque",
          label: "Previsão Data embarque",
          align: "right",
          field: (row) => row.estimatedShippingDate,
          format: (val) => `${val}`,
        },
        {
          name: "DataEmbarque",
          label: "Data embarque",
          align: "right",
          field: (row) => row.shippingDate,
          format: (val) => `${val}`,
        },
        {
          name: "PrevisaoDataChegada",
          label: "Previsão Data chegada",
          align: "right",
          field: (row) => row.estimatedArrivalDate,
          format: (val) => `${val}`,
        },
        {
          name: "DataChegada",
          label: "Data chegada",
          align: "right",
          field: (row) => row.arrivalDate,
          format: (val) => `${val}`,
        },
        {
          name: "UltimaModificacao",
          label: "Modificado",
          align: "center",
          field: (row) => row.lastModified,
          format: (val) => `${val}`,
        },
        {
          name: "Responsavel",
          label: "Responsável",
          align: "right",
          field: (row) => row.inCharge,
          format: (val) => `${val}`,
        },
      ],
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

    providerLabel() {
      if (this.stretch.provider) return this.stretch.provider.label;
      return "";
    },

    destinationProviderLabel() {
      if (this.stretch.destinationProvider) return this.stretch.destinationProvider.label;
      return "";
    },
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.filters.company = company;
        this.getValuesToLoad();
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

    "filters.provider"() {
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

    "filters.destinationProvider"() {
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
    "filters.from"(value) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.to"(value) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.pendings"(value) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    openModal() {
      if (this.openModal == false) this.deliveryBaseTax = null;
    },
    editModal() {
      if (this.editModal == false) this.onReset();
    },
    toggleAddStretch(value) {
      if (value && !this.stretchValueOptions.length) {
        this.$q.notify({
          message: "O contrato não possui cotação para taxa do trecho",
          position: "bottom",
          type: "negative",
        });
      }

      if (value && !this.isFirstStretch) {
        // this.requestPreviewStretch();
      }
    },
    tempOriginAddressAdd(address) {
      this.stretch.originRegion = address.value.region;
      this.stretch.originState = address.value.state;
      this.stretch.originCity = address.value.city;
      this.stretch.originAdress = address.label;
      this.stretch.originLocator = address.value.locator;
    },
    tempDestinationAddressAdd(address) {
      this.stretch.destinationRegion = address.value.region;
      this.stretch.destinationState = address.value.state;
      this.stretch.destinationCity = address.value.city;
      this.stretch.destinationAdress = address.label;
      this.stretch.destinationLocator = address.value.locator;
    },
    stretchValueSelected(value) {
      if (value && value.price) {
        let val = value.price.toFixed(2);
        this.stretch.price = parseFloat(val);
      }
    },

    "stretch.price"(val) {
      if (this.stretch.amountPaid && this.stretch.amountPaid != null) {
        this.stretch.balance = val - this.stretch.amountPaid;
      }
    },

    "stretch.amountPaid"(val) {
      if (this.stretch.price && this.stretch.price != null) {
        this.stretch.balance = this.stretch.price - val;
      }
    },
  },

  methods: {
    ...mapActions({
      geoplace: "gmaps/geoplace",
      search: "salesOrder/getProviders",
    }),

    hideOrderIdColumn() {
      return this.orderId ? true : false;
    },

    // Componentes
    searchPeople(input) {
      this.isSearching = true;

      return this.search(input)
        .then((result) => {
          if (result) {
            let items = [];
            for (let i = 0; i < result.length; i++) {
              items.push({
                label:
                  result[i].provider.id +
                  " - " +
                  result[i].provider.name +
                  " - " +
                  result[i].provider.alias,
                value: result[i].provider,
              });
            }
            return items;
          } else {
            this.$q.notify({
              message: this.$t("Forncedor não encontrado"),
              position: "bottom",
              type: "negative",
            });
          }
        })
        .finally((data) => {
          this.isUpdating = false;
          this.isSearching = false;
        });
    },
    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace(input)
        .then((result) => {
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
        })
        .finally((data) => {
          this.isUpdating = false;
          this.isSearching = false;
        });
    },
    onSelectOrigin(item) {
      this.stretch.originRegion = this.getRegion(item.state);
      this.stretch.originState = item.state;
      this.stretch.originCity = item.city;
      this.stretch.originAdress = item.description;
    },
    onSelectOriginEdit(item) {
      this.tempAdress.region = this.stretch.originRegion;
      this.tempAdress.state = this.stretch.originState;
      this.tempAdress.city = this.stretch.originCity;
      this.tempAdress.adress = this.stretch.originAdress;

      this.stretch.originRegion = this.getRegion(item.state);
      this.stretch.originState = item.state;
      this.stretch.originCity = item.city;
      this.stretch.originAdress = item.description;
    },
    onSelectOriginCity(item) {
      this.stretch.originCityMeeting = item.city;
      this.stretch.originState = item.state;
      this.stretch.originRegion = this.getRegion(item.state);
    },
    onSelectDestination(item) {
      this.stretch.destinationRegion = this.getRegion(item.state);
      this.stretch.destinationState = item.state;
      this.stretch.destinationCity = item.city;
      this.stretch.destinationAdress = item.description;
    },
    onSelectDestinationEdit(item) {
      this.tempDestinationAdress.region = this.stretch.destinationRegion;
      this.tempDestinationAdress.state = this.stretch.destinationState;
      this.tempDestinationAdress.city = this.stretch.destinationCity;
      this.tempDestinationAdress.adress = this.stretch.destinationAdress;

      this.stretch.destinationRegion = this.getRegion(item.state);
      this.stretch.destinationState = item.state;
      this.stretch.destinationCity = item.city;
      this.stretch.destinationAdress = item.description;
    },
    onSelectDestinationCity(item) {
      this.stretch.destinationCityMeeting = item.city;
      this.stretch.destinationState = item.state;
      this.getRegion(item.state);
    },
    onSelectOriginPeople(item) {
      this.stretch.provider = item.id;
      if (this.stretch.originType == "Base") {
        this.getProviderAddress(item.id).then((data) => {
          if (data != null && data.length != 0) {
            this.originProviderHasAddress = true;

            for (let index in data) {
              let address = {};
              address.country =
                data[index].street.district.city.state.country.countryname || "";
              address.state = data[index].street.district.city.state.uf || "";
              address.region = this.getRegion(address.state) || "";
              address.city = data[index].street.district.city.city || "";
              address.district = data[index].street.district.district || "";
              address.cep = data[index].street.cep.cep || "";
              address.street = data[index].street.street || "";
              address.number = data[index].number || "";
              address.complement = data[index].complement || "";
              address.locator = data[index].locator || "";
              let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

              this.originProviderAddressOptions.push({
                label: formatedAddress,
                value: address,
              });
            }
          } else {
            this.originProviderHasAddress = false;
          }
        });
      }
    },
    onSelectOriginPeopleEdit(item) {
      this.tempProvider.name = this.stretch.provider;
      this.tempProvider.id = this.stretch.provider.value;
      this.stretch.provider = item.id;
    },
    onSelectDestinationPeople(item) {
      this.stretch.destinationProvider = item.id;
      if (this.stretch.destinationType == "Base") {
        this.getProviderAddress(item.id).then((data) => {
          if (data != null) {
            this.destinationProviderHasAddress = true;
            this.destinationProviderAddressOptions = [];

            for (let index in data) {
              let address = {};
              address.country =
                data[index].street.district.city.state.country.countryname || "";
              address.state = data[index].street.district.city.state.uf || "";
              address.region = this.getRegion(address.state) || "";
              address.city = data[index].street.district.city.city || "";
              address.district = data[index].street.district.district || "";
              address.cep = data[index].street.cep.cep || "";
              address.street = data[index].street.street || "";
              address.number = data[index].number || "";
              address.complement = data[index].complement || "";
              address.locator = data[index].locator || "";
              let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;

              this.destinationProviderAddressOptions.push({
                label: formatedAddress,
                value: address,
              });
            }
          } else {
            this.destinationProviderHasAddress = false;
          }
        });
      }
    },
    onSelectDestinationPeopleEdit(item) {
      this.tempDestinationProvider.name = this.stretch.destinationProvider;
      this.tempDestinationProvider.id = this.stretch.destinationProviderId;

      this.stretch.provider = item.id;
    },
    onSelectOriginFilter(item) {
      if (item) this.filters.origin = item.city;
    },
    onSelectDestinationFilter(item) {
      if (item) this.filters.destination = item.city;
    },
    onSelectOriginPeopleFilter(item) {
      if (item) this.filters.provider = item.id;
    },
    onSelectDestinationPeopleFilter(item) {
      if (item) this.filters.destinationProvider = item.id;
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
    verifySuper() {
      if (!this.isSuper) {
        let columnsName = ["Valor", "ValorPago"];
        for (let i in columnsName) {
          let column = this.columns.find((x) => x.name == columnsName[i]);
          let position = this.columns.indexOf(column);
          this.columns.splice(position, 1);
        }
      }
    },

    // isInOrder() {
    //   if (this.hasOrderId) {

    //     let columnName = 'IdPedido';
    //     let column = SETTINGS.columns.find((x) => x.name == columnName);
    //     let position = SETTINGS.columns.indexOf(column);
    //     SETTINGS.columns.splice(position, 1);
    //   }
    // },

    addSurvey(props) {
      this.isLoading = true;
      let row = props.row;

      let values = {};
      values.orderLogisticId = row.id;
      values.timestamp = new Date().getTime();

      let options = {
        method: "POST",
        
        body: (values),
      };

      let endpoint = `/order_logistic_surveys/surveys_create`;
      return api.fetch(endpoint, options)
        .then((result) => {
          let data = result.response.data;
          if (result.response.success) {
            this.$q.notify({
              message: "Vistoria criada com sucesso.",
              position: "bottom",
              type: "positive",
            });
            this.$router.push({
              name: "ChecklistDetails",
              params: {
                id: data.order_logistic_surveys_id,
                token_url: data.order_logistic_surveys_token_url,
              },
            });
          }
        })

        .finally(() => {
          this.isLoading = false;
          this.getValuesToLoad();
        });
    },

    getquotationId(orderId) {
      return api.fetch(`/sales/orders/${orderId}/detail/summary`, {}).then((result) => {
        if (result.response.data.quotations.length) {
          // condicionar com length
          let quotations = result.response.data.quotations;
          // let quotationId = 29236;
          for (let index in quotations) {
            let quotationId = quotations[index].id;
            this.getQuotationValues(quotationId);
          }
        } else {
          this.stretchValueSelected = "SEM COTAÇÃO";
        }
      });
    },
    getQuotationValues(quotationId) {
      return api.fetch(`/quote_detail/${quotationId}`, {}).then((result) => {
        if (result.response.data.taxes.length) {
          let taxesFilter = ["TRECHO", "VALOR", "ACRÉSCIMO", "BASE", "GUINCHO"];
          let allTaxes = result.response.data.taxes;
          let taxes = [];

          for (let index in taxesFilter) {
            let res = allTaxes.filter((allTaxes) =>
              allTaxes.name.includes(taxesFilter[index])
            );
            if (res.length) {
              taxes.push.apply(taxes, res);
            }
          }
          
          this.stretchValueOptions = [];
          for (let index in taxes) {
            this.stretchValueOptions.push({
              label: taxes[index].name,
              id: taxes[index].id,
              price: taxes[index].total,
            });
          }
        }
      });
    },
    checkOrderId() {
      this.hasOrderId = this.orderId ? true : false;
    },
    requestPreviewStretch() {
      let params = {};
      params.order = this.orderId;
      return api.fetch("order_logistics", { params }).then((result) => {
        let members = result["hydra:member"];
        if (members.length) {
          let lastStretch = members[members.length - 1];
          this.stretch.originRegion = lastStretch.destinationRegion;
          this.stretch.originState = lastStretch.destinationState;
          this.stretch.originCity = lastStretch.destinationCity;
          this.stretch.originAdress = lastStretch.destinationAdress;
          // setTimeout(() => {
          //   this.stretch.originAdress = lastStretch.destinationAdress;
          // }, 1000)
        }
      });
    },
    openEditModal(props) {
      this.editAdress = false;
      this.editProvider = false;
      this.editDestinationAdress = false;
      this.editDestinationProvider = false;
      if (!this.orderId) this.getquotationId(props.row.order);

      this.stretchToEdit = this.deepClone(props.row);
      this.openModal = true;


      this.stretch.estimatedShippingDate = this.formatDate(
        this.stretch.estimatedShippingDate
      );
      this.stretch.estimatedShippingDate = this.buildAmericanDate(
        this.stretch.estimatedShippingDate
      );

      this.stretch.shippingDate = this.formatDate(this.stretch.shippingDate);
      this.stretch.shippingDate = this.buildAmericanDate(this.stretch.shippingDate);

      this.stretch.estimatedArrivalDate = this.formatDate(
        this.stretch.estimatedArrivalDate
      );
      this.stretch.estimatedArrivalDate = this.buildAmericanDate(
        this.stretch.estimatedArrivalDate
      );

      this.stretch.arrivalDate = this.formatDate(this.stretch.arrivalDate);
      this.stretch.arrivalDate = this.buildAmericanDate(this.stretch.arrivalDate);
    },
    cancelEditAdress() {
      this.editAdress = false;
      if (this.tempAdress.region) this.stretch.originRegion = this.tempAdress.region;

      if (this.tempAdress.state) this.stretch.originState = this.tempAdress.state;

      if (this.tempAdress.city) this.stretch.originCity = this.tempAdress.city;

      if (this.tempAdress.adress) this.stretch.originAdress = this.tempAdress.adress;
    },
    cancelEditProvider() {
      this.editProvider = false;
      if (this.tempProvider.name) this.stretch.provider = this.tempProvider.name;

      if (this.tempProvider.id) this.selectedProvider = this.tempProvider.id;
    },
    cancelEditDestinationAdress() {
      this.editDestinationAdress = false;
      if (this.tempDestinationAdress.region)
        this.stretch.destinationRegion = this.tempDestinationAdress.region;

      if (this.tempDestinationAdress.state)
        this.stretch.destinationState = this.tempDestinationAdress.state;

      if (this.tempDestinationAdress.city)
        this.stretch.destinationCity = this.tempDestinationAdress.city;

      if (this.tempDestinationAdress.adress)
        this.stretch.destinationAdress = this.tempDestinationAdress.adress;
    },
    cancelEditDestinationProvider() {
      this.editDestinationProvider = false;
      if (this.tempDestinationProvider.name)
        this.stretch.destinationProvider = this.tempDestinationProvider.name;

      if (this.tempDestinationProvider.id)
        this.selectedDestinationProvider = this.tempDestinationProvider.id;
    },
    validateDate(dateString) {
      let today = new Date();
      dateString = dateString.split("-");
      let date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
      //if (date >= today)
      return true;
    },
    getRegion(locale) {
      let states = this.collectionStateOptions;
      for (let index in states) {
        if (states[index][1] == locale) {
          return states[index][2];
        }
      }
    },
    onReset() {
      this.editModal = false;
      this.stretch.id = null;
      this.stretch.status = null;
      this.stretch.estimatedShippingDate = null;
      this.stretch.shippingDate = null;
      this.stretch.estimatedArrivalDate = null;
      this.stretch.arrivalDate = null;
      if (this.isFirstStretch) {
        this.stretch.originType = null;
        this.stretch.originRegion = null;
        this.stretch.originState = null;
        this.stretch.provider = null;
        this.stretch.originCity = null;
        this.stretch.originAdress = null;
        this.stretch.originType = null;
        this.stretch.originLocator = null;
      }
      this.stretch.destinationType = null;
      this.stretch.destinationRegion = null;
      this.stretch.destinationState = null;
      this.stretch.destinationProvider = null;
      this.stretch.destinationCity = null;
      this.stretch.destinationAdress = null;
      this.stretch.destinationLocator = null;
      this.stretch.price = null;
      this.stretch.amountPaid = null;
      this.stretch.balance = null;
      this.stretch.order = null;
    },
    formatFullDateTime(date) {
      return formatDateYmdTodmY(date, true);
    },
    formatDate(dateString) {
      if (dateString)
        return date.formatDate(date.extractDate(dateString, "YYYY-MM-DD"), "DD/MM/YYYY");
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
    padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    },
    formatDateTime(date) {
      return (
        [
          date.getFullYear(),
          this.padTo2Digits(date.getMonth() + 1),
          this.padTo2Digits(date.getDate()),
        ].join("-") +
        " " +
        [
          this.padTo2Digits(date.getHours()),
          this.padTo2Digits(date.getMinutes()),
          this.padTo2Digits(date.getSeconds()),
        ].join(":")
      );
    },
    getStatuses() {
      const endpoint = "statuses";
      const options = {};
      options.params = {
        context: "logistic",
      };
      return api.fetch(endpoint, options).then((result) => {
        let members = result["hydra:member"];
        if (members) {
          this.statusOptions = [];
          this.filterStatusOptions = [];
          for (let index in members) {
            this.statusOptions.push({
              value: members[index]["@id"].replaceAll("/statuses/", ""),
              label: this.$t(`logistic.statuses.${members[index].status}`),
            });
            this.filterStatusOptions.push({
              value: members[index]["@id"].replaceAll("/statuses/", ""),
              label: this.$t(`logistic.statuses.${members[index].status}`),
            });
          }
          this.filterStatusOptions.unshift({
            value: "Todos",
            label: "Todos",
          });
        }
      });
    },
    getStatusColor(status) {
      let color = "";
      switch (status) {
        case "Aberto":
          color = "#1282F1";
          break;

        case "Reembarque":
          color = "#1282F1";
          break;

        case "Pátio":
          color = "#1282F1";
          break;

        case "Aguardando":
          color = "#D9DE29";
          break;

        case "Aguardando retirada":
          color = "#D9DE29";
          break;

        case "Aguardando cliente":
          color = "#D9DE29";
          break;

        case "Em trânsito":
          color = "#D9DE29";
          break;

        case "Pendente de coleta":
          color = "#D9DE29";
          break;

        case "Pendente de embarque":
          color = "#F0ED12";
          break;

        case "Retirado":
          color = "#2CF30D";
          break;

        case "Finalizado":
          color = "#2CF30D";
          break;

        case "Liberado para base":
          color = "#2CF30D";
          break;

        default:
          break;
      }
      return color;
    },
    cleanFilter() {
      this.filters.order = null;
      this.filters.origin = null;
      this.filters.provider = null;
      this.filters.destinationProvider = null;
      this.filters.status = "Todos";
      this.filters.from = "";
      this.filters.to = "";
      this.filters.pendings = {label: 'Todos', value: 'Todos'};
      this.$refs.myDataFilter.$data.date["from"] = "";
      this.$refs.myDataFilter.$data.date["to"] = "";
      this.$refs.originAddress.model = null;
      this.$refs.destinationAddress.model = null;
      this.$refs.originProvider.model = null;
      this.$refs.destinationProvider.model = null;
    },
    // shippingDateValidate(selectedDate) {
    //   if (selectedDate == null)
    //     return "Preencha o campo";

    //   let formatedDate = date.extractDate(selectedDate, "YYYY-MM-DD");
    //   let today = new Date();
    //   today.setHours(0);
    //   today.setMinutes(0);
    //   today.setSeconds(0);
    //   if ( formatedDate > today || formatedDate.getDate() == today.getDate() ) {
    //     return true;
    //   }
    //   return "Data invalída";
    // },
    // arrivalDateValidate(selectedDate) {
    //   if (selectedDate == null)
    //     return "Preencha o campo";

    //   let formatedDate = date.extractDate(selectedDate, "YYYY-MM-DD");
    //   let today = new Date();
    //   today.setHours(0);
    //   today.setMinutes(0);
    //   today.setSeconds(0);
    //   if ( formatedDate > this.trecho.shippingDate || formatedDate.getDate() == today.getDate() ) {
    //     return true;
    //   }
    //   return "Data invalída";
    // },
    formatMoney(value) {
      return formatMoney(value, "BRL", "pt-br");
    },
    lastModified() {
      let date = new Date();
      let modified = this.formatDateTime(date);
      return modified;
    },
    finish(props) {
      if (props.row.status.label == "Finalizado") return;

      let arrivalDate = this.buildAmericanDate(new Date().toLocaleDateString());
      this.stretch = this.deepClone(props.row);

      this.selectedProvider = props.row.providerId;
      this.selectedDestinationProvider = props.row.destinationProviderId;
      let finishedStatus = this.statusOptions.find(
        (x) => x.label == "Finalizado" || x.value == 57
      );
      if (finishedStatus) this.stretch.status = finishedStatus;
      else {
        return null;
      }

      this.stretch.shippingDate = this.formatDate(props.row.shippingDate);
      this.stretch.shippingDate = this.buildAmericanDate(this.stretch.shippingDate);
      this.stretch.arrivalDate = arrivalDate.toString();
      this.saveStretch();
    },
    getProviderAddress(providerId) {
      return api.fetch(`/people/${providerId}`, {}).then((result) => {
        let addresses = result.address;
        if (result["@id"] && result.address.length > 0) {
          return addresses;
        } else {
          this.$q.notify({
            message: "Endereço de fornecedor não encontrado",
            position: "bottom",
            type: "negative",
          });
          return null;
        }
      });
    },
    getSummaryInfo() {
      let params = {};
      // params.myCompany = this.myCompany.id;

      return api.fetch(`/sales/orders/${this.orderId}/detail/summary`, { params }).then(
        (result) => {
          if (result) {
            this.car = result.response.data.productType;
            this.invoiceTotal = this.formatMoney(result.response.data.invoiceTotal);
            if (result.response.data.quote) {
              this.collectionAddress =
                result.response.data.quote.origin.city +
                " / " +
                result.response.data.quote.origin.state;
              this.destinationAddress =
                result.response.data.quote.destination.city +
                " / " +
                result.response.data.quote.destination.state;
            }
          }
        }
      );
    },
    getValuesToLoad() {
      this.isLoading = true;
      this.requestPreviewStretch();
      this.onRequest({ pagination: this.pagination });
      this.getStatuses();
      if (this.orderId) this.getquotationId(this.orderId);
    },

    deepClone(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      if (Array.isArray(obj)) {
        const newArray = [];
        for (let i = 0; i < obj.length; i++) {
          newArray[i] = this.deepClone(obj[i]);
        }
        return newArray;
      }

      const newObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = this.deepClone(obj[key]);
        }
      }

      return newObj;
    },

    // CRUD
    onSubmit() {
      this.$refs.myForm.validate().then((success) => {
        if (success) {
          this.saveStretch();
        }
      });
    },
    saveStretch() {
      let stretch = this.deepClone(this.stretch);
      this.openModal = false;
      this.editModal = false;

      stretch.status = stretch.status.value;
      if (stretch.provider)
        stretch.provider = stretch.provider.value
          ? stretch.provider.value
          : stretch.provider;
      if (stretch.destinationProvider)
        stretch.destinationProvider = stretch.destinationProvider.value
          ? stretch.destinationProvider.value
          : stretch.destinationProvider;

      if (stretch.originType == "Base") stretch.originType = "b";

      if (stretch.originType == "Coleta") stretch.originType = "c";

      if (stretch.originType == "Ponto de encontro") stretch.originType = "p";

      if (stretch.destinationType == "Base") stretch.destinationType = "b";

      if (stretch.destinationType == "Entrega") stretch.destinationType = "e";

      if (stretch.destinationType == "Ponto de encontro") stretch.destinationType = "p";

      if (stretch.order == null) stretch.order = this.orderId;

      stretch.price = parseFloat(this.stretch.price);
      stretch.amountPaid = parseFloat(this.stretch.amountPaid);
      stretch.balance = parseFloat(this.stretch.balance);

      stretch.lastModified = this.lastModified();

      let endpoint = this.stretch.id
        ? `/order_logistics/update`
        : `/order_logistics/create`;

      let options = {
        method: this.stretch.id ? "PUT" : "POST",
        
        body: (stretch),
      };
      api.fetch(endpoint, options)

        .then((result) => {
          if (result.response.success) {
            this.$q.notify({
              message: this.$t("Dados salvos com sucesso!"),
              position: "bottom",
              type: "positive",
            });
          }
          this.toggleAddStretch = false;
          return null;
        })

        .finally(() => {
          this.isSaving = false;
          this.onReset();
          this.getValuesToLoad();
        });
    },
    getStretchies(params) {
      const endpoint = "/order_logistics";
      const options = {};
      options.params = params;

      return api.fetch(endpoint, options)
        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:totalItems"],
          };
        })

        .finally(() => {
          this.isSaving = false;
        });
    },
    getSurveyId() {
      return api.fetch(endpoint, options)
        .then((result) => {
          return {
            members: result["hydra:member"],
            total: result["hydra:totalItems"],
          };
        })

        .finally(() => {
          this.isSaving = false;
        });
    },
    onRequest(props) {
      console.log(1);
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination;
      let params = { itemsPerPage: rowsPerPage, page };
      // let params = {};

      if (this.orderId) {
        params["order.id"] = this.orderId;
      }
      if (!this.orderId) {
        console.log(2, this.filters.order);

        if (this.filters.order != null) {
          console.log("aqui", params);
          params["order.id"] = this.filters.order;
        }

        if (this.filters.origin != null && this.filters.origin.length > 0) {
          params["originCity"] = this.filters.origin;
        }

        if (this.filters.destination != null && this.filters.destination.length > 0) {
          params["destinationCity"] = this.filters.destination;
        }

        if (this.filters.provider != null) {
          params["provider"] = this.filters.provider;
        }

        if (this.filters.destinationProvider != null) {
          params["destinationProvider"] = this.filters.destinationProvider;
        }

        if (
          this.filters.status != null &&
          this.filters.status.value != "Todos" &&
          this.filters.status.value != undefined
        ) {
          params["status"] = this.filters.status.value;
        }

        if (this.filters.from != null && this.filters.from != "") {
          params["shippingDate"] = this.buildAmericanDate(this.filters.from);
        }

        if (this.filters.to != null && this.filters.to != "") {
          params["arrivalDate"] = this.buildAmericanDate(this.filters.to);
        }

        if (this.filters.pendings && this.filters.pendings.value != 'Todos') {
          params["pendings"] = this.filters.pendings.value;
        }
      }
      if (this.filters.company != null) {
        params["myCompany"] = this.filters.company.id;
      }

      this.getStretchies(params)
        .then((data) => {
          this.data = [];
          if (data.members) {
            for (let index in data.members) {
              let originType = "";
              let destinationType = "";

              if (data.members[index].originType == "b") originType = "Base";

              if (data.members[index].originType == "c") originType = "Coleta";

              if (data.members[index].originType == "p") originType = "Ponto de encontro";

              if (data.members[index].destinationType == "b") destinationType = "Base";

              if (data.members[index].destinationType == "e") destinationType = "Entrega";

              if (data.members[index].destinationType == "p")
                destinationType = "Ponto de encontro";

              this.data.push({
                id: data.members[index].id,
                surveyId: data.members[index].orderLogisticSurvey
                  ? data.members[index].orderLogisticSurvey.id
                  : "",
                surveyToken: data.members[index].orderLogisticSurvey
                  ? data.members[index].orderLogisticSurvey.token_url
                  : "",
                status: {
                  label: this.$t(
                    `logistic.statuses.${data.members[index].status.status}`
                  ),
                  value: data.members[index].status.id,
                },
                estimatedShippingDate: data.members[index].estimatedShippingDate,
                shippingDate: data.members[index].shippingDate,
                estimatedArrivalDate: data.members[index].estimatedArrivalDate,
                arrivalDate: data.members[index].arrivalDate,
                originType: originType,
                originRegion: data.members[index].originRegion,
                originState: data.members[index].originState,
                originCity: data.members[index].originCity,
                originAdress: data.members[index].originAddress,
                originLocator: data.members[index].originLocator,
                provider:
                  data.members[index].provider == null
                    ? null
                    : {
                        label: data.members[index].provider.name,
                        value: data.members[index].provider.id,
                      },
                destinationType: destinationType,
                destinationRegion: data.members[index].destinationRegion,
                destinationState: data.members[index].destinationState,
                destinationCity: data.members[index].destinationCity,
                destinationAdress: data.members[index].destinationAdress,
                destinationLocator: data.members[index].destinationLocator,
                destinationProvider:
                  data.members[index].destinationProvider == null
                    ? null
                    : {
                        label: data.members[index].destinationProvider.name,
                        value: data.members[index].destinationProvider.id,
                      },
                price: data.members[index].price,
                amountPaid: data.members[index].amountPaid,
                balance: data.members[index].balance,
                order: data.members[index].order.id,
                contract: data.members[index].order.contract
                  ? data.members[index].order.contract.id
                  : "-",
                orderInvoice: this.getInvoice(data.members[index].purchasingOrder),
                lastModified:
                  data.members[index].lastModified == null
                    ? null
                    : data.members[index].lastModified,
                inCharge:
                  data.members[index].inCharge == null
                    ? null
                    : data.members[index].inCharge.name,
              });
            }
          }
          this.pagination.page = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.total;
        })

        .finally(() => {
          this.isSaving = false;
          this.isLoading = false;
          this.isFirstStretch = this.data.length ? false : true;
        });
    },
    getInvoice(purchasingOrder) {
      if (
        purchasingOrder &&
        purchasingOrder.invoice &&
        purchasingOrder.invoice[0] &&
        purchasingOrder.invoice[0].invoice
      )
        return purchasingOrder.invoice[0].invoice.id;
    },
    deleteTrecho(props) {
      this.confirmDelete = true;
      this.idRowToDelete = props.row.id;
    },
    nowDelete(props) {
      let stretchId = this.idRowToDelete;

      let options = {
        method: "DELETE",
      };

      return api.fetch("order_logistics/" + stretchId, options)
        .then((result) => {
          this.$q.notify({
            message: "Trecho excluído com sucesso.",
            position: "bottom",
            type: "positive",
          });
        })

        .finally(() => {
          this.isLoading = false;
          this.getValuesToLoad();
        });
    },
  },
};
</script>

<style>
.table-container {
  overflow-x: scroll;
}

.data-filter {
  padding-top: 0;
  padding-bottom: 0;
}

.reset-padding-bottom {
  padding-bottom: 0;
}
</style>
