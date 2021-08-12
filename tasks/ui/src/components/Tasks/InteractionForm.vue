<template>
    <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
        <div class="row">
            <div :class="'col-xs-12 ' + (checkIfIsVistoria() ? 'col-sm-6' : 'col-sm-12')">
                <q-uploader ref="uploader" no-thumbnails square flat
                    :headers     ="uploadHeaders"
                    :accept      ="uploadAccepted"
                    field-name   ="file"
                    color        ="white"
                    @added       ="fileAdded"
                    @removed     ="fileRemoved"
                    :multiple    ="false"
                    :class       ="myClass"
                    :auto-upload ="false"
                >
                    <template v-slot:header="scope">
                        <div class="row no-wrap items-center justify-end q-pa-sm q-gutter-xs">
                            <q-spinner v-if="scope.isUploading"
                                color="primary"
                                class="q-uploader__spinner"
                            />
                            <q-btn flat dense rounded
                                v-if  ="scope.canAddFiles"
                                type  ="a"
                                icon  ="add_box"
                                color ="primary"
                            >
                                <q-uploader-add-trigger />
                                <q-tooltip>Selecione uma imagem</q-tooltip>
                            </q-btn>
                            <q-btn v-if="scope.isUploading" round dense flat
                                icon  ="clear"
                                color ="red"
                                @click="scope.abort"
                            >
                                <q-tooltip>Cancelar upload</q-tooltip>
                            </q-btn>
                        </div>
                    </template>

                    <template v-slot:list="scope">
                        <div class="row items-center" style="min-height: 100%">
                            <div
                                v-if ="scope.files.length == 0"
                                class="text-center text-camelcase"
                                style="min-width: 100%; min-height: 100%"
                            >
                                <span class="text-bold text-uppercase">Area de upload</span>
                                <br>
                                Clique no botão "mais" ou arraste seu arquivo até esta caixa
                            </div>

                            <q-list separator
                                v-if ="scope.files.length > 0"
                                style="min-width: 100%"
                            >
                            <q-item v-for="file in scope.files" :key="file.name">
                                <q-item-section>
                                    <q-item-label class="full-width ellipsis">
                                        {{ file.name }}
                                    </q-item-label>

                                    <q-item-label caption>
                                        Status: {{ file.__status }}
                                    </q-item-label>

                                    <q-item-label caption>
                                        {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                                    </q-item-label>
                                </q-item-section>

                                <q-item-section top side>
                                    <q-btn flat dense round
                                        class ="gt-xs"
                                        size  ="12px"
                                        icon  ="clear"
                                        color ="red"
                                        @click="scope.removeFile(file)"
                                    />
                                </q-item-section>
                            </q-item>
                            </q-list>
                        </div>
                    </template>
                </q-uploader>
            </div>
            
            <div v-if="checkIfIsVistoria()" class="col-xs-12 col-sm-6">
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
        </div>
    
        <div class="row">
            <div class="col-xs-12 col-sm-12">
                <q-input stack-label lazy-rules
                    v-model    ="message"
                    type       ="textarea"
                    class      ="q-mb-sm"
                    label      ="Mensagem"
                    placeholder="Digite uma mensagem"
                    :outlined  ="true"
                />
            </div>
        </div>

        <div class="row justify-end q-mt-lg">
        <q-btn
            type     ="submit"
            color    ="primary"
            label    ="Enviar"
            :loading ="isSaving"
        />
        </div>

    </q-form>
</template>

<script>
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

export default {
    props: {
        message: {
            type    : String,
            required: true
        },
        category: {
            type    : Object,
            required: true
        }
    },

    data() {
        return {
            selectedFile  : {},
            uploadEndpoint: `${ENTRYPOINT}/`,
            uploadHeaders : [
                {
                    name : 'API-TOKEN',
                    value: this.$store.getters['auth/user'].token
                },
            ],
            uploadAccepted: 'image/*',
            isSaving: false,
            checklist: {
                item1: false,
                item2: false,
                item3: false,
                item4: false,
                item5: false,
                item6: false,
            }
        }
    },

    computed: {
        myClass() {
            return `q-upd q-upd-single w-100p`;
        }
    },

    methods: {
        checkIfIsVistoria() {
            if (this.category && this.category.name) {
                var name = this.category.name;

                if (name.toLowerCase().indexOf('vistoria') > -1) {
                    return true;
                }
            }

            return false;
        },

        fileAdded(files) {
            this.selectedFile = files[0];
        },

        fileRemoved() {
            this.selectedFile = {};
        },

        onSubmit() {
            this.$emmit('submit', {
                message: this.message,
            });
        }
    }

}

</script>

<style scoped>
    .w-100p {
        width: 100%;   
    }
    .q-upd {
        border: #c9c9c9 solid 1px;
        border-radius: 10px !important;
        margin: 10px auto;
    }
</style>