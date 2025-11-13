<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-col :md="24">
      <small> The assignees will be reponsible for providing more details about this risk </small>
      <el-select
        v-model="form.assignee_ids"
        placeholder="Select Assignee"
        multiple
        filterable
        style="width: 100%"
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
    </el-col>
    <el-row>
      <el-col :md="24">
        <el-button-group class="pull-right">
          <el-button
            :disabled="form.assignee_ids.length < 1 && form.threats.length < 1"
            type="success"
            @click="submit()"
          >
            <icon icon="tabler:device-floppy" />Save
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
    // Editor
    // FormWizard,
    // TabContent
    // BButton,
  },
  props: {
    threats: {
      type: Array,
      default: () => []
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        assignee_ids: [],
        threats: []
      }
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {
    this.setAssetIds()
  },
  methods: {
    setAssetIds() {
      const threats = []
      this.threats.forEach((threat) => {
        threats.push(threat.id)
      })
      this.form.threats = threats
      this.form.assignee_ids = this.threats[0].assignee_ids !== null ? this.threats[0].assignee_ids : []
    },
    filterMethod(query, item) {
      return item.threats.toLowerCase().includes(query.toLowerCase())
    },
    submit() {
      this.loading = true
      const saveRisksResource = new Resource('assign-risk-registers')
      saveRisksResource
        .store(this.form)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$message({
            message: 'Assigned Successfully',
            type: 'success'
          })
          this.$emit('done')
          // this.$emit('update:is-create-business-process-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
