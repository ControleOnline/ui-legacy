<template>
  <div class="row">

    <div class="col-12" v-for="interaction of interactions" :key="interaction.id">
        <q-card :style="isMyInteraction(interaction) ? 'background: #e9e9e9' : ''">
            <q-card-section>
                <div>
                    <strong>{{ interaction.registeredBy.alias || interaction.registeredBy.name }}</strong>
                    <small> | em {{ getInteractionDate(interaction) }}</small>    
                </div>
                <h5 v-if="interaction.type === 'response'">
                    Em resposta a  <strong>{{ getInteractionById(interaction.body.responseFrom).registeredBy.alias }}</strong>
                    <small> | {{ getInteractionById(interaction.body.responseFrom).body.title }}</small>
                </h5>
                <h5 v-if="interaction.type === 'request'">{{ interaction.body.title }}</h5>
                <div v-if="interaction.type === 'request'">{{ interaction.body.message }}</div>
            </q-card-section>
            <q-card-section v-if="interaction.file">
                <img
                    style="max-height: 200px; max-width: 80%;" 
                    :src="interaction.file.url"
                />
            </q-card-section>
            <q-card-section v-if="interaction.type === 'comment' || interaction.type === 'response'">
                {{ interaction.body.message }}
            </q-card-section>
        </q-card>
    </div>

    <div class="col-12">
        <FormTaskInteraction 
            :isLoading     ="isLoading"
            :category      ="taskData.taskCategory"
            :isSaving      ="isSaving"
            @newInteraction="onNewInteractionAdded"
        />
    </div>
  </div>
</template>

<script>
import Api                    from '@freteclick/quasar-common-ui/src/utils/api';
import { formatDateYmdTodmY } from '@freteclick/quasar-common-ui/src/utils/formatter';
import FormTaskInteraction    from './FormTaskInteraction.vue';
import { ENTRYPOINT }         from '../../../../../../src/config/entrypoint';
import { mapGetters }         from 'vuex';

export default {

    components: {
        FormTaskInteraction
    },

    props: {
        api: {
            type    : Api,
            required: true
        },
        taskData: {
            type    : Object,
            required: true
        },
        id: {
            type    : Number,
            required: true
        }
    },

    data() {
        return {
            isLoading   : true,
            interactions: [],
            isSaving    : false
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
                task: this.id
            };

            this.isLoading = true;

            return this.api.private(`task_interations`, { params })
                .then(response => response.json())
                .then(data => {
                    if (data['hydra:member'] && data['hydra:member'].length) {
                        var items = data['hydra:member'];

                        for(var key in items) {
                            if (items[key]) {
                                var item = items[key];

                                if (item.body) {
                                    item.body = JSON.parse(item.body);
                                }

                                if (item.file) {
                                    item.file.url = ENTRYPOINT + item.file.url;
                                }

                                items[key] = item;
                            }
                        }

                        this.interactions = items;
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
                id: this.interactions.length + 2,
                type: 'comment',
                body: {
                    message: data.message
                },
                registeredBy: {
                    id   : this.user.people,
                    alias: this.user.realname,
                    name : this.user.realname,
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

            return this.api.private('/task_interations/task/' + this.id, options)
                .then(response => response.json())
                .then(result => {
                    return result;
                });

        },

        getInteractionDate(interaction) {
            return formatDateYmdTodmY(interaction.createdAt);
        },
        getInteractionById(id) {
            return this.interactions.find(interaction => interaction.id === id);
        },
        isMyInteraction(interaction) {
            return interaction.registeredBy.id == this.user.people;
        }
    }
}

</script>