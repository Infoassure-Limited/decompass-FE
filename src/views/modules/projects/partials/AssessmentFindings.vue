<template>
  <div>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportTableToExcel('assessmentFindingsTable')"
    >
      Export to Excel
    </el-button>
    <el-button :loading="downloading" type="success" @click="exportToWord()">
      Export to Word
    </el-button>
    <div id="docx">
      <div class="WordSection1">
        <table
          id="assessmentFindingsTable"
          v-loading="load"
          class="table table-bordered table-striped table-responsive"
          style="height: 550px; overflow: auto"
        >
          <thead>
            <tr>
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Standard</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Clause/Requirement</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                ><div style="width: 350px">Question</div></th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Response</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Assessment Grade</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Findings</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Recommendations</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >Assessment Status</th
              >
              <th
                style="font-size: 16px"
                data-f-sz="16"
                data-fill-color="333333"
                data-f-color="ffffff"
                >General Remark</th
              >
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assessment, index) in assessment_answers" :key="index">
              <td>{{ assessment.standard.name }}</td>
              <td>{{ assessment.clause.name }}</td>
              <td>
                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="assessment.question.question"></span>
              </td>
              <td>
                {{ assessment.yes_or_no }}<br /><br />
                {{ assessment.open_ended_answer }}
              </td>
              <td
                :style="`background: #${customClass(assessment.consultant_grade)}`"
                :data-fill-color="customClass(assessment.consultant_grade)"
                >{{ assessment.consultant_grade }}</td
              >
              <td>{{ assessment.findings }}</td>
              <td>{{ assessment.recommendations }}</td>
              <td>{{ assessment.status }}</td>
              <td>{{ assessment.remark }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {},
  props: {
    selectedProject: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      load: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      assessment_answers: [],
      downloading: false
    }
  },
  created() {
    this.fetchAssessmentAnswers()
  },
  methods: {
    checkPermission,
    customClass(value) {
      switch (value) {
        case 'Conformity':
          return '00a65a'
        case 'Non-Conformity':
          return 'f00c12'
        case 'Opportunity For Improvement':
          return 'FFA500'
        default:
          // Not Applicable
          return 'CCCCCC'
      }
    },
    fetchAssessmentAnswers() {
      this.load = true
      this.assessment_answers = []
      const fetchEntryResource = new Resource('reports/fetch-project-answers')
      fetchEntryResource
        .list({ project_id: this.selectedProject.id })
        .then((response) => {
          this.load = false
          this.assessment_answers = response.assessment_answers
        })
        .catch((error) => {
          this.load = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    exportToWord() {
      // EU A4 use: size: 841.95pt 595.35pt;
      // US Letter use: size:11.0in 8.5in;

      const css =
        '<style>' +
        '@page WordSection1{mso-page-orientation: landscape;}' +
        'div.WordSection1 {page: WordSection1;}' +
        'table{border-collapse:collapse;}td,th{border:1px gray solid;width:5em;padding:2px;}' +
        '</style>'

      const html = window.docx.innerHTML
      const blob = new Blob(['\ufeff', css + html], {
        type: 'application/msword'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('A')
      link.href = url
      // Set default file name.
      // Word will append file extension - do not add an extension here.
      link.download = 'AssessmentFindingsTable-Document'
      document.body.appendChild(link)
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, 'AssessmentFindingsTable-Document.doc')
      } else {
        link.click()
      } // other browsers
      document.body.removeChild(link)
    },
    exportTableToExcel(id) {
      // this.downloading = true
      // // const rawData = this.riskAssessments
      // // import('@/vendor/Export2Excel').then(excel => {
      // //   excel.export_table_to_excel(id)
      // //   setTimeout(() => {
      // //     this.downloading = false
      // //   }, 2000)
      // // })
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: 'AssessmentFindingsTable.xlsx',
      //     sheet: {
      //       name: 'Sheet 1'
      //     }
      //   })
      // }, 1000)
      // setTimeout(() => {
      //   this.downloading = false
      // }, 30000)
    }
  }
}
</script>
