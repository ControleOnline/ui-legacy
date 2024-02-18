<template>
    <q-page padding>
        <div class="row">
            <div v-for="month in months" :key="month.name" class="col-3 q-mb-md q-pa-sm">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">{{ month.name }}</div>
                    </q-card-section>
                    <q-card-section>
                        <q-list bordered>
                            <q-item-label header>Receitas (Agrupadas por Cagtegoria) <q-btn class="btn-primary" label="Detalhes" @click="showDetails(month)" /></q-item-label>
                            
                            <q-item v-for="income in month.incomes" :key="income.description">
                                <q-item-section>{{ income.description }} (Isso é a categoria): {{ income.amount
                                }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <q-card-section>
                        <q-list bordered>
                            <q-item-label header>Despesas (Agrupadas por Cagtegoria) <q-btn  class="btn-primary" label="Detalhes" @click="showDetails(month)" /></q-item-label>
                            <q-item v-for="expense in month.expenses" :key="expense.description">
                                <q-item-section>{{ expense.description }} (Isso é a categoria): {{ expense.amount
                                }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <q-card-section>
                        <div>Total de Despesas: {{ month.totalExpenses }}</div>
                        <div>Total de Receitas: {{ month.totalIncome }}</div>
                        <div>Saldo: {{ month.balance }}</div>
                    </q-card-section>

                </q-card>
            </div>
        </div>

        <q-dialog v-model="modalVisible">
            <q-card>
                <q-card-section>
                    <div class="text-h6">{{ selectedMonth.name }}</div>
                </q-card-section>
                <q-card-section>
                    <!-- Conteúdo do modal com detalhes do mês selecionado -->
                    <div>Total de Despesas: {{ selectedMonth.totalExpenses }}</div>
                    <!-- Outros detalhes aqui -->
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>
  
<script>
export default {
    name: 'FinancePage',
    data() {
        return {
            modalVisible: false,
            selectedMonth: null,
            months: [
                {
                    name: 'Janeiro',
                    totalExpenses: 'R$15.780,64',
                    totalIncome: 'R$15.040,00',
                    balance: 'R$-740,64',
                    expenses: [
                        { description: 'Aluguel', amount: 'R$1.000,00' },
                        { description: 'Supermercado', amount: 'R$500,00' }
                        // Adicione outras despesas aqui
                    ],
                    incomes: [
                        { description: 'Salário', amount: 'R$3.000,00' },
                        { description: 'Freelance', amount: 'R$2.000,00' }
                        // Adicione outras receitas aqui
                    ]
                },
                {
                    name: 'Fevereiro',
                    totalExpenses: 'R$15.780,64',
                    totalIncome: 'R$15.040,00',
                    balance: 'R$-740,64',
                    expenses: [
                        { description: 'Aluguel', amount: 'R$1.000,00' },
                        { description: 'Supermercado', amount: 'R$500,00' }
                        // Adicione outras despesas aqui
                    ],
                    incomes: [
                        { description: 'Salário', amount: 'R$3.000,00' },
                        { description: 'Freelance', amount: 'R$2.000,00' }
                        // Adicione outras receitas aqui
                    ]
                },
            ]
        }

    },
    methods: {
        showDetails(month) {
            this.selectedMonth = month;
            this.modalVisible = true;
        }
    }

}

</script>
  