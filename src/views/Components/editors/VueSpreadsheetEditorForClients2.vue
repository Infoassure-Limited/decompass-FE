<template>
  <div v-loading="loading" element-loading-text="loading resources, please wait...">
    <div>
      <el-tooltip class="item" effect="dark" content="Save" placement="top-start">
        <el-button type="success" size="mini" @click="save">
          <icon icon="tabler:device-floppy" />
        </el-button>
      </el-tooltip>
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
    <ejs-spreadsheet
      ref="spreadsheet"
      height="750px"
      :open-url="openUrl"
      :save-url="saveUrl"
      :allow-save="true"
      :beforeSave="beforeSave"
      :saveComplete="saveComplete"
    />
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
    documentData: {
      type: Object,
      default: () => ({})
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
    this.openFile()
  },
  methods: {
    openFile() {
      if (this.documentData.link === null) {
        this.fetchbase64FileFormat(this.documentData.template_link)
      } else {
        this.openJsonversion(this.documentData.link)
      }
    },
    async openJsonversion(link) {
      const formData = {
        path: link
      }
      const jsonDataResource = new Resource('fetch-json-formatted-excel-doc')
      const response = await jsonDataResource.store(formData)
      this.$refs.spreadsheet.openFromJson({ file: response.jsonObject })
    },
    async fetchbase64FileFormat(link) {
      this.loading = true
      const formData = {
        path: link
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
    },
    beforeSave: function (args) {
      args.needBlobData = true // To trigger the saveComplete event.
      args.isFullPost = false // Get the spreadsheet data as blob data in the saveComplete event.
    },
    async save() {
      const spreadsheet = this.$refs.spreadsheet
      // Step 1: Get spreadsheet data as JSON
      const jsonData = await spreadsheet.saveAsJson()
      const jsonString = JSON.stringify(jsonData)

      // Step 2: Create Blob from JSON string
      const blob = new Blob([jsonString], { type: 'application/json' })

      if (blob) {
        const formData = new FormData()
        formData.append('file_to_be_saved', blob, 'spreadsheet.json')
        formData.append('path', this.documentData.link)
        formData.append('id', this.documentData.id)
        formData.append('title', this.documentData.title)
        this.saveDocBlob(formData)
      }
    },
    saveComplete: function (args) {
      // console.log(args)
      const blob = args.blobData
      if (blob) {
        const formData = new FormData()
        formData.append('file_to_be_saved', blob, 'spreadsheet.json')
        formData.append('path', this.documentData.link)
        formData.append('id', this.documentData.id)
        formData.append('title', this.documentData.title)
        this.saveDocBlob(formData)
        this.download(blob)
      }
    },
    download(blob) {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'Sample.xlsx'
      link.click()
    },
    saveDocBlob(formData) {
      this.loading = true
      const saveResource = new Resource('save-client-copy')
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
