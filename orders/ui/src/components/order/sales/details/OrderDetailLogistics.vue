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
      <div class="col-3">
        <q-input
          v-if="editShippingTax"
          outlined
          readonly
          stack-label
          label="Valor Total de Fretes"
          v-model="shippingTax"
        ></q-input>
        <q-input
          v-else="editShippingTax"
          outlined
          stack-label
          label="Valor Total de Fretes"
          v-model="shippingTax"
        ></q-input>
      </div>
      <div>
        <q-btn
          flat
          round
          dense
          style="margin-top: 13px"
          color="primary"
          :icon="editShippingTax ? 'edit' : 'cancel'"
          @click="editShippingTax = !editShippingTax"
        >
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
      </div>
      <div class="flex justify-end" style="width: 70%">
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
        row-key="Status"
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

            <q-td :props="props" key="Status">
              {{props.row.status}}
            </q-td>
            <q-td :props="props" key="PrevisaoEmbarque">
              {{props.row.shippingDateForecast}}
            </q-td>
            <q-td :props="props" key="PrevisaoChegada">
              {{props.row.arrivalDateForecast}}
            </q-td>
            <q-td :props="props" key="DataPatio">
              {{props.row.carParkDate}}
            </q-td>
            <q-td :props="props" key="Embarque">
              {{props.row.shippingDate}}
            </q-td>
            <q-td :props="props" key="DiasDecorridosPatio">
              {{props.row.elapsedWorkingDays}}
            </q-td>
            <q-td :props="props" key="OrigemTipo">
              {{props.row.originType}}
            </q-td>
            <q-td :props="props" key="OrigemLocal">
              {{props.row.originLocal}}
            </q-td>
            <q-td :props="props" key="DestinoTipo">
              {{props.row.destinationType}}
            </q-td>
            <q-td :props="props" key="DestinoLocal">
              {{props.row.destinationLocal}}
            </q-td>
            <q-td :props="props" key="ValorFreteVendido">
              {{props.row.taxSoldValue}}
            </q-td>
            <q-td :props="props" key="ValorFreteNegociado">
              {{props.row.dealedValue}}
            </q-td>
            <q-td :props="props" key="Saldo">
              {{props.row.balance}}
            </q-td>
            <q-td :props="props" key="PrazoContrato">
              {{props.row.termContract}}
            </q-td>
            <q-td :props="props" key="CobrancaBaseEntrega">
              {{props.row.deliveryBaseTaxValue}}
            </q-td>
            <q-td :props="props" key="DataProvisaoPagamento">
              {{props.row.paymentProvisionDate}}
            </q-td>
            <q-td :props="props" key="PagamentoRealizado">
              {{props.row.paymentMade}}
            </q-td>
            <q-td :props="props" key="Fornecedor">
              {{props.row.provider}}
            </q-td>
            <q-td :props="props" key="EnderecoFornecedor">
              {{props.row.providerAddress}}
            </q-td>
            <q-td :props="props" key="Localizador">
              {{props.row.locator}}
            </q-td>
            <q-td :props="props" key="LiberacaoCarro">
              {{props.row.releaseCar}}
            </q-td>
            <q-td :props="props" key="Observacoes">
              {{props.row.notes}}
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
              <div class="row col-12">
                <div class="col-5 q-gutter-sm">
                  <label>Origem</label>
                  <q-select
                    outlined
                    stack-label
                    label="Tipo"
                    :options="originTypeOptions"
                    v-model="trecho.originType"
                  ></q-select>
                  <q-select
                    outlined
                    stack-label
                    label="Local"
                    :options="originLocalOptions()"
                    v-model="trecho.originLocal"
                  ></q-select>
                </div>

                <q-separator vertical></q-separator>
                
                <div class="col-5 q-gutter-sm">
                  <label> Destino</label>
                  <q-select
                    outlined
                    stack-label
                    label="Tipo"
                    :options="destinationTypeOptions"
                    v-model="trecho.destinationType"
                  ></q-select>
            
                  <q-select
                    outlined
                    stack-label
                    label="Local"
                    :options="destinationLocalOptions()"
                    v-model="trecho.destinationLocal"
                  ></q-select>
                </div>
              </div>

              <q-separator horizontal></q-separator>

              <div class="row col-12 q-gutter-sm ">
                <div class="col-5">
                  <q-select
                    outlined
                    stack-label
                    label="Fornecedor"
                    :options="providerOptions"
                    v-model="trecho.provider"
                  ></q-select>
                </div>
                <div class="col-5">
                  <q-input
                    readonly
                    outlined
                    stack-label
                    label="Endereço do fornecedor"
                    v-model="trecho.providerAddress"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    readonly
                    outlined
                    stack-label
                    label="Localizador"
                    v-model="trecho.locator"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    type="date"
                    outlined
                    stack-label
                    label="Liberação do carro"
                    v-model="trecho.releaseCar"
                  ></q-input>
                </div>
              </div>

              <div class="row col-12 q-gutter-sm">
                <div class="col-5">
                  <q-input
                    outlined
                    stack-label
                    label="Valor do frete vendido"
                    v-model="trecho.taxSoldValue"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    stack-label
                    label="Valor do frete negociado"
                    v-model="trecho.dealedValue"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    readonly
                    outlined
                    stack-label
                    label="Saldo"
                    v-model="trecho.balance"
                  ></q-input>
                </div>
                <div class="col-2">
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
                <div class="col-3">
                  <q-input
                    v-if="trecho.deliveryBaseTax"
                    outlined
                    stack-label
                    label="Valor"
                    v-model="trecho.deliveryBaseTaxValue"
                  ></q-input>
                </div>
              </div>

              <div class="row col-12 q-gutter-sm">
                <div class="col-5">
                  <q-select
                    outlined
                    stack-label
                    label="Status"
                    :options="statusOptions"
                    v-model="trecho.status"
                  ></q-select>
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    type="date"
                    stack-label
                    label="Data pátio"
                    v-model="trecho.carParkDate"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    type="date"
                    stack-label
                    label="Previsão de embarque"
                    v-model="trecho.shippingDateForecast"
                  ></q-input>
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    type="date"
                    stack-label
                    label="Previsão de chegada"
                    v-model="trecho.arrivalDateForecast"
                  ></q-input>
                </div>
              </div>
              <q-separator></q-separator>

              <div class="row col-12 q-gutter-sm">
                <div class="col-3">
                  <q-input
                    readonly
                    outlined
                    stack-label
                    label="Data provisão pagamento"
                    v-model="trecho.paymentProvisionDate"
                  ></q-input>
                </div>
                <div class="col-7">
                  <q-input
                    type="textarea"
                    outlined
                    stack-label
                    label="Observações"
                    v-model="trecho.notes"
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
                ></q-btn>
              </div>

            </q-form>
          </q-card>
        </q-dialog>
      </div>

  </div>



</template>
  
  <script>
  export default {

  
    data() {
      return {
        isLoading: false,
        editShippingTax: true,
        shippingTax: null,
        trecho: {
          status: null,
          provider: null,
          providerAddress: null,
          locator: null,
          releaseCar: null,
          taxSoldValue: null,
          dealedValue: null,
          balance: null,
          termContract: null,
          carParkDate: null,
          shippingDateForecast: null,
          arrivalDateForecast: null,
          shippingDate: null,
          elapsedWorkingDays: null,
          originType: null,
          originLocal: null,
          destinationType: null,
          destinationLocal: null,
          deliveryBaseTax: null,
          deliveryBaseTaxValue: null,
          paymentProvisionDate: null,
          paymentMade: null,
          notes: null,
        },
        addModal: false,
        providerOptions: ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"],
        statusOptions: ["Aguardando cliente", "Aguardando retirada", "Em trânsito", "Pendente de coleta", "Pendente de embarque", "Reembarque", "Retirado"],
        originTypeOptions: ["Coleta", "Base", "Ponto de encontro"],
        destinationTypeOptions: ["Entrega", "Base", "Ponto de encontro"],
        data: [],
        columns: [
          {
            name: 'Status',
            label: 'Status',
            align: 'center',
            field: row => row.status,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoChegada',
            label: 'Previsão Embarque',
            align: 'center',
            field: row => row.shippingDateForecast,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoEmbarque',
            label: 'Previsão Chegada',
            align: 'center',
            field: row => row.arrivalDateForecast,
            format: val => `${val}`,
          },
          {
            name: 'DataPatio',
            label: 'Data Pátio',
            align: 'center',
            field: row => row.carParkDate,
            format: val => `${val}`,
          },
          {
            name: 'Embarque',
            label: 'Embarque',
            align: 'center',
            field: row => row.shippingDate,
            format: val => `${val}`,
          },
          {
            name: 'DiasDecorridosPatio',
            label: 'Dias Decorridos (Pátio)',
            align: 'center',
            field: row => row.elapsedWorkingDays,
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
            name: 'OrigemLocal',
            label: 'Origem Local',
            align: 'center',
            field: row => row.originLocal,
            format: val => `${val}`,
          },
          {
            name: 'DestinoTipo',
            label: 'Destino Tipo',
            align: 'center',
            field: row => row.destinationType,
            format: val => `${val}`,
          },
          {
            name: 'DestinoLocal',
            label: 'Destino Local',
            align: 'left',
            field: row => row.destinationLocal,
            format: val => `${val}`,
          },
          {
            name: 'ValorFreteVendido',
            label: 'Valor Frete Vendido',
            align: 'left',
            field: row => row.taxSoldValue,
            format: val => `${val}`,
          },
          {
            name: 'ValorFreteNegociado',
            label: 'Valor Frete Negociado',
            align: 'center',
            field: row => row.dealedValue,
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
            name: 'PrazoContrato',
            label: 'Prazo Contrato',
            align: 'right',
            field: row => row.termContract,
            format: val => `${val}`,
          },
          {
            name: 'CobrancaBaseEntrega',
            label: 'Cobrança Base de Entrega',
            align: 'right',
            field: row => row.deliveryBaseTaxValue,
            format: val => `${val}`,
          },
          {
            name: 'DataProvisaoPagamento',
            label: 'Data Provisão Pagamento',
            align: 'right',
            field: row => row.paymentProvisionDate,
            format: val => `${val}`,
          },
          {
            name: 'PagamentoRealizado',
            label: 'Pagamento Realizado',
            align: 'right',
            field: row => row.paymentMade,
            format: val => `${val}`,
          },
          {
            name: 'Fornecedor',
            label: 'Fornecedor',
            align: 'right',
            field: row => row.Fornecedor,
            format: val => `${val}`,
          },
          {
            name: 'EnderecoFornecedor',
            label: 'Endereço Fornecedor',
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
            label: 'LiberacaoCarro',
            align: 'right',
            field: row => row.releaseCar,
            format: val => `${val}`,
          },
          {
            name: 'Observacoes',
            label: 'Observações',
            align: 'right',
            field: row => row.notes,
            format: val => `${val}`,
          },
        ],
      }
    },

    created() {
    },

    methods: {

      deleteTrecho(index) {
        this.data.splice(index, 1);
      },

      onSubmit() {
        let novoTrecho = this.trecho;
        this.data.push(novoTrecho);
        // this.onReset();
      },
      onReset() {
          this.trecho.provider = null;
          this.trecho.providerAddress = null;
          this.trecho.locator = null;
          this.trecho.releaseCar = null;
          this.trecho.taxSoldValue = null;
          this.trecho.dealedValue = null;
          this.trecho.balance = null;
          this.trecho.termContract = null;
          this.trecho.status = null;
          this.trecho.carParkDate = null;
          this.trecho.shippingDateForecast = null;
          this.trecho.arrivalDateForecast = null;
          this.trecho.shippingDate = null;
          this.trecho.elapsedWorkingDays = null;
          this.trecho.originType = null;
          this.trecho.originLocal = null;
          this.trecho.destinationType = null;
          this.trecho.destinationLocal = null;
          this.trecho.deliveryBaseTax = null;
          this.trecho.deliveryBaseTaxValue = null;
          this.trecho.paymentProvisionDate = null;
          this.trecho.paymentMade = null;
          this.trecho.notes = null;
      },
      originLocalOptions() {

      },
      destinationLocalOptions() {

      },
    },

    watch: {
      "addModal"() {
        if (this.addModal == false) this.deliveryBaseTax = null;
      },
      "data.length"() {
        console.log('ver')
        console.log(this.data)
      },
    }
  }
  </script>
  
  <style>
  .bt-edit {
    margin-right: 15px;
  }
  </style>
  