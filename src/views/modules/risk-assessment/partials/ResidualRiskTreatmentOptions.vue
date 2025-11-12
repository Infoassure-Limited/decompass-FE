<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <el-alert :type="treatment_alert_type" :closable="false">
      {{ treatment_comment }}
    </el-alert>

    <div v-if="!showTreatmentOption && selectedData.residual_risk_treatment_option === null">
      <hr />
      <el-button type="success" size="mini" @click="setTreatmentQuestions('Accept')">
        Accept
      </el-button>
      <el-button type="default" size="mini" @click="showTreatmentOption = true">
        I want to explore other options
      </el-button>
    </div>
    <div v-else v-loading="loading">
      <p>Select your option</p>
      <el-select
        v-model="selectedData.residual_risk_treatment_option"
        placeholder="Select Option"
        @change="setTreatmentQuestions($event)"
      >
        <el-option
          v-for="(treatment_option, option_index) in treatment_options"
          :key="option_index"
          :label="treatment_option"
          :value="treatment_option"
        />
      </el-select>
    </div>

    <div v-if="treatment_option_details.length > 0">
      <p></p>
      <el-row :gutter="20">
        <el-col v-for="(treatment_detail, index) in treatment_option_details" :key="index" :md="24">
          <el-form-group :label="treatment_detail.question">
            <small>{{ treatment_detail.question }}</small>
            <textarea
              v-model="treatment_detail.answer"
              class="form-control"
              placeholder="Type response here..."
            ></textarea>
          </el-form-group>
        </el-col>
        <el-col>
          <el-button :loading="loading" type="success" plain @click="saveTreatmentOptionDetails()">
            Save Response
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    selectedData: {
      type: Object,
      required: true
    },
    riskScore: {
      type: Number,
      default: () => null
    },
    riskAppetite: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      treatment_option_question_details: {
        Avoid: [
          { question: 'Reason for avoidance', answer: '' },
          { question: 'Alternative preference adopted', answer: '' },
          { question: 'Would you like to review the risk later?', answer: '' },
          { question: 'When in the future?', answer: '' }
        ],
        Transfer: [
          { question: 'Reason for transfer', answer: '' },
          { question: 'To whom will the transfer be?', answer: '' },
          { question: 'Is there a signed contract/SLA for the transfer?', answer: '' },
          {
            question: 'What other treatment plan is in place after transferring the risk?',
            answer: ''
          }
        ],
        Accept: [
          { question: 'Reasons for acceptance', answer: '' },
          // {
          //   question: 'Have you done the cost-benefit analysis for the risk? If yes, mention it.',
          //   answer: ''
          // },
          {
            question:
              'Is there a system that would continuously control and monitor the given risk? If Yes, List or Mention them',
            answer: ''
          }
          // List or Mention them{ question: 'List or Mention them', answer: '' },
        ],
        Mitigate: []
      },
      loading: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
      treatment_option_details: [],
      active_treatment_option: ''
    }
  },
  watch: {
    riskScore() {
      this.setSavedTreatmentOption()
      this.treatRisk()
    }
  },
  created() {
    this.setSavedTreatmentOption()
    this.treatRisk()
  },
  methods: {
    setSavedTreatmentOption() {
      this.active_treatment_option = this.selectedData.residual_risk_treatment_option
      this.treatment_option_details =
        this.selectedData.treatment_option_details !== null
          ? this.selectedData.treatment_option_details
          : []
    },
    treatRisk() {
      const riskValue = this.riskScore
      const { riskAppetite } = this
      if (riskValue <= riskAppetite) {
        this.treatment_comment = `Risk Score of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk. It's up to you.`
        this.treatment_alert_type = 'success'
        this.showTreatmentOption = false
      } else {
        this.treatment_comment = `Risk Score of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        this.treatment_alert_type = 'error'
        this.showTreatmentOption = true
      }
      this.showTreatmentModal = true
    },
    setTreatmentQuestions(option) {
      if (option === 'Mitigate') {
        this.treatment_option_details = this.treatment_option_question_details[option]
        this.saveTreatmentOptionDetails()
      } else if (option === this.active_treatment_option) {
        this.setSavedTreatmentOption()
      } else {
        this.treatment_option_details = this.treatment_option_question_details[option]
      }
    },
    saveTreatmentOptionDetails() {
      this.loading = true
      const params = {
        residual_risk_treatment_option: this.selectedData.residual_risk_treatment_option,
        residual_treatment_option_details: this.residual_treatment_option_details
      }
      const updateResources = new Resource(
        'risk-assessment/save-residual-risk-assessment-treatment-details'
      )
      updateResources
        .update(this.selectedData.id, params)
        .then((response) => {
          this.loading = false
          this.$message('Option Saved')
          this.$emit('selected', response)
          // this.form = response.dpia
        })
        .catch()
    }
  }
}
</script>
