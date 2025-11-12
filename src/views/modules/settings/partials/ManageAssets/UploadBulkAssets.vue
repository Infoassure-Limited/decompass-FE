<template>
  <div v-loading="load">
    <el-row :gutter="10" class="padded">
      <el-col :md="20">
        <el-row :gutter="20">
          <el-col :md="24" class="mb-2">
            <el-alert :closable="false">
              <div class="alert-body">
                <h5><strong>Fill the Form below to continue</strong></h5>
              </div>
            </el-alert>
            <div>
              Select Asset Type
              <a
                class="pull-right"
                style="cursor: pointer; color: darkGreen"
                @click="showCreate = true"
              >
                <icon icon="tabler:plus" />Click to create if not listed
              </a>
            </div>
            <el-select
              v-model="selectedAssetType"
              filterable
              placeholder="Select Asset type"
              value-key="id"
              style="width: 100%"
              @change="setSampleAssets()"
            >
              <el-option
                v-for="(item, index) in assetTypes"
                :key="index"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-col>
          <el-col md="12" v-if="selectedAssetType !== null">
            <a style="cursor: pointer; color: darkBlue" @click="handleExport">
              <icon icon="tabler:download" /> Download Spreadsheet Format
            </a>
          </el-col>
        </el-row>
        <div
          v-if="selectedAssetType !== null"
          style="background: #f0f0f0; color: #000000; padding: 10px"
        >
          <h3>Bulk Upload Guide</h3>
          <p>
            Kindly follow the steps below to upload your available assets, by asset types, from a
            spreadsheet
          </p>
          <ol>
            <!-- <li>
              <h4>Using the form, select the Asset Type for the assets to be uploaded</h4>
            </li> -->
            <template v-if="selectedAssetType !== null">
              <li>
                <a style="cursor: pointer; color: darkBlue" @click="handleExport">
                  <icon icon="tabler:download" /> Download Spreadsheet Format
                </a>
                to get the file format for <strong>{{ selectedAssetType.name }}</strong> assets
              </li>
              <li>Open the file with a spreadsheet package, example Microsoft Excel package</li>
              <li
                >Leave the Table Header Names (First Row) the way they are and
                <strong class="red">DO NOT MODIFY THEM</strong></li
              >
              <li
                >Fill the downloaded spreadsheet file accordingly as guided by the Header Names.
                Each row for an entry. Where no data exist for a column, fill in a NONE.
                <br /><strong class="red">DO NOT leave any cell blank.</strong></li
              >
              <li>
                If not applicable, delete the sample entries given to guide you and input your data
                accordingly
              </li>
              <li
                >When done with all entries, SAVE your file.
                <!-- <strong class="red"> For example {{ selectedAssetType.name }}_Assets.csv </strong> -->
              </li>
              <li>Select the file from where you saved using the form provided</li>
              <li>Preview your work and click on SUBMIT when satisfied</li>
              <li>CONGRATULATIONS!!! You are done.</li>
            </template>
          </ol>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="selectedAssetType !== null" :gutter="10">
      <el-col :md="10">
        <upload-excel-component class="mt-5 mb-5" @success="handleSuccess" />
        <el-button v-if="tableData.length > 0" type="success" @click="submitBulkAssets">
          <icon icon="tabler:send" /> SUBMIT
        </el-button>
      </el-col>
      <el-col :md="14" v-if="tableData.length > 0">
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
          <!-- <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
          </el-table> -->
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-model="showCreate"
      title="Create Asset Types"
      width="40%"
      destroy-on-close
      hide-footer
    >
      <CreateAssetType @saved="($emit('updateAssetTypes'), (showCreate = false))" />
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/views/Components/UploadExcel/index.vue'
import CreateAssetType from './CreateAssetType.vue'
import Resource from '@/api/resource'
import exportToExcelWithDropdown from '@/vendor/Excel'

export default {
  name: 'UploadBulk',
  components: {
    UploadExcelComponent,
    CreateAssetType
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
    submitBulkAssets() {
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
