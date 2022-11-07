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
        >
        <template v-slot:body="props">
          <q-tr :props="props.row">
            <q-td :props="props" key="Status">
              {{props.row.status}}
            </q-td>
            <q-td :props="props" key="DataPatio">
              {{props.row.dataPatio}}
            </q-td>
            <q-td :props="props" key="PrevisaoEmbarque">
              {{props.row.previsaoEmbarque}}
            </q-td>
            <q-td :props="props" key="DiasUteisDecorridos">
              {{props.row.diasUteisDecorridos}}
            </q-td>
            <q-td :props="props" key="PrevisaoChegada">
              {{props.row.previsaoChegada}}
            </q-td>
            <q-td :props="props" key="OrigemTipo">
              {{props.row.origemTipo}}
            </q-td>
            <q-td :props="props" key="OrigemLocal">
              {{props.row.origemLocal}}
            </q-td>
            <q-td :props="props" key="DestinoTipo">
              {{props.row.destinoTipo}}
            </q-td>
            <q-td :props="props" key="DestinoLocal">
              {{props.row.destinoLocal}}
            </q-td>
            <q-td :props="props" key="Fornecedor">
              {{props.row.fornecedor}}
            </q-td>
            <q-td :props="props" key="PrazoContrato">
              {{props.row.prazoContrato}}
            </q-td>
            <q-td :props="props" key="CobrancaBaseEntrega">
              {{props.row.cobrancaBaseEntrega}}
            </q-td>
            <q-td :props="props" key="ValorFreteVendido">
              {{props.row.valorFreteVendido}}
            </q-td>
            <q-td :props="props" key="ValorFreteNegociado">
              {{props.row.valorFreteNegociado}}
            <q-td :props="props" key="DataProvisaoPagamento">
              {{props.row.dataProvisaoPagamento}}
            </q-td>
            <q-td :props="props" key="PagamentoRealizado">
              {{props.row.pagamentoRealizado}}
            </q-td>
            </q-td>
            <q-td :props="props" key="Saldo">
              {{props.row.saldo}}
            </q-td>
          </q-tr>
        </template>
        </q-table>

        <q-dialog v-model="addModal" full-width>
          <q-card class="q-pa-md">
            <q-form
            class="row flex q-gutter-md"
            @submit="onSubmit"
            @reset="onReset"
            >
              <div class="col-6">
                <q-select
                  outlined
                  stack-label
                  label="Fornecedor"
                  :options="providerOptions"
                  v-model="novoTrecho.provider"
                ></q-select>
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  stack-label
                  label="Status"
                  :options="statusOptions"
                  v-model="novoTrecho.status"
                ></q-select>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  type="date"
                  stack-label
                  label="Data pátio"
                  v-model="novoTrecho.parkCarDate"
                ></q-input>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  type="date"
                  stack-label
                  label="Previsão de embarque"
                  v-model="novoTrecho.shippingDate"
                ></q-input>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  stack-label
                  label="Dias úteis decorridos (pátio)"
                  v-model="novoTrecho.elapsedWorkingDays"
                ></q-input>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  type="date"
                  stack-label
                  label="Previsão de chegada"
                  v-model="novoTrecho.arrivalForecast"
                ></q-input>
              </div>
              <q-separator></q-separator>
              
              <div class="col-6">
                <label>Origem</label>
                <q-select
                  outlined
                  stack-label
                  label="Tipo"
                  :options="originTypeOptions"
                  v-model="novoTrecho.originType"
                ></q-select>
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  stack-label
                  label="Local"
                  :options="originLocalOptions()"
                  v-model="novoTrecho.originLocal"
                ></q-select>
              </div>
              <q-separator></q-separator>
              
              <div class="col-6">
                <label> Destino</label>
                <q-select
                  outlined
                  stack-label
                  label="Tipo"
                  :options="destinationTypeOptions"
                  v-model="novoTrecho.destinationType"
                ></q-select>
              </div>
              <div class="col-6">
                <q-select
                  outlined
                  stack-label
                  label="Local"
                  :options="destinationLocalOptions()"
                  v-model="novoTrecho.destinationLocal"
                ></q-select>
              </div>
              <q-separator></q-separator>
             <div class="row col-12">
              <div class="col-3">
                <label>Cobrança de base de entrega?</label>
                <q-radio
                  outlined
                  stack-label
                  label="Sim"
                  v-model="novoTrecho.deliveryBaseTax"
                  :val="true"
                ></q-radio>
                <q-radio
                  outlined
                  stack-label
                  label="Não"
                  v-model="novoTrecho.deliveryBaseTax"
                  :val="false"
                ></q-radio>
              </div>
              <div class="col-3">
                <q-input
                  v-if="novoTrecho.deliveryBaseTax"
                  outlined
                  stack-label
                  label="Valor"
                  v-model="novoTrecho.deliveryBaseTaxValue"
                ></q-input>
              </div>
             </div>
             <div class="col-6">
              <q-input
                outlined
                stack-label
                label="Valor do frete vendido"
                v-model="novoTrecho.taxSoldValue"
              ></q-input>
             </div>
             <div class="col-6">
              <q-input
                outlined
                stack-label
                label="Valor negociado"
                v-model="novoTrecho.dealedValue"
              ></q-input>
             </div>
             <div class="col-6 q-gutter-x-md">
              <q-btn
                color="positive"
                label="Salvar"
                type="submit"
              ></q-btn>
              <q-btn
                color="negative"
                label="Cancelar"
                type="reset"
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
        novoTrecho: {
          status: null,
          carParkDate: null,
          shippingDate: null,
          elapsedWorkingDays: null,
          arrivalForecast: null,
          originType: null,
          originLocal: null,
          destinationType: null,
          destinationLocal: null,
          provider: null,
          deliveryBaseTaxValue: null,
          taxSoldValue: null,
          dealedValue: null,
        },
        address: null,
        locator: null,
        releaseCar: null,
        balance: null,
        deliveryBaseTax: null,
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
            name: 'DataPatio',
            label: 'Data Pátio',
            align: 'center',
            field: row => row.dataPatio,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoEmbarque',
            label: 'Previsão Embarque',
            align: 'center',
            field: row => row.previsaoEmbarque,
            format: val => `${val}`,
          },
          {
            name: 'DiasUteisDecorridos',
            label: 'Dias úteis decorridos',
            align: 'center',
            field: row => row.diasUteisDecorridos,
            format: val => `${val}`,
          },
          {
            name: 'PrevisaoChegada',
            label: 'Previsão chegada',
            align: 'center',
            field: row => row.previsaoChegada,
            format: val => `${val}`,
          },
          {
            name: 'OrigemTipo',
            label: 'Origem Tipo',
            align: 'center',
            field: row => row.origemTipo,
            format: val => `${val}`,
          },
          {
            name: 'OrigemLocal',
            label: 'Origem Local',
            align: 'center',
            field: row => row.origemLocal,
            format: val => `${val}`,
          },
          {
            name: 'DestinoTipo',
            label: 'Destino Tipo',
            align: 'center',
            field: row => row.destinoTipo,
            format: val => `${val}`,
          },
          {
            name: 'DestinoLocal',
            label: 'Destino Local',
            align: 'center',
            field: row => row.destinoLocal,
            format: val => `${val}`,
          },
          {
            name: 'Fornecedor',
            label: 'Fornecedor',
            align: 'left',
            field: row => row.fornecedor,
            format: val => `${val}`,
          },
          {
            name: 'PrazoContrato',
            label: 'Prazo Contrato',
            align: 'left',
            field: row => row.prazoContrato,
            format: val => `${val}`,
          },
          {
            name: 'CobrancaBaseEntrega',
            label: 'Cobrança Base de Entrega',
            align: 'center',
            field: row => row.cobrancaBaseEntrega,
            format: val => `${val}`,
          },
          {
            name: 'ValorFreteVendido',
            label: 'Valor Frete Vendido',
            align: 'right',
            field: row => row.valorFreteVendido,
            format: val => `${val}`,
          },
          {
            name: 'ValorFreteNegociado',
            label: 'Valor Frete Negociado',
            align: 'right',
            field: row => row.valorFreteNegociado,
            format: val => `${val}`,
          },
          {
            name: 'DataProvisaoPagamento',
            label: 'Data Provisão Pagamento',
            align: 'right',
            field: row => row.dataProvisaoPagamento,
            format: val => `${val}`,
          },
          {
            name: 'PagamentoRealizado',
            label: 'Pagamento Realizado?',
            align: 'right',
            field: row => row.pagamentoRealizado,
            format: val => `${val}`,
          },
          {
            name: 'Saldo',
            label: 'Saldo',
            align: 'right',
            field: row => row.saldo,
            format: val => `${val}`,
          },
        ],
      }
    },

    methods: {
      onSubmit() {
        console.log(this.novoTrecho)
        this.data.push({
          status: this.novoTrecho.status,
          dataPatio: this.novoTrecho.parkCarDate,
          previsaoEmbarque: this.novoTrecho.shippingDate,
          diasUteisDecorridos: this.novoTrecho.elapsedWorkingDays,
          previsaoChegada: this.novoTrecho.arrivalForecast,
          origemTipo: this.novoTrecho.originTipo,
          origemLocal: this.novoTrecho.originLocal,
          destinoTipo: this.novoTrecho.destinoTipo,
          destinoLocal: this.novoTrecho.destinoLocal,
          fornecedor: this.novoTrecho.provider,
          cobrancaBaseEntrega: this.novoTrecho.deliveryBaseTaxValue,
          valorFreteVendido: this.novoTrecho.taxSoldValue,
          valorFreteNegociado: this.novoTrecho.dealedValue,
          prazoContrato: "", // + 5 dias
          saldo: (this.novoTrecho.taxSoldValue - this.novoTrecho.dealedValue),

        })
        this.onReset();
      },
      onReset() {
        this.novoTrecho.status = null;
        this.novoTrecho.parkCarDate = null;
        this.novoTrecho.shippingDate = null;
        this.novoTrecho.elapsedWorkingDays = null;
        this.novoTrecho.arrivalForecast = null;
        this.novoTrecho.originTipo = null;
        this.novoTrecho.originLocal = null;
        this.novoTrecho.destinoTipo = null;
        this.novoTrecho.destinoLocal = null;
        this.novoTrecho.provider = null;
        this.novoTrecho.deliveryBaseTaxValue = null;
        this.novoTrecho.taxSoldValue = null;
        this.novoTrecho.dealedValue = null;
        this.novoTrecho.prazoContrato = null;

        this.deliveryBaseTax = null;
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
    }
  }
  </script>
  
  <style>
  .bt-edit {
    margin-right: 15px;
  }
  </style>
  