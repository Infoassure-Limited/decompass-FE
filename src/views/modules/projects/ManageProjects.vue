<template>
  <el-tabs type="border-card" lazy>
    <el-tab-pane v-if="checkPermission(['manage-project-phases'])" lazy>
      <template v-slot:label>
        <span>Manage Project Phases</span>
      </template>
      <project-phases />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['manage-project-plan'])" lazy>
      <template v-slot:label>
        <span>Manage Project Plan</span>
      </template>
      <project-plan />
    </el-tab-pane>
    <el-tab-pane v-if="checkPermission(['manage-client-projects'])" lazy>
      <template v-slot:label>
        <span>Manage Projects</span>
      </template>
      <client-projects />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ClientProjects from './ClientProjects.vue'
import ProjectPhases from './ProjectPhases.vue'
import ProjectPlan from './ProjectPlan.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    ClientProjects,
    ProjectPhases,
    ProjectPlan
  },
  methods: {
    checkPermission
  }
}
</script>
