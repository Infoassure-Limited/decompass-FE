<template>
  <div v-loading="loading">
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="Select Business Unit" label-for="business_unit_id">
            <el-select
              v-model="form.business_unit_id"
              placeholder="Select Business Unit"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="(business_unit, index) in business_units"
                :key="index"
                :value="business_unit.id"
                :label="business_unit.unit_name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="form.business_unit_id !== ''">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="Name of Controller">
              <el-tooltip
                target="controller_name"
                title="Who is the controller of the data i.e. the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data"
              />
              <input id="controller_name" v-model="form.controller_name" class="form-control" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Contact Details of Controller">
              <el-tooltip
                target="controller_contact_details"
                title="State the contact details of the Controller"
              />
              <input
                id="controller_contact_details"
                v-model="form.controller_contact_details"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Name of Joint Controller">
              <el-tooltip
                target="joint_controller_name"
                title="Who is the joint controller (if any) of the data. This applies where two or more controllers jointly determine the purposes and means of processing"
              />
              <input
                id="joint_controller_name"
                v-model="form.joint_controller_name"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Contact Details of Joint Controller">
              <el-tooltip
                target="joint_controller_contact_details"
                title="State the contact details of the joint controller"
              />
              <input
                id="joint_controller_contact_details"
                v-model="form.joint_controller_contact_details"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Name of Controller's Representative">
              <el-tooltip
                target="controller_rep_name"
                title="Where the controller is not established in the European Union"
              />
              <input
                id="controller_rep_name"
                v-model="form.controller_rep_name"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Contact Details of Controller's Representative">
              <el-tooltip
                target="controller_rep_contact_details"
                title="State the contact details of the controller's representative"
              />
              <input
                id="controller_rep_contact_details"
                v-model="form.controller_rep_contact_details"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Name of Data Protection Officer">
              <el-tooltip
                target="dpo_name"
                title="If applicable - where there is a requirement to appoint a data protection officer"
              />
              <input id="dpo_name" v-model="form.dpo_name" class="form-control" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Contact Details of Data Protection Officer">
              <el-tooltip
                target="dpo_details"
                title="State the contact details of the data protection officer"
              />
              <input id="dpo_details" v-model="form.dpo_details" class="form-control" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Purpose of Processing">
              <el-tooltip
                target="processing_purpose"
                title="The reasons for which the processing is carried out"
              />
              <textarea
                id="processing_purpose"
                v-model="form.processing_purpose"
                class="form-control"
              ></textarea>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Category of Data Subjects">
              <el-tooltip
                target="data_subject_categories"
                title="Define who the data subjects are e.g. by country, gender, service recipients"
              />
              <input
                id="data_subject_categories"
                v-model="form.data_subject_categories"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Categories of Personal Data">
              <el-tooltip
                target="personal_data_categories"
                title="Define the types of data items that are involved, particularly if special categories such as biometric data"
              />
              <textarea
                id="personal_data_categories"
                v-model="form.personal_data_categories"
                class="form-control"
              ></textarea>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Categories of Data Recipients">
              <el-tooltip
                target="data_recipients_categories"
                title="Who is the data regularly shared with or who has access to it?"
              />
              <input
                id="data_recipients_categories"
                v-model="form.data_recipients_categories"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="International Transfer Destination">
              <el-tooltip
                target="international_transfer_destination"
                title="Countries or international organisations to whom the data are regularly transferred"
              />
              <input
                id="international_transfer_destination"
                v-model="form.international_transfer_destination"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Time Limit for Erasure">
              <el-tooltip
                target="erasure_time_limit"
                title="How long will the personal data be held for before it is erased?"
              />
              <input
                id="erasure_time_limit"
                v-model="form.erasure_time_limit"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Technical and Organisational Security Measures Applied">
              <el-tooltip
                target="security_measures_applied"
                title="A brief description of the controls used to protect the personal data (refer to additional information if required)"
              />
              <input
                id="security_measures_applied"
                v-model="form.security_measures_applied"
                class="form-control"
              />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="Comments">
              <el-tooltip
                target="comments"
                title="Any other comments you would like to make about the information"
              />
              <textarea id="comments" v-model="form.comments" class="form-control"></textarea>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="success" @click="submit()"> Submit </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    clientId: {
      type: Number,
      required: true
    },
    standardId: {
      type: Number,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      yes_no: ['Yes', 'No'],
      lawful_bases: [
        'Consent-based',
        'Contractual',
        'Legal Obligation',
        'Vital Interests',
        'Public Interests',
        'Legitimate Interests'
      ],
      exceptions: [
        'Explicit Consent',
        'Legal Obligation',
        'Public Data',
        'Legal Claims',
        'Public Interest',
        'Health Purposes',
        'Public Health',
        'Archiving and Research'
      ],
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        client_id: '',
        standard_id: '',
        business_unit_id: '',
        controller_name: '',
        controller_contact_details: '',
        joint_controller_name: '',
        joint_controller_contact_details: '',
        controller_rep_name: '',
        controller_rep_contact_details: '',
        dpo_name: '',
        dpo_details: '',
        processing_purpose: '',
        data_subject_categories: '',
        personal_data_categories: '',
        data_recipients_categories: '',
        international_transfer_destination: '',
        erasure_time_limit: '',
        security_measures_applied: '',
        comments: ''
      },
      business_units: [],
      business_processes: [],
      loading: false,
      selectedClient: {},
      uploadableFile: null
    }
  },
  created() {
    this.form.client_id = this.clientId
    this.form.standard_id = this.standardId
    this.fetchBusinessUnits()
  },
  methods: {
    fetchBusinessUnits() {
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.clientId })
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    isEmpty() {
      return (
        this.form.controller_name === '' ||
        this.form.controller_contact_details === '' ||
        this.form.joint_controller_name === '' ||
        this.form.joint_controller_contact_details === '' ||
        this.form.controller_rep_name === '' ||
        this.form.controller_rep_contact_details === '' ||
        this.form.dpo_name === '' ||
        this.form.dpo_details === '' ||
        this.form.processing_purpose === '' ||
        this.form.data_subject_categories === '' ||
        this.form.personal_data_categories === '' ||
        this.form.data_recipients_categories === '' ||
        this.form.international_transfer_destination === '' ||
        this.form.erasure_time_limit === '' ||
        this.form.security_measures_applied === '' ||
        this.form.comments === ''
      )
    },
    submit() {
      if (this.isEmpty()) {
        this.$alert('No field should be left blank')
        return
      }
      this.loading = true
      const saveRisksResource = new Resource('ndpa/ropa/store')
      saveRisksResource
        .store(this.form)
        .then(() => {
          this.loading = false
          this.form = {
            controller_name: '',
            controller_contact_details: '',
            joint_controller_name: '',
            joint_controller_contact_details: '',
            controller_rep_name: '',
            controller_rep_contact_details: '',
            dpo_name: '',
            dpo_details: '',
            processing_purpose: '',
            data_subject_categories: '',
            personal_data_categories: '',
            data_recipients_categories: '',
            international_transfer_destination: '',
            erasure_time_limit: '',
            security_measures_applied: '',
            comments: ''
          }
          // this.$message('Action Successful')
          this.$notify({
            title: 'Submitted Successfully'
          })
          // this.$emit('update:is-create-business-process-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
