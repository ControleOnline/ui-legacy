<template>
  <div class="row">

    <div class="col-12" v-for="interaction of interactions" :key="interaction.id">
        <q-card
            :style="interaction.type === 'request' ? 'background-color: #e5e5e5' : (interaction.type === 'response' ? 'background-color: #cbe1e6' : '')"
        >
            <q-card-section>
                <div>
                    <strong>{{ interaction.registeredBy.alias }}</strong>
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
                    style="max-height: 400px; max-width: 80%;" 
                    :src="interaction.file.url"
                />
            </q-card-section>
            <q-card-section v-if="interaction.type === 'comment' || interaction.type === 'response'">
                {{ interaction.body.message }}
            </q-card-section>
            <q-card-actions v-if="interaction.type === 'response'" align="around">
                <q-btn flat>
                    <q-icon name="thumb_up" /> Aprovado
                </q-btn>
                <q-btn flat>
                    <q-icon name="thumb_down" /> Reprovado
                </q-btn>
            </q-card-actions>
        </q-card>
    </div>
  </div>
</template>

<script>
import Api                    from '@freteclick/quasar-common-ui/src/utils/api';
import { formatDateYmdTodmY } from '@freteclick/quasar-common-ui/src/utils/formatter';
import FormTaskInteraction    from './FormTaskInteraction.vue';
import { ENTRYPOINT }         from '../../../../../../src/config/entrypoint';

export default {

    components: {
        FormTaskInteraction
    },

    props: {
        api: {
            type    : Api,
            required: true
        },
        id: {
            type    : Number,
            required: true
        }
    },

    data() {
        return {
            dialog      : false,
            isLoading   : true,
            interactions: [
                {
                    id: 3,
                    type: 'response',
                    body: {
                        responseFrom: 2,
                        message: "Essa é a foto do carro fiat Uno",
                        status: "em análise"
                    },
                    registeredBy: {
                        id   : 0,
                        name : "Guilherme",
                        alias: "Guilherme"
                    },
                    file: {
                        id: 12,
                        url: '../../../../../../src/assets/fiat uno.jpg'
                    },
                    createdAt: "2021-08-02"
                },
                {
                    id  : 2,
                    type: 'request',
                    body: {
                        title: "Foto do carro",
                        message: "Envie uma foto do carro"
                    },
                    registeredBy: {
                        id   : 0,
                        name : "Foccus Cegonhas",
                        alias: "Foccus Cegonhas"
                    },
                    createdAt: "2021-08-02"
                },
                {
                    id  : 1,
                    type: 'comment',
                    body: {
                        message: "Outro comentário sobre essa tarefa"
                    },
                    registeredBy: {
                        id   : 0,
                        name : "Anderson",
                        alias: "Anderson"
                    },
                    createdAt: "2021-08-01"
                },
                {
                    id  : 0,
                    type: 'comment',
                    body: {
                        message: "Comentário número 1 sobre essa tarefa"
                    },
                    registeredBy: {
                        id   : 0,
                        name : "Guilherme",
                        alias: "Guilherme"
                    },
                    createdAt: "2021-08-01"
                }
            ]
        }
    },

    created() {
        console.log(ENTRYPOINT);
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
                    console.log(data);
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
        getInteractionDate(interaction) {
            return formatDateYmdTodmY(interaction.createdAt);
        },
        getInteractionById(id) {
            return this.interactions.find(interaction => interaction.id === id);
        }
    }
}

</script>