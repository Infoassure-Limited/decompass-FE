<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="12">
        <h3> Asset Types </h3>
      </el-col>
      <el-col :md="12">
        <div class="pull-right">
          <el-button v-if="!showCreate" type="primary" @click="showCreate = true"
            ><Icon icon="tabler:plus" /> Create</el-button
          >
          <!-- <el-button v-if="showCreate" type="danger" @click="showCreate = false"
          >Hide Create Form</el-button
        > -->
        </div>
      </el-col>
    </el-row>
    <hr />
    <!-- <v-text-field
      v-model="search"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
    /> -->
    <v-client-table :data="asset_types" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:name="{ row }">
        <div>
          <div v-if="editablerow === row.id">
            <input
              v-model="row.name"
              type="text"
              class="form-control"
              @blur="editAssetType(row.id, $event)"
            />
          </div>
          <div v-else>
            {{ row.name }}
          </div>
        </div>
      </template>

      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button type="default" @click="editablerow = row.id">
                <Icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete">
              <el-button type="danger" plain @click="deleteEntry(row)">
                <Icon icon="tabler:trash" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-dialog
      v-model="showCreate"
      title="Create Asset Types"
      size="lg"
      destroy-on-close
      hide-footer
    >
      <CreateAssetType :client-id="selectedClient.id" @saved="fetchAssetTypes" />
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'
// import Assets from './Assets.vue'
import CreateAssetType from './CreateAssetType.vue'

export default {
  components: {
    // Assets,
    CreateAssetType
  },
  data() {
    return {
      editablerow: null,
      form: { client_id: '', names: [] },
      asset_types: [],
      headers: [
        { key: 'name', title: 'Name' },
        { key: 'action', title: 'Action' }
      ],
      clients: [],
      loading: false,
      showCreate: false,
      columns: ['name', 'action'],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: []
      },
      search: ''
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    this.fetchAssetTypes()
  },
  methods: {
    // fetchClients() {
    //
    //   const fetchBusinessUnitsResource = new Resource('clients')
    //   fetchBusinessUnitsResource.list({ option: 'all' })
    //     .then(response => {
    //       this.clients = response.clients
    //       if (this.clients.length === 1) {
    //         // eslint-disable-next-line prefer-destructuring
    //         this.form.client_id = this.clients[0].id
    //         this.fetchAssetTypes()
    //       }
    //     })
    // },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('assets/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.asset_types = response.asset_types
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    editAssetType(id, event) {
      const name = event.target.value
      const fetchMatriceResource = new Resource('assets/update-asset-type')
      fetchMatriceResource
        .update(id, { name })
        .then(() => {
          this.editablerow = null
        })
        .catch()
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('assets/delete-asset-type')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchAssetTypes()
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error(error.response.data.error)
            this.loading = false
          })
      }
    }
  }
}
</script>
