<template>
  <div v-loading="load">
    <div align="center" class="mb-10">
      <el-button type="primary" @click="fetchCalendarDetails()">
        <icon icon="tabler:reload" /> Reload Calendar
      </el-button>
    </div>
    <FullCalendar :options="calendarOptions" />
    <el-drawer v-if="modalShow" v-model="modalShow" direction="rtl" size="87%">
      <template #header>
        <span>Task Details</span>
      </template>
      <el-card>
        <AssignTaskTable
          :selected-data="selectedData"
          :selected-module="selectedModule"
          :staff="[]"
          role="user"
          @update:tasks="fetchCalendarDetails()"
        />
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Resource from '@/api/resource'
import AssignTaskTable from './partials/AssignTaskTable.vue'
export default {
  components: {
    FullCalendar,
    AssignTaskTable
  },
  props: {
    selectedModule: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      modalShow: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          right: 'prev,next',
          center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          left: 'dayGridMonth,timeGridWeek,timeGridDay'
          //   left: '',
          //   center: '',
          //   right: ''
        },
        initialView: 'timeGridWeek',
        // dateClick: this.handleDateClick,
        weekends: false,
        // editable: true,
        // eventResizableFromStart: true,

        slotMinTime: '08:00:00', // "07:45:00",
        slotMaxTime: '18:00:00',
        slotDuration: '00:30:00',
        events: [],
        eventClick: this.handleDateClick
      },
      load: false,
      selectedData: {
        id: null,
        notes: ''
      }
    }
  },
  mounted() {
    this.fetchCalendarDetails()
  },
  methods: {
    handleDateClick: function (arg) {
      this.selectedData = {
        id: parseInt(arg.event.extendedProps.taskId)
      }
      this.modalShow = true
    },
    fetchCalendarDetails() {
      this.load = true
      const fetchResource = new Resource(
        `${this.selectedModule}/calendar/fetch-user-assigned-tasks`
      )
      fetchResource.list().then((response) => {
        const { my_tasks } = response
        this.setEvents(my_tasks)
        this.load = false
      })
    },
    setEvents(routines) {
      const events = []
      routines.forEach((routine) => {
        const color = '#6c757d' // gray
        if (routine.status === 'completed') {
          color = '#02552e' // green
        } else if (routine.status === 'overdue') {
          color = '#a10111' // red
        }
        const eachEvent = {
          id: routine.id,
          taskId: routine.task_id,
          title: `${routine.task_name}`,
          assignee: `${routine.assignee}`,
          notes: `${routine.notes}`,
          start: `${routine.start_date} 00:00`,
          end: `${routine.deadline} 17:00`,
          startTime: `${routine.start_date} 08:00`,
          endTime: `${routine.deadline} 17:00`,
          backgroundColor: color,
          textColor: 'white',
          borderColor: 'white',
          // daysOfWeek: [routine.day],
          allDay: false
        }
        events.push(eachEvent)
      })
      this.calendarOptions.events = events
    }
  }
}
</script>
