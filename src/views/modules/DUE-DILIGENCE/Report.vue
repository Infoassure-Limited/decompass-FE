<template>
  <div>
    <el-button :loading="downloading" type="primary" @click="exportToExcel('dueDiligenceReport')">
      Export
    </el-button>
    <div style="height: 500px; overflow: auto" class="table-responsive">
      <table id="dueDiligenceReport" v-loading="loading" class="table table-bordered">
        <thead>
          <tr>
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 250px"> Domain/Category </div></th
            >
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 250px"> Requirements </div></th
            >
            <!-- <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Key
          </div></th> -->
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              >Answer</th
            >
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 250px"> Observation </div></th
            >
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 150px"> Risk Score </div></th
            >
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 250px"> Impact </div></th
            >
            <th
              data-fill-color="333333"
              data-f-color="ffffff"
              style="font-size: 14px"
              data-f-sz="16"
              ><div style="width: 250px"> Recommendation </div></th
            >
          </tr>
        </thead>
        <tbody v-if="!downloading">
          <template v-for="answers in data">
            <tr v-for="(report, index) in answers" :key="index">
              <td v-if="index === 0" :rowspan="answers.length">
                {{ report.domain }}
              </td>
              <td>{{ report.question }}</td>
              <!-- <td>{{ report.key }}</td> -->
              <td>
                {{ report.answer }}
                <small>{{ report.detailed_explanation }}</small>
              </td>
              <td>
                <el-input
                  v-model="report.observation"
                  type="textarea"
                  placeholder="State your observations..."
                  style="width: 100%"
                  @blur="saveRemark(report.id, $event, 'observation')"
                />
              </td>
              <td>
                <select
                  v-model="report.risk_score"
                  placeholder="Select Risk Score"
                  class="form-control"
                  style="width: 100%"
                  @input="saveRemark(report.id, $event, 'risk_score')"
                >
                  <option
                    v-for="(score, score_index) in risk_scores"
                    :key="score_index"
                    :value="score.value"
                    :label="score.label"
                  ></option>
                </select>
              </td>
              <td>
                <textarea
                  v-model="report.impact"
                  placeholder="State Impact..."
                  style="width: 100%"
                  class="form-control"
                  @blur="saveRemark(report.id, $event, 'impact')"
                ></textarea>
              </td>
              <td>
                <textarea
                  v-model="report.recommendations"
                  placeholder="Give Recommendations..."
                  style="width: 100%"
                  class="form-control"
                  @blur="saveRemark(report.id, $event, 'recommendations')"
                ></textarea>
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <template v-for="answers in data">
            <tr v-for="(report, index) in answers" :key="index">
              <td>{{ report.domain }}</td>
              <td>{{ report.question }}</td>
              <td>
                {{ report.answer }}
                <small>{{ report.detailed_explanation }}</small>
              </td>
              <td>{{ report.observation }}</td>
              <td>{{ formatRiskScore(report.risk_score) }}</td>
              <td>{{ report.impact }}</td>
              <td>{{ report.recommendations }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
// import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    vendorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      risk_scores: [
        { value: 1, label: '1-Low' },
        { value: 2, label: '2-Medium' },
        { value: 3, label: '3-High' }
      ],
      downloading: false,
      loading: false,
      data: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    vendorId() {
      this.fetchReport()
    }
  },
  created() {
    this.fetchReport()
  },
  methods: {
    fetchReport() {
      this.loading = true
      const fetchQuestionsWithResponseResource = new Resource('vdd/reports/fetch')
      fetchQuestionsWithResponseResource
        .list({ vendor_id: this.vendorId })
        .then((response) => {
          this.data = response.answers
          this.loading = false
        })
        .catch((this.loading = false))
    },
    saveRemark(id, event, field) {
      const { value } = event.target
      // console.log(answer[field])
      const param = { answer: value, field }
      const fetchConsultingsResource = new Resource('vdd/responses/update')
      fetchConsultingsResource.update(id, param).then(() => {})
    },
    formatRiskScore(value) {
      const { risk_scores } = app
      let label = ''
      risk_scores.forEach((impact) => {
        if (value === impact.value) {
          label = impact.label
        }
      })
      return label
    },
    exportToExcel(id) {
      // this.downloading = true
      // setTimeout(() => {
      //   TableToExcel.convert(document.getElementById(id), {
      //     name: `${this.selectedClient.name}-3rd-Party-Vendor-Due-Diligence-Assessment.xlsx`,
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
