<template>
  <div v-loading="loading">
    <el-row class="match-height">
      <el-col md="7">
        <el-row>
          <el-form label-position="top">
            <el-col md="12">
              <el-form-item label="Is the Control Applicable?">
                <el-select
                  v-model="form.applicable"
                  class="form-control"
                  placeholder="Applicable"
                  style="width: 100%"
                  @change="saveSOA('applicable', $event, form.id)"
                >
                  <el-option value="Yes"> Yes </el-option>
                  <el-option value="No"> No </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div style="background: #f0f0f0; padding: 10px; border-radius: 5px">
              <el-row>
                <el-col md="12">
                  <h3>Reasons for Selection</h3>
                </el-col>
                <el-col md="12">
                  <el-form-item label="Legal/Contractual Requirement">
                    <el-select
                      v-model="form.legal_requirement"
                      class="form-control"
                      placeholder="Implemented"
                      style="width: 100%"
                      @change="saveSOA('legal_requirement', $event, form.id)"
                    >
                      <el-option value="Yes"> Yes </el-option>
                      <el-option value="No"> No </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col md="12">
                  <el-form-item label="Business Requirement">
                    <el-select
                      v-model="form.business_requirement"
                      class="form-control"
                      placeholder="business_requirement"
                      style="width: 100%"
                      @change="saveSOA('business_requirement', $event, form.id)"
                    >
                      <el-option value="Yes"> Yes </el-option>
                      <el-option value="No"> No </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col md="12">
                  <el-form-item label="Result of Risk Assessment">
                    <el-select
                      v-model="form.result_of_risk_assessment"
                      class="form-control"
                      placeholder="result_of_risk_assessment"
                      style="width: 100%"
                      @change="saveSOA('result_of_risk_assessment', $event, form.id)"
                    >
                      <el-option value="Yes"> Yes </el-option>
                      <el-option value="No"> No </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-col md="12">
              <el-form-item
                label="Kindly provide description of controls/justification for exclusion"
              >
                <textarea
                  v-model="form.justification_of_exclusion"
                  class="form-control"
                  placeholder="Description of Controls/Justification for Exclusion"
                  style="width: 100%"
                  @blur="saveSOA('justification_of_exclusion', $event.target.value, form.id)"
                ></textarea>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Reference to Control Document/Evidence">
                <textarea
                  v-model="form.reference_to_control_document"
                  class="form-control"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('reference_to_control_document', $event.target.value, form.id)"
                ></textarea>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Is the control implemented">
                <el-select
                  v-model="form.implemented"
                  class="form-control"
                  placeholder="Implemented"
                  style="width: 100%"
                  @change="saveSOA('implemented', $event, form.id)"
                >
                  <el-option value="Fully Implemented"> Fully Implemented </el-option>
                  <el-option value="Partially Implemented"> Partially Implemented </el-option>
                  <el-option value="Not Implemented"> Not Implemented </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Additional Controls Required (if any)">
                <textarea
                  v-model="form.addition_control_required"
                  class="form-control"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('addition_control_required', $event.target.value, form.id)"
                ></textarea>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Specify Assets">
                <el-alert type="primary" :closable="false">
                  This field defines the assets which controls are applicable to e.g policies for
                  information security applies to 'people' (staff, intern, guest) OR other assets
                  such as software, equipments, data etc.
                </el-alert>
                <br />
                <el-select
                  v-model="form.assets"
                  filterable
                  multiple
                  style="width: 100%"
                  @change="saveSOA('assets', $event, form.id)"
                >
                  <el-option
                    v-for="(asset_type, index) in asset_types"
                    :key="index"
                    :value="asset_type.name"
                    :label="asset_type.name"
                  />
                </el-select>
                <p>
                  <el-tag v-for="asset in form.assets" :key="asset" type="success">
                    {{ asset }}
                  </el-tag>
                </p>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="State Risk">
                <el-alert type="primary" :closable="false">
                  A potential for a loss OR Something that hasn't happen yet but has a probability
                  of occuring in the future if control(s) are not applied.
                </el-alert>
                <br />
                <textarea
                  v-model="form.risk"
                  class="form-control"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('risk', $event.target.value, form.id)"
                ></textarea>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="State Issue">
                <el-alert type="primary" :closable="false">
                  Issue is a current problem or obstacle or risk affecting information assets that
                  requires immediate action to correct the problems.
                </el-alert>
                <br />
                <textarea
                  v-model="form.issue"
                  class="form-control"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('issue', $event.target.value, form.id)"
                ></textarea>
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Who is Responsible? (R)">
                <el-input
                  v-model="form.r"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('r', $event, form.id)"
                />
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Who is Accountable? (A)">
                <el-input
                  v-model="form.a"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('a', $event, form.id)"
                />
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Who is Consulted? (C)">
                <el-input
                  v-model="form.c"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('c', $event, form.id)"
                />
              </el-form-item>
            </el-col>
            <el-col md="12">
              <el-form-item label="Who is Informed? (I)">
                <el-input
                  v-model="form.i"
                  placeholder="Type here..."
                  style="width: 100%"
                  @blur="saveSOA('i', $event, form.id)"
                />
              </el-form-item>
            </el-col>
            <P />
            <el-button gradient="primary" @click="formSubmitted()"> Done </el-button>
          </el-form>
        </el-row>
      </el-col>
      <el-col md="5">
        <div v-if="selectedData !== null">
          <div
            style="
              background: #f7f0da;
              padding: 10px;
              border-radius: 5px;
              border: 2px solid #d2a204;
              border-radius: 5px;
            "
          >
            <strong>Control:</strong><br />
            <!-- eslint-disable-next-line vue/no-v-html-->
            <span v-html="selectedData.name"></span><br /><br />

            <strong>Control Description:</strong><br />
            <!-- eslint-disable-next-line vue/no-v-html-->
            <span v-html="selectedData.description"></span><br />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      asset_types: [],
      form: {
        assets: []
      },
      loading: false,
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false
    }
  },
  watch: {
    selectedData() {
      this.form = this.selectedData.soa
      this.fetchDetails()
    }
  },
  created() {
    this.form = this.selectedData.soa
    this.fetchAssetTypes()
    this.fetchDetails()
  },
  methods: {
    resetForm(data) {
      this.form = data
    },
    fetchAssetTypes() {
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      this.loading = true
      fetchEntryResource
        .list({ client_id: this.selectedData.client_id })
        .then((response) => {
          this.asset_types = response.asset_types
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
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
    saveSOA(field, value, id) {
      //
      const params = {
        field,
        value
      }
      const updateField = new Resource('soa/update-soa')
      updateField.update(id, params).then(() => {})
    },
    fetchDetails() {
      this.loading = true
      const fetchDetailsResources = new Resource('soa/details')
      fetchDetailsResources
        .get(this.selectedData.soa.id)
        .then((response) => {
          this.form = response.soa
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    formSubmitted() {
      this.$emit('updated')
    }
  }
}
</script>
