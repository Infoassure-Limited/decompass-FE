<template>
  <div v-loading="loading">
    <div>
      <el-row>
        <el-col :md="12">
          <h3>Manage User Access</h3>
        </el-col>
        <el-col :md="12">
          <span class="pull-right">
            <el-button type="primary" @click="isCreateActive = true">
              <Icon icon="tabler:plus" />
              <span class="align-middle">Create</span>
            </el-button>
          </span>
        </el-col>
      </el-row>
    </div>

    <aside>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="8" :md="8">
          <el-select
            v-model="selectedBusinessUnit"
            value-key="id"
            placeholder="Select Business Unit"
            style="width: 100%"
            @change="fetchOtherUsers()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit"
              :label="business_unit.unit_name"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8">
          <div v-if="selectedBusinessUnit !== null">
            Access Code:
            <code v-loading="loadCode"> {{ selectedBusinessUnit.access_code }} &nbsp;</code>

            <el-button size="small" type="success" @click="refreshCode()"> New Code </el-button>
          </div>
        </el-col>
      </el-row>
    </aside>
    <v-client-table :data="users" :columns="['name', 'email', 'action']" :options="{}">
      <template v-slot:action="props">
        <div>
          <el-tooltip content="Edit" placement="top">
            <el-button type="default" @click="editRow(props.row)">
              <Icon icon="tabler:edit" />
            </el-button>
          </el-tooltip>
          <!-- <el-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </el-button> -->
        </div>
      </template>
    </v-client-table>
    <el-drawer
      v-model="isCreateActive"
      title="Create Team Members"
      direction="rtl"
      destroy-on-close
    >
      <create-other-user
        :selected-client="selectedClient"
        :business-units="business_units"
        @save="fetchOtherUsers"
      />
    </el-drawer>
    <el-drawer v-model="isEditActive" title="Edit Team Members" direction="rtl" destroy-on-close>
      <edit-other-user
        :business-units="business_units"
        :selected-user="selectedUser"
        @update="fetchOtherUsers"
      />
    </el-drawer>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateOtherUser from './CreateOtherUser.vue'
import EditOtherUser from './EditOtherUser.vue'

export default {
  components: {
    CreateOtherUser,
    EditOtherUser
  },
  data() {
    return {
      loading: false,
      pageLength: 10,
      dir: false,
      users: [],
      business_units: [],
      business_unit_id: '',
      selectedBusinessUnit: null,
      selectedClient: null,
      selectedUser: null,
      isCreateActive: false,
      isEditActive: false,
      loadCode: false
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    storedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    storedClient() {
      this.selectedClient = this.storedClient
      this.fetchBusinessUnits()
    }
  },
  created() {
    this.fetchClients()
    this.selectedClient = this.storedClient
    this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    },
    fetchBusinessUnits() {
      this.selectedBusinessUnit = null
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchOtherUsers() {
      this.loading = true
      const fetchOtherClientUsersResource = new Resource('business-units/fetch-other-users')
      fetchOtherClientUsersResource
        .list({ business_unit_id: this.selectedBusinessUnit.id })
        .then((response) => {
          this.loading = false
          this.users = response.users
        })
        .catch(() => {
          this.loading = false
        })
    },
    refreshCode() {
      this.loadCode = true
      const fetchOtherClientUsersResource = new Resource('business-units/refresh-access-code')
      fetchOtherClientUsersResource
        .update(this.selectedBusinessUnit.id)
        .then((response) => {
          this.loadCode = false
          this.selectedBusinessUnit = response.business_unit
        })
        .catch(() => {
          this.loadCode = false
        })
    },
    editRow(row) {
      this.selectedUser = row
      this.isEditActive = true
    }
  }
}
</script>
