<template>
    <div class="row">
        <q-tabs v-model="currentTab" align="justify" class="text-primary col-xs-12 col-md-3" dense no-caps>
            <q-tab name="public" :label="$t(taskData.type + '.public')" />
            <q-tab name="private" :label="$t(taskData.type + '.private')" />
        </q-tabs>
        <q-tab-panels v-model="currentTab" class="col-12 bg-transparent">
            <q-tab-panel class="row q-px-none" name="public">
                <div class="col-12 q-mb-md" v-for="interaction of interactions_public" :key="interaction.id">
                    <q-card :class="'no-shadow public-interaction' + (isMyInteraction(interaction) ? '-my' : '')">
                        <q-card-section>
                            <div class="flex items-center q-gutter-x-sm">
                                <p class="text-bold">{{ interaction.registeredBy.alias || interaction.registeredBy.name
                                }}</p>
                                <p>-</p>
                                <p>em {{ getInteractionDate(interaction) }}</p>
                            </div>
                        </q-card-section>
                        <q-card-section v-if="interaction.file">
                            <img style="max-height: 200px; max-width: 80%;" :src="interaction.file.url" />
                        </q-card-section>
                        <q-card-section v-if="interaction.type === 'comment'">
                            <div class="row">
                                <div class="col-12">
                                    {{ interaction.body }}
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-12 q-px-sm">
                    <FormTaskInteraction :isLoading="isLoading" :visibility="'public'" :isSaving="isSaving"
                        @newInteraction="onNewInteractionAdded" />
                </div>
            </q-tab-panel>
            <q-tab-panel class="row q-px-none" name="private">
                <div class="col-12 q-mb-md" v-for="interaction of interactions_private" :key="interaction.id">
                    <q-card :class="'no-shadow private-interaction' + (isMyInteraction(interaction) ? '-my' : '')">
                        <q-card-section>
                            <div class="flex items-center q-gutter-x-sm">
                                <p class="text-bold">{{ interaction.registeredBy.alias || interaction.registeredBy.name
                                }}
                                </p>
                                <p>-</p>
                                <p>em {{ getInteractionDate(interaction) }}</p>
                            </div>
                        </q-card-section>
                        <q-card-section v-if="interaction.file">
                            <img style="max-height: 200px; max-width: 80%;" :src="interaction.file.url" />
                        </q-card-section>
                        <q-card-section v-if="interaction.type === 'comment'">
                            <div class="row">
                                <div class="col-12">
                                    {{ interaction.body }}
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="col-12">
                    <FormTaskInteraction :isLoading="isLoading" :visibility="'private'" :isSaving="isSaving"
                        @newInteraction="onNewInteractionAdded" />
                </div>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import { formatDateYmdTodmY } from '@controleonline/quasar-common-ui/src/utils/formatter';
import FormTaskInteraction from './FormTaskInteraction.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';
import { mapGetters } from 'vuex';

export default {

    components: {
        FormTaskInteraction
    },

    props: {
        api: {
            type: Api,
            required: true
        },
        taskData: {
            type: Object,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            currentTab: 'private',
            isLoading: true,
            interactions_public: [],
            interactions_private: [],
            isSaving: false
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },

    created() {
        this.getInterations();
    },

    methods: {
        getInterations() {
            var params = {
                task: this.id,
                visibility: this.currentTab
            };

            this.isLoading = true;

            return api.fetch(`task_interations`, { params })
                
                .then(data => {
                    if (data['hydra:member'] && data['hydra:member'].length) {
                        var items = data['hydra:member'];

                        for (var key in items) {
                            if (items[key]) {
                                var item = items[key];
                                if (item.file) {
                                    item.file.url = ENTRYPOINT + item.file.url;
                                }
                                items[key] = item;
                            }
                        }

                        this.currentTab === 'private' ? this.interactions_private = items : this.interactions_public = items;
                        this.isLoading = false;
                    }
                });
        },
        onNewInteractionAdded(data) {
            var today = new Date();

            var month = today.getMonth() + 1;

            if (month < 10) {
                month + "0" + month;
            }
            var day = today.getDate();

            if (day < 10) {
                day + "0" + day;
            }

            var newItem = {
                id: this.currentTab === 'private' ? this.interactions_private.length + 2 : this.interactions_public.length + 2,
                type: 'comment',
                body: data.body,
                visibility: this.currentTab,
                registeredBy: {
                    id: this.user.people,
                    alias: this.user.realname,
                    name: this.user.realname,
                },
                createdAt: today.getFullYear() + '-' + month + '-' + day
            };

            if (data.checklist) {
                newItem.body.checklist = data.checklist;
            }

            if (data.file) {
                newItem.file = data.file;
            }

            this.isSaving = true;
            this.saveInteraction(newItem)
                .then(res => {
                    this.isSaving = false;
                    this.getInterations();
                });

        },

        saveInteraction(payload) {
            var file = payload.file;

            var data = Object.assign({}, payload);

            delete data.file;

            var options = {
                body: JSON.stringify(data),
                method: "POST"
            };

            if (file) {
                options.file = file;
            }

            return api.fetch('/task_interations/task/' + this.id, options)
                
                .then(result => {
                    return result;
                });

        },

        getInteractionDate(interaction) {
            return formatDateYmdTodmY(interaction.createdAt, true).replace(' ', ' às ');
        },
        getInteractionById(id) {
            return this.currentTab === 'private'
                ? this.interactions_private.find(interaction => interaction.id === id)
                : this.interactions_public.find(interaction => interaction.id === id);
        },
        isMyInteraction(interaction) {
            return interaction.registeredBy.id == this.user.people;
        }
    },

    watch: {
        currentTab() {
            this.getInterations();
        }
    }
}

</script>
<style scoped>
.private-interaction-my {
    background: #e9e9e9
}

.private-interaction {
    background: white
}

.public-interaction-my {
    background: #4caf5069
}

.public-interaction {
    background: #03a9f463
}
</style>