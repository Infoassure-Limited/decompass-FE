<template>
  <div v-loading="load">
    <el-row :gutter="10">
      <el-col :md="24">
        <upload-excel-component class="mt-5 mb-5" @success="handleSuccess" />
        <el-button v-if="tableData.length > 0" type="success" @click="submitEntry">
          <icon icon="tabler:send" /> SUBMIT
        </el-button>
      </el-col>
      <el-col :md="24" v-if="tableData.length > 0">
        <el-alert
          title="Preview of what you just uploaded. Scroll right to see more columns"
          type="info"
          :closable="false"
        />
        <div style="max-height: 350px; overflow: auto">
          <table class="table table-bordered" v-if="tableData.length > 0">
            <thead>
              <tr>
                <th v-for="item of tableHeader" :key="item" style="min-width: 150px">
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) of tableData" :key="index">
                <td v-for="item of tableHeader" :key="item" style="min-width: 150px">
                  {{ row[item] }}
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
import UploadExcelComponent from '@/views/Components/UploadExcel/index.vue'
import Resource from '@/api/resource'
import exportToExcelWithDropdown from '@/vendor/Excel'

export default {
  components: {
    UploadExcelComponent
  },
  props: {
    assetTypes: {
      type: Array,
      default: () => []
    },
    clientId: {
      type: Number,
      default: null
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fill_fields_error: false,
      showCreate: false,
      tableData: [],
      tableHeader: [],
      form: {
        asset_type_id: null,
        asset_type_name: '',
        assets: []
      },
      selectedAssetType: null,
      users: [],
      load: false
    }
  },
  mounted() {
    this.users = this.staff.map((user) => user.name)
  },
  methods: {
    setSampleAssets() {
      this.form.asset_type_id = this.selectedAssetType.id
      this.form.asset_type_name = this.selectedAssetType.name
    },
    handleDownload() {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        // const multiHeader = [['List of Products', '', '', '', '']];
        const tHeader = [
          'ASSET_NAME',
          'ASSET_DESCRIPTION',
          'PURPOSE_OF_ASSET',
          'ASSET_CLASSIFICATION',
          'INFORMATION_STORED',
          'ASSET_LOCATION',
          'ASSET_OWNER'
        ]
        // const filterVal = []
        // const list = [] // this.items
        const data = [] // this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          // multiHeader,
          header: tHeader,
          data,
          filename: 'ASSET_BULK_UPLOAD_TEMPLATE',
          autoWidth: true,
          bookType: 'xlsx'
        })
        // this.downloadLoading = false
      })
    },
    handleExport() {
      let asset_samples = []

      if (this.selectedAssetType.asset_samples !== null) {
        asset_samples = this.selectedAssetType.asset_samples
      }
      const myData = [
        {
          ASSET_NAME: 'Sample Asset Name goes here',
          ASSET_DESCRIPTION: 'Asset Description goes here',
          PURPOSE_OF_ASSET: 'Purpose of Asset goes here',
          ASSET_CLASSIFICATION: 'Public',
          INFORMATION_STORED: 'Customer Data',
          ASSET_LOCATION: 'Remote',
          ASSET_OWNER: ''
        }
      ]
      asset_samples.forEach((asset_sample) => {
        myData.push({
          ASSET_NAME: asset_sample,
          ASSET_DESCRIPTION: '',
          PURPOSE_OF_ASSET: '',
          ASSET_CLASSIFICATION: '',
          INFORMATION_STORED: '',
          ASSET_LOCATION: '',
          ASSET_OWNER: ''
        })
      })
      const categoryOptions = [
        { options: ['Public', 'Internal', 'Confidential', 'Restricted'], column: 4 },
        {
          options: [
            'Personal Data',
            'Financial Data',
            'Organization Data',
            'Operational Data',
            'Customer Data',
            'Intellectual Property'
          ],
          column: 5
        },
        { options: ['Physical', 'Remote'], column: 6 },
        { options: this.users, column: 7 }
      ]
      exportToExcelWithDropdown(myData, categoryOptions, `${this.selectedAssetType.name}.xlsx`)
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(results);
    },
    submitEntry() {
      const { form } = this
      if (form.asset_type_id === '') {
        this.$message({ message: 'Please select an asset type', type: 'danger' })
      } else {
        this.load = true
        form.assets = this.tableData

        const uploadBulkAssets = new Resource('assets/upload-bulk-assets')
        uploadBulkAssets
          .store(form)
          .then((response) => {
            this.load = false
            this.tableData = response.unsaved_data
            if (this.tableData.length > 0) {
              this.$alert('Some data could not be uploaded')
            } else {
              this.tableHeader = []
              this.$message({ message: 'Bulk upload Successful!!!', type: 'success' })
            }
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
