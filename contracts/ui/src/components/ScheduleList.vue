<template>
  <q-table
    :loading        ="isLoading"
    :data           ="data"
    :columns        ="columns"
    :pagination.sync="pagination"
    @request        ="onRequest"
    row-key         ="id"
  >
    <template v-slot:body-cell-remove="props">
      <q-td auto-width>
        <q-btn flat round dense
          color   ="red"
          icon    ="delete"
          @click  ="removeItem(props.row)"
          :disable="readOnly"
          :loading="props.row._bussy"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import configurable     from './../mixins/configurable';
import Contract         from './../entity/Contract';
import { formatAsTime } from './../library/formatter';

export default {
  name  : 'ContractScheduleList',
  mixins: [ configurable ],

  props: {
    contract : {
      type    : Contract,
      required: true
    },
    readOnly: {
      type    : Boolean,
      required: false,
      default : false
    }
  },

  created() {
    this.columns = [
      {
        name  : 'students',
        field : 'students',
        align : 'left',
        label : this.$t('contracts.columns.student'),
        format: (val) => {
          return val.join(', ')
        }
      },
      {
        name : 'weekDay',
        field: 'weekDay',
        align: 'left',
        label: this.$t('contracts.columns.week_days'),
      },
      {
        name : 'startTime',
        field: 'startTime',
        align: 'left',
        label: this.$t('contracts.columns.start_time'),
      },
      {
        name : 'endTime',
        field: 'endTime',
        align: 'left',
        label: this.$t('contracts.columns.end_time'),
      },
      {
        name : 'trainer',
        field: 'trainer',
        align: 'left',
        label: this.$t('contracts.columns.teacher'),
      },
      {
        name : 'local',
        field: 'local',
        align: 'left',
        label: this.$t('contracts.columns.local'),
      },
      {
        name : 'remove'
      },
    ];

    this.weekDays = [
      {
        label: 'Segunda-feira',
        value: 'monday',
      },
      {
        label: 'Terça-feira',
        value: 'tuesday',
      },
      {
        label: 'Quarta-feira',
        value: 'wednesday',
      },
      {
        label: 'Quinta-feira',
        value: 'thursday',
      },
      {
        label: 'Sexta-feira',
        value: 'friday',
      },
      {
        label: 'Sábado',
        value: 'saturday',
      },
      {
        label: 'Domingo',
        value: 'sunday',
      },
    ];

    this.dayPeriods = [
      {
        label: '07:00',
        value: '07:00:00',
      },
      {
        label: '07:30',
        value: '07:30:00',
      },
      {
        label: '08:00',
        value: '08:00:00',
      },
      {
        label: '08:30',
        value: '08:30:00',
      },
      {
        label: '09:00',
        value: '09:00:00',
      },
      {
        label: '09:30',
        value: '09:30:00',
      },
      {
        label: '10:00',
        value: '10:00:00',
      },
      {
        label: '10:30',
        value: '10:30:00',
      },
      {
        label: '11:00',
        value: '11:00:00',
      },
      {
        label: '11:30',
        value: '11:30:00',
      },
      {
        label: '12:00',
        value: '12:00:00',
      },
      {
        label: '12:30',
        value: '12:30:00',
      },
      {
        label: '13:00',
        value: '13:00:00',
      },
      {
        label: '13:30',
        value: '13:30:00',
      },
      {
        label: '14:00',
        value: '14:00:00',
      },
      {
        label: '14:30',
        value: '14:30:00',
      },
      {
        label: '15:00',
        value: '15:00:00',
      },
      {
        label: '15:30',
        value: '15:30:00',
      },
      {
        label: '16:00',
        value: '16:00:00',
      },
      {
        label: '16:30',
        value: '16:30:00',
      },
      {
        label: '17:00',
        value: '17:00:00',
      },
      {
        label: '17:30',
        value: '17:30:00',
      },
      {
        label: '18:00',
        value: '18:00:00',
      },
      {
        label: '18:30',
        value: '18:30:00',
      },
      {
        label: '19:00',
        value: '19:00:00',
      },
      {
        label: '19:30',
        value: '19:30:00',
      },
      {
        label: '20:00',
        value: '20:00:00',
      },
      {
        label: '20:30',
        value: '20:30:00',
      },
      {
        label: '21:00',
        value: '21:00:00',
      },
      {
        label: '21:30',
        value: '21:30:00',
      },
      {
        label: '22:00',
        value: '22:00:00',
      },
      {
        label: '22:30',
        value: '22:30:00',
      },
      {
        label: '23:00',
        value: '23:00:00',
      },
    ];

    this.allDays = {
      'monday'   : 'Segunda-feira',
      'tuesday'  : 'Terça-feira',
      'wednesday': 'Quarta-feira',
      'thursday' : 'Quinta-feira',
      'friday'   : 'Sexta-feira',
      'saturday' : 'Sábado',
      'sunday'   : 'Domingo',
    };

    this.classType = {
      'ead'    : 'Online',
      'company': 'Externa',
      'school' : 'Interna',
    };

    this.onRequest({
      pagination: this.pagination,
      filter    : this.filters,
    });
  },

  data() {
    return {
      columns   : [],
      dayPeriods: [],
      weekDays  : [],
      allDays   : {},
      classType : {},
      data      : [],
      isLoading : false,
      pagination: {
        descending : false,
        page       : 1,
        rowsPerPage: 20,
        rowsNumber : 10,
      },
    }
  },

  methods: {
    onRequest(props) {
      if (this.isLoading)
        return;

      let {
          page,
          rowsPerPage,
          rowsNumber,
          sortBy,
          descending
      } = props.pagination;

      this.isLoading = true;

      this.Api.Schedules
        .GetAll({
          query: {
            itemsPerPage   : rowsPerPage,
            page           : page,
            'team.contract': this.contract.id,
          }
        })
          .then((schedule) => {
              let items = [];

              for (let index in schedule.members) {
                let item = schedule.members[index];

                items.push({
                  'id'       : item['@id'].replace(/\D/g, ''),
                  'students' : item.team.peopleTeams
                    .filter((peopleTeam) => {
                      return peopleTeam.peopleType === 'student'
                    })
                    .map   ((peopleTeam) => {
                      return `${peopleTeam.people.name} ${peopleTeam.people.alias}`;
                    }),
                  'weekDay'  : this.allDays[item.weekDay],
                  'startTime': formatAsTime(item.startTime),
                  'endTime'  : formatAsTime(item.endTime  ),
                  'trainer'  : `${item.peopleTrainer.trainer.name} ${item.peopleTrainer.trainer.alias}`,
                  'local'    : this.classType[item.team.type] || '-',
                  '_bussy'   : false,
                });
              }

              this.data = items;

              return {
                members: items,
                total  : schedule.total,
              }
          })
          .then((schedule) => {
            this.pagination.page        = page;
            this.pagination.rowsPerPage = rowsPerPage;
            this.pagination.sortBy      = sortBy;
            this.pagination.descending  = descending;
            this.pagination.rowsNumber  = schedule.total;
          })
          .finally(() => {
            this.isLoading = false;
          });
    },

    removeItem(item) {
      if (window.confirm(this.$t('messages.sure_remove'))) {
        item._bussy = true;
        this.Api.Schedules
          .Delete({
            params: { id: item.id }
          })
            .then(isOk => {
              this.onRequest({
                pagination: this.pagination,
                filter    : this.filters,
              });
            })
            .catch(error => {
              this.$q.notify({
                message : this.$t(error.message),
                position: 'bottom',
                type    : 'negative',
              });
            })
            .finally(() => {
              item._bussy = false;
            })
          ;
      }
    },

    reload() {
      this.onRequest({
        pagination: this.pagination,
        filter    : this.filters,
      });
    },
  },
};
</script>
