<template>
  <q-page padding>
    <contract-list
      title            ="Lista de contratos"
      :detailRoute     ="(id) => { return { name: 'ContractDetails', params: { id: id }}}"
      :retrieveContract="requestContracts"
      :createContract  ="createContract"
      @contractCreated ="onCreatedContract"
    />
  </q-page>
</template>

<script>

export default {
  methods: {
    onCreatedContract() {
      this.$q.notify({
        message : 'Contrato criado com sucesso!',
        position: 'bottom',
        type    : 'positive',
      });
    },

    requestContracts(params) {
      let result = {
        members: [],
        total  : 50
      };

      result.members.push({
        'id'          : 1,
        'beneficiario': 'Andrew da Silva Reis',
        'dataInicio'  : '2021-01-10',
        'dataFim'     : '2025-01-10',
        'status'      : 'draft',
      });

      result.members.push({
        'id'          : 2,
        'beneficiario': 'Silvia dos Santos',
        'dataInicio'  : '2021-04-10',
        'dataFim'     : '2022-04-10',
        'status'      : 'draft',
      });

      return new Promise(
        function(resolve, reject) {
          window.setTimeout(
            function() {
              resolve(result)
            },
            Math.random() * 2000 + 1000
          );
        }
      );
    },

    createContract() {
      return new Promise(
        function(resolve, reject) {
          window.setTimeout(
            function() {
              resolve({})
            },
            Math.random() * 2000 + 1000
          );
        }
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
