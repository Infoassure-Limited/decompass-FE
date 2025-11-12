<template>
  <div v-loading="loading">
    <el-form label-position="top">
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="Name of Controller">
            <el-tooltip
              target="controller_name"
              content="Who is the controller of the data i.e. the natural or legal person, public authority, agency or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data"
            />
            <input
              id="controller_name"
              v-model="form.controller_name"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_name')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Contact Details of Controller">
            <el-tooltip
              target="controller_contact_details"
              content="State the contact details of the Controller"
            />
            <input
              id="controller_contact_details"
              v-model="form.controller_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_contact_details')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Name of Joint Controller">
            <el-tooltip
              target="joint_controller_name"
              content="Who is the joint controller (if any) of the data. This applies where two or more controllers jointly determine the purposes and means of processing"
            />
            <input
              id="joint_controller_name"
              v-model="form.joint_controller_name"
              class="form-control"
              @blur="updateField($event.target.value, 'joint_controller_name')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Contact Details of Controller">
            <el-tooltip
              target="joint_controller_contact_details"
              content="State the contact details of the joint controller"
            />
            <input
              id="joint_controller_contact_details"
              v-model="form.joint_controller_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'joint_controller_contact_details')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Name of Controller's Representative">
            <el-tooltip
              target="controller_rep_name"
              content="Where the controller is not established in the European Union"
            />
            <input
              id="controller_rep_name"
              v-model="form.controller_rep_name"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_rep_name')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Contact Details of Controller's Representative">
            <el-tooltip
              target="controller_rep_contact_details"
              content="State the contact details of the controller's representative"
            />
            <input
              id="controller_rep_contact_details"
              v-model="form.controller_rep_contact_details"
              class="form-control"
              @blur="updateField($event.target.value, 'controller_rep_contact_details')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Name of Data Protection Officer">
            <el-tooltip
              target="dpo_name"
              content="If applicable - where there is a requirement to appoint a data protection officer"
            />
            <input
              id="dpo_name"
              v-model="form.dpo_name"
              class="form-control"
              @blur="updateField($event.target.value, 'dpo_name')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Contact Details of Data Protection Officer">
            <el-tooltip
              target="dpo_details"
              content="State the contact details of the data protection officer"
            />
            <input
              id="dpo_details"
              v-model="form.dpo_details"
              class="form-control"
              @blur="updateField($event.target.value, 'dpo_details')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Purpose of Processing">
            <el-tooltip
              target="processing_purpose"
              content="The reasons for which the processing is carried out"
            />
            <textarea
              id="processing_purpose"
              v-model="form.processing_purpose"
              class="form-control"
              @blur="updateField($event.target.value, 'processing_purpose')"
            ></textarea>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Category of Data Subjects">
            <el-tooltip
              target="data_subject_categories"
              content="Define who the data subjects are e.g. by country, gender, service recipients"
            />
            <input
              id="data_subject_categories"
              v-model="form.data_subject_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'data_subject_categories')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Categories of Personal Data">
            <el-tooltip
              target="personal_data_categories"
              content="Define the types of data items that are involved, particularly if special categories such as biometric data"
            />
            <textarea
              id="personal_data_categories"
              v-model="form.personal_data_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'personal_data_categories')"
            ></textarea>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Categories of Data Recipients">
            <el-tooltip
              target="data_recipients_categories"
              content="Who is the data regularly shared with or who has access to it?"
            />
            <input
              id="data_recipients_categories"
              v-model="form.data_recipients_categories"
              class="form-control"
              @blur="updateField($event.target.value, 'data_recipients_categories')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="International Transfer Destination">
            <el-tooltip
              target="international_transfer_destination"
              content="Countries or international organisations to whom the data are regularly transferred"
            />
            <input
              id="international_transfer_destination"
              v-model="form.international_transfer_destination"
              class="form-control"
              @blur="updateField($event.target.value, 'international_transfer_destination')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Time Limit for Erasure">
            <el-tooltip
              target="erasure_time_limit"
              content="How long will the personal data be held for before it is erased?"
            />
            <input
              id="erasure_time_limit"
              v-model="form.erasure_time_limit"
              class="form-control"
              @blur="updateField($event.target.value, 'erasure_time_limit')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Technical and Organisational Security Measures Applied">
            <el-tooltip
              target="security_measures_applied"
              content="A brief description of the controls used to protect the personal data (refer to additional information if required)"
            />
            <input
              id="security_measures_applied"
              v-model="form.security_measures_applied"
              class="form-control"
              @blur="updateField($event.target.value, 'security_measures_applied')"
            />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="Comments">
            <el-tooltip
              target="comments"
              content="Any other comments you would like to make about the information"
            />
            <textarea
              id="comments"
              v-model="form.comments"
              class="form-control"
              @blur="updateField($event.target.value, 'comments')"
            ></textarea>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="$emit('updated')"> Update </el-button>
    </el-form>
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
    this.form = this.selectedData
  },
  methods: {
    updateField(value, field) {
      const params = {
        field,
        value
      }
      const updateResources = new Resource('ndpa/ropa/update')
      updateResources
        .update(this.selectedData.id, params)
        .then((response) => {
          this.form = response.ropa
          // this.$message('Updated')
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
