<template>
  <div class="">
    <el-row :gutter="10" class="padded">
      <el-col :xs="24" :sm="12" :md="12">
        <div style="background: #f0f0f0; color: #000000; padding: 10px">
          <strong>Kindly follow the steps below to upload threats in bulk from csv file.</strong>
          <ol>
            <li
              ><code><a @click="handleDownload">Download CSV Format</a></code> to get the file
              format</li
            >
            <li>Open with a spreadsheet package, example Microsoft Excel package</li>
            <li
              >Leave the Table Header Names the way they are and
              <strong class="red">DO NOT MODIFY THEM</strong></li
            >
            <li
              >Fill the downloaded csv file accordingly as guided by the Header Names. Each row for
              an entry. <br /><strong class="red">DO NOT leave any cell blank.</strong></li
            >
            <!-- <li>Delete the two sample entries given to guide you and start from row number two (2) in the file.</li> -->
            <li
              >When done with all entries, SAVE your file with .csv (Comma delimited) file
              extension. <strong class="red">For example threat_sheet_1.csv</strong></li
            >
            <li>Preview your work and click on SUBMIT if satisfied</li>
            <li>CONGRATULATIONS!!! You are done.</li>
          </ol>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-row v-loading="loader">
          <el-col cols="12" class="mb-2">
            <el-alert variant="primary" show>
              <div class="alert-body">
                <h5><strong>Fill the Form below</strong></h5>
              </div>
            </el-alert>
          </el-col>
          <el-col md="12">
            <upload-excel-component :on-success="handleSuccess" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <legend v-if="tableData.length > 0">
      Preview what you just uploaded and then click on the submit button.
      <a class="btn btn-success" @click="uploadBulkData">SUBMIT</a>
    </legend>
    <div style="height: 600px; overflow: auto">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
      </el-table>
    </div>
    <legend v-if="tableData.length > 0">
      Click on the submit button. <a class="btn btn-success" @click="uploadBulkData">SUBMIT</a>
    </legend>
  </div>
</template>

<script>
import UploadExcelComponent from '@/views/components/UploadExcel/index.vue'
import Resource from '@/api/resource'

export default {
  name: 'UploadBulk',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      fill_fields_error: false,
      tableData: [],
      tableHeader: [],
      form: {
        bulk_data: []
      },
      clauses: [],
      loader: false
    }
  },
  created() {},
  methods: {
    handleDownload() {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        // const multiHeader = [['List of Products', '', '', '', '']];
        const tHeader = ['THREATS', 'SOLUTIONS', 'VULNERABILITIES']
        // const filterVal = []
        // const list = [] // this.items
        const data = [] // this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          // multiHeader,
          header: tHeader,
          data,
          filename: 'BULK THREAT UPLOAD SAMPLE FILE',
          autoWidth: true,
          bookType: 'csv'
        })
        // this.downloadLoading = false
      })
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(results);
    },
    uploadBulkData() {
      const { form } = this
      form.bulk_data = this.tableData
      this.loader = true
      const uploadBulk = new Resource('risk-library/store-bulk')
      uploadBulk
        .store(form)
        .then(() => {
          this.tableHeader = []
          this.$message({ message: 'Bulk upload Successful!!!', type: 'success' })
          this.$emit('save')
          this.loader = false
        })
        .catch((error) => {
          this.$message({ message: error, type: 'danger' })
        })
    }
  }
}
</script>
<style scoped>
.red {
  color: #c40505;
}
</style>
