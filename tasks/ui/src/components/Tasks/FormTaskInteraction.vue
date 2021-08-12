<template>
    <q-card>
        <q-card-actions>
            <div class="row" style="width: 100%">
                <div class="col-12">
                    <q-input 
                        v-model="message"
                        style="width: 100%"
                        type="textarea"
                    >
                        <template v-slot:append>
                            <q-btn round flat @click="sendAttachment">
                                <q-icon name="attachment" />
                            </q-btn>
                            <q-btn round flat @click="sendInteraction">
                                <q-icon name="send" />
                            </q-btn>
                        </template>
                    </q-input>
                </div>
            </div>
        </q-card-actions>
      
        <q-dialog v-model="dialog">
            <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section class="row items-center">
                <div class="text-h6">{{ $t('tasks.newInteraction') }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
                <InteractionForm 
                    :message ="message"
                    :category="category"
                />
            </q-card-section>
            </q-card>
        </q-dialog>
    </q-card>
</template>

<script>
import InteractionForm from "./InteractionForm.vue";

export default {
    components: {
        InteractionForm
    },
    
    props: {
        category: {
            type    : Object,
            required: true
        }
    },

    data() {
        return {
            dialog : false,
            message: ''
        };
    },

    methods: {
        sendAttachment() {
            this.dialog = true;
        },
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