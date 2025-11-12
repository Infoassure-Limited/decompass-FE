<template>
  <div v-loading="loading">
    <div v-if="selectedProject.is_completed === 1">
      <el-row v-if="!isAdmin && feedbacks.length < 1" :gutter="10">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"
          ><strong>We would love to get your feedback</strong></el-col
        >
        <el-col
          v-for="(form_field, form_index) in form_fields"
          :key="form_index"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <div class="form-group">
            <label for>{{ form_field.label }}</label>
            <div v-if="form_field.input_type === 'select'">
              <el-select
                v-model="extra_details[form_index]"
                style="width: 100%"
                value-key="label"
                @input="populateExtraDetailsField(form_index, form_field.label, $event)"
              >
                <el-option
                  v-for="(option, option_index) in formatAvailableOptions(
                    form_field.available_options
                  )"
                  :key="option_index"
                  :value="option"
                  :label="option"
                />
              </el-select>
            </div>
            <div v-if="form_field.input_type === 'number_input'">
              <el-input
                v-model="extra_details[form_index]"
                type="number"
                :placeholder="form_field.placeholder"
                @input="populateExtraDetailsField(form_index, form_field.label, $event)"
              />
            </div>
            <div v-if="form_field.input_type === 'string_input'">
              <el-input
                v-model="extra_details[form_index]"
                type="text"
                :placeholder="form_field.placeholder"
                @input="populateExtraDetailsField(form_index, form_field.label, $event)"
              />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-button type="primary" @click="submitFeedback()"> Submit </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-if="isAdmin" :xs="24" :lg="8">
          <aside style="height: 250px; overflow: auto">
            <h4>Client's feedback</h4>
            <hr />
            <div v-for="(feedback, feedbackIndex) in feedbacks" :key="feedbackIndex">
              <el-card>
                <strong>{{ feedback.label }}</strong
                ><br />
                <span>{{ feedback.value }}</span>
              </el-card>
            </div>
          </aside>
        </el-col>
        <el-col v-if="feedbacks.length > 0" :xs="24" :lg="16">
          <div align="center" style="border: #d0d0d0 double 2px; padding: 30px">
            <div v-if="selectedProject.certificate !== null">
              <div v-if="selectedProject.certificate.report !== null">
                <a
                  :href="baseServerUrl + 'storage/' + selectedProject.certificate.report"
                  target="_blank"
                >
                  <feather-icon size="70" icon="DownloadIcon" color="black" /><br /><br />
                  <h2>DOWNLOAD REPORT HERE</h2>
                </a>
              </div>
              <div v-if="selectedProject.certificate.original !== null">
                <a
                  :href="baseServerUrl + 'storage/' + selectedProject.certificate.original"
                  target="_blank"
                >
                  <feather-icon size="70" icon="DownloadIcon" color="green" /><br /><br />
                  <h2>DOWNLOAD CERTIFICATE</h2>
                </a>
              </div>
              <div v-if="selectedProject.certificate.preview !== null">
                <a
                  :href="baseServerUrl + 'storage/' + selectedProject.certificate.preview"
                  target="_blank"
                >
                  <feather-icon size="70" icon="DownloadIcon" color="green" /><br /><br />
                  <h2>DOWNLOAD CERTIFICATE</h2>
                </a>
              </div>
              <div v-else>
                <el-empty description="Your certificate is yet to be uploaded" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty
        :image="baseServerUrl + 'images/print.png'"
        description="Certificate will be issued when project is completed"
      />
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      loading: false,
      feedbacks: [],
      form_fields: [],
      form: {
        extra_details: []
      },
      extra_details: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchFeedBacks()
    this.fetchFormFields()
  },
  methods: {
    populateExtraDetailsField(formIndex, label, value) {
      this.form.extra_details[formIndex] = { label, value }
      // this.doSubmit();
    },
    formatAvailableOptions(value) {
      return value.split('~')
    },
    fetchFeedBacks() {
      const param = {
        project_id: this.selectedProject.id,
        client_id: this.selectedProject.client_id
      }
      param.client_id = this.selectedProject.client_id
      this.loading = true
      const fetchQuestionsResource = new Resource('projects/client-project-feedback')
      fetchQuestionsResource.list(param).then((response) => {
        this.feedbacks = response.feedbacks
        this.loading = false
      })
    },
    fetchFormFields() {
      const fetchFormFieldResource = new Resource('custom-fields')
      fetchFormFieldResource.list().then((response) => {
        this.form_fields = response.form_fields
        this.loading = false
      })
    },
    submitFeedback() {
      const param = this.form
      param.project_id = this.selectedProject.id
      param.client_id = this.selectedProject.client_id
      const submitFeedbackResource = new Resource('projects/save-client-feedback')
      submitFeedbackResource.store(param).then(() => {
        this.$alert('Thank you for your feedback')
        this.fetchFeedBacks()
        this.loading = false
      })
    }
  }
}
</script>
