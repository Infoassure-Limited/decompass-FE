<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane v-if="checkRole(['admin'])" label="Manage Schedules & Tasks">
      <ModuleCalendar :selected-module="module" />
    </el-tab-pane>
    <!-- <el-tab-pane v-if="checkRole(['admin'])" label="All Scheduled Tasks" lazy>
      <Calendar :selected-module="module" />
    </el-tab-pane> -->
    <el-tab-pane v-if="checkRole(['user', 'admin'])" label="My Tasks">
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
import checkRole from '@/utils/role'
// import ModuleCalendar from './partials/ModuleCalendar.vue'
// import AssignedCalendar from './partials/AssignedCalendar.vue'
import ModuleCalendar from '@/views/modules/ModuleSetup/Calendar/ModuleCalendar.vue'
import AssignedCalendar from '@/views/modules/ModuleSetup/Calendar/AssignedCalendar.vue'
export default {
  components: {
    ModuleCalendar,
    // Calendar,
    // MyCalendar,
    AssignedCalendar
  },

  data() {
    return {
      module: 'bcms'
    }
  },
  methods: {
    checkRole
  }
}
</script>
