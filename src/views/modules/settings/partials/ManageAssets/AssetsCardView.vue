<template>
  <div v-loading="loading">
    <!-- <v-btn color="black" block @click="createModal = true">
      <icon icon="tabler:plus" />&nbsp;Add Asset under {{ assetType.name }}
    </v-btn>
    <br /> -->
    <el-card
      v-for="(asset, index) in assetsArray"
      :key="index"
      :id="index"
      @click="viewDetails(asset, index)"
      style="cursor: pointer; margin-bottom: 5px"
      shadow="hover"
    >
      <div style="font-size: 14pt; font-weight: 600">{{ asset.name }}</div>
      <!-- <strong>{{ `TASK ${activity.activity_no}-${task.id}` }}</strong> -->
      <div>
        <em><span v-html="asset.description"></span></em>
        <br />
        <icon icon="tabler:arrow-badge-right" />Purpose: {{ asset.purpose }}
        <!-- <br />
        <span>
          <icon icon="tabler:user" />Owner:
          {{ asset.owner ? asset.owner.name : 'Not Assigned' }}
        </span>
        <br /> -->
      </div>
    </el-card>
    <!-- <el-dialog v-model="createModal" title="Create Asset" width="60%" destroy-on-close hide-footer>
      <div style="max-height: 500px; overflow: auto">
        <CreateAsset
          :asset-type-id="assetType.id"
          :client-id="clientId"
          @save="(fetchAssets(), (createModal = false))"
        />
      </div>
    </el-dialog> -->
    <!-- <el-dialog v-model="editModal" title="Edit Asset" destroy-on-close hide-footer>
      <EditAsset :selected-asset="selectedAsset" @update="(fetchAssets(), (editModal = false))" />
    </el-dialog> -->
  </div>
</template>

<script>
import Resource from '@/api/resource'
import CreateAsset from './CreateAsset.vue'
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'
// import EditAsset from './EditAsset.vue'

export default {
  components: {
    // BModal,
    // CreateAsset
    // EditAsset
  },
  props: {
    assetsArray: {
      type: Array,
      default: () => []
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
  created() {},
  methods: {
    viewDetails(asset, viewId) {
      if (asset.id) {
        this.$emit('clickToView', asset)

        this.changeActiveTabBgColor(viewId)
      }
    },
    changeActiveTabBgColor(viewId) {
      const root = document.documentElement // Get the root element (<html>)
      // root.style.setProperty('--el-color-primary', '#ff0000')
      const primaryBgColor = root.style.getPropertyValue('--el-color-primary')
      const divs = document.getElementsByClassName('el-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.background = '#ffffff'
          divs[i].style.color = '#000000'
        }
      }
      const doc = document.getElementById(viewId)
      if (doc !== undefined && doc !== null) {
        // Now we know that foo is defined, we are good to go.
        doc.style.background = changeOpacityOfHexaColorCode(primaryBgColor, 0.2)
      }
      // document.getElementById(viewId).style.color = '#ffffff'
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
