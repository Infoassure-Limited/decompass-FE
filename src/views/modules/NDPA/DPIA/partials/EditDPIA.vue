<template>
  <div v-loading="loading">
    <el-row class="match-height">
      <el-col md="8">
        <el-collapse accordion type="margin">
          <el-collapse-item title="RISK DESCRIPTION" :is-visible="true">
            <el-row>
              <el-col md="12">
                <el-form-group label="Business Unit">
                  <textarea v-model="form.business_unit" disabled class="form-control"></textarea>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Business Process">
                  <textarea
                    v-model="form.business_process"
                    disabled
                    class="form-control"
                  ></textarea>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Personal Data Asset">
                  <!-- <el-tooltip
                    target="personal_data_asset"
                    title="The personal data that could be affected by the risk. Could be defined at individual data item level e.g. date of birth, or as a group of data items e.g. delivery information."
                  /> -->
                  <code>Fed in from PDA</code>
                  <textarea
                    id="personal_data_asset"
                    v-model="form.personal_data_asset"
                    class="form-control"
                    disabled
                  ></textarea>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Risk Scenerio">
                  <el-tooltip target="risk_scenerio" />
                  <a style="color: #409eff" @click="showRisksForm = true">
                    <i class="el-icon-plus"></i> Click to pick from Risk Register</a
                  >
                  <!-- <ckeditor
                    id="risk_scenerio"
                    v-model="form.risk_scenerio"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  /> -->
                  <textarea
                    id="risk_scenerio"
                    v-model="form.risk_scenerio"
                    placeholder="Enter Risk Scenerio"
                    class="form-control"
                    @blur="updateField($event.target.value, 'risk_scenerio')"
                  ></textarea>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Existing Controls">
                  <code>Fed in from risk register selection</code>
                  <ckeditor
                    id="existing_controls"
                    v-model="form.existing_controls"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  />
                  <!-- <textarea
                    v-model="form.existing_controls"
                    placeholder="Existing Control"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'existing_controls')"
                  /> -->
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Risk Owner">
                  <code>This is also the business process owner</code>
                  <input
                    v-model="form.risk_owner"
                    placeholder="Risk owner"
                    disabled
                    class="form-control"
                  />
                </el-form-group>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="RISK ANALYSIS">
            <el-row>
              <el-col md="12">
                <el-form-group label="Likelihood">
                  <el-tooltip
                    target="likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  />
                  <select
                    id="likelihood"
                    v-model="form.likelihood"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'likelihood')"
                  >
                    <option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="likelihood.value"
                    ></option>
                  </select>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Likelihood Rationale">
                  <!-- <el-tooltip
                    target="likelihood_rationale"
                    title="The role that is responsible for the personal data"
                  /> -->
                  <code>Value is based on the Likelihood settings</code>
                  <textarea
                    id="likelihood_rationale"
                    v-model="form.likelihood_rationale"
                    class="form-control"
                    disabled
                  ></textarea>
                  <!-- <textarea
                    id="likelihood_rationale"
                    v-model="form.likelihood_rationale"
                    placeholder="Likelihood Rationale"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'likelihood_rationale')"
                  /> -->
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Impact">
                  <el-tooltip
                    target="impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  />
                  <select
                    id="impact"
                    v-model="form.impact"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'impact')"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    ></option>
                  </select>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Impact Rationale">
                  <code>Value is based on the Impact Analysis settings</code>
                  <!-- <ckeditor
                    id="impact_rationale"
                    v-model="form.impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  /> -->
                  <el-tooltip
                    target="impact_rationale"
                    title="The role that is responsible for the personal data"
                  />
                  <textarea
                    id="impact_rationale"
                    v-model="form.impact_rationale"
                    placeholder="Impact Rationale"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'impact_rationale')"
                  ></textarea>
                </el-form-group>
              </el-col>
              <!-- <el-col md="12">
                <el-form-group
                  label="Risk Score"
                >

                  <el-tooltip
                    target="risk_score"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="risk_score"
                    v-model="form.risk_score"
                    placeholder="Risk Score"
                    class="form-control"
                    type="number"
                    disabled
                  >
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Risk Level"
                >

                  <el-tooltip
                    target="risk_level"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="risk_level"
                    v-model="form.risk_level"
                    placeholder="Risk Level"
                    type="text"
                    disabled
                  >
                </el-form-group>
              </el-col> -->
            </el-row>
          </el-collapse-item>
          <el-collapse-item title="TREATMENT">
            <risk-treatment-options
              :selected-data="form"
              :risk-score="form.risk_score"
              :risk-appetite="riskAppetite"
              table="d_p_i_assessments"
              @selected="resetForm"
            />
            <!-- <el-row>
              <el-col md="12">
                <el-form-group
                  label="Treatment Actions"
                >

                  <el-button
                    v-if="form.risk_score !== null && form.risk_score > 0"
                    type="success"
                    plain
                    @click="treatRisk()"
                  >
                    Click to Treat
                  </el-button>
                  <p />
                  <h4><strong>{{ form.treatment_option }}</strong></h4>
                </el-form-group>
                <hr>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Treatment Actions"
                >

                  <el-tooltip
                    target="treatment_actions"
                    title="The role that is responsible for the personal data"
                  />
                  <textarea
                    id="treatment_actions"
                    v-model="form.treatment_actions"
                    placeholder="Treatment Actions"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'treatment_actions')"
                  />
                </el-form-group>
              </el-col>
            </el-row> -->
          </el-collapse-item>
          <el-collapse-item v-if="form.treatment_option === 'Mitigate'" title="POST-TREATMENT">
            <el-row>
              <el-col md="12">
                <el-form-group label="Likelihood">
                  <!-- <el-tooltip
                    target="revised_likelihood"
                    title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                  /> -->
                  <select
                    id="revised_likelihood"
                    v-model="form.revised_likelihood"
                    placeholder="Select Likelihood Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_likelihood')"
                  >
                    <option
                      v-for="(likelihood, l_index1) in likelihoods"
                      :key="l_index1"
                      :label="`${likelihood.value}-${likelihood.name}`"
                      :value="likelihood.value"
                    ></option>
                  </select>
                </el-form-group>
              </el-col>
              <el-col md="12">
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
              <el-col md="12">
                <el-form-group label="Post-Treatment Impact">
                  <!-- <el-tooltip
                    target="revised_impact"
                    title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
                  /> -->
                  <select
                    id="revised_impact"
                    v-model="form.revised_impact"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateField($event.target.value, 'revised_impact')"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    ></option>
                  </select>
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group label="Impact Rationale">
                  <!-- <ckeditor
                    id="revised_impact_rationale"
                    v-model="form.revised_impact_rationale"
                    :editor="editor"
                    :config="editorConfig"
                    disabled
                  /> -->
                  <textarea
                    id="revised_impact_rationale"
                    v-model="form.revised_impact_rationale"
                    placeholder="Impact Rationale"
                    class="form-control"
                    type="text"
                    @blur="updateField($event.target.value, 'revised_impact_rationale')"
                  ></textarea>
                </el-form-group>
              </el-col>
              <!-- <el-col md="12">
                <el-form-group
                  label="Risk Score"
                >
                  <input
                    id="revised_risk_score"
                    v-model="form.revised_risk_score"
                    placeholder="Risk Score"
                    class="form-control"
                    type="number"
                    disabled
                  >
                </el-form-group>
              </el-col>
              <el-col md="12">
                <el-form-group
                  label="Risk Level"
                >

                  <el-tooltip
                    target="revised_risk_level"
                    title="The role that is responsible for the personal data"
                  />
                  <input
                    id="revised_risk_level"
                    v-model="form.revised_risk_level"
                    placeholder="Risk Level"
                    class="form-control"
                    type="text"
                    disabled
                  >
                </el-form-group>
              </el-col> -->
              <el-col md="12">
                <el-form-group label="Comments">
                  <el-tooltip target="comments" title="Any other relevant information" />
                  <textarea
                    id="comments"
                    v-model="form.comments"
                    class="form-control"
                    @blur="updateField($event.target.value, 'comments')"
                  ></textarea>
                  <!-- <ckeditor
                    id="comments"
                    v-model="form.comments"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField($event.target.value, 'comments')"
                  /> -->
                </el-form-group>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <P />
        <el-button type="primary" @click="$emit('updated')"> Done </el-button>
      </el-col>
      <el-col md="4">
        <aside>
          <div align="center">
            <h4>Pre-Treatment Values</h4>
            <img :src="changeImpactImage(form.risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.risk_level }}</strong>
          </p>
        </aside>
        <hr />
        <aside v-if="form.treatment_option === 'Mitigate'">
          <div align="center">
            <h4>Post-Treatment Values</h4>
            <img :src="changeImpactImage(form.revised_risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ form.revised_risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ form.revised_risk_level }}</strong>
          </p>
        </aside>
      </el-col>
    </el-row>
    <el-dialog v-model="showRisksForm" title="Select Risks" centered size="xl" hide-footer>
      <v-client-table v-model="risk_registers" :columns="columns" :options="options">
        <template v-slot:select="{ row }">
          <div>
            <el-checkbox v-model="risk_scenerios" :label="row.risk_id" border />
          </div>
        </template>
      </v-client-table>
      <aside>
        <el-button type="primary" @click="setRiskScenerios()"> Done </el-button>
      </aside>
    </el-dialog>
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
import RiskTreatmentOptions from '@/views/modules/risk-assessment/partials/RiskTreatmentOptions.vue'

export default {
  components: {
    RiskTreatmentOptions
    // BButton,
  },
  props: {
    selectedData: {
      type: Object,
      required: true
    },
    riskAppetite: {
      type: Number,
      required: true
    },
    likelihoods: {
      type: Array,
      default: () => null
    },
    impacts: {
      type: Array,
      default: () => null
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        personal_data_asset: '',
        risk_scenerio: '',
        risk_owner: '',
        existing_controls: '',
        likelihood: '',
        likelihood_rationale: '',
        impact: '',
        impact_rationale: '',
        risk_score: '',
        risk_level: '',
        treatment_option: '',
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
      columns: ['select', 'risk_id', 'vulnerability_description', 'control_description'],
      options: {
        headings: {
          risk_id: 'REF',
          vulnerability_description: 'Risk Desc',
          control_description: 'Control'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['risk_id', 'vulnerability_description', 'control_description'],
        // filterable: false,
        filterable: ['risk_id', 'vulnerability_description', 'control_description']
      },
      loading: false,
      selectedClient: {},
      uploadableFile: null,
      risk_registers: [],
      risk_scenerios: [],
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false
    }
  },
  created() {
    this.form = this.selectedData
    this.fetchRiskRegister()
  },
  methods: {
    resetForm(data) {
      this.form = data
    },
    changeImpactImage(str) {
      if (str) {
        return `images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return 'images/project-icons/no-impact-level.png'
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
    fetchRiskRegister() {
      this.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource
        .list({
          client_id: this.selectedData.client_id,
          business_unit_id: this.selectedData.business_unit_id
        })
        .then((response) => {
          this.risk_registers = response.risk_registers
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    setRiskScenerios() {
      this.showRisksForm = false
      let scenerio = '<ul>'
      let control = '<ul>'
      this.risk_scenerios.forEach((riskId) => {
        const fileteredRiskRegister = this.risk_registers.filter(
          (riskRegister) => riskRegister.risk_id === riskId
        )
        scenerio += `<li> ${fileteredRiskRegister[0].vulnerability_description}</li>`
        control += `<li> ${fileteredRiskRegister[0].control_description}</li>`
      })
      this.form.risk_scenerio = scenerio
      this.form.existing_controls = control
      this.updateField(scenerio, 'risk_scenerio')
      this.updateField(control, 'existing_controls')
    },
    updateField(value, field) {
      const params = {
        field,
        value
      }
      const updateResources = new Resource('dpia/update')
      updateResources
        .update(this.selectedData.id, params)
        .then((response) => {
          this.form = response.dpia
        })
        .catch()
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
