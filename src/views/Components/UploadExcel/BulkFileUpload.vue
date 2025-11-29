<template>
  <div>
    <h3>Important Note</h3>
    <aside type="primary" :closable="false">
      <p>
        The first row of your spreadsheet should be the Header Names for each column and should NOT
        be left blank
      </p>
      For proper data identification and processing, please ensure that headers with the following
      keywords exist:
      <ul>
        <li v-for="identifier in identifiers" :key="identifier">
          <strong>{{ identifier }}</strong>
        </li>
      </ul>
    </aside>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xls,.xlsx"
      @change="handleClick"
    />
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <el-button
        :loading="load"
        style="margin-left: 16px"
        size="mini"
        type="primary"
        @click="handleUpload"
      >
        Browse
      </el-button>

      <br />
      <p>Supported file formats are: <strong>.xls and .xlsx</strong> extensions only</p>
    </div>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import * as XLSX from 'xlsx/xlsx.mjs'
import Resource from '@/api/resource'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    identifiers: {
      type: Array,
      required: true
    },
    beforeUpload: Function,
    onSuccess: Function, // eslint-disable-line
  },
  data() {
    return {
      load: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results

      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) {
        return
      }
      const { files } = e.dataTransfer
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')

        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const { files } = e.target
      const rawFile = files[0] // only use files[0]
      if (!rawFile) {
        return
      }
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.load = true
      const formData = new FormData()
      formData.append('file', rawFile)
      formData.append('type', this.type)
      formData.append('identifiers', this.identifiers)
      const uploadBulkAssets = new Resource('files/upload')
      uploadBulkAssets
        .store(formData)
        .then((response) => {
          this.load = false
          this.$emit('saved')
        })
        .catch((error) => {
          this.load = false
          this.$alert(error.response.data.message)
        })

      // return new Promise((resolve, reject) => {
      //   const reader = new FileReader()
      //   reader.onload = (e) => {
      //     const data = e.target.result
      //     const workbook = XLSX.read(data, { type: 'array' })
      //     const firstSheetName = workbook.SheetNames[0]
      //     const worksheet = workbook.Sheets[firstSheetName]
      //     const header = this.getHeaderRow(worksheet)
      //     const results = XLSX.utils.sheet_to_json(worksheet)
      //     this.generateData({ header, results })
      //     this.loading = false
      //     resolve()
      //   }
      //   reader.readAsArrayBuffer(rawFile)
      // })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */

      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = `UNKNOWN ${C}` // <-- replace with your desired default
        if (cell && cell.t) {
          hdr = XLSX.utils.format_cell(cell)
        }
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 3px dashed #bbb;
  width: 100%;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
