import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  isLoading: false,
  error: "",
  violations: null,
  totalItems: 0,
  filters: persistentFilter.getFilters(),
  state: {
    resourceEndpoint: "order_logistics",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
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
        classes: "hidden",
        headerClasses: "hidden",
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
  },
  actions: actions,
  getters,
  mutations,
};
