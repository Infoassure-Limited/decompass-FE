<template>
  <div class="app-calendar border">
    <div class="row no-gutters">
      <!-- Calendar -->
      <div v-loading="load" class="col position-relative">
        <el-button @click="dialogFormVisible = true"> Schedule </el-button>
        <div class="card shadow-none border-0 mb-0 rounded-0">
          <div class="card-body pb-0">
            <full-calendar ref="refCalendar" :options="calendarOptions" class="full-calendar" />
          </div>
        </div>
      </div>

      <!-- Sidebar Overlay -->
      <!-- <div
          class="body-content-overlay"
          :class="{'show': isCalendarOverlaySidebarActive}"
          @click="isCalendarOverlaySidebarActive = false"
        />
        <create-routine-modal
          v-model="isEventHandlerSidebarActive"
          :event="event"
          :clear-event-data="clearEventData"
          @remove-event="removeEvent"
          @add-event="addEvent"
          @update-event="updateEvent"
        /> -->
    </div>
    <el-dialog
      v-if="dialogFormVisible"
      v-model="dialogFormVisible"
      title="Schedule New Review Meeting"
      v-model:visible="dialogFormVisible"
    >
      <div>
        <el-form-group label="Title of meeting" label-for="v-class">
          <el-input
            v-model="form.title"
            placeholder="Annual review meeting"
            class="span"
            style="width: 100%"
          />
        </el-form-group>
        <el-form-group label="Meeting Agenda" label-for="v-class">
          <ckeditor v-model="form.agenda" :editor="editor" :config="editorConfig" />
        </el-form-group>
        <el-form-group label="Meeting Link" label-for="v-class">
          <el-input
            v-model="form.meeting_link"
            placeholder="Copy and paste meeting link here"
            class="span"
            style="width: 100%"
          />
        </el-form-group>
        <el-form-group label="Date" label-for="v-class">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Set Start Date"
            value-format="YYYY-MM-DD"
          />
        </el-form-group>
        <el-form-group label="Start Time" label-for="v-class">
          <el-time-picker
            v-model="form.start"
            format="HH:mm"
            value-format="HH:mm:ss"
            placeholder="Start time"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '20:30'
            }"
          />
        </el-form-group>
        <el-form-group label="Duration (in minutes)" label-for="v-class">
          <el-input-number
            v-model="form.duration_minutes"
            :min="15"
            :max="120"
            :step="15"
            step-strictly
          />
        </el-form-group>
        <el-form-group label="Attendees" label-for="v-class">
          <el-select
            v-model="form.attendees"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Type in the email address of attendees"
            style="width: 100%"
          >
            <el-option v-for="(item, index) in []" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-group>
        <el-form-group>
          <hr />
          <el-button :disabled="form.start === ''" variant="primary" @click="saveRoutine()">
            Submit
          </el-button>
        </el-form-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
// import CreateRoutineModal from './partials/CreateRoutineModal.vue'
import Resource from '@/api/resource'

const updateRoutineResource = new Resource('vdd/client-review-meetings/update')
export default {
  components: {
    FullCalendar /* CreateRoutineModal, */
  },
  props: {
    vendorId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    function renderRoutine(id, start, end, day) {
      const param = {
        id,
        start,
        end,
        day
      }
      updateRoutineResource.update(id, param).then(() => {})
    }
    function removeRoutine(id) {
      this.$confirm('Are you sure you want to delete this schedule?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      })
        .then(() => {
          const deleteMeetingResource = new Resource('vdd/client-review-meetings/destroy')
          deleteMeetingResource.destroy(id).then(() => {
            this.fetchMeetingSchedule()
          })
        })
        .catch(() => {})
    }
    function showDetails(event) {
      console.log(event)
      const { id } = event
      const { agenda } = event.extendedProps
      const { title } = event
      this.$confirm(agenda, title, {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          removeRoutine(id)
        })
        .catch(() => {})
    }
    return {
      dialogFormVisible: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'timeGridWeek',
        // dateClick: this.handleDateClick,
        weekends: true,
        editable: true,
        eventResizableFromStart: true,

        slotMinTime: '00:00:00', // "07:45:00",
        slotMaxTime: '23:00:00',
        slotDuration: '00:30:00',
        events: [],
        eventResize(info) {
          const event = info.event._instance.range

          const id = info.event._def.publicId
          const { start } = event
          const { end } = event
          // console.log(info.event)
          renderRoutine(id, start, end, start)
        },
        eventDrop(info) {
          const event = info.event._instance.range

          const id = info.event._def.publicId
          const { start } = event
          const { end } = event
          // console.log(info.event)
          renderRoutine(id, start, end, start)
        },
        eventClick(info) {
          showDetails(info.event)

          //   const id = info.event._def.publicId
          //   // info.event.remove()
          //   // eslint-disable-next-line no-alert
          //   if (window.confirm('Are you sure you want to delete this schedule?')) {
          //     removeRoutine(id)
          //     info.event.remove()
          //   }
        }
      },
      load: false,
      selected_class_id: '',
      class_teachers: [],
      subject_teachers: [],

      form: {
        title: '',
        agenda: '',
        scheduled_at: '',
        date: '',
        ended_at: '',
        duration_minutes: 60,
        location: null,
        meeting_link: null,
        notes: '',
        attendees: []
      },
      days: [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' }
      ]
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    }
  },
  watch: {
    vendorId() {
      this.fetchMeetingSchedule()
    }
  },
  created() {
    this.fetchMeetingSchedule()
  },
  methods: {
    handleDateClick(arg) {
      console.log(arg)
    },
    fetchMeetingSchedule() {
      this.load = true
      const fetchMeetingScheduleResource = new Resource(
        'vdd/client-review-meetings/get-vendor-meetings'
      )
      fetchMeetingScheduleResource.get(this.vendorId).then((response) => {
        this.setEvents(response.data)
        this.load = false
      })

      // console.log(events)
    },
    addMinutes(date, minutes) {
      const dateCopy = new Date(date)
      dateCopy.setMinutes(date.getMinutes() + minutes)
      return dateCopy
    },
    saveRoutine() {
      const param = this.form
      param.vendor_id = this.vendorId
      param.scheduled_at = `${param.date}T${param.start}.000Z`
      param.ended_at = this.addMinutes(new Date(param.scheduled_at), param.duration_minutes)
      param.scheduled_by = this.userData.email
      this.load = true

      const storeRoutineResource = new Resource('vdd/client-review-meetings/store')
      storeRoutineResource.store(param).then((response) => {
        this.dialogFormVisible = false
        if (response.message === 'busy') {
          this.$alert('This teacher is busy at this time')
        } else {
          const classTeacher = response.class_teacher
          const { routines } = classTeacher
          this.setEvents(routines)
        }
        this.load = false
      })

      // console.log(events)
    },
    setEvents(routines) {
      const events = []
      routines.forEach((routine) => {
        if (routine.title) {
          const eachEvent = {
            id: routine.id,
            title: routine.title,
            agenda: routine.agenda,
            start: routine.scheduled_at,
            end: routine.ended_at,
            startTime: routine.scheduled_at,
            endTime: routine.ended_at,
            // backgroundColor: '#f00',
            // textColor: 'white',
            // borderColor: 'white',
            // daysOfWeek: [routine.day],
            allDay: false
          }
          events.push(eachEvent)
        }
      })
      this.calendarOptions.events = events
    }
  }
}
</script>
