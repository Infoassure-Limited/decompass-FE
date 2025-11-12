<template>
  <div class="container" v-loading="loading">
    <h4>Assign Responder from Staff List</h4>
    <!-- <el-select
        v-model="selectedUser"
        placeholder="Select User"
        filterable
        style="width: 100%"
        @change="assignUser()"
      >
        <el-option
          v-for="(user, index) in client_users"
          :key="index"
          :value="user.id"
          :label="user.name"
        />
      </el-select> -->
    <v-client-table
      :data="client_users"
      :columns="['name', 'email', 'action']"
      :options="{ filterable: false }"
    >
      <template v-slot:email="props">
        {{ props.row.email }}
        <div v-if="props.row.id === selectedIncident.assigned_to" class="pull-right">
          <el-tag type="success">
            <span>Assigned</span>
          </el-tag>
        </div>
      </template>
      <template v-slot:action="props">
        <div v-if="props.row.id !== selectedIncident.assigned_to">
          <el-button type="primary" @click="assignUser(props.row)">
            <span>Assign</span>
          </el-button>
        </div>
      </template>
    </v-client-table>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import { themeOptions } from '@/components/CodeEditor/src/config/config'
export default {
  props: {
    incident: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      client_users: [],
      selectedIncident: null
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.selectedIncident = this.incident
    this.fetchClientUsers()
  },
  methods: {
    fetchClientUsers() {
      this.loading = true
      const clientUsersResource = new Resource('clients/users')
      clientUsersResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.client_users = response.users
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    assignUser(user) {
      this.$confirm(
        `Are you sure you want to assign this incident to ${user.name} ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const assignUserResource = new Resource('isms/incidents/assign-user')
          assignUserResource
            .update(this.incident.id, { assigned_to: user.id })
            .then((response) => {
              this.$message.success('User assigned successfully')
              this.selectedIncident.assigned_to = user.id
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
