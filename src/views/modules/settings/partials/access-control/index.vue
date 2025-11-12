<template>
  <el-card>
    <roles />
    <!-- <el-tabs pills nav-class="nav-pill-primary" content-class="mt-1">
      <el-tab-pane>
        <template #label>
          <feather-icon icon="UsersIcon" />
          <span>Manage Role</span>
        </template>
        <roles />
      </el-tab-pane>
      <el-tab-pane lazy>
        <template #label>
          <feather-icon icon="KeyIcon" />
          <span>Assign Privileges</span>
        </template>
        <assign-access />
      </el-tab-pane>
    </el-tabs> -->
  </el-card>
</template>

<script>
import Roles from './Roles.vue'
// import AssignAccess from './partials/AssignAccess.vue'

export default {
  components: {
    Roles
    // AssignAccess
  }
}
</script>
