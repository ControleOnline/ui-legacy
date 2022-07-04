<template>
    <q-card>
        <q-card-actions class="row">
            <div class="col-12">
                <div>
                    <q-input v-model="body" type="textarea" :loading="isSaving">
                        <template v-slot:append>
                            <q-btn round flat @click="sendAttachment">
                                <q-icon name="attachment" />
                            </q-btn>
                            <q-btn round flat @click="sendInteraction(body)">
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
                    <InteractionForm v-model="body" :isSaving="isSaving" @submit="onSubmit" />
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
        isSaving: {
            type: Boolean,
            required: false,
            default: false
        },
        visibility: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            dialog: false,
            body: ''
        };
    },

    methods: {
        sendAttachment() {
            this.dialog = true;
        },
        sendInteraction(body, details) {
            if (body && body.length) {
                var data = {};

                if (details) {
                    data = details;
                }

                data.body = body;
                data.visibility = this.visibility;
                this.$emit('newInteraction', data);

                this.body = '';
            }
        },
        onSubmit(data) {
            this.sendInteraction(data.body, data);
            this.dialog = false;
        }
    }
}
</script>

<style>
.radio-inline {
    text-align: center;
}

.radio-inline .q-radio {
    display: inline-block;
    margin: 0px 15px;
}
</style>