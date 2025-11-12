<template>
  <div class="">
    <el-row :gutter="10" class="padded">
      <el-col :xs="24" :sm="12" :md="12">
        <div style="background: #f0f0f0; color: #000000; padding: 10px">
          <strong
            >Kindly follow the steps below to upload questions in bulk (per clause/requirement) from
            csv file.</strong
          >
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
            <li
              >For the ANSWER_TYPE field, use the values<br />*<code>open_ended</code><br />*<code
                >yes-no</code
              ><br />*<code>both</code><br />
              as spelt where applicable</li
            >
            <!-- <li>Delete the two sample entries given to guide you and start from row number two (2) in the file.</li> -->
            <li
              >When done with all entries, SAVE your file with .csv (Comma delimited) file
              extension. <strong class="red">For example question_1.csv</strong></li
            >
            <li>Fill the form accordingly and select the file from where you saved</li>
            <li>Preview your work and click on SUBMIT if satisfied</li>
            <li>CONGRATULATIONS!!! You are done.</li>
          </ol>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <b-row v-loading="loader">
          <b-col cols="12" class="mb-2">
            <b-alert variant="primary" show>
              <div class="alert-body">
                <h5><strong>Fill the Form below</strong></h5>
              </div>
            </b-alert>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Select Requirement" label-for="v-clause">
              <el-select
                v-model="selectedClause"
                value-key="id"
                style="width: 100%"
                @input="setSection()"
              >
                <el-option
                  v-for="(clause, index) in clauses"
                  :key="index"
                  :value="clause"
                  :label="`${clause.name} - ${clause.description}`"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Select Section" label-for="v-section">
              <el-select v-model="form.section_id" style="width: 100%">
                <el-option
                  v-for="(section, index) in sections"
                  :key="index"
                  :value="section.id"
                  :label="`${section.name} - ${section.description}`"
                />
              </el-select>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <upload-excel-component :on-success="handleSuccess" />
          </b-col>
        </b-row>
      </el-col>
    </el-row>
    <legend v-if="tableData.length > 0">
      Preview what you just uploaded and then click on the submit button.
      <a class="btn btn-success" @click="addBulkProductToStock">SUBMIT</a>
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
      Click on the submit button.
      <a class="btn btn-success" @click="addBulkProductToStock">SUBMIT</a>
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
  props: {
    clauses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fill_fields_error: false,
      tableData: [],
      tableHeader: [],
      form: {
        section_id: '',
        clause_id: '',
        bulk_data: []
      },
      selectedClause: '',
      sections: [],
      loader: false
    }
  },
  created() {},
  methods: {
    setSection() {
      this.form.clause_id = this.selectedClause.id
      this.sections = this.selectedClause.sections
    },
    handleDownload() {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        // const multiHeader = [['List of Products', '', '', '', '']];
        const tHeader = ['QUESTION', 'HINT', 'ANSWER_TYPE']
        // const filterVal = []
        // const list = [] // this.items
        const data = [] // this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          // multiHeader,
          header: tHeader,
          data,
          filename: 'BULK QUESTIONS SAMPLE FILE',
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
    addBulkProductToStock() {
      const { form } = app
      if (form.section_id === '') {
        this.$message({
          message: 'Please select a section from a requirement part',
          type: 'danger'
        })
      } else {
        form.bulk_data = this.tableData
        this.loader = true
        const uploadBulkStudents = new Resource('ndpa/questions/upload-bulk')
        uploadBulkStudents
          .store(form)
          .then((response) => {
            this.tableData = response.unsaved_data
            if (this.tableData.length > 0) {
              this.$alert(
                'Some data could not be uploaded. Possible cause may be duplicate questions'
              )
            } else {
              this.tableHeader = []
              this.$message({ message: 'Bulk upload Successful!!!', type: 'success' })
              this.$emit('save')
            }
            this.loader = false
          })
          .catch((error) => {
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
