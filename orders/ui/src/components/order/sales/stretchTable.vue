<template>
  <div class="flex q-gutter-y-md q-mx-sm">

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
    <div class="">
      <div class="row items-start">

        <div v-if="!hasOrderId" class="col-sm-3 col-xs-12 q-pa-md">
          <q-input
            outlined
            stack-label
            label="Pedido"
            v-model="filters.order"
          ></q-input>
        </div>

        <div class="col-sm-3 col-xs-12 q-pa-md">
          <ListAutocomplete
            :source="getGeoPlaces"
            :isLoading="isSearching"
            label="Origem"
            @selected="onSelectOrigin"
            placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
          />
        </div>
        <div class="col-sm-3 col-xs-12 q-pa-md">
          <ListAutocomplete
            :source="getGeoPlaces"
            :isLoading="isSearching"
            label="Destino"
            @selected="onSelectOrigin"
            placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
          />
        </div>
        <div class="col-sm-3 col-xs-12 q-pa-md">
          <PeopleAutocomplete :source="searchPeople" :isLoading="isSearching" label="Fornecedor"
              @selected="onSelectOriginProvider" placeholder="Pesquisar..." />
        </div>
        <div class="col-sm-3 col-xs-12 q-pa-md">
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
        <div class="col-sm-6 col-xs-12 q-pa-md">
          <DataFilter :fromDate="filters.dateFrom" :toDate="filters.dateTo" :showButton="false" @dateChanged="dateChanged" />
        </div>
      </div>
      <q-btn
        v-if="hasOrderId"
        label="Novo"
        color="primary"
        @click="addModal = true"
      ></q-btn>
    </div>
  <!-- Filtros Fim -->

  <!-- Tabela-->
    <q-table :loading="isLoading" :data="data" :columns="settings.columns" :pagination.sync="pagination"
    @request="onRequest" row-key="trechostatus" selection="multiple">
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
                <q-item clickable @click="deleteTrecho(props.rowIndex)">
                  <q-item-section side>
                    <q-icon name="delete"></q-icon>
                  </q-item-section>
                  <q-item-section>
                    Excluir
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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
            <q-td :props="props" key="Fornecedor">
              {{props.row.provider}}
            </q-td>
            <q-td :props="props" key="OrigemEndereco">
              {{props.row.originAdress}}
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
            <q-td :props="props" key="DestinoFornecedor">
              {{props.row.destinationProvider}}
            </q-td>
            <q-td :props="props" key="DestinoEndereco">
              {{props.row.destinationAdress}}
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
  <!-- Tabela Fim -->

  <!-- Modal Novo-->
    <div>
      <q-dialog v-model="addModal" full-width>
            <q-card class="q-pa-md">
              <q-form
              class="row flex q-gutter-y-md"
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

  <!-- Modal Novo-->
    <div>
      <q-dialog v-model="editModal" full-width>
            <q-card class="q-pa-md">
              <q-form
              class="row flex q-gutter-y-md"
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
                      outlined
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
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Dias uteis decorridos (Patio)"
                      v-model="trecho.elapsedWorkingDays"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Prazo contrato"
                      v-model="trecho.termContract"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Data provisao pagamento"
                      v-model="trecho.paymentProvisionDate"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Pagamento realizado"
                      v-model="trecho.paymentMade"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Saldo"
                      v-model="trecho.balance"
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

const SETTINGS = {
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
};

Object.freeze(SETTINGS);

export default {
  
  props: {
    orderId: {
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
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
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
      trecho: {
        trechostatus: null,
        shippingDateForecast: null,
        arrivalDateForecast: null,
        originType: null,
        originRegion: null,
        originState: null,
        provider: null,
        originAdress: null,
        originCityMeeting: null,
        destinationType: null,
        destinationRegion: null,
        destinationState: null,
        destinationProvider: null,
        destinationAdress: null,
        destinationCityMeeting: null,
        providerAddress: null,
        locator: null,
        releaseCar: null,
        soldValue: null,
        paidValue: null,
        providerBalance: this.soldValue - this.paidValue || null,
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
      editModal: false,
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
          filter: this.filters,
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
    "filters.dateFrom"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.dateTo"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "addModal"() {
      if (this.addModal == false) this.deliveryBaseTax = null;
    },
    "trecho.originRegion"(value) {
      this.getOriginStatesPerRegion(value);
    },
    "trecho.destinationRegion"(value) {
      this.getDestinationStatesPerRegion(value);
    },
    "orderId"(value) {
      console.log('value')
      console.log(value)
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
      this.filters.origin = item;
    },
    onSelectDestination(item) {
      this.trecho.destinationAdress = item;
    },
    onSelectOriginProvider(item) {
      this.trecho.provider = item;
    },
    onSelectDestinationProvider(item) {
      this.trecho.destinationProvider = item;
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
      this.trecho = props.row;
      this.indexRowEdit = props.rowIndex;
    },
    validateDate(dateString) {
      let today = new Date();
      dateString = dateString.split("-");
      let date = new Date(dateString[0], dateString[1] - 1, dateString[2]);
      if (date >= today) return true;
    },
    getOriginStatesPerRegion(region) {
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
    onReset() {
      this.editModal = false,
      this.trecho.trechostatus = null;
      this.trecho.shippingDateForecast = null;
      this.trecho.arrivalDateForecast = null;
      this.trecho.originType = null;
      this.trecho.originRegion = null;
      this.trecho.originState = null;
      this.trecho.provider = null;
      this.trecho.originAdress = null;
      this.trecho.originCityMeeting = null;
      this.trecho.destinationType = null;
      this.trecho.destinationRegion = null;
      this.trecho.destinationState = null;
      this.trecho.destinationProvider = null;
      this.trecho.destinationAdress = null;
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
    formatDate(dateString) {
      if (dateString)
        return date.formatDate(
          date.extractDate(dateString, "DD/MM/YYYY"),
          "YYYY-MM-DD"
        );
      else return null;
    },

    // CRUD
    deleteTrecho(index) {
      this.data.splice(index, 1)
      const endpoint = "";

      let options = {
        method: "DELETE",
        headers: new Headers({ "Content-Type": "application/ld+json" }),
      };

      fetch(endpoint ,options)
      .then(response => response.json())
      .then(result => {
        if (result.response.success) {
          this.$q.notify({
            message: this.$t("Dados apagados com sucesso!"),
            position: "bottom",
            type: "positive",
          });
        } else {
          this.$q.notify({
            message: this.$t("Não foi possível apagar os dados!"),
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
        this.getStretchies();
      });
    },
    saveStretch() {
      if (!this.editModal) {
        let stretch = structuredClone(this.trecho)
        this.data.push(stretch);
        this.onReset()
      } else {
        let stretch = structuredClone(this.trecho)
        this.data[this.indexRowEdit] = stretch;
        this.editModal = false;
      }

      // let endpoint = '/logistic/'+ this.orderId.toString();


      // let options = {
      // method: 'POST',
      // body  : JSON.stringify(this.trecho),
      // };


      // fetch(endpoint ,options)
      //   .then(response => response.json())
      //   .then(result => {
      //     if (result.response.success) {
      //       this.$q.notify({
      //         message: this.$t("Dados salvos com sucesso!"),
      //         position: "bottom",
      //         type: "positive",
      //       });
      //     } else {
      //       this.$q.notify({
      //         message: this.$t("Não foi possível salvar os dados!"),
      //         position: "bottom",
      //         type: "negative",
      //       });
      //     }
      //     return null;
      //   })
      //   .catch((error) => {
      //     this.$q.notify({
      //       message: this.$t(error.message),
      //       position: "bottom",
      //       type: "negative",
      //     });
      //   })
      //   .finally(() => {
      //     this.isSaving = false;
      //     this.onReset();
      //   });
    },
    getStretchies(params) {
      const endpoint = this.hasOrderId ? "" : "";
      const options = {};
      options.params = params;

      // fetch(endpoint ,options)
      //   .then(response => response.json())
      //   .then(result => {
      //     this.data = [];
      //   if (data.length) {
      //     for (let index in data) {
      //       this.data.push({
      //         trechostatus: null,
      //         shippingDateForecast: null,
      //         arrivalDateForecast: null,
      //         originType: null,
      //         originRegion: null,
      //         originState: null,
      //         originCity: null,
      //         provider: null,
      //         originAdress: null,
      //         originCityMeeting: null,
      //         destinationType: null,
      //         destinationRegion: null,
      //         destinationState: null,
      //         destinationCity: null,
      //         destinationProvider: null,
      //         destinationAdress: null,
      //         destinationCityMeeting: null,
      //         providerAddress: null,
      //         locator: null,
      //         releaseCar: null,
      //         soldValue: null,
      //         paidValue: null,
      //         providerBalance: null,
      //         providerStatus: null,
      //         carParkDate: null,
      //         providerShippingDate: null,
      //         elapsedWorkingDays: null,
      //         termContract: null,
      //         deliveryBaseTax: null,
      //         deliveryBaseTaxValue: null,
      //         taxSoldValue: null,
      //         dealedValue: null,
      //         paymentProvisionDate: null,
      //         paymentMade: null,
      //         balance: null,
      //         notes: null,
      //         shippingDate: null,
      //       });
      //     }
      //   }
      // })
      // .finally(() => {
      //   this.isSaving = false;
      // });
    },
    onRequest(props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let filter = props.filter;
      let params = { itemsPerPage: rowsPerPage, page };

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
      params.fromDate = this.formatDate(this.filters.from) || "";
      params.toDate = this.formatDate(this.filters.to) || "";

      if (this.filters.company != null) {
        params["myCompany"] = this.filters.company.id;
      }

      this.getStretchies(params).then(() => {
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;
      });
    },
  },
};
</script>

<style>

</style>
