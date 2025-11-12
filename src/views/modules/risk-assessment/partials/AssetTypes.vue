<template>
  <div>
    <aside>
      <h3>Create Asset Types</h3>
      <el-row :gutter="10">
        <el-col :md="20">
          <label>Type in the asset types and hit enter to add more</label>
          <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Example: People, IT equipment, etc"
            style="width: 100%"
          >
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :md="4">
          <label>&nbsp;</label>
          <el-button type="success" style="width: 100%" @click="submitEntry()"> Submit </el-button>
        </el-col>
      </el-row>
    </aside>
    <v-client-table :data="asset_types" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:action="props">
        <div>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteEntry(props.row)" />
        </div>
      </template>
    </v-client-table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  data() {
    return {
      form: { names: [] },
      asset_types: [],
      loading: false,
      columns: ['name', 'action'],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: []
      }
    }
  },
  created() {
    this.fetchAssetTypes()
  },
  methods: {
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list()
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
    submitEntry() {
      const saveEntryResource = new Resource('risk-assessment/save-asset-types')
      this.loading = true
      saveEntryResource
        .store(this.form)
        .then(() => {
          this.fetchAssetTypes()
          this.form = { names: [] }
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-asset-type')
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
