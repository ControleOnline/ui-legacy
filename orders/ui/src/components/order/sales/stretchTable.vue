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
                :source="getGeoPlaces"
                :isLoading="isSearching"
                label="Origem"
                @selected="onSelectOriginFilter"
                placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
              />
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3">
              <PeopleAutocomplete
                :source="searchPeople"
                :isLoading="isSearching"
                label="Fornecedor"
                @selected="onSelectOriginPeopleFilter"
                placeholder="Pesquisar..."
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
                    <q-item-section class="text-grey">
                      Sem resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-xs-12 col-sm-9 col-md-7 q-pb-sm">
              <DataFilter
                ref="myDataFilter"
                class="data-filter-listener"
                style="justify-content: flex-start"
                :fromDate="filters.from"
                :toDate="filters.to"
                :showButton="false"
                @dateChanged="dateChanged"
              />
            </div>
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-12 flex justify-end q-gutter-x-md"
          >
            <div
              v-if="!hasOrderId"
              class="col-sm-3 flex items-end col-xs-12 q-pb-md"
            >
              <q-btn
                color="primary"
                label="Limpar filtro"
                @click="cleanFilter()"
              ></q-btn>
            </div>
            <div class="col-sm-3 flex items-end col-xs-12 q-pb-md">
              <q-btn
                v-if="hasOrderId && toggleAddStretch == false"
                class=""
                label="Novo Trecho"
                color="primary"
                @click="toggleAddStretch = !toggleAddStretch"
              ></q-btn>
              <q-btn
                v-if="hasOrderId && toggleAddStretch == true"
                class=""
                icon="close"
                label="Novo Trecho"
                color="negative"
                @click="toggleAddStretch = !toggleAddStretch"
              ></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Filtros Fim -->

    <!-- Add Trecho -->
    <div>
      <q-card v-if="toggleAddStretch == true" class="row q-pa-md q-mb-xl">
        <q-form
          class="row flex col-12 q-gutter-y-md"
          ref="myForm"
          @submit="onSubmit"
        >
          <div class="row col-12 q-gutter-sm">
            <q-select
              dense
              class="col-2 flex items-end"
              outlined
              stack-label
              label="Status"
              :options="statusOptions"
              v-model="stretch.status"
              :rules="[(val) => val != null || 'Preencha o campo']"
            ></q-select>
          </div>

          <!-- Origem -->
          <div class="col-5 q-mr-xl">
            <span class="label">Origem</span>
            <div class="row col-12 q-gutter-sm">
              <div class="col-12">
                <q-select
                  dense
                  outlined
                  stack-label
                  label="Tipo"
                  :options="originTypeOptions"
                  v-model="stretch.originType"
                  :rules="[(val) => val != null || 'Preencha o campo']"
                ></q-select>
              </div>

              <div class="col-12">
                <PeopleAutocomplete
                  :source="searchPeople"
                  :isLoading="isSearching"
                  label="Fornecedor"
                  @selected="onSelectOriginPeople"
                  placeholder="Pesquisar..."
                />
              </div>

              <div class="row col-12">
                <div v-if="stretch.originType != 'Base'" class="col-12">
                  <ListAutocomplete
                    :source="getGeoPlaces"
                    :isLoading="isSearching"
                    label="Busca de endereço"
                    @selected="onSelectOrigin"
                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                  />
                </div>
                <div v-if="stretch.originType == 'Base'" class="col-12">
                  <q-select
                    :options="originProviderAddressOptions"
                    dense
                    outlined
                    stack-label
                    label="Endereço"
                    v-model="tempOriginAddressAdd"
                  ></q-select>
                </div>
              </div>
            </div>
          </div>

          <!-- Destino -->
          <div class="col-5">
            <span class="label">Destino</span>
            <div class="row col-12 q-gutter-sm">
              <div class="col-12">
                <q-select
                  dense
                  outlined
                  stack-label
                  label="Tipo destino"
                  :options="destinationTypeOptions"
                  v-model="stretch.destinationType"
                  :rules="[(val) => val != null || 'Preencha o campo']"
                ></q-select>
              </div>

              <div class="col-12">
                <PeopleAutocomplete
                  :source="searchPeople"
                  :isLoading="isSearching"
                  label="Fornecedor"
                  @selected="onSelectDestinationPeople"
                  placeholder="Pesquisar..."
                />
              </div>

              <div class="row col-12">
                <div v-if="stretch.destinationType != 'Base'" class="col-12">
                  <ListAutocomplete
                    :source="getGeoPlaces"
                    :isLoading="isSearching"
                    label="Busca de endereço"
                    @selected="onSelectDestination"
                    placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                  />
                </div>
                <div v-if="stretch.destinationType == 'Base'" class="col-12">
                  <q-select
                    :options="destinationProviderAddressOptions"
                    dense
                    outlined
                    stack-label
                    label="Endereço"
                    v-model="tempDestinationAddressAdd"
                  ></q-select>
                </div>
              </div>
            </div>
          </div>

          <div class="row col-12 q-mt-xl">
            <q-input
              class="col-2"
              dense
              type="number"
              outlined
              stack-label
              label="Valor"
              v-model="stretch.price"
              :rules="[(val) => val != null || 'Preencha o campo']"
            ></q-input>
          </div>

          <div class="row col-12 q-gutter-sm">
            <div class="col-2">
              <q-input
                dense
                type="date"
                outlined
                stack-label
                label="Embarque"
                v-model="stretch.shippingDate"
                :rules="[(val) => val != null || 'Preencha o campo']"
              ></q-input>
            </div>
            <div class="col-2">
              <q-input
                dense
                type="date"
                outlined
                stack-label
                label="Chegada"
                v-model="stretch.arrivalDate"
              ></q-input>
            </div>
          </div>

          <div class="col-12 q-gutter-sm flex justify-end">
            <q-btn color="positive" label="Salvar" @click="onSubmit()"></q-btn>
            <q-btn
              color="negative"
              label="Limpar"
              v-close-popup
              @click="onReset"
            ></q-btn>
          </div>
        </q-form>
      </q-card>
    </div>
    <!-- Add Trecho Fim -->

    <!-- Tabela-->
    <div class="q-mt-none">
      <q-table
        ref="myTable"
        flat
        :loading="isLoading"
        :data="data"
        :columns="settings.columns"
        :pagination.sync="pagination"
        @request="onRequest"
        row-key="Id"
        :rows-per-page-options="[0]"
      >
        <!-- <template v-slot:header-selection="scope"></template> -->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-btn dense flat icon="settings">
                <q-menu>
                  <q-list>
                    <q-item clickable @click="openEditModal(props)">
                      <q-item-section side>
                        <q-icon name="edit"></q-icon>
                      </q-item-section>
                      <q-item-section> Editar </q-item-section>
                    </q-item>
                    <q-item clickable @click="finish(props)">
                      <q-item-section side>
                        <q-icon name="check"></q-icon>
                      </q-item-section>
                      <q-item-section> Finalizar </q-item-section>
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
              {{ props.row.id }}
            </q-td>
            <q-td :props="props" key="IdPedido">
              {{ props.row.orderId }}
            </q-td>
            <q-td :props="props" key="stretchstatus" :style="{color: getStatusColor(props.row.status)}">
              {{ props.row.status }}
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
            <q-td :props="props" key="Fornecedor">
              {{ props.row.provider }}
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
            <q-td :props="props" key="DestinoFornecedor">
              {{ props.row.destinationProvider }}
            </q-td>
            <q-td :props="props" key="Valor">
              {{ formatMoney(props.row.price) }}
            </q-td>
            <q-td :props="props" key="DataEmbarque">
              {{ formatDate(props.row.shippingDate) }}
            </q-td>
            <q-td :props="props" key="DataChegada">
              {{ formatDate(props.row.arrivalDate) }}
            </q-td>
            <q-td :props="props" key="UltimaModificacao">
              {{ formatDate(props.row.lastModified) }}
            </q-td>
            <q-td :props="props" key="Responsavel">
              {{ props.row.inCharge }}
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
            {{props.row.peopleBalance}}
          </q-td>
          <q-td :props="props" key="FornecedorStatus">
            {{props.row.peopleStatus}}
          </q-td>
          <q-td :props="props" key="DataPatio">
            {{formatDate(props.row.carParkDate)}}
          </q-td>
          <q-td :props="props" key="FornecedorDataEmbarque">
            {{props.row.peopleShippingDate}}
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

    <!-- Modal Edit-->
    <div>
      <q-dialog v-model="editModal">
        <q-card class="q-pa-md" style="max-width: 50%">
          <q-form
            class="row flex q-gutter-y-md"
            ref="myForm"
            @submit="onSubmit"
          >
            <div class="row col-12 q-gutter-sm">
              <div class="col-12">
                <q-select
                  dense
                  class="col-12 flex items-end"
                  outlined
                  stack-label
                  label="Status"
                  :options="statusOptions"
                  v-model="stretch.status"
                  :rules="[(val) => val != null || 'Preencha o campo']"
                ></q-select>
              </div>

              <!-- Origem -->
              <div class="row col-5 q-mr-xl">
                <div class="col-12">
                  <q-select
                    dense
                    outlined
                    stack-label
                    label="Tipo"
                    :options="originTypeOptions"
                    v-model="stretch.originType"
                    :rules="[(val) => val != null || 'Preencha o campo']"
                  ></q-select>
                </div>

                <div class="row col-12 q-gutter-sm q-mb-md">
                  <div class="col-4">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="Região"
                      v-model="stretch.originRegion"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="UF"
                      v-model="stretch.originState"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="Cidade"
                      v-model="stretch.originCity"
                    ></q-input>
                  </div>
                </div>
                <div class="col-12 q-mb-md">
                  <q-input
                    v-if="editAdress == false"
                    dense
                    outlined
                    readonly
                    stack-label
                    label="Endereço"
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
                  <div class="row flex items-center" v-if="editAdress == true">
                    <ListAutocomplete
                      class="col-11"
                      :source="getGeoPlaces"
                      :isLoading="isSearching"
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
                <div class="row col-12">
                  <div class="col-12 q-mb-sm">
                    <q-input
                      v-if="editProvider == false"
                      dense
                      outlined
                      readonly
                      stack-la
                      label="Fornecedor'"
                      v-model="stretch.provider"
                    >
                      <template v-slot:append>
                        <q-btn
                          dense
                          flat
                          icon="edit"
                          color="primary"
                          @click="editProvider = true"
                        ></q-btn>
                      </template>
                    </q-input>
                    <div
                      v-if="editProvider == true"
                      class="row flex items-center"
                    >
                      <PeopleAutocomplete
                        class="col-11"
                        :source="searchPeople"
                        :isLoading="isSearching"
                        label="Fornecedor"
                        @selected="onSelectOriginPeopleEdit"
                        placeholder="Pesquisar..."
                      />
                      <div class="col-1">
                        <q-btn
                          dense
                          flat
                          icon="cancel"
                          color="negative"
                          @click="cancelEditProvider()"
                        ></q-btn>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="col-xs-12 q-mb-sm" v-if="stretch.originType == 'Coleta'">
                        <ListAutocomplete
                          :source="getGeoPlaces"
                          :isLoading="isSearching"
                          label="Busca de endereço"
                          @selected="onSelectOrigin"
                          placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                        />
                      </div> -->
                </div>
              </div>
              <!-- Origem Fim -->

              <!-- Destino -->
              <div class="row col-5">
                <div class="col-12">
                  <q-select
                    dense
                    outlined
                    stack-label
                    label="Tipo destino"
                    :options="destinationTypeOptions"
                    v-model="stretch.destinationType"
                    :rules="[(val) => val != null || 'Preencha o campo']"
                  ></q-select>
                </div>

                <div class="row col-12 q-gutter-sm q-mb-md">
                  <div class="col-4">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="Região"
                      v-model="stretch.destinationRegion"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="UF"
                      v-model="stretch.destinationState"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-input
                      dense
                      outlined
                      readonly
                      stack-label
                      label="Cidade"
                      v-model="stretch.destinationCity"
                    ></q-input>
                  </div>
                </div>
                <div class="col-12 q-mb-md">
                  <q-input
                    v-if="editDestinationAdress == false"
                    dense
                    outlined
                    readonly
                    stack-label
                    label="Endereço"
                    v-model="stretch.destinationAdress"
                  >
                    <template v-slot:append>
                      <q-btn
                        dense
                        flat
                        icon="edit"
                        color="primary"
                        @click="editDestinationAdress = true"
                      ></q-btn>
                    </template>
                  </q-input>
                  <div
                    class="row flex items-center"
                    v-if="editDestinationAdress == true"
                  >
                    <ListAutocomplete
                      class="col-11"
                      :source="getGeoPlaces"
                      :isLoading="isSearching"
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
                        @click="cancelEditDestinationAdress()"
                      ></q-btn>
                    </div>
                  </div>
                </div>
                <div class="row col-12">
                  <div class="col-12 q-mb-sm">
                    <q-input
                      v-if="editDestinationProvider == false"
                      dense
                      outlined
                      readonly
                      stack-la
                      label="Fornecedor'"
                      v-model="stretch.destinationProvider"
                    >
                      <template v-slot:append>
                        <q-btn
                          dense
                          flat
                          icon="edit"
                          color="primary"
                          @click="editDestinationProvider = true"
                        ></q-btn>
                      </template>
                    </q-input>
                    <div
                      v-if="editDestinationProvider == true"
                      class="row flex items-center"
                    >
                      <PeopleAutocomplete
                        class="col-11"
                        :source="searchPeople"
                        :isLoading="isSearching"
                        label="Fornecedor"
                        @selected="onSelectDestinationPeopleEdit"
                        placeholder="Pesquisar..."
                      />
                      <div class="col-1">
                        <q-btn
                          dense
                          flat
                          icon="cancel"
                          color="negative"
                          @click="cancelEditDestinationProvider()"
                        ></q-btn>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="col-xs-12 q-mb-sm" v-if="stretch.originType == 'Coleta'">
                        <ListAutocomplete
                          :source="getGeoPlaces"
                          :isLoading="isSearching"
                          label="Busca de endereço"
                          @selected="onSelectOrigin"
                          placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
                        />
                      </div> -->
                </div>
              </div>
              <!-- Destino Fim -->
            </div>

            <div class="col-12">
              <q-input
                dense
                type="number"
                outlined
                stack-label
                label="Valor"
                v-model="stretch.price"
                :rules="[(val) => val != null || 'Preencha o campo']"
              ></q-input>
            </div>

            <div class="row col-12 q-gutter-sm">
              <div class="col-5">
                <q-input
                  dense
                  type="date"
                  outlined
                  stack-label
                  label="Embarque"
                  v-model="stretch.shippingDate"
                ></q-input>
              </div>

              <div class="col-5">
                <q-input
                  dense
                  type="date"
                  outlined
                  stack-label
                  label="Chegada"
                  v-model="stretch.arrivalDate"
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

            <!-- <div class="row col-12 q-gutter-sm" v-if="stretch.originType == 'Base'">
                
                  <div class="col-2">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Fornecedor endereço"
                      v-model="stretch.peopleAddress"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      type="date"
                      outlined
                      stack-label
                      label="Liberação do carro"
                      v-model="stretch.locator"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Valor vendido"
                      v-model="stretch.soldValue"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      stack-label
                      label="Valor pago"
                      v-model="stretch.paidValue"
                    ></q-input>
                  </div>
                  <div class="col-2">
                    <q-input
                      readonly
                      outlined
                      stack-label
                      label="Saldo"
                      v-model="stretch.peopleBalance"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-select
                      outlined
                      stack-label
                      label="Status"
                      :options="peopleStatusOptions"
                      v-model="stretch.peopleStatus"
                    ></q-select>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      type="date"
                      stack-label
                      label="Data pátio"
                      v-model="stretch.carParkDate"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Dias uteis decorridos (Patio)"
                      v-model="stretch.elapsedWorkingDays"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Prazo contrato"
                      v-model="stretch.termContract"
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
                      v-model="stretch.deliveryBaseTax"
                      :val="true"
                    ></q-radio>
                    <q-radio
                      outlined
                      disable
                      stack-label
                      label="Não"
                      v-model="stretch.deliveryBaseTax"
                      :val="false"
                    ></q-radio>
                  </div>
                  <div class="col-4">
                    <q-input
                      v-if="stretch.deliveryBaseTax"
                      outlined
                      readonly
                      stack-label
                      label="Valor"
                      v-model="stretch.deliveryBaseTaxValue"
                      type="number"
                    ></q-input>
                  </div>
                  <div class="col-5">
                    <q-input
                      outlined
                      stack-label
                      label="Valor do frete vendido"
                      v-model="stretch.taxSoldValue"
                      type="number"
                    ></q-input>
                  </div>
                  <div class="col-4">
                    <q-input
                      outlined
                      stack-label
                      label="Valor negociado"
                      v-model="stretch.dealedValue"
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
                      v-model="stretch.paymentProvisionDate"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Pagamento realizado"
                      v-model="stretch.paymentMade"
                    ></q-input>
                  </div>
                  <div class="col-3">
                    <q-input
                      outlined
                      readonly
                      stack-label
                      label="Saldo"
                      v-model="stretch.balance"
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
import fetch from "@controleonline/quasar-common-ui/src/utils/fetch";
import { LocalStorage } from "quasar";

const SETTINGS = {
  columns: [
    {
      name: "",
      label: "",
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
      field: (row) => row.orderId,
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
      name: "Fornecedor",
      label: "Fornecedor",
      align: "left",
      field: (row) => row.people,
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
      name: "DataEmbarque",
      label: "Data embarque",
      align: "right",
      field: (row) => row.shippingDate,
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
      align: "right",
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
    },
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

  beforeDestroy() {},

  data() {
    return {
      api: new Api(this.$store.getters["auth/user"].token),
      isLoading: false,
      isSearching: false,
      editShippingTax: true,
      shippingTax: null,
      hasOrderId: null,
      toggleAddStretch: false,
      indexRowEdit: null,
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
      stretch: {
        id: null,
        status: null,
        shippingDate: null,
        arrivalDate: null,
        originType: null,
        originRegion: null,
        originState: null,
        originCity: null,
        originAdress: null,
        provider: null,
        destinationType: null,
        destinationRegion: null,
        destinationState: null,
        destinationCity: null,
        destinationAdress: null,
        destinationProvider: null,
        price: null,
      },
      addModal: false,
      editModal: false,
      peopleOptions: ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"],
      peopleStatusOptions: [
        "Liberado para base",
        "Aguardando cliente",
        "Pátio",
      ],
      statusOptions: [],
      originProviderAddressOptions: [],
      destinationProviderAddressOptions: [],
      filterStatusOptions: [],
      originTypeOptions: ["Coleta", "Base", "Ponto de encontro"],
      destinationTypeOptions: ["Entrega", "Base", "Ponto de encontro"],
      originRegionOptions: [
        "Norte",
        "Nordeste",
        "Sul",
        "Sudeste",
        "Centro-Oeste",
      ],
      destinationRegionOptions: [
        "Norte",
        "Nordeste",
        "Sul",
        "Sudeste",
        "Centro-Oeste",
      ],
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
      settings: SETTINGS,
      filters: {
        company: null,
        defaultCompany: null,
        order: null,
        origin: null,
        provider: null,
        status: "Todos",
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
    addModal() {
      if (this.addModal == false) this.deliveryBaseTax = null;
    },
    editModal() {
      if (this.editModal == false) this.onReset();
    },
    "tempOriginAddressAdd"(address) {
      console.log('endereco')
      console.log(address)
      this.stretch.originRegion = address.value.region
      this.stretch.originState = address.value.state
      this.stretch.originCity = address.value.city
      this.stretch.originAdress= address.label
      console.log(this.stretch)
    },
    "tempDestinationAddressAdd"(address) {
      console.log('endereco')
      console.log(address)
      this.stretch.destinationRegion = address.value.region
      this.stretch.destinationState = address.value.state
      this.stretch.destinationCity = address.value.city
      this.stretch.destinationAdress= address.label
      console.log(this.stretch)
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
      this.getRegion(item.state);
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
      this.stretch.provider = {
        value: item.id,
        label: item.name,
      };
      if (this.stretch.originType == "Base") {
        this.getProviderAddress(item.id).then((data) => {
          if (data != null) {
            this.originProviderAddressOptions = [];
            
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
              let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;
      
              this.originProviderAddressOptions.push({
                label: formatedAddress,
                value: address,
              });
            }
          }
        });
      }
    },
    onSelectOriginPeopleEdit(item) {
      this.tempProvider.name = this.stretch.provider;
      this.tempProvider.id = this.stretch.providerId;

      this.stretch.provider = item.name;
      this.selectedProvider = item.id;
    },
    onSelectDestinationPeople(item) {
      this.stretch.destinationProvider = {
        value: item.id,
        label: item.name,
      };
      if (this.stretch.destinationType == "Base") {
        this.getProviderAddress(item.id).then((data) => {
          if (data != null) {
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
              let formatedAddress = `${address.street}, ${address.number}, ${address.complement} - ${address.district}, ${address.cep}, ${address.city} ${address.state}, ${address.country}`;
      
              this.destinationProviderAddressOptions.push({
                label: formatedAddress,
                value: address,
              });
            }
          }
        });
      }
    },
    onSelectDestinationPeopleEdit(item) {
      this.tempDestinationProvider.name = this.stretch.destinationProvider;
      this.tempDestinationProvider.id = this.stretch.destinationProviderId;

      this.stretch.provider = item.name;
      this.selectedDestinationProvider = item.id;
    },
    onSelectOriginFilter(item) {
      this.filters.origin = item.description;
    },
    onSelectDestinationFilter(item) {
      this.filters.destination = item.description;
    },
    onSelectOriginPeopleFilter(item) {
      this.filters.provider = item.id;
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
      this.editAdress = false;
      this.editProvider = false;
      this.editDestinationAdress = false;
      this.editDestinationProvider = false;
      this.editModal = true;
      this.selectedProvider = props.row.providerId;
      this.selectedDestinationProvider = props.row.destinationProviderId;
      this.selectedStatus = props.row.statusId;
      this.stretch = structuredClone(props.row);
      this.stretch.shippingDate = this.formatDate(this.stretch.shippingDate);
      this.stretch.shippingDate = this.buildAmericanDate(
        this.stretch.shippingDate
      );
      this.stretch.arrivalDate = this.formatDate(this.stretch.arrivalDate);
      this.stretch.arrivalDate = this.buildAmericanDate(
        this.stretch.arrivalDate
      );
    },
    cancelEditAdress() {
      this.editAdress = false;
      if (this.tempAdress.region)
        this.stretch.originRegion = this.tempAdress.region;

      if (this.tempAdress.state)
        this.stretch.originState = this.tempAdress.state;

      if (this.tempAdress.city) this.stretch.originCity = this.tempAdress.city;

      if (this.tempAdress.adress)
        this.stretch.originAdress = this.tempAdress.adress;
    },
    cancelEditProvider() {
      this.editProvider = false;
      if (this.tempProvider.name)
        this.stretch.provider = this.tempProvider.name;

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
      console.log(locale)
      console.log('1')
      let states = this.collectionStateOptions;
      for (let index in states) {
        console.log('2')
        if (states[index][1] == locale) {
          console.log('3')
          return states[index][2];
          // return 'retorno'
        }
      }
    },
    onReset() {
      this.editModal = false;
      this.stretch.id = null;
      this.stretch.status = null;
      this.stretch.shippingDate = null;
      this.stretch.arrivalDate = null;
      this.stretch.originType = null;
      this.stretch.originRegion = null;
      this.stretch.originState = null;
      this.stretch.provider = null;
      this.stretch.originCity = null;
      this.stretch.originAdress = null;
      this.stretch.originType = null;
      this.stretch.destinationRegion = null;
      this.stretch.destinationState = null;
      this.stretch.destinationProvider = null;
      this.stretch.destinationCity = null;
      this.stretch.destinationAdress = null;
      this.stretch.price = null;
      this.stretch.order = null;
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
        context: "logistic",
      };
      return this.api
        .private(endpoint, options)
        .then((response) => response.json())
        .then((result) => {
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
      
        case "Liberado para Base":
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
      this.filters.status = "Todos";
      this.filters.from = "";
      this.filters.to = "";
      this.$refs.myDataFilter.$data.date["from"] = "";
      this.$refs.myDataFilter.$data.date["to"] = "";
    },
    // shippingDateValidate(selectedDate) {
    //   if (selectedDate == null)
    //     return "Preencha o campo";

    //   console.log('aqui')
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

    //   console.log('aqui')
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
      let modified = this.buildAmericanDate(
        date.toLocaleDateString()
      );

      return modified;
    },
    finish(props) {
      let arrivalDate = this.buildAmericanDate(new Date().toLocaleDateString());
      this.stretch = structuredClone(props.row);

      this.selectedProvider = props.row.providerId;
      this.selectedDestinationProvider = props.row.destinationProviderId;
      this.selectedStatus = this.statusOptions[10].value;

      this.stretch.shippingDate = this.formatDate(props.row.shippingDate);
      this.stretch.shippingDate = this.buildAmericanDate(
        this.stretch.shippingDate
      );
      this.stretch.arrivalDate = arrivalDate.toString();
      console.log(arrivalDate)
      this.saveStretch();
    },
    getProviderAddress(providerId) {
      return this.api
        .private(`/people/${providerId}`, {})
        .then((response) => response.json())
        .then((result) => {
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
        })
        .catch((error) => {
          this.$q.notify({
            message: this.$t(error.message),
            position: "bottom",
            type: "negative",
          });
        });
    },
    getValuesToLoad() {
      this.onRequest({ pagination: this.pagination });
      this.getStatuses();
      this.isLoading = true;
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
      this.addModal = false;
      this.editModal = false;

      let endpoint =
        this.stretch.id == null
          ? `/order_logistics`
          : `/order_logistics/${this.stretch.id}`;

      let stretch = structuredClone(this.stretch);

      if (this.stretch.id) {
        stretch.status = "/statuses/" + this.selectedStatus;
        stretch.provider = "/people/" + this.selectedProvider;
        stretch.destinationProvider =
          "/people/" + this.selectedDestinationProvider;
      } else {
        stretch.status = "/statuses/" + this.stretch.status.value;
        if (this.stretch.provider)
          stretch.provider = "/people/" + this.stretch.provider.value;
        if (this.stretch.destinationProvider)
          stretch.destinationProvider =
            "/people/" + this.stretch.destinationProvider.value;
      }

      stretch.order = this.stretch.id
        ? `/sales/orders/${this.stretch.orderId}`
        : `/sales/orders/${this.orderId}`;
      stretch.price = parseFloat(this.stretch.price);

      if (stretch.originType == "Base") stretch.originType = "b";

      if (stretch.originType == "Coleta") stretch.originType = "c";

      if (stretch.originType == "Ponto de encontro") stretch.originType = "p";

      if (stretch.destinationType == "Base") stretch.destinationType = "b";

      if (stretch.destinationType == "Entrega") stretch.destinationType = "e";

      if (stretch.destinationType == "Ponto de encontro")
        stretch.destinationType = "p";

      stretch.inCharge = "/people/" + LocalStorage.getItem('session').people;
      stretch.lastModified = this.lastModified();

      console.log(stretch)

      let options = {
        method: this.stretch.id == null ? "POST" : "PUT",
        headers: new Headers(),
        body: JSON.stringify(stretch),
      };
      this.api
        .private(endpoint, options)
        .then((response) => response.json())
        .then((result) => {
          if (result.id) {
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
          //this.onReset();
          this.getValuesToLoad();
        });
    },
    getStretchies(params) {
      const endpoint = "/order_logistics";
      const options = {};
      options.params = params;

      return this.api
        .private(endpoint, options)
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

      if (this.orderId) {
        params["order"] = this.orderId;
      }

      if (this.filters.order != null) {
        params["order"] = this.filters.order;
      }

      if (this.filters.origin != null && this.filters.origin.length > 0) {
        params["origin"] = this.filters.origin;
      }

      if (this.filters.provider != null) {
        params["provider"] = this.filters.provider;
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

              if (data.members[index].originType == "p")
                originType = "Ponto de encontro";

              if (data.members[index].destinationType == "b")
                destinationType = "Base";

              if (data.members[index].destinationType == "e")
                destinationType = "Entrega";

              if (data.members[index].destinationType == "p")
                destinationType = "Ponto de encontro";

              this.data.push({
                id: data.members[index].id,
                status: this.$t(
                  `logistic.statuses.${data.members[index].status.status}`
                ),
                statusId: data.members[index].status.id,
                shippingDate: data.members[index].shippingDate,
                arrivalDate: data.members[index].arrivalDate,
                originType: originType,
                originRegion: data.members[index].originRegion,
                originState: data.members[index].originState,
                originCity: data.members[index].originCity,
                originAdress: data.members[index].originAdress,
                provider:
                  data.members[index].provider == null
                    ? null
                    : data.members[index].provider.alias,
                providerId:
                  data.members[index].provider == null
                    ? null
                    : data.members[index].provider.id,
                destinationType: destinationType,
                destinationRegion: data.members[index].destinationRegion,
                destinationState: data.members[index].destinationState,
                destinationCity: data.members[index].destinationCity,
                destinationAdress: data.members[index].destinationAdress,
                destinationProvider:
                  data.members[index].destinationProvider == null
                    ? null
                    : data.members[index].destinationProvider.alias,
                destinationProviderId:
                  data.members[index].destinationProvider == null
                    ? null
                    : data.members[index].destinationProvider.id,
                price: data.members[index].price,
                orderId: data.members[index].order.id,
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
          this.isLoading = false;
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
