<!-- eslint-disable prettier/prettier -->
<template>
  <div v-loading="load">
    <el-row :gutter="10">
      <el-col :md="24" v-if="tableData.length > 0">        
        <el-button class="pull-right" :disabled="rowIsEmpty()" type="primary" @click="submitBulkAssets">
          <icon icon="tabler:send" /> SUBMIT
        </el-button>
        <div class="mt-10" style="height: 550px; overflow: auto">
          <table class="table table-bordered" v-if="tableData.length > 0">
            <thead>
              <tr>
                <th ></th>
                <th v-for="item of tableHeader" :key="item" style="min-width: 150px">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) of tableData" :key="index">
                <td>
                  <el-button-group>
                    <el-button
                      v-if="tableData.length > 1"
                      type="danger"
                      circle
                      size="mini"
                      @click="removeLine(index)"
                    >
                      <icon icon="tabler:trash" />
                    </el-button>
                    <el-button
                      v-if="index + 1 === tableData.length"
                      type="success"
                      circle
                      size="mini"
                      @click="addLine(index)"
                    >
                      <icon icon="tabler:plus" />
                    </el-button>
                  </el-button-group>
                </td>
                <td v-for="dataKey of tableDataKey" :key="dataKey" style="min-width: 150px">
                  <div v-if="dataKey === 'domain'">
                    <el-select v-model="row[dataKey]" style="width: 100%" placeholder="Select Domain">
                      <el-option v-for="(domain, index) in domains" :key="index" :label="domain" :value="domain" />
                    </el-select>
                  </div>
                  <div v-else-if="dataKey === 'answer_type'">
                    <el-select v-model="row[dataKey]" style="width: 100%" placeholder="Select Answer Type">
                      <el-option v-for="(type, index) in answer_types" :key="index" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div v-else-if="dataKey === 'upload_evidence'">
                    <el-select v-model="row[dataKey]" style="width: 100%" placeholder="Select Answer Type">
                      <el-option v-for="(type, index) in isEvidenceRequired" :key="index" :label="type.label" :value="type.value" />
                    </el-select>
                  </div>
                  <div v-else>
                    <el-input
                      v-model="row[dataKey]"
                      type="text"
                      :placeholder="`Type here...`"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="fill_fields_error">
                <td colspan="6">
                  <label class="alert alert-danger"
                    >Please fill all empty fields before adding another row</label
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import exportToExcelWithDropdown from '@/vendor/Excel'

export default {
  name: 'UploadBulk',
  components: {},
  data() {
    return {
      fill_fields_error: false,
      showCreate: false,
      tableData: [],
      tableHeader: ['REQUIREMENT', 'HINT', 'DOMAIN', 'ANSWER TYPE', 'EVIDENCE UPLOAD REQUIRED'],
      tableDataKey: ['question', 'key', 'domain', 'answer_type', 'upload_evidence'],
      domains: [
        'COMPANY INFORMATION',
        'INFORMATION SECURITY AND DATA PRIVACY',
        'BUSINESS CONTINUITY MANAGEMENT/DISASTER RECOVERY',
        'PHYSICAL SECURITY',
        'PERSONNEL SECURITY',
        'INCIDENCE RESPONSE',
        'SYSTEMS AND NETWORK SECURITY',
        'CHANGE CONTROL',
        'AUDITS AND TECHNICAL TESTING',
        'LOGICAL ACCESS CONTROL'
      ],
      answer_types: [
        { value: 'yes-no', label: 'Yes or No' },
        { value: 'open-ended', label: 'Open Ended' },
        { value: 'both', label: 'Both' }
      ],
      isEvidenceRequired: [
        { value: 1, label: 'Yes' },
        { value: 0, label: 'No' }
      ],
      form: {
        details: []
      },
      load: false,
      blockRemoval: false
    }
  },
  mounted() {
    this.addLine()
  },
  methods: {
    rowIsEmpty() {
      return this.tableData.some(
        (detail) => detail.question === '' || detail.domain === '' || detail.answer_type === ''
      )
    },
    addLine() {
      this.fill_fields_error = false

      if (this.rowIsEmpty() && this.tableData.length > 0) {
        this.fill_fields_error = true
      } else {
        this.tableData.push({
          question: '',
          key: '',
          domain: '',
          answer_type: '',
          upload_evidence: 1
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.tableData.splice(detailId, 1)
      }
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(results);
    },
    submitBulkAssets() {
      const { form } = this
      if (this.rowIsEmpty()) {
        this.$alert({ message: 'Please fill all empty fields', type: 'danger' })
      } else {
        this.load = true
        form.details = this.tableData

        const uploadBulkAssets = new Resource('vdd/questions/save')
        uploadBulkAssets
          .store(form)
          .then((response) => {
            this.load = false
            this.tableData = []
            this.$message({ message: 'Requirements upload Successful!!!', type: 'success' })
            this.addLine()
            this.$emit('save')
          })
          .catch((error) => {
            this.load = false
            this.$message({ message: error, type: 'danger' })
          })
      }
    }
  }
}
</script>
<style scoped>
.red {
  color: #c40505;
}
</style>
