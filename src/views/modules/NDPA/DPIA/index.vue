<!-- eslint-disable vue/html-indent -->
<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span v-if="isEdit" class="pull-right">
          <el-button type="primary" size="mini" :loading="downloading" @click="isEdit = false">
            View Summary Sheet
          </el-button>
        </span>
        <h4>Data Privacy Impact Assessment</h4>
      </div>
    </template>

    <el-container style="height: 100%; border: 1px solid #eee; background: #fff">
      <el-aside width="300px" style="background-color: #f0f0f0; overflow: auto">
        <div
          style="
            text-align: center;
            background-color: #333333;
            color: #ffffff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          "
        >
          <span>DPIA by Business Units</span>
        </div>
        <aside>
          <el-input v-model="filterText" placeholder="Filter keyword" />
        </aside>
        <el-tree
          ref="tree"
          v-loading="loading"
          class="filter-tree"
          :highlight-current="true"
          :accordion="true"
          :indent="1"
          :data="dpia_data"
          :filter-node-method="filterNode"
          @node-click="viewDetails"
        />
      </el-aside>

      <el-container>
        <el-main v-loading="loadView">
          <div v-if="isEdit">
            <edit-d-p-i-a
              :impacts="impacts"
              :likelihoods="likelihoods"
              :selected-data="selectedData"
              :risk-appetite="risk_appetite"
              @updated="renderViewAgain"
            />
          </div>
          <div v-else>
            <view-details
              :selected-client="selectedClient"
              :impacts="impacts"
              :likelihoods="likelihoods"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import EditDPIA from './partials/EditDPIA.vue'
import ViewDetails from './partials/Details.vue'

export default {
  components: {
    EditDPIA,
    ViewDetails
  },
  props: {
    selectedClient: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedData: null,
      dpia_data: [],
      loading: false,
      treeProps: {
        children: 'details',
        label: 'label'
      },
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      loadView: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchDPIA(true)
    this.setMatrix()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.label.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    createNew() {
      this.isEdit = false
      this.form = { name: '', sub_dpias: [] }
      this.sub_dpias = []
    },
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.isEdit = false
        setTimeout(() => {
          this.selectedData = data
          this.isEdit = true
          this.loadView = false
        }, 10)
      }
    },
    fetchDPIA(load = true) {
      const fetchEntryResource = new Resource('dpia')
      this.loading = load
      this.dpia_data = []
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.dpia_data = response.dpia_data
          this.risk_appetite = response.risk_appetite

          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.fetchDPIA()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
