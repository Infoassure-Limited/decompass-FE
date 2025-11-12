<template>
  <div>
    <el-row>
      <el-col :md="8">
        <el-select
          v-model="category"
          placeholder="Select Policy Category"
          value-key="id"
          style="width: 100%"
        >
          <el-option
            v-for="(cat, index) in policy_categories"
            :key="index"
            :label="cat.name"
            :value="cat"
          />
        </el-select>
      </el-col>
      <el-col :md="24">
        <PolicyTable v-if="category !== null" :category="category" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import PolicyTable from './PolicyTable.vue'

export default {
  components: {
    PolicyTable
  },
  data() {
    return {
      policy_categories: [],
      loading: false,
      category: null
    }
  },
  created() {
    this.fetchPolicyCategories()
  },
  methods: {
    fetchPolicyCategories() {
      const fetchEntryResource = new Resource('policy/policy-categories')
      this.loading = true
      fetchEntryResource
        .list()
        .then((response) => {
          this.policy_categories = response.data
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
</script>
