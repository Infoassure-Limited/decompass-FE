<template>
  <div v-loading="loading" element-loading-text="loading resources, please wait...">
    <div>
      <el-tooltip class="item" effect="dark" content="Download" placement="top-start">
        <el-button type="primary" size="mini">
          <icon icon="tabler:download" />
        </el-button>
      </el-tooltip>
    </div>
    <!-- <ejs-spreadsheet>
      <e-sheets>
        <e-sheet>
          <e-ranges>
            <e-range :dataSource="data" />
          </e-ranges>
        </e-sheet>
      </e-sheets>
    </ejs-spreadsheet> -->
    <ejs-spreadsheet ref="spreadsheet" height="750px" :open-url="openUrl" :allow-save="false" />
  </div>
</template>

<script>
import {
  SpreadsheetComponent,
  RangesDirective,
  RangeDirective,
  SheetsDirective,
  SheetDirective
} from '@syncfusion/ej2-vue-spreadsheet'
import Resource from '@/api/resource'
export default {
  components: {
    'ejs-spreadsheet': SpreadsheetComponent
    // 'e-sheets': SheetsDirective,
    // 'e-sheet': SheetDirective,
    // 'e-ranges': RangesDirective,
    // 'e-range': RangeDirective
  },
  props: {
    documentPath: {
      type: String,
      default: ''
    },
    documentTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openUrl: 'https://services.syncfusion.com/vue/production/api/spreadsheet/open',
      saveUrl: 'https://services.syncfusion.com/vue/production/api/spreadsheet/save',
      loading: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
    // saveUrl() {
    //   return `${this.$store.getters.baseServerUrl}api/spreadsheet/export-excel`
    // }
  },
  mounted() {
    this.fetchbase64FileFormat()
  },
  methods: {
    beforeSave: function (args) {
      args.needBlobData = true // To trigger the saveComplete event.
      args.isFullPost = false // Get the spreadsheet data as blob data in the saveComplete event.
    },
    save() {
      const spreadsheet = this.$refs.spreadsheet
      spreadsheet.save({ saveType: 'Xlsx' })
    },
    saveComplete: function (args) {
      // console.log(args)
      const blob = args.blobData
      if (blob) {
        const formData = new FormData()
        formData.append('file_to_be_saved', blob, 'spreadsheet.xlsx')
        formData.append('path', this.documentPath)
        this.saveDocBlob(formData)
      }
    },
    saveDocBlob(formData) {
      this.loading = true
      const saveResource = new Resource('save-excel-doc-template')
      saveResource
        .store(formData)
        .then((response) => {
          // open the SFDT text in Document Editor
          this.$message(response.message)
          // this.$refs.doceditcontainer.ej2Instances.documentEditor.open(response)
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.message)
        })
    },
    async fetchbase64FileFormat() {
      const formData = {
        path: this.documentPath
      }
      const fetchBase64Resource = new Resource('fetch-excel-doc')
      const responseInBase64 = await fetchBase64Resource.store(formData)
      this.loadData(
        `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${responseInBase64}`
      )
    },
    loadData(data) {
      this.loading = true
      fetch(data)
        .then((response) => {
          this.loading = false
          response.blob().then((fileBlob) => {
            // convert the excel file to blob
            const file = new File([fileBlob], 'Sample.xlsx') // convert the blob into file
            this.$refs.spreadsheet.open({ file }) // open the file into Spreadsheet
          })
        })
        .catch((e) => {
          console.log(e)
          this.loading = false
        })
    }
  }
}
</script>
<style>
@import '../../../styles/ej2-base/buttons.css';
@import '../../../styles/ej2-base/inputs.css';
@import '../../../styles/ej2-base/popups.css';
@import '../../../styles/ej2-base/lists.css';
@import '../../../styles/ej2-base/navigations.css';
@import '../../../styles/ej2-base/splitbuttons.css';
@import '../../../styles/ej2-base/dropdowns.css';
@import '../../../styles/ej2-base/base.css';
@import '../../../styles/ej2-base/doc-editor-material.css';
@import '../../../styles/ej2-base/grids.css';
@import '../../../styles/ej2-base/spreadsheet.css';
</style>
