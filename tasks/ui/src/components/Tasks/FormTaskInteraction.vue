<template>
    <q-card>
        <q-card-actions>
            <div class="row" style="width: 100%">
                <div class="col-4">
                    <div class="radio-inline">
                        <q-checkbox left-label v-model="checklist.item1" label="Stepe" />
                        <q-checkbox left-label v-model="checklist.item2" label="Extintor" />
                        <q-checkbox left-label v-model="checklist.item3" label="Tapete" />
                    </div>
                    <div class="radio-inline">
                        <q-checkbox left-label v-model="checklist.item4" label="Pneu" />
                        <q-checkbox left-label v-model="checklist.item5" label="Calota" />
                        <q-checkbox left-label v-model="checklist.item6" label="Banco" />
                    </div>
                </div>
                <div class="col-8">
                    <q-input 
                        v-model="message"
                        style="width: 100%"
                        type="textarea"
                    >
                        <template v-slot:append>
                            <q-btn round flat @click="sendInteraction">
                                <q-icon name="send" />
                            </q-btn>
                        </template>
                    </q-input>
                </div>
            </div>
        </q-card-actions>
    </q-card>
</template>

<script>

export default {
    data() {
        return {
            message: '',
            checklist: {
                item1: false,
                item2: false,
                item3: false,
                item4: false,
                item5: false,
                item6: false,
            }
        };
    },

    methods: {
        sendInteraction() {
          this.$emit('newInteraction', this.message);
          this.message = '';
        }
    }
}
</script>

<style>
.radio-inline{
    text-align: center;
}
.radio-inline .q-radio{
    display: inline-block;
    margin: 0px 15px;
}
</style>