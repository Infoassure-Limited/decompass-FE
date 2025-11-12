<template>
  <el-tabs type="border-card">
    <el-tab-pane label="Manage Requirements" :lazy="true">
      <clauses />
    </el-tab-pane>
    <el-tab-pane label="Manage Audit Questions" :lazy="true">
      <questions />
    </el-tab-pane>
    <el-tab-pane label="Manage Project phases" :lazy="true">
      <project-phases :module-id="moduleId" />
    </el-tab-pane>
    <el-tab-pane label="Manage Project Plan" :lazy="true">
      <project-plan :module-id="moduleId" />
    </el-tab-pane>
    <!-- <el-tab-pane
      label="Manage Project"
      :lazy="true"
    >
      <client-projects />
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import checkPermission from '@/utils/permission'
import Questions from './Questions.vue'
import Clauses from './Clauses.vue'
import ProjectPhases from './ProjectPhases.vue'
import ProjectPlan from './ProjectPlan.vue'
// import ClientProjects from './ClientProjects.vue'

export default {
  components: {
    Questions,
    Clauses,
    ProjectPhases,
    ProjectPlan
    // ClientProjects,
  },
  props: {
    moduleId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    checkPermission
  }
}
</script>
