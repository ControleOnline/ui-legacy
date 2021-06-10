// This is just an example,
// so you can safely delete all default props below

export default {
  contracts: {
    title       : 'Contratos',
    new_contract: 'Novo contrato',
    search_by   : 'Buscar por',
    search_phold: 'Data inicio ou nome participante',
    status      : 'Status',
    all         : 'Todos',
    model       : 'Template',
    start_date  : 'Data de inicio',
    save        : 'Salvar',
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
  },
  messages: {
    saved_successfully: 'Dados salvos com sucesso',
    select_an_option  : 'Selecione uma opção',
    field_required    : 'Este campo é obrigatório',
    email_invalid     : 'O email informado não é válido',
    value_invalid     : 'O valor informado não é válido',
  }
}
