<template>
  <el-tabs type="border-card">
    <el-tab-pane v-if="checkPermission(['manage-ndpa-process'])" label="Manage Schedules & Tasks">
      <ModuleCalendar :selected-module="module" />
    </el-tab-pane>
    <!-- <el-tab-pane v-if="checkRole(['admin'])" label="All Scheduled Tasks" lazy>
      <Calendar :selected-module="module" />
    </el-tab-pane> -->
    <el-tab-pane v-if="checkRole(['user', 'admin'])" label="My Tasks">
      <AssignedCalendar :selected-module="module" />
    </el-tab-pane>
    <!-- <el-tab-pane v-if="checkRole(['user', 'admin'])" label="My Tasks">
      <MyCalendar :selected-module="module" />
    </el-tab-pane> -->
  </el-tabs>
  <!-- <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
  </div> -->
</template>

<script>
import Calendar from '@/views/modules/ModuleSetup/Calendar/partials/Calendar.vue'
import MyCalendar from '@/views/modules/ModuleSetup/Calendar/TaskCalendar.vue'
import checkRole from '@/utils/role'
import checkPermission from '@/utils/permission'
import ModuleCalendar from '@/views/modules/ModuleSetup/Calendar/ModuleCalendar.vue'
import AssignedCalendar from '@/views/modules/ModuleSetup/Calendar/AssignedCalendar.vue'
// import ModuleCalendar from './partials/ModuleCalendar.vue'
// import AssignedCalendar from './partials/AssignedCalendar.vue'
export default {
  components: {
    ModuleCalendar,
    // Calendar,
    // MyCalendar
    AssignedCalendar
  },

  data() {
    return {
      module: 'ndpa'
    }
  },
  methods: {
    checkRole,
    checkPermission
  }
}
</script>
