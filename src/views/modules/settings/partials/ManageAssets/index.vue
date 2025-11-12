<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :md="12">
        <h3> Asset Management </h3>
        <small>Grouped by Asset Types</small>
      </el-col>
    </el-row>
    <el-container style="height: 100%">
      <el-aside
        v-loading="loading"
        element-loading-text="loading resources, please wait..."
        width="400px"
      >
        <div class="mb-2">
          <el-button-group v-if="checkPermission(['create-assets'])">
            <el-button type="primary" block @click="showCreate = true">
              <icon icon="tabler:plus" />&nbsp;Create An Asset
            </el-button>
            <el-button type="info" block @click="showBulkUploadModal = true">
              <icon icon="tabler:upload" />&nbsp;Upload Bulk Assets
            </el-button>
          </el-button-group>
        </div>
        <el-input v-model="form.name" placeholder="Search Asset" @input="fetchAssets(false)">
          <template v-slot:append>
            <el-button size="sm" @click="fetchAssets(true)">
              <icon icon="tabler:search" />
            </el-button>
          </template>
        </el-input>
        <div style="max-height: 500px; overflow: auto; margin-top: 10px">
          <el-collapse expand-icon-position="left" accordion>
            <el-collapse-item
              v-for="(assetsArray, index) in assets"
              :key="index"
              :name="`asset-${index}`"
            >
              <template #title>
                <span>
                  <el-tag class="pull-right" effect="dark" round>{{ assetsArray.length }}</el-tag>
                  <h3>{{ index }}</h3>
                </span>
              </template>
              <div v-for="(asset, index) in assetsArray" :key="index">
                <CardNavView
                  :id="asset.id"
                  :title="asset.name"
                  :description="asset.description"
                  @clickToView="viewDetails(asset)"
                />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>

      <el-container>
        <el-main v-loading="loadView" element-loading-text="loading data, please wait...">
          <div v-if="viewType === 'edit'">
            <EditAsset
              v-if="checkPermission(['update-assets'])"
              :selected-asset="selectedData"
              :asset-types="asset_types"
              :staff="staff"
              @update="(fetchAssets(), (editModal = false))"
              @deleted="(fetchAssets(), (viewType = 'welcome'))"
            />
            <ViewAsset
              v-else
              :selected-asset="selectedData"
              :asset-types="asset_types"
              :staff="staff"
              @update="(fetchAssets(), (editModal = false))"
              @deleted="(fetchAssets(), (viewType = 'welcome'))"
            />
          </div>
          <div v-if="viewType === 'welcome'" align="center">
            <icon icon="tabler:packages" size="200" />
            <h3>Manage assets for your organization here</h3>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog v-model="showCreate" title="Create Asset" width="60%" destroy-on-close hide-footer>
      <CreateAsset
        :asset-types="asset_types"
        :client-id="storedClient.id"
        :staff="staff"
        @save="(fetchAssets(), (showCreate = false))"
        @updateAssetTypes="fetchAssetTypes"
      />
    </el-dialog>
    <el-drawer
      v-model="showBulkUploadModal"
      title="Upload bulk assets"
      size="87%"
      destroy-on-close
      hide-footer
    >
      <UploadBulkAssets
        :asset-types="asset_types"
        :client-id="storedClient.id"
        :staff="staff"
        @save="(fetchAssets(), (showCreate = false))"
        @updateAssetTypes="fetchAssetTypes"
      />
    </el-drawer>
    <!-- <el-dialog
      v-model="showCreate"
      title="Create Asset Types"
      width="50%"
      destroy-on-close
      hide-footer
    >
      <CreateAssetType :client-id="storedClient.id" @saved="fetchAssetTypes" />
    </el-dialog> -->
  </el-card>
</template>
<script>
import checkPermission from '@/utils/permission'
import CardNavView from '@/views/Components/CardNavView.vue'
import Resource from '@/api/resource'
// import Assets from './AssetsCardView.vue'
// import CreateAssetType from './CreateAssetType.vue'
import CreateAsset from './CreateAsset.vue'
import EditAsset from './EditAsset.vue'
import UploadBulkAssets from './UploadBulkAssets.vue'
import ViewAsset from './ViewAsset.vue'

export default {
  components: {
    // Assets,
    CardNavView,
    // CreateAssetType,
    CreateAsset,
    EditAsset,
    ViewAsset,
    UploadBulkAssets
  },
  data() {
    return {
      selectedAssetType: '',
      viewType: 'welcome',
      form: { client_id: '', name: '' },
      assets: null,
      asset_types: [],
      loading: false,
      showCreate: false,
      showBulkUploadModal: false,
      columns: ['name', 'action'],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: []
      },
      selectedData: null,
      staff: []
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
      this.form.client_id = this.storedClient.id
      this.fetchAssets()
    }
  },
  mounted() {
    this.fetchClients()
    this.form.client_id = this.storedClient.id
    this.fetchAssets()
    this.fetchAssetTypes()
    this.fetchStaff()
  },
  methods: {
    checkPermission,
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
          this.loadView = false
        }, 100)
      }
    },
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('assets/fetch-asset-types')
      fetchEntryResource
        .list(/*{ client_id: this.form.client_id }*/)
        .then((response) => {
          this.asset_types = response.asset_types
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchAssets(load = true) {
      this.showCreate = false
      const fetchEntryResource = new Resource('assets/fetch-assets')
      this.loading = load
      fetchEntryResource
        .list({ client_id: this.form.client_id, name: this.form.name })
        .then((response) => {
          this.assets = response.assets
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
      fetchMatriceResource.update(id, { name }).then().catch()
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
