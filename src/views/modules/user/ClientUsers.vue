<template>
  <el-card>
    <ClientUsersList />
    <!-- <el-tabs content-class="mt-1">
      <el-tab-pane lazy>
        <template #label>
          <icon icon="tabler:list" />
          <span>&nbsp;Users List</span>
        </template>
        <ClientUsersList />
      </el-tab-pane>
      <el-tab-pane lazy>
        <template #label>
          <icon icon="tabler:users-plus" />
          <span>&nbsp;Register Users</span>
        </template>
        <RegisterUserClient />
      </el-tab-pane>
    </el-tabs> -->
  </el-card>
</template>

<script>
import ClientUsersList from './partials/ClientUsersList.vue'
// import RegisterUserClient from './partials/RegisterUserClient.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    ClientUsersList
    // RegisterUserClient
  },
  methods: {
    checkPermission
  }
}
</script>
