// This is just an example,
// so you can safely delete all default props below

export default {
  contracts: {
    title       : 'Contratos',
    new_contract: 'Novo contrato',
    search_by   : 'Buscar por',
    status      : 'Status',
    all         : 'Todos',
    statuses    : {
      'Draft'             : 'Proposta',
      'Waiting approval'  : 'Aguardando aprovação',
      'Active'            : 'Ativo',
      'Canceled'          : 'Cancelado',
      'Amended'           : 'Alterado',
      'Waiting signatures': 'Aguardando assinaturas',
    },
    columns     : {
      'id'         : 'ID',
      'contratante': 'Contratante',
      'data_inicio': 'Data inicio',
      'data_fim'   : 'Data fim',
      'status'     : 'Status',
    },
    errors     : {
      'no_company' : 'Faltou selecionar a empresa',
    },
  }
}
