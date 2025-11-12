<template>
  <div>
    <aside>
      <h3>Create Risk Likelihood</h3>
      <el-row :gutter="10">
        <el-col :md="20">
          <label>Type in the likelihood and hit enter to add more</label>
          <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Example: Unlikely, likely"
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
    <v-client-table :data="likelihoods" v-loading="loading" :columns="columns" :options="options">
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
      likelihoods: [],
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
    this.fetchLikelihoods()
  },
  methods: {
    fetchLikelihoods() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      this.loading = true
      fetchEntryResource
        .list()
        .then((response) => {
          this.likelihoods = response.likelihoods
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    submitEntry() {
      const saveEntryResource = new Resource('risk-assessment/save-likelihoods')
      this.loading = true
      saveEntryResource
        .store(this.form)
        .then(() => {
          this.fetchLikelihoods()
          this.loading = false
          this.form = { names: [] }
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-likelihood')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchLikelihoods()
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
