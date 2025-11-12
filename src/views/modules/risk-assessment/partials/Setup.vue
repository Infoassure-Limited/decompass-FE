<template>
  <el-card>
    <el-tabs vertical content-class="mt-1">
      <el-tab lazy title="Asset Types">
        <asset-types />
      </el-tab>
      <el-tab lazy title="Categories">
        <categories />
      </el-tab>
      <!-- <el-tab
        lazy
        title="Impacts"
      >
        <impacts />
      </el-tab>
      <el-tab
        lazy
        title="Likelihoods"
      >
        <likelihoods />
      </el-tab> -->
    </el-tabs>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import AssetTypes from './AssetTypes.vue'
import Categories from './Categories.vue'
// import Likelihoods from './Likelihoods.vue'
// import Impacts from './Impacts.vue'

export default {
  components: {
    AssetTypes,
    Categories
    // Likelihoods,
    // Impacts,
  },
  data() {
    return {}
  },
  methods: {
    checkPermission
  }
}
</script>
