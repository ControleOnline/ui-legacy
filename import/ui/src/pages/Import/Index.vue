<template>
    <CarrierImports :api="API" />
</template>

<script>
import CarrierImports from '../../components/Import/ImportsList';
import Api from '@controleonline/quasar-common-ui/src/utils/api';
export default {
    components: {
        Api,
        CarrierImports
    },
    data() {
        return {
            API: new Api(this.$store.getters['auth/user'].token),
        }
    },
}
</script>