// This is just an example,
// so you can safely delete all default props below

export const translate = {
  order: {
    warning: {
      rural: 'Pedido sujeito a cobrança de taxas adicionais devido a possibilidade de classificação como ÁREA RURAL pelo transportador',
      dificult: 'Pedido sujeito a cobrança de taxas adicionais devido a possibilidade de classificação como DIFICIL ACESSO pelo transportador',
    },
    inMyCompany: 'Em minha Empresa',
    inOtherPlace: 'Em outro Local',
    inOtherPlaceDelivery: 'Em outro Local',
    statuses: {
      'quote': 'Cotação',
      'waiting client invoice tax': 'Aguardando nota fiscal',
      'automatic analysis': 'Análise automática',
      'analysis': 'Em análise',
      'waiting payment': 'Aguardando pagamento',
      'waiting retrieve': 'Aguardando coleta',
      'on the way': 'Em viagem',
      'waiting invoice tax': 'Aguardando fatura',
      'delivered': 'Entregue',
      'waiting billing': 'Gerando NF',
      'canceled': 'Cancelado',
      'waiting commission': 'Aguardando comissão',
      'ship to carrier': 'Entregar na transportadora',
      'retrieved': 'Coletado',
      'entered the base': "Entrou na Base",
      'boarded': "Embarcou",
      'expired': "Expirado",
      'pending': "Aguardando Documentação"
    },
  },
  logistic:{
    statuses: {
      'open' : 'Aberto',
      'waiting' : 'Aguardando',
      'released to base' : 'Liberado para base',
      'waiting client' : 'Aguardando cliente',
      'parking' : 'Pátio',
      'waiting for withdrawal' : 'Aguardando retirada',
      'in transit' : 'Em trânsito',
      'collection pending' : 'Pendente de coleta',
      'boarding pending' : 'Pendente de embarque',
      're-embark' : 'Reembarque',
      'withdrawn' : 'Retirado',
    },
    types: {
      'b' : 'Base',
      'c' : 'Coleta',
    }
  }
}
