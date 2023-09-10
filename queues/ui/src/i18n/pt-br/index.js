// This is just an example,
// so you can safely delete all default props below

export const translate = {
  people: 'Pessoa',
  queue: {
    queue: 'Fila',
    queuePeople: 'Fila pessoa',
    status: {
      open: 'Aberto',
      waiting: 'Aguardando',
      attendance: 'Em atendimento',
      attended: 'Atendido',
    },
    priority: {
      Default: 'Padrão',
      Priority: 'Prioridade',
      Emergency: 'Emergência',
    },
  },
  hardware: {
    hardware: 'Dispostivo',
  },
  displayType:{
    delivery: 'Delivery',
    production: 'Produção',
    display: 'Chamada'
  },

  displays:{
    id:'ID',
  display:'Nome',
  displayType:'Tipo',
  company:'Empresa'
  },
  display:{
    types:{
        display: 'Display de Chamada',
        production: 'Display de Preparação',
        delivery: 'Display de Entrega'
      },
      messages:{
        display: 'Para acompanhamento do cliente',
        production: 'Para a produção dos itens do pedido',
        delivery: 'Para entrega de pedidos'
      }
  }
}
