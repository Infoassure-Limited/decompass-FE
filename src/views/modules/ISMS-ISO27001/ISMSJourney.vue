<template>
  <el-tabs type="border-card" lazy>
    <el-tab-pane v-if="checkRole(['admin'])" label="Manage Schedules & Tasks">
      <ModuleCalendar :selected-module="module" />
      <!-- <AssignedCalendar v-if="checkRole(['user'])" :selected-module="module" /> -->
    </el-tab-pane>
    <!-- <el-tab-pane v-if="checkRole(['admin'])" label="All Scheduled Tasks" lazy>
      <Calendar :selected-module="module" />
    </el-tab-pane> -->
    <el-tab-pane v-if="checkRole(['user', 'admin'])" label="My Tasks" lazy>
      <AssignedCalendar :selected-module="module" />
    </el-tab-pane>
  </el-tabs>
  <!-- <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
  </div> -->
</template>

<script>
// import Calendar from '@/views/modules/ModuleSetup/Calendar/partials/Calendar.vue'
// import MyCalendar from '@/views/modules/ModuleSetup/Calendar/partials/MyCalendar.vue'
import MyCalendar from '@/views/modules/ModuleSetup/Calendar/TaskCalendar.vue'
import ModuleCalendar from '@/views/modules/ModuleSetup/Calendar/ModuleCalendar.vue'
import AssignedCalendar from '@/views/modules/ModuleSetup/Calendar/AssignedCalendar.vue'
import checkRole from '@/utils/role'
// import AssignedCalendar from './partials/AssignedCalendar.vue'
// import ModuleCalendar from './partials/ModuleCalendar.vue'
export default {
  components: {
    ModuleCalendar,
    // Calendar,
    // MyCalendar
    AssignedCalendar
  },

  data() {
    return {
      module: 'isms'
    }
  },
  methods: {
    checkRole
  }
}
</script>
