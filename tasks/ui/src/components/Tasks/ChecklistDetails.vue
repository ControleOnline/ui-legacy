<template>
  <div>
    <div
        v-if="generalWarningVisible"
        class="aviso_alerta">
      <q-icon name="warning" class="text-red" style="font-size: 14rem;"/>
      <q-banner dense inline-actions class="text-white bg-red q-pa-lg">
        <span
            v-html="htmlGeneralFailureWarning"
            style="font-size: 18px;">
        </span>
      </q-banner>
    </div>
    <div v-if="generalContentVisible">
      <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
        <div class="row q-pb-lg">
          <h5>Dados Principais</h5>
          <q-separator class="clear"/>
        </div>
        <div class="row">
          <q-input
              class="res_q_imp text_width_double"
              v-model="main_data_survey.customer"
              standout label="Cliente Nome"
              tabindex="-1"
              readonly
          />
          <q-input
              class="res_q_imp text_width_double"
              v-model="main_data_survey.customer_email"
              standout label="Email do Cliente"
              tabindex="-1"
              readonly
          >
            <template v-slot:prepend>
              <q-icon name="mail"/>
            </template>
          </q-input>
        </div>
        <div class="row">
          <q-input
              class="res_q_imp text_width_620px"
              v-model="main_data_survey.vehicle_name"
              standout label="Veiculo"
              tabindex="-1"
              readonly
          />
        </div>
        <div class="row">
          <q-input
              class="res_q_imp"
              v-model="main_data_survey.vehicle_plate"
              standout label="Placa"
              tabindex="-1"
              readonly
          />
          <q-input
              class="res_q_imp"
              v-model="main_data_survey.vehicle_color"
              standout label="Cor"
              tabindex="-1"
              readonly
          />
        </div>
        <div class="row">
          <q-select
              class="res_q_imp res_q_select"
              outlined
              v-model="main_data_survey.type_survey"
              :options="options_type_survey"
              label="Tipo Vistoria"
              :rules="[isInvalid('type_survey')]"
          />
          <q-input
              class="res_q_imp"
              borderless
              v-model="main_data_survey.updated_at" label="Data/Hora"
              tabindex="-1"
              readonly
          />
        </div>
        <div class="row">
          <q-input
              class="res_q_imp res_q_select"
              v-model="main_data_survey.surveyor_email"
              outlined label="E-Mail Vistoriador"
              :rules="[isInvalid('email')]"
              @blur="onBlur('surveyor_email_inp')"
              debounce="300"
              @input="surveyorEmailInputChangeValue"
              autocomplete="off"
          >
            <template v-slot:prepend>
              <q-icon name="mail"/>
            </template>
          </q-input>
          <q-input
              ref="surveyor_name_inp"
              :tabindex="tabIndexInp.surveyor_name"
              class="res_q_imp"
              v-model="main_data_survey.surveyor_name"
              outlined label="Nome Vistoriador"
              :readonly="readonly.surveyor_name_inp"
              @click="clickSurveyorTextField"
              @focus="onFocus('surveyor_name_inp')"
              :loading="loading.surveyor_name_inp"
              autocomplete="off"
              :rules="[isInvalid('surveyor_name')]"
          />
        </div>
        <div class="row">
          <q-input
              type="number"
              class="res_q_imp text_width_206px"
              v-model="main_data_survey.vehicle_km"
              outlined
              label="Km Odômetro"
              suffix="Km"
              :rules="[isInvalid('vehicle_km')]"
          />
          <q-select
              class="res_q_imp res_q_select"
              outlined
              v-model="main_data_survey.belongings_removed"
              :options="options_no_yes"
              label="Pertences Retirados"
              :rules="[isInvalid('belongings_removed')]"
          />
        </div>

        <div class="row">
          <q-select
              class="res_q_imp text_width_620px"
              outlined
              v-model="main_data_survey.service_location.model"
              use-input
              use-chips
              input-debounce="0"
              label="Local Atendimento"
              :options="main_data_survey.service_location.options"
              @filter="serviceLocationFilterFn"
              @filter-abort="serviceLocationAbortFilterFn"
              @input="serviceLocationGetSelection"
              :readonly="readonly.service_location_inp"
              :loading="loading.service_location_inp"
              :rules="[isInvalid('service_location')]"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="row">
          <h5>Condições Gerais</h5>
          <q-separator class="clear"/>
          <div v-for="(field, i) in carcase_fields" :key="i" class="q-px-xs-none q-px-sm-lg q-pt-lg ajuste_mob_option">
            <span :id="'carcase_fields_' + i"> {{ field.label }}</span>
            <q-field
                class="qfield_aqui"
                borderless
                dense
                v-model="group[field.value]"
                :rules="[isInvalidOptions('carcase_fields_' + i)]"
            >
              <q-option-group
                  v-model="group[field.value]"
                  :options="carcase_options"
                  color="primary"
                  inline
              />
            </q-field>
            <q-separator/>
          </div>
        </div>
        <div class="row">
          <h5>Rodas</h5>
          <q-separator class="clear"/>
          <div v-for="(field, i) in wheels_fields" :key="i" class="q-px-xs-none q-px-sm-lg q-pt-lg ajuste_mob_option">
            <span :id="'wheels_fields_' + i"> {{ field.label }}</span>
            <q-field
                class="qfield_aqui"
                borderless
                dense
                v-model="group[field.value]"
                :rules="[isInvalidOptions('wheels_fields_' + i)]"
            >
              <q-option-group
                  required
                  v-model="group[field.value]"
                  :options="wheels_options"
                  color="primary"
                  inline
              />
            </q-field>
            <q-separator/>
          </div>
        </div>
        <div class="row">
          <h5>Acessórios</h5>
          <q-separator class="clear"/>
          <div v-for="(field, i) in accessories_fields" :key="i" class="q-px-xs-none q-px-sm-lg q-pt-lg ajuste_mob_option">
            <span :id="'accessories_fields_' + i"> {{ field.label }}</span>
            <q-field
                class="qfield_aqui"
                borderless
                dense
                v-model="group[field.value]"
                :rules="[isInvalidOptions('accessories_fields_' + i)]"
            >
              <q-option-group
                  required
                  v-model="group[field.value]"
                  :options="accessories_options"
                  color="primary"
                  inline
              />
            </q-field>
            <q-separator/>
          </div>
        </div>

        <div class="row">
          <h5>Observações</h5>
          <q-separator class="clear"/>
          <textarea
              v-model="main_data_survey.comments"
              class="full-width" rows="10" style="padding: 7px;"></textarea>
        </div>
        <div class="row">
          <q-checkbox
              class="q-py-lg"
              v-model="group.dirty"
              label="Veículo muito sujo, sem condições de apuração detalhada da lataria, não nos responsabilizamos por arranhões que venham a ser identificados após a lavagem."
          />
          <span>
        A empresa não se responsabiliza pelos seguintes defeitos do veículo:
        Descarga da bateria, total ou parcial, queima de farol, luzes ou
        celibim, ou qualquer mal funcionamento do motor, vazamento do radiador,
        mangueiras ou correias arrebentadas, caixa escapando, disco platinado,
        objetos de valor, dinheiro, jóias, armas e documentos sob hipótese
        alguma.
      </span>
        </div>
        <div class="row justify-end">
          <q-btn
              type="submit"
              icon="save"
              label="Salvar"
              size="md"
              color="primary"
              class="q-mt-md"
              :loading="loading.btn_save"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {ENTRYPOINT} from '../../../../../../src/config/entrypoint';
import {mapGetters} from "vuex";

function findIn(obj, search) {
  return obj.find(c => c.value === search);
}

export default {
  props: {
    carcase_options: {
      type: Array,
      required: true,
    },
    accessories_options: {
      type: Array,
      required: true,
    },
    wheels_options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      generalContentVisible: true,
      generalWarningVisible: false,
      htmlGeneralFailureWarning: null,
      intervalo: null,
      storage: {
        defaultCompanyId: null
      },
      route: {
        tasksSurveys_id: this.$route.params.id
      },
      tabIndexInp: {
        surveyor_name: -1
      },
      loading: {
        surveyor_name_inp: false,
        service_location_inp: true,
        btn_save: false
      },
      readonly: {
        surveyor_name_inp: true,
        service_location_inp: true
      },
      surveyor_validations: { // Monitora status para preenchimento automático do campo do Vistoriador (nome) com base no email informado
        mail_validate_ok: false,
        mail_consulted_bd: false,
        mail_existis_bd: false,
        lastMailVerifiedInBD: null,
        foundMailInDatabase: false
      },
      main_data_survey: {
        comments: null,
        surveyor_people_id: null,
        updated_at: null,
        type_survey: null,
        customer: null,
        customer_email: null,
        surveyor_email: null,
        surveyor_name: null,
        vehicle_name: null,
        vehicle_km: null,
        vehicle_plate: null,
        vehicle_color: null,
        belongings_removed: null,
        service_location: {
          selectedTrainedId: null,
          selectedAddressId: null,
          model: null,
          optionsLoadedAjax: null,
          optionsLoadedAjaxFormated: [],
          options: []
        },
      },
      options_type_survey: [
        {
          label: 'Coleta',
          value: 'collect'
        },
        {
          label: 'Entrega',
          value: 'delivery'
        },
        {
          label: 'Outros',
          value: 'others'
        }
      ],
      options_no_yes: [
        {
          label: 'Não',
          value: 'no'
        },
        {
          label: 'Sim',
          value: 'yes'
        }
      ],
      group: {
        paint: null, // Pintura
        lining: null, // Forração
        tapestry: null, // Tapeçaria
        left_front_tire: null, // Pneu Dianteiro Esquerdo
        right_front_tire: null, // Pneu Dianteiro Direito
        left_rear_tire: null, // Pneu Traseiro Esquerdo
        right_rear_tire: null, // Pneu Traseiro Direito
        spare: null, // Stepe
        cigarette_lighter: null, // Acendedor de Cigarros
        air_conditioning: null, // Ar Condicionado
        common_antenna: null, // Antena Comum
        horn: null, // Buzina
        seat_belt: null, // Cinto de Segurança
        carpets: null, // Tapetes
        battery: null, // Bateria
        speaker: null, // Alto Falante
        hubcap: null, // Calota
        hitch: null, // Engate
        auxiliary_headlight: null, // Farol Auxiliar
        common_wheel: null, // Roda Comum
        special_wheel: null, // Roda Especial
        radio_cd: null, // Radio CD
        radio_fm: null, // Radio AM/FM
        document: null, // Documento
        manual: null, // Manual
        keys: null, // Chave
        extra_key: null, // Chave Reserva
        back_cap: null, // Tampão Traseiro
        extinguisher: null, // Extintor
        triangle: null, // Triângulo
        jack: null, // Macaco
        tire_iron: null, // Chave de Roda
        screwdriver: null, // Chave de Fenda
        dirty: false // Veículo muito Sujo
      },
      carcase_fields: [
        {
          label: "Pintura",
          value: "paint",
        },
        {
          label: "Forração",
          value: "lining",
        },
        {
          label: "Tapeçaria",
          value: "tapestry",
        },
      ],
      accessories_fields: [
        {
          label: "Acendedor de Cig.",
          value: "cigarette_lighter",
        },
        {
          label: "Ar Condicionado",
          value: "air_conditioning",
        },
        {
          label: "Antena Comum",
          value: "common_antenna",
        },
        {
          label: "Buzina",
          value: "horn",
        },
        {
          label: "Cinto de Segurança",
          value: "seat_belt",
        },
        {
          label: "Tapetes",
          value: "carpets",
        },
        {
          label: "Bateria",
          value: "battery",
        },
        {
          label: "Auto falante",
          value: "speaker",
        },
        {
          label: "Calota",
          value: "hubcap",
        },
        {
          label: "Engate",
          value: "hitch",
        },
        {
          label: "Farol Auxiliar",
          value: "auxiliary_headlight",
        },
        {
          label: "Roda Comum",
          value: "common_wheel",
        },
        {
          label: "Roda Especial",
          value: "special_wheel",
        },
        {
          label: "Rádio CD",
          value: "radio_cd",
        },
        {
          label: "Rádio AM/FM",
          value: "radio_fm",
        },
        {
          label: "Documento",
          value: "document",
        },
        {
          label: "Manual",
          value: "manual",
        },
        {
          label: "Chave",
          value: "keys",
        },
        {
          label: "Chave Reserva",
          value: "extra_key",
        },
        {
          label: "Tampão Traseiro",
          value: "back_cap",
        },
        {
          label: "Extintor",
          value: "extinguisher",
        },
        {
          label: "Triângulo",
          value: "triangle",
        },
        {
          label: "Macaco",
          value: "jack",
        },
        {
          label: "Chave de Roda",
          value: "tire_iron",
        },
        {
          label: "Chave de Fenda",
          value: "screwdriver",
        },
      ],
      wheels_fields: [
        {
          label: "Pneu Diant. Esq.",
          value: "left_front_tire",
        },
        {
          label: "Pneu Diant. Dir.",
          value: "right_front_tire",
        },
        {
          label: "Pneu Tras. Esq.",
          value: "left_rear_tire",
        },
        {
          label: "Pneu Tras. Dir.",
          value: "right_rear_tire",
        },
        {
          label: "Estepe",
          value: "spare",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      defaultCompany: 'people/defaultCompany'
    })
  },
  watch: {
    deep: true,
    // --- Observa o TextField 'Vistoriador Nome' se está como somente leitura(readonly:true) ou editável (readonly: false)
    "readonly.surveyor_name_inp": function (val, oldVal) {
      if (val) { // === true -> Se estiver somo somente leitura, define tabindex como -1 para não tentar foco ao pressionar o TAB
        this.tabIndexInp.surveyor_name = -1
      } else { // === false -> Caso contrário deixa o tabindex no funcionamento normal
        this.tabIndexInp.surveyor_name = null
      }
    }
  },
  methods: {
    onSubmit() {

      if (this.loading.btn_save) {
        return;
      }
      this.loading.btn_save = true;
      this.callAjaxSaveSurveyDataById();

    },
    callAjaxGetOneSurveyById() {

      let id_local = this.route.tasksSurveys_id;

      axios({
        url: ENTRYPOINT + `/tasks_surveys/${id_local}/getonesurvey?timestamp=${new Date().getTime()}`,
        method: 'get'
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando falha o retorno dos dados
          this.alertNotify(data.message, 'n');
          this.htmlGeneralFailureWarning = data.message;
          this.generalContentVisible = false;
          this.generalWarningVisible = true;
        }

        if (data.success) { // Quando os dados são retornados com êxito

          let dado = data.data;
          if (dado.belongings_removed !== null) {
            this.main_data_survey.belongings_removed = findIn(this.options_no_yes, dado.belongings_removed);
          }
          if (dado.type_survey !== null) {
            this.main_data_survey.type_survey = findIn(this.options_type_survey, dado.type_survey);
          }
          this.main_data_survey.surveyor_email = dado.surveyor_email;
          this.main_data_survey.surveyor_name = dado.surveyor_name;
          this.surveyor_validations.lastMailVerifiedInBD = dado.surveyor_email;
          this.surveyor_validations.mail_consulted_bd = true;
          this.surveyor_validations.mail_existis_bd = true;
          this.surveyor_validations.mail_validate_ok = true;
          this.surveyor_validations.foundMailInDatabase = true;
          this.main_data_survey.surveyor_people_id = dado.surveyor_people_id;
          if (dado.vehicle_km !== null) {
            this.main_data_survey.vehicle_km = String(dado.vehicle_km);
          }
          this.main_data_survey.customer = dado.client_name;
          this.main_data_survey.customer_email = dado.client_email;
          this.main_data_survey.vehicle_name = dado.car_type;
          this.main_data_survey.updated_at = dado.updated_at;
          if (dado.car_inf !== null) {
            this.main_data_survey.vehicle_plate = dado.car_inf.carNumber;
            this.main_data_survey.vehicle_color = dado.car_inf.carColor;
          } else {
            this.main_data_survey.vehicle_plate = 'Não Cadastrado';
            this.main_data_survey.vehicle_color = 'Não Cadastrado';
          }
          this.main_data_survey.comments = dado.comments;

          // ---------------------- Retorna dados do Local de Atendimento somente pelo ID do Endereço
          if (data.data.selectedAddressId !== null) {
            let address_id = data.data.selectedAddressId;
            let index_location = this.main_data_survey.service_location.optionsLoadedAjax.map((el) => el.address_id).indexOf(address_id);
            this.main_data_survey.service_location.model = this.main_data_survey.service_location.optionsLoadedAjaxFormated[index_location];
            this.main_data_survey.service_location.selectedAddressId = address_id;
            this.main_data_survey.service_location.selectedTrainedId = this.main_data_survey.service_location.optionsLoadedAjax[index_location].trainer_id;
          }
          // ------------------------------------------------------------------------------

          if (dado.group !== null) {
            this.group = dado.group;
          }

        }

        this.$q.loading.hide();
        console.log(data);

      });

    },
    callAjaxSaveSurveyDataById() {

      let id_local = this.route.tasksSurveys_id;

      axios({
        url: ENTRYPOINT + `/tasks_surveys/${id_local}/survey?action=save&timestamp=${new Date().getTime()}`,
        method: 'put',
        data: {
          'type_survey': this.main_data_survey.type_survey.value,
          'surveyor_email': this.main_data_survey.surveyor_email,
          'surveyor_name': this.main_data_survey.surveyor_name,
          'vehicle_km': this.main_data_survey.vehicle_km,
          'belongings_removed': this.main_data_survey.belongings_removed.value,
          'selectedTrainedId': this.main_data_survey.service_location.selectedTrainedId,
          'selectedAddressId': this.main_data_survey.service_location.selectedAddressId,
          'comments': this.main_data_survey.comments,
          'group': this.group
        }
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando dá um erro no salvamento
          this.alertNotify(data.message, 'n');
        }

        if (data.success) { // Quando o salvamento é executado com Êxito
          this.alertNotify('Dados Salvos com Êxito.', 'p');
        }

        this.loading.btn_save = false;

        //console.log(data);

      });

    },
    surveyorEmailInputChangeValue(val) {
      this.surveyor_validations.mail_consulted_bd = false;
      this.surveyor_validations.mail_existis_bd = false;
      setTimeout(() => {
        this.checkMailSurveyorOnBd(false);
      }, 10);

    },
    serviceLocationGetSelection(val) { // Quando seleciona um resultado no select do "Local Atendimento"
      let index = this.main_data_survey.service_location.optionsLoadedAjaxFormated.indexOf(val);
      if (index >= 0) { // Quando selecionar um Resultado
        let trainer_id = this.main_data_survey.service_location.optionsLoadedAjax[index].trainer_id;
        let address_id = this.main_data_survey.service_location.optionsLoadedAjax[index].address_id;
        this.main_data_survey.service_location.selectedTrainedId = trainer_id;
        this.main_data_survey.service_location.selectedAddressId = address_id;
      } else { // Quando excluir um Resultado
        this.main_data_survey.service_location.selectedTrainedId = null;
        this.main_data_survey.service_location.selectedAddressId = null;
      }
    },
    serviceLocationFilterFn(val, update, abort) { // Quando busca por um resultado no select do "Local Atendimento"
      // call abort() at any time if you can't retrieve data somehow
      update(() => {
        if (val === '') {
          this.main_data_survey.service_location.options = this.main_data_survey.service_location.optionsLoadedAjaxFormated
        } else {
          const needle = val.toLowerCase()
          this.main_data_survey.service_location.options = this.main_data_survey.service_location.optionsLoadedAjaxFormated.filter(v => v.toLowerCase().indexOf(needle) > -1);
        }
      })
    },
    serviceLocationAbortFilterFn() {
      console.log('delayed filter aborted');
    },
    onKeyUp(inputAndKey) {
      switch (inputAndKey) {
        case 'surveyor_email_inp_any_key':
          if (this.surveyor_validations.lastMailVerifiedInBD !== this.main_data_survey.surveyor_email) {
            if (!this.readonly.surveyor_name_inp) {
              // this.readonly.surveyor_name_inp = true;
            }
          } else {
            if (this.readonly.surveyor_name_inp) {
              // this.readonly.surveyor_name_inp = false;
            }
          }
          break;
        default:
          break;
      }
    },
    onBlur(input) {
      switch (input) {
        case 'surveyor_email_inp':
          this.checkMailSurveyorOnBd(true);
          break;
        default:
          break;
      }
    },
    onFocus(input) {
      switch (input) {
        case 'surveyor_name_inp':

          break;
        default:
          break;
      }
    },
    validateEmpty(val) {
      if (val !== null && typeof val !== 'undefined') {
        val = val.trim();
      }
      if (val === null || val.length === 0) {
        return 'Deve ser preenchido';
      }
    },
    isInvalidOptions(key) {
      return val => {
        if (typeof val === 'undefined' || val === null) {
          let container = this.$el.querySelector("#" + key);
          let top = container.offsetTop;
          window.scrollTo(0, top);
          return 'Deve ser selecionado';
        }
      }
    },
    isInvalid(key) {
      return val => {
        switch (key) {
          case 'carcase_fields':
            if (typeof val === 'undefined') {
              return 'Deve ser selecionado';
            }
            break;
          case 'vehicle_km':
            console.log("val vehicle_km: " + val);
            return this.validateEmpty(val);
            break;
          case 'surveyor_name':
            return this.validateEmpty(val);
            break;
          case 'belongings_removed':
            console.log("val belongings_removed: " + val);
            if (val === null) {
              return 'Deve ser selecionado';
            }
            break;
          case 'type_survey':
            if (val === null || typeof val === 'undefined') {
              return 'Selecione o Tipo de Vistoria';
            }
            break;
          case 'service_location':
            if (val === null || typeof val === 'undefined') {
              return 'Deve ser selecionado';
            }
            break;
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
              this.main_data_survey.surveyor_name = null;
              this.main_data_survey.surveyor_people_id = null;
              this.readonly.surveyor_name_inp = false;
              this.surveyor_validations.lastMailVerifiedInBD = this.main_data_survey.surveyor_email;
              this.loading.surveyor_name_inp = false;
              this.surveyor_validations.mail_validate_ok = false;
              this.surveyor_validations.foundMailInDatabase = false;
              this.surveyor_validations.mail_consulted_bd = false;
              this.surveyor_validations.mail_existis_bd = false;
              return 'O email informado não é válido';
            } else {
              this.surveyor_validations.mail_validate_ok = true;
            }
            break;
          default:
            if (!(val && val.length > 0))
              return 'Este campo é obrigatório';
        }
      }
    },
    clickSurveyorTextField() {
      if (!this.surveyor_validations.mail_existis_bd && !this.loading.surveyor_name_inp && this.readonly.surveyor_name_inp) {
        if (!this.surveyor_validations.foundMailInDatabase &&
            ((this.surveyor_validations.lastMailVerifiedInBD !== this.main_data_survey.surveyor_name) ||
                (this.main_data_survey.surveyor_name === null || !this.surveyor_validations.mail_validate_ok))) {
          this.alertNotify('Preencha Primeiramente o E-Mail do Vistoriador', 'n');
        }
      }
    },
    checkMailSurveyorOnBd(disable_focus) { // Usando no evento BLUR no campo E-MAIL do Vistoriador
      if (this.surveyor_validations.mail_validate_ok && !this.surveyor_validations.mail_existis_bd) {
        if (this.surveyor_validations.lastMailVerifiedInBD !== this.main_data_survey.surveyor_email) {
          console.log('asdasdasdsad');
          this.loading.surveyor_name_inp = true;
          this.callAjaxSearchMailSurveyor(disable_focus);
        }
      }
    },
    /**
     * Retorna todos os Pontos de Encontro pelo ID da Default Company
     *
     * @param defaultCompanyId
     */
    callAjaxGetAllPeopleTrainerByDefaultCompanyId(defaultCompanyId) {

      let defaultCompanyId_local = this.storage.defaultCompanyId;

      return axios({
        url: ENTRYPOINT + `/tasks_surveys/${defaultCompanyId_local}/findpeopletrainer?timestamp=${new Date().getTime()}`,
        method: 'get'
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando não encontra resultado

        }

        if (data.success) { // Quando encontra resultado com sucesso
          let tmp = data.data;
          for (let p = 0; p < tmp.length; p++) {
            this.main_data_survey.service_location.optionsLoadedAjaxFormated.push(`${tmp[p].alias} - ${tmp[p].district} - ${tmp[p].city} - ${tmp[p].UF}`);
          }
          this.main_data_survey.service_location.options = this.main_data_survey.service_location.optionsLoadedAjaxFormated
          this.main_data_survey.service_location.optionsLoadedAjax = data.data;
          this.loading.service_location_inp = false;
          this.readonly.service_location_inp = false
        }

        return data;

      });

    },
    callAjaxSearchMailSurveyor(disable_focus) {

      let email = this.main_data_survey.surveyor_email;

      axios({
        url: ENTRYPOINT + `/tasks_surveys/findsurveyor?email=${email}&timestamp=${new Date().getTime()}`,
        method: 'get'
      }).then((response) => {

        let data = response.data.response;

        if (!data.success) { // Quando não encontra e-mail de vistoriador
          this.main_data_survey.surveyor_name = null;
          this.main_data_survey.surveyor_people_id = null;
          this.readonly.surveyor_name_inp = false;
          this.surveyor_validations.lastMailVerifiedInBD = this.main_data_survey.surveyor_email;
          this.surveyor_validations.foundMailInDatabase = false;
          this.surveyor_validations.mail_consulted_bd = true;
          this.surveyor_validations.mail_existis_bd = false;
          this.loading.surveyor_name_inp = false;
          if (disable_focus) {
            setTimeout(() => {
              this.$refs.surveyor_name_inp.focus();
            }, 20);
          }
        }

        if (data.success) { // Quando encontra um e-mail de vistoriador com sucesso

          this.main_data_survey.surveyor_name = data.data[0].name;
          this.main_data_survey.surveyor_people_id = data.data[0].id;
          this.surveyor_validations.lastMailVerifiedInBD = this.main_data_survey.surveyor_email;
          this.surveyor_validations.foundMailInDatabase = true;
          this.surveyor_validations.mail_consulted_bd = true;
          this.surveyor_validations.mail_existis_bd = true;
          this.readonly.surveyor_name_inp = true;
          this.loading.surveyor_name_inp = false;

        }

      });

    },
    /**
     * Exibe Alerta Positivo ou Negativo
     * @param msg
     * @param tipo ('n','p')
     */
    alertNotify(msg, tipo) {
      let status = (tipo === 'n') ? 'negative' : 'positive';
      this.$q.notify({
        message: msg,
        html: true,
        group: false,
        multiLine: true,
        position: 'bottom',
        type: status,
      });
    },
    preencheTeste() {

      // ---------------------- Retorna dados do Local de Atendimento somente pelo ID do Endereço
      let address_id = 139
      let index_location = this.main_data_survey.service_location.optionsLoadedAjax.map((el) => el.address_id).indexOf(address_id);
      this.main_data_survey.service_location.model = this.main_data_survey.service_location.optionsLoadedAjaxFormated[index_location];
      this.main_data_survey.service_location.selectedAddressId = address_id;
      this.main_data_survey.service_location.selectedTrainedId = this.main_data_survey.service_location.optionsLoadedAjax[index_location].trainer_id;
      // ------------------------------------------------------------------------------

      this.main_data_survey.type_survey = findIn(this.options_type_survey, 'delivery');
      this.main_data_survey.surveyor_email = 'gilberto@eletronicamais.com.br';
      this.main_data_survey.surveyor_name = 'Gilberto Lima';
      this.main_data_survey.vehicle_km = '407';
      this.main_data_survey.belongings_removed = findIn(this.options_no_yes, 'yes');

      // ------------------- Condições Gerais

      this.group.paint = 'good'; // Pintura
      this.group.lining = 'steady'; // Forração
      this.group.tapestry = 'poor'; // Tapeçaria

      // ------------------- Rodas

      this.group.left_front_tire = 'missed'; // Pneu Dianteiro Esquerdo
      this.group.right_front_tire = 'steady'; // Pneu Dianteiro Direito
      this.group.left_rear_tire = 'poor'; // Pneu Traseiro Esquerdo
      this.group.right_rear_tire = 'good'; // Pneu Traseiro Direito
      this.group.spare = 'missed'; // Stepe

      // ------------------- Acessórios

      this.group.cigarette_lighter = 'yes'; // Acendedor de Cigarros
      this.group.air_conditioning = 'no'; // Ar Condicionado
      this.group.common_antenna = 'no'; // Antena Comum
      this.group.horn = 'yes'; // Buzina
      this.group.seat_belt = 'yes'; // Cinto de Segurança
      this.group.carpets = 'no'; // Tapetes
      this.group.battery = 'yes'; // Bateria
      this.group.speaker = 'no'; // Alto Falante
      this.group.hubcap = 'no'; // Calota
      this.group.hitch = 'no'; // Engate
      this.group.auxiliary_headlight = 'yes'; // Farol Auxiliar
      this.group.common_wheel = 'yes'; // Roda Comum
      this.group.special_wheel = 'no'; // Roda Especial
      this.group.radio_cd = 'no'; // Radio CD
      this.group.radio_fm = 'no'; // Radio AM/FM
      this.group.document = 'yes'; // Documento
      this.group.manual = 'no'; // Manual
      this.group.keys = 'yes'; // Chave
      this.group.extra_key = 'no'; // Chave Reserva
      this.group.back_cap = 'yes'; // Tampão Traseiro
      this.group.extinguisher = 'yes'; // Extintor
      this.group.triangle = 'no'; // Triângulo
      this.group.jack = 'yes'; // Macaco
      this.group.tire_iron = 'yes'; // Chave de Roda
      this.group.screwdriver = 'no'; // Chave de Fenda

    }
  },
  beforeCreate() {
    this.$q.loading.show();
  },
  mounted() {

    if (!this.intervalo && !this.storage.defaultCompanyId) {

      this.intervalo = setInterval(() => {
        if (this.defaultCompany !== null) {
          this.storage.defaultCompanyId = this.defaultCompany.id;
          console.log('Capturou LocalStorage uma única vez');
          this.callAjaxGetAllPeopleTrainerByDefaultCompanyId(this.storage.defaultCompanyId).then((data) => {
            //this.preencheTeste();
            this.callAjaxGetOneSurveyById();
          });
          clearInterval(this.intervalo);
        }
      }, 50);

    }

  }

}
</script>

<style>
.qfield_aqui .q-field__bottom {
  font-size: 15px !important;
  padding-top: 0;
}
</style>

<style scoped>

.aviso_alerta {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.clear {
  clear: both;
  width: 100%;
}

h5 {
  margin: 0;
  margin-top: 50px;
  font-weight: 500;
}

.res_q_imp {
  padding-right: 24px;
  padding-bottom: 24px;
}

.res_q_select {
  width: 413.68px;
}

.text_width_206px {
  width: 206.84px;
}

.text_width_620px {
  width: 620px;
}

.text_width_double {
  width: 310px;
}

/* XS -> Extra Small */
@media (max-width: 599px) {
  .ajuste_mob_option {
    width: 100% !important;
  }
}

/* SM -> Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  .res_q_imp {
    width: 100%;
    padding-right: unset;
  }
}

</style>
