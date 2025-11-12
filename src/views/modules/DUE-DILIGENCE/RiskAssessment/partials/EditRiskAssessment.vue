<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="10">
        <div
          v-if="details.is_submitted === 1"
          :style="`background: ${form.revised_risk_level === 'Low' ? '#e0fadf' : form.revised_risk_level === 'Medium' ? '#faf4df' : '#fadfdf'}; border: 3px dashed #cccccc; padding: 10px; margin-bottom: 5px; border-radius: 5px;`"
        >
          <h3>Assessment</h3>
          <el-row>
            <!-- <el-col :md="24">
              <label>Risk Score</label>
              <p>
                <select
                  v-model="details.risk_score"
                  placeholder="Select Risk Score"
                  class="form-control"
                  style="width: 100%;"
                  @input="saveAssessment(details, 'risk_score')"
                >
                  <option
                    v-for="(score, score_index) in risk_scores"
                    :key="score_index"
                    :value="score.value"
                    :label="score.label"
                  />
                </select>
              </p>
            </el-col> -->

            <el-col :md="24">
              <label>Observation</label>
              <p>
                <el-input
                  v-model="details.observation"
                  type="textarea"
                  placeholder="Give your observation to the response here..."
                  style="width: 100%"
                  @blur="saveAssessment(details, 'observation')"
                />
              </p>
              <!-- <p><el-alert
                      :closable="false"
                      :type="(details.risk_score === 1) ? 'success' : (details.risk_score === 2) ? 'warning' : 'error'"
                      effect="dark"
                    >
                      {{ (details.observation) ? details.observation : 'No observation yet' }}
                    </el-alert></p> -->
            </el-col>
            <el-col :md="24">
              <label>Vulnerabilities</label>
              <p>
                <el-input
                  v-model="details.impact"
                  type="textarea"
                  placeholder="State the vulnerabilities this response poses..."
                  style="width: 100%"
                  @blur="saveAssessment(details, 'impact')"
                />
              </p>
              <!-- <p>
                      <el-alert
                        :closable="false"
                        :type="(details.risk_score === 1) ? 'success' : (details.risk_score === 2) ? 'warning' : 'error'"
                        effect="dark"
                      >
                        {{ (details.impact) ? details.impact : 'No impact' }}
                      </el-alert>
                    </p> -->
            </el-col>
            <el-col :md="24">
              <label>Recommendations</label>
              <p>
                <el-input
                  v-model="details.recommendations"
                  type="textarea"
                  placeholder="Provide a recommendation..."
                  style="width: 100%"
                  @blur="saveAssessment(details, 'recommendations')"
                />
              </p>
              <!-- <p>
                      <el-alert
                        :closable="false"
                        :type="(details.risk_score === 1) ? 'success' : (details.risk_score === 2) ? 'warning' : 'error'"
                        effect="dark"
                      >
                        {{ (details.recommendations) ? details.recommendations : 'Nothing to recommend' }}
                      </el-alert>
                    </p> -->
            </el-col>
            <el-col :md="24">
              <label>Status</label>
              <p>
                <el-alert :closable="false">
                  {{ details.status ? details.status : 'Open' }}
                </el-alert>
              </p>
            </el-col>
          </el-row>
        </div>
        <hr />
        <aside v-if="form.risk_score !== null">
          <div>
            <h4>Inherent Risk</h4>
            <img :src="changeImpactImage(form.risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.risk_level }}</strong>
          </p>
        </aside>
        <hr />
        <aside v-if="form.treatment_option === 'Mitigate' && form.revised_risk_score !== null">
          <div>
            <h4>Residual Risk</h4>
            <img :src="changeImpactImage(form.revised_risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.revised_risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.revised_risk_level }}</strong>
          </p>
        </aside>
      </el-col>
      <el-col :md="14">
        <aside>
          <p>Vulnerabilities</p>
          <em
            ><strong>{{ details.impact }}</strong></em
          >
        </aside>
        <el-collapse accordion type="margin">
          <el-collapse-item title="RISK ANALYSIS">
            <el-row :gutter="10">
              <el-col ::md="24">
                <el-form-group label="Likelihood of Occurence">
                  <!-- <el-tooltip
                    target="likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  /> -->
                  <el-select
                    id="likelihood"
                    v-model="form.likelihood_of_occurence"
                    placeholder="Select Likelihood Value"
                    @change="updateField($event, 'likelihood_of_occurence')"
                  >
                    <el-option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="likelihood.value"
                    />
                  </el-select>
                </el-form-group>
              </el-col>
              <el-col :md="24">
                <div>Likelihood Rationale</div>
                <code>Value is based on the Likelihood settings</code>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <!-- <span v-html="form.likelihood_rationale" /> -->
                <textarea
                  class="form-control"
                  id="likelihood_rationale"
                  v-model="form.likelihood_rationale"
                  disabled
                ></textarea>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <!-- <el-col
                v-for="(impact_data, impact_data_index) in form.impact_data"
                :key="`impact1-${impact_data_index}`"
                md="6"
              >
                <el-form-group
                  :label="impact_data.name"
                >
                  <select
                    v-model="impact_data.impact_value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact_data', impact_data.slug)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_data_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </el-form-group>
              </el-col> -->
              <el-col
                v-for="(impact_data, impact_data_index) in form.impact_on_areas"
                :key="`impact2-${impact_data_index}`"
                :md="12"
              >
                <!-- <el-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                <small>{{ impact_data.name }}</small>
                <el-select
                  v-model="impact_data.impact_value"
                  placeholder="Select Impact Value"
                  @change="updateField($event, 'impact_on_areas', impact_data.slug)"
                >
                  <el-option
                    v-for="(impact, c_index) in impacts"
                    :key="c_index + impact_data_index"
                    :label="`${impact.value}-${impact.name}`"
                    :value="impact.value"
                  />
                </el-select>
              </el-col>
              <el-col :md="24">
                <h3>Impact Value: {{ form.impact_of_occurence }}</h3>
              </el-col>
              <el-col :md="24">
                <div>Impact Rationale</div>
                <code>Value is based on the Impact Analysis settings</code>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <!--       -->
                <!-- <ckeditor
                    id="impact_rationale"
                    v-model="form.impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  /> -->
                <aside>
                  <span v-html="form.impact_rationale"></span>
                </aside>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item v-if="form.risk_score !== null" title="TREATMENT">
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.risk_score"
              :risk-appetite="riskAppetite"
              @selected="resetForm"
            />
          </el-collapse-item>
          <el-collapse-item v-if="form.treatment_option === 'Mitigate'" title="POST-TREATMENT">
            <aside>
              <p>Recommendations</p>
              <em
                ><strong>{{ details.recommendations }}</strong></em
              >
            </aside>
            <el-row :gutter="5">
              <el-col :md="24">
                <small>Control/Mitigating Actions</small>

                <Editor
                  v-model="form.recommended_control"
                  @blur="updateField(form.recommended_control, 'recommended_control')"
                />
              </el-col>
              <el-col :md="24">
                <small>Control Effectiveness Level</small>
                <el-select
                  v-model="form.control_effectiveness_level"
                  placeholder="Select"
                  @change="updateField($event, 'control_effectiveness_level')"
                >
                  <el-option
                    v-for="(assessment_option, option_index) in assessment_options"
                    :key="option_index"
                    :label="assessment_option"
                    :value="assessment_option"
                  />
                </el-select>
              </el-col>
              <el-col :md="24">
                <small>Likelihood of Occurence</small>
                <!-- <el-tooltip
                      target="revised_likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
                <el-select
                  id="revised_likelihood"
                  v-model="form.revised_likelihood_of_occurence"
                  placeholder="Select Likelihood Value"
                  @change="updateField($event, 'revised_likelihood_of_occurence')"
                >
                  <el-option
                    v-for="(likelihood, l_index1) in likelihoods"
                    :key="l_index1"
                    :label="`${likelihood.value}-${likelihood.name}`"
                    :value="likelihood.value"
                  />
                </el-select>
              </el-col>
              <el-col :md="24">
                <el-form-group label="Likelihood Rationale">
                  <!-- <el-tooltip
                      target="revised_likelihood_rationale"
                      title="The role that is responsible for the personal data"
                    /> -->
                  <textarea
                    id="revised_likelihood_rationale"
                    v-model="form.revised_likelihood_rationale"
                    class="form-control"
                    type="text"
                    disabled
                  ></textarea>
                </el-form-group>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_data"
                :key="`r_impact1-${impact_data_index}`"
                :md="12"
              >
                <small>{{ impact_data.name }}</small>
                <el-select
                  v-model="impact_data.impact_value"
                  placeholder="Select Impact Value"
                  @change="updateField($event, 'revised_impact_data', impact_data.slug)"
                >
                  <el-option
                    v-for="(impact, c_index) in impacts"
                    :key="c_index + impact_data_index"
                    :label="`${impact.value}-${impact.name}`"
                    :value="impact.value"
                  />
                </el-select>
              </el-col>
              <el-col
                v-for="(impact_data, impact_data_index) in form.revised_impact_on_areas"
                :key="`r_impact2-${impact_data_index}`"
                :md="12"
              >
                <small>{{ impact_data.name }}</small>
                <!-- <el-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                <el-select
                  v-model="impact_data.impact_value"
                  placeholder="Select Impact Value"
                  @change="updateField($event, 'revised_impact_on_areas', impact_data.slug)"
                >
                  <el-option
                    v-for="(impact, c_index) in impacts"
                    :key="c_index + impact_data_index"
                    :label="`${impact.value}-${impact.name}`"
                    :value="impact.value"
                  />
                </el-select>
              </el-col>
              <el-col :md="24">
                <h3>Impact Value: {{ form.revised_impact_of_occurence }}</h3>
              </el-col>
              <el-col :md="24">
                <small>Impact Rationale</small>
                <aside>
                  <span v-html="form.revised_impact_rationale"></span>
                </aside>
                <!-- <Editor
                  id="revised_impact_rationale"
                  v-model="form.revised_impact_rationale"
                  disabled
                /> -->
              </el-col>
              <el-col :md="24">
                <small label="Comments">Comments</small>
                <!-- <el-tooltip
                      target="comments"
                      title="Any other relevant information"
                    />
                    <textarea
                      id="comments"
                      v-model="form.comments"
                      class="form-control"
                      @blur="updateField($event.target.value, 'comments');"
                    /> -->
                <textarea
                  id="comments"
                  v-model="form.comments"
                  class="form-control"
                  @blur="updateField($event.target.value, 'comments')"
                ></textarea>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <!-- <el-row>
          <el-col
            :md="12"
          >
            <el-form-group
              label="Key Risk Indicator"
            >
              <textarea
                v-model="form.key_risk_indicator"
                placeholder=""
                class="form-control"
                row="5"
                @blur="updateField($event.target.value, 'key_risk_indicator')"
              />
            </el-form-group>
          </el-col>
        </el-row> -->
        <P />
        <el-button type="primary" @click="formSubmitted()"> Submit </el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="showTreatmentModal"
      title="Risk Treatment Option"
      centered
      size="md"
      hide-footer
    >
      <div>
        <div>
          <el-alert :type="treatment_alert_type" :closable="false">
            {{ treatment_comment }}
          </el-alert>
        </div>
        <div v-if="!showTreatmentOption">
          <el-button
            type="success"
            @click="(updateField('Accept', 'treatment_option'), (showTreatmentModal = false))"
          >
            Accept
          </el-button>
          <el-button type="default" @click="showTreatmentOption = true">
            I want to explore other options
          </el-button>
        </div>
        <div v-else>
          <p>Select your option</p>
          <select
            v-model="form.treatment_option"
            class="form-control"
            placeholder="Select Option"
            @change="
              (updateField($event.target.value, 'treatment_option'), (showTreatmentModal = false))
            "
          >
            <option
              v-for="(treatment_option, option_index) in treatment_options"
              :key="option_index"
              :label="treatment_option"
              :value="treatment_option"
            ></option>
          </select>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import RiskTreatmentOptions from './RiskTreatmentOptions.vue'
import { Editor } from '@/components/Editor'

export default {
  components: {
    RiskTreatmentOptions,
    Editor
  },
  props: {
    details: {
      type: Object,
      required: true
    },
    riskAssessment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      likelihoods: [],
      impacts: [],
      riskAppetite: 1,
      form: {
        client_id: '',
        vendor_id: '',
        risk_scenerio: '',
        risk_owner: '',
        existing_controls: '',
        likelihood: '',
        likelihood_rationale: '',
        impact: '',
        impact_rationale: '',
        risk_score: null,
        risk_level: '',
        treatment_option: '',
        treatment_option_details: [],
        treatment_actions: '',
        revised_likelihood: '',
        revised_likelihood_rationale: '',
        revised_impact: '',
        rivised_impact_rationale: '',
        revised_risk_score: '',
        revised_risk_level: '',
        comments: ''
      },
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      assessment_options: ['Effective', 'Ineffective', 'Sub-optimal'],
      loading: false,
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false
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
    riskAssessment() {
      this.fetchDetails()
    }
  },
  created() {
    this.form = this.riskAssessment
    this.setMatrix()
    this.fetchDetails()
  },
  methods: {
    setMatrix() {
      this.fetchRiskAppetite()
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchRiskAppetite() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-risk-appetite')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.riskAppetite = response.risk_appetite
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    saveAssessment(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const saveAssessmentResource = new Resource('vdd/responses/update')
      saveAssessmentResource.update(answer.id, param).then(() => {})
    },
    resetForm(data) {
      this.form = data
    },
    changeImpactImage(str) {
      if (str) {
        return `/images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return '/images/project-icons/no-impact-level.png'
    },
    treatRisk() {
      const assessment = this.form
      const riskValue = assessment.risk_score
      const { riskAppetite } = app
      if (riskValue <= riskAppetite) {
        this.treatment_comment = `Risk Score of ${riskValue} satisfies your Risk Appetite of ${riskAppetite}. You might want to Accept the risk, it's up to you.`
        this.treatment_alert_type = 'success'
        this.showTreatmentOption = false
      } else {
        this.treatment_comment = `Risk Score of ${riskValue} exceeds your Risk Appetite of ${riskAppetite}. Kindly pick an option to further treat the risk`
        this.treatment_alert_type = 'error'
        this.showTreatmentOption = true
      }
      this.showTreatmentModal = true
    },
    updateField(value, field, subField = '') {
      const params = {
        field,
        value,
        sub_field: subField
      }

      // assessment.loader = true
      const updateResources = new Resource('vdd/risk-assessment/update-fields')
      updateResources
        .update(this.riskAssessment.id, params)
        .then((response) => {
          this.form = response.risk_assessment
        })
        .catch(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.riskAssessment.loader = false
        })
    },
    fetchDetails() {
      this.loading = true
      const fetchDetailsResources = new Resource('vdd/risk-assessment/details')
      fetchDetailsResources
        .get(this.riskAssessment.id)
        .then((response) => {
          this.form = response.risk_assessment
          this.form.impact_rationale = response.risk_assessment.impact_rationale
            ? response.risk_assessment.impact_rationale
            : ''
          this.form.revised_impact_rationale = response.risk_assessment.revised_impact_rationale
            ? response.risk_assessment.revised_impact_rationale
            : ''
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    async formSubmitted() {
      await this.updateField('Submitted', 'status')
      this.$emit('updated')
    }
  }
}
</script>
