export const routes = [{
  path: '/auditoria/',
  component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'AuditFiscalIndex',
      path: 'fiscal',
      component: () =>  import ('../pages/Audit/Fiscal/IndexNovo.vue'),
    },
    {
      name: 'AuditFiscalCreate',
      path: 'fiscal/create',
      component: () =>  import ('../pages/Audit/Fiscal/Edit.vue'),
    },
    {
      name: 'AuditFiscalDetails',
      path: 'fiscal/id/:id',
      component: () =>  import ('../pages/Audit/Fiscal/Edit.vue'),
    },
    {
      name: 'AuditFiscalHistorico',
      path: 'fiscal/:id/historico',
      component: () =>  import ('../pages/Audit/Fiscal/Historico.vue'),
    },
    {
      name: 'AuditContabilIndex',
      path: 'contabil',
      component: () =>  import ('../pages/Audit/Contabil/Index.vue'),
    },
    {
      name: 'AuditContabilDetails',
      path: 'contabil/:id',
      component: () =>  import ('../pages/Audit/Contabil/Details.vue'),
    },
    {
      name: 'AuditContabilHistorico',
      path: 'contabil/:id/historico',
      component: () =>  import ('../pages/Audit/Contabil/Historico.vue'),
    },
    {
      name: 'AuditDeptoPessoalIndex',
      path: 'depto-pessoal',
      component: () =>  import ('../pages/Audit/Depto/Index.vue'),
    },
    {
      name: 'AuditDeptoPessoalDetails',
      path: 'depto-pessoal/:id',
      component: () =>  import ('../pages/Audit/Depto/Details.vue'),
    },
    {
      name: 'AuditDeptoPessoalHistorico',
      path: 'depto-pessoal/:id/historico',
      component: () =>  import ('../pages/Audit/Depto/Historico.vue'),
    },
    {
      name: 'AuditSocietarioIndex',
      path: 'societario',
      component: () =>  import ('../pages/Audit/Societario/Index.vue'),
    },
    {
      name: 'AuditSocietarioDetails',
      path: 'societario/:id',
      component: () =>  import ('../pages/Audit/Societario/Details.vue'),
    },
    {
      name: 'AuditSocietarioHistorico',
      path: 'societario/:id/historico',
      component: () =>  import ('../pages/Audit/Societario/Historico.vue'),
    },
    {
      name: 'AuditSocietarioMessages',
      path: 'societario/:id/mensagens',
      component: () =>  import ('../pages/Audit/Societario/Mensagens.vue'),
    },
  ]
},
{
  path: '/fiscal/',
  component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'FiscalImpostoIndex',
      path: 'impostos',
      component: () =>  import ('../pages/Fiscal/Impostos/Index.vue'),
    },
    {
      name: 'FiscalImpostoCreate',
      path: 'impostos/novo',
      component: () =>  import ('../pages/Fiscal/Impostos/Create.vue')
    },
    {
      name: 'FiscalImpostoEdit',
      path: 'impostos/:id/editar',
      component: () =>  import ('../pages/Fiscal/Impostos/Edit.vue')
    },
    {
      name: 'FiscalDeclaracaoIndex',
      path: 'declaracoes',
      component: () =>  import ('../pages/Fiscal/Declaracoes/Index.vue'),
    },
    {
      name: 'FiscalDeclaracaoCreate',
      path: 'declaracoes/novo',
      component: () =>  import ('../pages/Fiscal/Declaracoes/Create.vue')
    },
    {
      name: 'FiscalDeclaracaoEdit',
      path: 'declaracoes/:id/editar',
      component: () =>  import ('../pages/Fiscal/Declaracoes/Edit.vue')
    },
    {
      name: 'FiscalServicosAdicionaisIndex',
      path: 'servicos-adicionais',
      component: () =>  import ('../pages/Fiscal/Servicos/Index.vue'),
    },
  ]
},
{
  path: '/contabil/',
  component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'ContabilExtratosIndex',
      path: 'extratos',
      component: () =>  import ('../pages/Contabil/Extratos/Index.vue'),
    },
    {
      name: 'ContabilDeclaracaoIndex',
      path: 'declaracoes',
      component: () =>  import ('../pages/Contabil/Declaracoes/Index.vue'),
    },
    {
      name: 'ContabilDeclaracaoCreate',
      path: 'declaracoes/novo',
      component: () =>  import ('../pages/Contabil/Declaracoes/Create.vue')
    },
    {
      name: 'ContabilDeclaracaoEdit',
      path: 'declaracoes/:id/editar',
      component: () =>  import ('../pages/Contabil/Declaracoes/Edit.vue')
    },
    {
      name: 'ContabilServicosAdicionaisIndex',
      path: 'servicos-adicionais',
      component: () =>  import ('../pages/Contabil/Servicos/Index.vue'),
    },
    {
      name: 'ContabilAdministrativoIndex',
      path: 'administrativo',
      component: () =>  import ('../pages/Contabil/Administrativo/Index.vue'),
    },
    {
      name: 'ContabilAdministrativoCreate',
      path: 'administrativo/novo',
      component: () =>  import ('../pages/Contabil/Administrativo/Create.vue')
    },
  ]
},
{
  path: '/depto-pessoal/',
  component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'DeptoImpostoIndex',
      path: 'impostos',
      component: () =>  import ('../pages/Depto/Impostos/Index.vue'),
    },
    {
      name: 'DeptoImpostoCreate',
      path: 'impostos/novo',
      component: () =>  import ('../pages/Depto/Impostos/Create.vue')
    },
    {
      name: 'DeptoImpostoEdit',
      path: 'impostos/:id/editar',
      component: () =>  import ('../pages/Depto/Impostos/Edit.vue')
    },
    {
      name: 'DeptoDeclaracaoIndex',
      path: 'declaracoes',
      component: () =>  import ('../pages/Depto/Declaracoes/Index.vue'),
    },
    {
      name: 'DeptoDeclaracaoCreate',
      path: 'declaracoes/novo',
      component: () =>  import ('../pages/Depto/Declaracoes/Create.vue')
    },
    {
      name: 'DeptoDeclaracaoEdit',
      path: 'declaracoes/:id/editar',
      component: () =>  import ('../pages/Depto/Declaracoes/Edit.vue')
    },
    {
      name: 'DeptoFolhaPagamentoIndex',
      path: 'folhas-pagamento',
      component: () =>  import ('../pages/Depto/Folhas/Index.vue'),
    },
    {
      name: 'DeptoFolhaPagamentoCreate',
      path: 'folhas-pagamento/novo',
      component: () =>  import ('../pages/Depto/Folhas/Create.vue')
    },
    {
      name: 'DeptoFolhaPagamentoEdit',
      path: 'folhas-pagamento/:id/editar',
      component: () =>  import ('../pages/Depto/Folhas/Edit.vue')
    },
    {
      name: 'DeptoProLaboreIndex',
      path: 'pro-labore',
      component: () =>  import ('../pages/Depto/Prolabore/Index.vue'),
    },
    {
      name: 'DeptoProLaboreCreate',
      path: 'pro-labore/novo',
      component: () =>  import ('../pages/Depto/Prolabore/Create.vue')
    },
    {
      name: 'DeptoProLaboreEdit',
      path: 'pro-labore/:id/editar',
      component: () =>  import ('../pages/Depto/Prolabore/Edit.vue')
    },
    {
      name: 'DeptoFuncionariosIndex',
      path: 'funcionarios',
      component: () =>  import ('../pages/Depto/Funcionarios/Index.vue'),
    },
    {
      name: 'DeptoFuncionariosDependentes',
      path: 'funcionarios/:id/dependentes',
      component: () =>  import ('../pages/Depto/Funcionarios/Dependentes.vue')
    },
    {
      name: 'DeptoFuncionariosFolhas',
      path: 'funcionarios/:id/folhas',
      component: () =>  import ('../pages/Depto/Funcionarios/Folhas.vue')
    },
    {
      name: 'DeptoSociosIndex',
      path: 'socios',
      component: () =>  import ('../pages/Depto/Socios/Index.vue'),
    },
    {
      name: 'DeptoSociosDependentes',
      path: 'socios/:id/dependentes',
      component: () =>  import ('../pages/Depto/Socios/Dependentes.vue')
    },
    {
      name: 'DeptoSociosFolhas',
      path: 'socios/:id/folhas',
      component: () =>  import ('../pages/Depto/Socios/Folhas.vue')
    },
    {
      name: 'DeptoAdministrativoIndex',
      path: 'administrativo',
      component: () =>  import ('../pages/Depto/Administrativo/Index.vue'),
    },
    {
      name: 'DeptoAdministrativoCreate',
      path: 'administrativo/novo',
      component: () =>  import ('../pages/Depto/Administrativo/Create.vue')
    },
    {
      name: 'DeptoServicosAdicionaisIndex',
      path: 'servicos-adicionais',
      component: () =>  import ('../pages/Depto/Servicos/Index.vue'),
    },
  ]
},
{
  path: '/societario/',
  component: () =>  import ('@controleonline/ui-layout/src/layouts/AdminLayout.vue'),
  children: [
    {
      name: 'SocietarioIndex',
      path: '',
      component: () =>  import ('../pages/Societario/Index.vue'),
    },
    {
      name: 'SocietarioMessages',
      path: ':id/mensagens',
      component: () =>  import ('../pages/Societario/Mensagens.vue'),
    },
  ]
},
]

export default routes
