<template>
  <div>
    <aside>
      <h3>Create Areas of Control</h3>
      <el-row :gutter="10">
        <el-col :md="20">
          <label>Type in the areas and hit enter to add more</label>
          <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="e.g A.5 Organizational Controls, A.6 People Controls"
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
    <v-client-table :data="areas" v-loading="loading" :columns="columns" :options="options">
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
      areas: [],
      loading: false,
      columns: ['name', 'action'],
      options: {
        headings: {
          name: 'Areas'
        },
        filterByColumn: false,
        sortable: [],
        filterable: []
      }
    }
  },
  created() {
    this.fetchAreas()
  },
  methods: {
    fetchAreas() {
      const fetchEntryResource = new Resource('soa/fetch-areas')
      this.loading = true
      fetchEntryResource
        .list()
        .then((response) => {
          this.areas = response.areas
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    submitEntry() {
      const saveEntryResource = new Resource('soa/save-areas')
      this.loading = true
      saveEntryResource
        .store(this.form)
        .then(() => {
          this.fetchAreas()
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
        const saveEntryResource = new Resource('soa/delete-area')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchAreas()
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
