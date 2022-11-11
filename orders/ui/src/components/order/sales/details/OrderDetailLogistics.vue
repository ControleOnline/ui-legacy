<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress
        :indeterminate="isLoading"
        size="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>

    <div class="row col-12 q-mt-md q-mx-md flex items-end">
    
      
      <div class="flex justify-end" >
        <q-btn
            label="Novo"
            color="primary"
            @click="addModal = true"
        ></q-btn>
      </div>
    </div>


      <div class="col-12">

      </div>

      <div class="col-12 q-mt-md">
        <q-table
        :data="data"
        :columns="columns"
        row-key="trechostatus"
        selection="multiple"
        >
        <template v-slot:header-selection="scope"></template>
        <template v-slot:body="props">
          <q-tr :props="props.row">

            <q-td>
              <q-btn
                dense
                icon="delete"
                color="negative"
                @click="deleteTrecho(props.rowIndex)"
              ></q-btn>
            </q-td>

            <q-td :props="props" key="trechostatus">
              {{props.row.trechostatus}}
            </q-td>
            <q-td :props="props" key="PrevisaoEmbarque">
              {{props.row.shippingDateForecast}}
            </q-td>
            <q-td :props="props" key="PrevisaoChegada">
              {{props.row.arrivalDateForecast}}
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
              {{props.row.originAdress.description}}
            </q-td>
            <q-td :props="props" key="PontoEncontro">
              {{props.row.originCityMeeting}}
            </q-td>
            <q-td :props="props" key="DestinoTipo">
              {{props.row.destinationType}}
            </q-td>
            <q-td :props="props" key="DestinoRegiao">
              {{props.row.destinationRegion}}
            </q-td>
            <q-td :props="props" key="DestinoEstado">
              {{props.row.destinationState}}
            </q-td>
            <q-td :props="props" key="DestinoCidade">
              {{props.row.destinationCity}}
            </q-td>
            <q-td :props="props" key="DestinoFornecedor">
              {{props.row.destinationProvider}}
            </q-td>
            <q-td :props="props" key="DestinoEndereco">
              {{props.row.destinationAdress.description}}
            </q-td>
            <q-td :props="props" key="DestinoPontoEncontro">
              {{props.row.destinationCityMeeting}}
            </q-td>
            <q-td :props="props" key="FornecedorEndereco">
              {{props.row.providerAddress}}
            </q-td>
            <q-td :props="props" key="EnderecoFornecedor">
              {{props.row.locator}}
            </q-td>
            <q-td :props="props" key="Localizador">
              {{props.row.locator}}
            </q-td>
            <q-td :props="props" key="LiberacaoCarro">
              {{props.row.releaseCar}}
            </q-td>
            <q-td :props="props" key="ValorVendido">
              {{props.row.soldValue}}
            </q-td>
            <q-td :props="props" key="ValorPago">
              {{props.row.paidValue}}
            </q-td>
            <q-td :props="props" key="FornecedorSaldo">
              {{props.row.providerBalance}}
            </q-td>
            <q-td :props="props" key="FornecedorStatus">
              {{props.row.providerStatus}}
            </q-td>
            <q-td :props="props" key="DataPatio">
              {{props.row.carParkDate}}
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
            </q-td>
            <q-td :props="props" key="ValorNegociado">
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
            </q-td>
            <q-td :props="props" key="DataEmbarque">
              {{props.row.shippingDate}}
            </q-td>
          </q-tr>
        </template>
        </q-table>

        <q-dialog v-model="addModal" full-width>
          <q-card class="q-pa-md">
            <q-form
            class="row flex q-gutter-y-md"
            @submit="onSubmit"
            >

              <div class="row col-12 q-gutter-sm">
                <div class="col-4">
                  <q-select
                    outlined
                    stack-label
                    label="Status"
                    :options="statusOptions"
                    v-model="trecho.trechostatus"
                  ></q-select>
                </div>
                <div class="col-3">
                  <q-input
                    type="date"
                    outlined
                    stack-label
                    label="Previsão de embarque"
                    v-model="trecho.shippingDateForecast"
                  ></q-input>
                </div>
                <div class="col-2">
                  <q-input
                    type="date"
                    outlined
                    stack-label
                    label="Previsão de chegada"
                    v-model="trecho.arrivalDateForecast"
                  ></q-input>
                </div>
              </div>

              <div class="row col-12 q-gutter-sm">
                <div class="row col-5 q-gutter-sm">
                  <label class="col-12">Origem</label>
                  <div class="col-4">
                    <q-select
                      outlined
                      stack-label
                      label="Tipo"
                      :options="originTypeOptions"
                      v-model="trecho.originType"
                    ></q-select>
                  </div>
                  <div class="col-4">
                    <q-select
                      outlined
                      stack-label
                      label="Região"
                      :options="originRegionOptions"
                      v-model="trecho.originRegion"
                    ></q-select>
                  </div>
                  <div class="col-2">
                    <q-select
                      outlined
                      stack-label
                      label="UF"
                      :options="originUfRegionOptions"
                      v-model="trecho.originState"
                    ></q-select>
                  </div>
                  <div class="col-4">
                    <q-input
                      outlined
                      stack-label
                      label="Cidade"
                      v-model="trecho.originCity"
                    ></q-input>
                  </div>
                  <div class="col-6">
                  
                    <div class="col-xs-12 col-sm-6">
                      <PeopleAutocomplete v-if="trecho.originType == 'Base'" :source="searchPeople" :isLoading="isSearching" label="Fornecedor"
                        @selected="onSelectOriginProvider" placeholder="Pesquisar..." />
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
                    <q-input
                      v-if="trecho.originType == 'Ponto de encontro'"
                      outlined
                      stack-label
                      label="Cidade"
                      v-model="trecho.originCity"
                    ></q-input>
                  </div>
                </div>

                
                <div class="row col-5 q-gutter-sm">
                  <label class="col-12">Destino</label>
                  <div class="col-4">
                    <q-select
                      outlined
                      stack-label
                      label="Tipo"
                      :options="destinationTypeOptions"
                      v-model="trecho.destinationType"
                    ></q-select>
                  </div>
                  <div class="col-4">
                    <q-select
                      outlined
                      stack-label
                      label="Região"
                      :options="destinationRegionOptions"
                      v-model="trecho.destinationRegion"
                    ></q-select>
                  </div>
                  <div class="col-2">
                    <q-select
                      outlined
                      stack-label
                      label="UF"
                      :options="destinationUfRegionOptions"
                      v-model="trecho.destinationState"
                    ></q-select>
                  </div>
                  <div class="col-4">
                    <q-input
                      outlined
                      stack-label
                      label="Cidade"
                      v-model="trecho.destinationCity"
                    ></q-input>
                  </div>
                  <div class="col-6">
                    <div class="col-xs-12 col-sm-6">
                      <PeopleAutocomplete v-if="trecho.destinationType == 'Base'" :source="searchPeople" :isLoading="isSearching" label="Fornecedor"
                        @selected="onSelectDestinationProvider" placeholder="Pesquisar..." />
                    </div>
                    <div class="col-xs-12 q-mb-sm" v-if="trecho.destinationType == 'Entrega'">
                      <ListAutocomplete
                        :source="getGeoPlaces"
                        :isLoading="isSearching"
                        label="Busca de endereço"
                        @selected="onSelectDestination"
                        placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                      />
                    </div>
                    <q-input
                      v-if="trecho.destinationType == 'Ponto de encontro'"
                      outlined
                      stack-label
                      label="Cidade"
                      v-model="trecho.destinationCity"
                    ></q-input>
                  </div>
                </div>
              </div>

              <div class="row col-12 q-gutter-sm" v-if="trecho.originType == 'Base'">
              
                <div class="col-2">
                  <q-input
                    type="date"
                    outlined
                    stack-label
                    label="Liberação do carro"
                    v-model="trecho.releaseCar"
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
                <div class="col-9">
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
              
              
              </div>

              <div class="row col-12 q-gutter-sm">
                <div class="col-3">
                  <label>Cobrança de base de entrega?</label>
                  <q-radio
                    outlined
                    stack-label
                    label="Sim"
                    v-model="trecho.deliveryBaseTax"
                    :val="true"
                  ></q-radio>
                  <q-radio
                    outlined
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
                <div class="col-5">
                  <q-input
                    outlined
                    stack-label
                    label="Valor negociado"
                    v-model="trecho.dealedValue"
                    type="number"
                  ></q-input>
                </div>
              </div>
                
              <div class="row col-12 q-gutter-sm">
                
                <div class="col-7">
                  <q-input
                    type="textarea"
                    outlined
                    stack-label
                    label="Observações"
                    v-model="trecho.notes"
                  ></q-input>
                </div>
                <div class="col-3">
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
                  type="submit"
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

  </div>



</template>
  
  <script>

import Api from "@controleonline/quasar-common-ui/src/utils/api";
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/common/ListAutocomplete";
import { mapActions, mapGetters } from "vuex";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/common/PeopleAutocomplete";

  export default { 

    components: {
    ListAutocomplete,
    PeopleAutocomplete
  },
  
    data() {
      return {
        api: new Api(this.$store.getters["auth/user"].token),
        isLoading: false,
        isSearching: false,
        editShippingTax: true,
        shippingTax: null,
        trecho: {
          trechostatus: null,
          shippingDateForecast: null,
          arrivalDateForecast: null,
          originType: null,
          originRegion: null,
          originState: null,
          originCity: null,
          provider: {
            id: null,
            name: null,
          },
          originAdress: {
            street: null,
            number: null,
            district: null,
            postalCode: null,
            city: null,
            state: null,
            country: null,
            description: null,
          },
          originCityMeeting: null,
          destinationType: null,
          destinationRegion: null,
          destinationState: null,
          destinationCity: null,
          destinationProvider: {
            id: null,
            name: null,
          },
          destinationAdress: {
            street: null,
            number: null,
            district: null,
            postalCode: null,
            city: null,
            state: null,
            country: null,
            description: null,
          },
          destinationCityMeeting: null,
          providerAddress: null,
          locator: null,
          releaseCar: null,
          soldValue: null,
          paidValue: null,
          providerBalance: null,
          providerStatus: null,
          carParkDate: null,
          providerShippingDate: null,
          elapsedWorkingDays: null,
          termContract: null,
          deliveryBaseTax: null,
          deliveryBaseTaxValue: null,
          taxSoldValue: null,
          dealedValue: null,
          paymentProvisionDate: null,
          paymentMade: null,
          balance: null,
          notes: null,
          shippingDate: null,
        },
        addModal: false,
        providerOptions: ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"],
        providerStatusOptions: ['Liberado para base', 'Aguardando cliente', 'Pátio'],
        statusOptions: ["Aguardando cliente", "Aguardando retirada", "Em trânsito", "Pendente de coleta", "Pendente de embarque", "Reembarque", "Retirado"],
        originTypeOptions: ["Coleta", "Base", "Ponto de encontro"],
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
        columns: [
          {
            name: 'trechostatus',
            label: 'Trecho status',
            align: 'center',
            field: row => row.trechostatus,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoEmbarque',
            label: 'Previsão Embarque',
            align: 'center',
            field: row => row.shippingDateForecast,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoChegada',
            label: 'Previsão Chegada',
            align: 'center',
            field: row => row.arrivalDateForecast,
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
            label: 'Destino Local',
            align: 'left',
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
            name: 'PontoEncontro',
            label: 'Ponto de encontro',
            align: 'center',
            field: row => row.originCityMeeting,
            format: val => `${val}`,
          },
          {
            name: 'DestinoTipo',
            label: 'Destino tipo',
            align: 'right',
            field: row => row.destinationType,
            format: val => `${val}`,
          },
          {
            name: 'DestinoRegiao',
            label: 'Destino região',
            align: 'right',
            field: row => row.destinationRegion,
            format: val => `${val}`,
          },
          {
            name: 'DestinoEstado',
            label: 'Destino Estado',
            align: 'right',
            field: row => row.destinationState,
            format: val => `${val}`,
          },
          {
            name: 'DestinoCidade',
            label: 'Destno cidade',
            align: 'right',
            field: row => row.destinationCity,
            format: val => `${val}`,
          },
          {
            name: 'DestinoFornecedor',
            label: 'Destino Fornecedor',
            align: 'right',
            field: row => row.destinationProvider,
            format: val => `${val}`,
          },
          {
            name: 'DestinoEndereco',
            label: 'Endereço de destino',
            align: 'right',
            field: row => row.destinationAdress,
            format: val => `${val}`,
          },
          {
            name: 'DestinoPontoEncontro',
            label: 'Destino Ponto de encontro',
            align: 'right',
            field: row => row.destinationCityMeeting,
            format: val => `${val}`,
          },
          {
            name: 'FornecedorEndereco',
            label: 'Fornecedor Endereço',
            align: 'right',
            field: row => row.providerAddress,
            format: val => `${val}`,
          },
          {
            name: 'Localizador',
            label: 'Localizador',
            align: 'right',
            field: row => row.locator,
            format: val => `${val}`,
          },
          {
            name: 'LiberacaoCarro',
            label: 'Liberação Carro',
            align: 'right',
            field: row => row.releaseCar,
            format: val => `${val}`,
          },
          {
            name: 'ValorVendido',
            label: 'Valor Vendido',
            align: 'right',
            field: row => row.soldValue,
            format: val => `${val}`,
          },
          {
            name: 'ValorPago',
            label: 'Valor pago',
            align: 'right',
            field: row => row.paidValue,
            format: val => `${val}`,
          },
          {
            name: 'FornecedorSaldo',
            label: 'Fornecedor Saldo',
            align: 'right',
            field: row => row.providerBalance,
            format: val => `${val}`,
          },
          {
            name: 'FornecedorStatus',
            label: 'Fornecedor status',
            align: 'right',
            field: row => row.providerStatus,
            format: val => `${val}`,
          },
          {
            name: 'DataPatio',
            label: 'Data pátio',
            align: 'right',
            field: row => row.carParkDate,
            format: val => `${val}`,
          },
          {
            name: 'FornecedorDataEmbarque',
            label: 'Fornecedor data embarque',
            align: 'right',
            field: row => row.providerShippingDate,
            format: val => `${val}`,
          },
          {
            name: 'DiasUteisDecorridosPatio',
            label: 'Dias uteis decorridos (Patio)',
            align: 'right',
            field: row => row.elapsedWorkingDays,
            format: val => `${val}`,
          },
          {
            name: 'PrazoContrato',
            label: 'Prazo contrato',
            align: 'right',
            field: row => row.termContract,
            format: val => `${val}`,
          },
          {
            name: 'CobrancaBaseEntrega',
            label: 'Cobranca base entrega',
            align: 'right',
            field: row => row.deliveryBaseTaxValue,
            format: val => `${val}`,
          },
          {
            name: 'ValorFreteVendido',
            label: 'Valor frete vendido',
            align: 'right',
            field: row => row.taxSoldValue,
            format: val => `${val}`,
          },
          {
            name: 'ValorNegociado',
            label: 'Valor negociado',
            align: 'right',
            field: row => row.dealedValue,
            format: val => `${val}`,
          },
          {
            name: 'DataProvisaoPagamento',
            label: 'Data provisao pagamento',
            align: 'right',
            field: row => row.paymentProvisionDate,
            format: val => `${val}`,
          },
          {
            name: 'PagamentoRealizado',
            label: 'Pagamento realizado',
            align: 'right',
            field: row => row.paymentMade,
            format: val => `${val}`,
          },
          {
            name: 'Saldo',
            label: 'Saldo',
            align: 'right',
            field: row => row.balance,
            format: val => `${val}`,
          },
          {
            name: 'Observacoes',
            label: 'Observacoes',
            align: 'right',
            field: row => row.notes,
            format: val => `${val}`,
          },
          {
            name: 'DataEmbarque',
            label: 'Data embarque',
            align: 'right',
            field: row => row.shippingDate,
            format: val => `${val}`,
          },
        ],
      }
    },

    created() {
      this.getStates();
    },

    methods: {
      ...mapActions({
      contact: "people/contact",
      geoplace: "gmaps/geoplace",
      search: "people/searchPeople",
      }),

      deleteTrecho(index) {
        this.data.splice(index, 1);
      },

      onSubmit() {
        
        this.data.push(this.trecho);
        this.onReset();
      },
      onReset() {
          this.trecho.trechostatus = null;
          this.trecho.shippingDateForecast = null;
          this.trecho.arrivalDateForecast = null;
          this.trecho.originType = null;
          this.trecho.originRegion = null;
          this.trecho.originState = null;
          this.trecho.originCity = null;
          this.trecho.provider = null;
          this.trecho.originAdress.street = null;
          this.trecho.originAdress.number = null;
          this.trecho.originAdress.district = null;
          this.trecho.originAdress.postalCode = null;
          this.trecho.originAdress.city = null;
          this.trecho.originAdress.state = null;
          this.trecho.originAdress.country = null;
          this.trecho.originAdress.description = null;
          this.trecho.originCityMeeting = null;
          this.trecho.destinationType = null;
          this.trecho.destinationRegion = null;
          this.trecho.destinationState = null;
          this.trecho.destinationCity = null;
          this.trecho.destinationProvider = null;
          this.trecho.destinationAdress.street = null;
          this.trecho.destinationAdress.number = null;
          this.trecho.destinationAdress.district = null;
          this.trecho.destinationAdress.postalCode = null;
          this.trecho.destinationAdress.city = null;
          this.trecho.destinationAdress.state = null;
          this.trecho.destinationAdress.country = null;
          this.trecho.destinationAdress.description = null;
          this.trecho.destinationCityMeeting = null;
          this.trecho.providerAddress = null;
          this.trecho.locator = null;
          this.trecho.releaseCar = null;
          this.trecho.soldValue = null;
          this.trecho.paidValue = null;
          this.trecho.providerBalance = null;
          this.trecho.providerStatus = null;
          this.trecho.carParkDate = null;
          this.trecho.providerShippingDate = null;
          this.trecho.elapsedWorkingDays = null;
          this.trecho.termContract = null;
          this.trecho.deliveryBaseTax = null;
          this.trecho.deliveryBaseTaxValue = null;
          this.trecho.taxSoldValue = null;
          this.trecho.dealedValue = null;
          this.trecho.paymentProvisionDate = null;
          this.trecho.paymentMade = null;
          this.trecho.balance = null;
          this.trecho.notes = null;
          this.trecho.shippingDate = null;
      },
      getItems() {
        console.log('entrou')
        let params = {};
        const endpoint = `/states`;
        return this.api
          .private(endpoint, { params })
          .then((response) => response.json())
          .then((result) => {
            return {
              states: result['hydra:member']
            }
          });
      },
      getStates() {
        this.getItems()
        .then((data) => {
          if (data.states) {
            for (let index in data.states) {
              this.originUfRegionOptions.push(data.states[index].uf)
              this.destinationUfRegionOptions.push(data.states[index].uf)
            }
            
          }
        })
        .finally(() => {
        });
      },
      getoriginStatesPerRegion(region) {
        this.originUfRegionOptions = [];
        let states = this.collectionStateOptions;
        for (let index in states) {
          if (states[index][2] == region) this.originUfRegionOptions.push(states[index][1]);
        }
      },
      getDestinationStatesPerRegion(region) {
        this.destinationUfRegionOptions = [];
        let states = this.collectionStateOptions;
        for (let index in states) {
          if (states[index][2] == region) this.destinationUfRegionOptions.push(states[index][1]);
        }
      },
      onSelectOrigin(item) {
        this.trecho.originAdress.street = item.street;
        this.trecho.originAdress.number = item.number;
        this.trecho.originAdress.district = item.district;
        this.trecho.originAdress.postalCode = item.postalCode;
        this.trecho.originAdress.city = item.city;
        this.trecho.originAdress.state = item.state;
        this.trecho.originAdress.country = item.country;
        this.trecho.originAdress.description = item.description;
      },
      onSelectDestination(item) {
        this.trecho.destinationAdress.street = item.street;
        this.trecho.destinationAdress.number = item.number;
        this.trecho.destinationAdress.district = item.district;
        this.trecho.destinationAdress.postalCode = item.postalCode;
        this.trecho.destinationAdress.city = item.city;
        this.trecho.destinationAdress.state = item.state;
        this.trecho.destinationAdress.country = item.country;
        this.trecho.destinationAdress.description = item.description;
      },
      onSelectOriginProvider(item) {
        this.trecho.provider.id = item.id;
        this.trecho.provider.name = item.name;
      },
      onSelectDestinationProvider(item) {
        this.trecho.provider.id = item.id;
        this.trecho.destinationProvider.name = item.name;
      },
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
    },

    watch: {
      "addModal"() {
        if (this.addModal == false) this.deliveryBaseTax = null;
      },
      "trecho.originRegion"(value) {
        this.getoriginStatesPerRegion(value);
      },
      "trecho.destinationRegion"(value) {
        this.getDestinationStatesPerRegion(value);
      },
    }
  }
  </script>
  
  <style>
  .bt-edit {
    margin-right: 15px;
  }
  </style>
  