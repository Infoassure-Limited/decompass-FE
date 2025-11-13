<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div v-loading="loading">
    <el-col :md="24">
      <small> The assignee will be reponsible for providing more details about this risk </small>
      <el-select
        v-model="form.assignee_id"
        placeholder="Select Assignee"
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
    <div> Pick from the list of threats to assign. When done, click on Save. <br /> </div>
    <div v-loading="loadSearch" style="max-height: 400px; overflow: auto">
      <el-table
        :data="threats"
        row-key="id"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="threat" label="Threats" />
        <el-table-column label="Vulnerabilities">
          <template #default="scope">{{ scope.row.vulnerability_description }}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-row>
      <el-col :md="24">
        <el-button-group class="pull-right">
          <el-button
            :disabled="form.assignee_id !== null && form.risk_registers.length < 1"
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
        risk_registers: [],
        assignee_id: null
      }
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      const selectedData = []
      selectedData.push(
        ...val.map((item) => {
          return {
            id: item.id
          }
        })
      )
      this.form.risk_registers = selectedData
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
