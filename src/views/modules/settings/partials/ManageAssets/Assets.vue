<template>
  <div v-loading="loading">
    <div>
      <span class="pull-right">
        <el-button type="primary" @click="createModal = true">
          <span class="align-middle">Create Asset</span>
        </el-button>
      </span>
      <h3>{{ assetType.name }} Asset Management</h3>
    </div>
    <v-client-table :data="assets" :columns="columns" :options="options">
      <template v-slot:name="{ row }">
        <div>
          {{ row.name }}
          <!-- <input
            v-model="row.name"
            type="text"
            class="form-control"
            @blur="editAsset(row.id, $event)"
          > -->
        </div>
      </template>
      <template v-slot:owner="props">
        <el-select
          v-model="props.row.owner_id"
          placeholder="Select Asset Owner"
          filterable
          style="width: 100%"
          @change="setAssetOwner(props.index, props.row.id, $event)"
        >
          <el-option
            v-for="(user, user_index) in staff"
            :key="user_index"
            :value="user.id"
            :label="user.name"
          >
            <span style="float: left">{{ user.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              user.designation ? user.designation : ''
            }}</span>
          </el-option>
        </el-select>
        <!-- <el-button
          class="pull-right"
          type="text"
          @click="editableRow = row.id"
        >
          <el-tooltip content="Assign Asset Owner">
            <feather-icon
              size="20"
              icon="UserCheckIcon"
            />
          </el-tooltip>
        </el-button>
        <div v-if="row.owner">
          {{ row.owner.name }}
        </div> -->
      </template>
      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit Asset">
              <el-button type="default" @click="editEntry(row)">
                <Icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete Asset">
              <el-button type="danger" plain @click="deleteEntry(row)">
                <Icon icon="tabler:trash" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-dialog v-model="createModal" title="Create Asset" size="lg" destroy-on-close hide-footer>
      <CreateAsset
        :asset-type-id="assetType.id"
        :client-id="clientId"
        @save="(fetchAssets(), (createModal = false))"
      />
    </el-dialog>
    <el-dialog v-model="editModal" title="Edit Asset" destroy-on-close hide-footer>
      <EditAsset :selected-asset="selectedAsset" @update="(fetchAssets(), (editModal = false))" />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import CreateAsset from './CreateAsset.vue'
import EditAsset from './EditAsset.vue'

export default {
  components: {
    // BModal,
    CreateAsset,
    EditAsset
  },
  props: {
    assetType: {
      type: Object,
      default: null
    },
    clientId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        // 'description',
        'classification',
        'owner',
        'action'
      ],
      options: {
        headings: {
          owner: 'Owner'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        // texts: {
        //   filter: 'Search:'
        // },
        sortable: [],
        // filterable: false,
        filterable: []
      },
      assets: [],
      staff: [],
      form: { names: [] },
      createModal: false,
      editModal: false,
      selectedAsset: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchStaff()
    this.fetchAssets()
  },
  methods: {
    fetchAssets(load = true) {
      this.display = 'table'
      this.loading = load
      const fetchAssetsResource = new Resource('assets/fetch-assets')
      fetchAssetsResource
        .list({ client_id: this.clientId, asset_type_id: this.assetType.id })
        .then((response) => {
          this.assets = response.assets
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    setAssetOwner(index, assetId, userId) {
      this.assets[parseInt(index - 1)].owner_id = userId
      const fetchUsersResource = new Resource('assets/set-asset-owner')
      fetchUsersResource.update(assetId, { owner_id: userId }).then(() => {
        this.$message('Action Successful')
      })
    },
    editEntry(row) {
      this.selectedAsset = row
      this.editModal = true
    }
  }
}
</script>
