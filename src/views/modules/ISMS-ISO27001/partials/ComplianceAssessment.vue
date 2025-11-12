<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <el-skeleton v-if="loading" :rows="5" animated />
    <v-stepper v-else v-model="step" alt-labels non-linear>
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <template v-for="(monitor, index) in monitors" :key="`${index}-step`">
            <v-stepper-item
              :complete="monitor[0].is_submitted === 1"
              editable
              :title="index"
              :color="monitor[0].is_submitted === 1 ? 'green' : 'gray'"
            />

            <v-divider />
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item
            v-for="(monitor, index) in monitors"
            :key="`${index}-content`"
            :value="monitor.responses"
          >
            <el-row>
              <el-col :md="24">
                <div class="mb-4">
                  <span>
                    <strong>{{ index }}</strong>
                  </span>
                  <span class="pull-right">
                    <el-button-group>
                      <el-tooltip content="Save" placement="left-start">
                        <el-button
                          type="success"
                          :disabled="monitor[0].is_submitted === 1"
                          @click="$message('Saved Successfully')"
                        >
                          <icon icon="tabler:device-floppy" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Submit" placement="left-start">
                        <el-button
                          type="default"
                          :disabled="monitor[0].is_submitted === 1"
                          @click="submitResponse(monitor[0].id)"
                          :loading="loadSubmit"
                        >
                          <icon icon="tabler:cloud-up" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="Edit" placement="top-start">
                        <el-button
                          type="warning"
                          :disabled="monitor[0].is_submitted === 0"
                          @click="monitor[0].is_submitted = 0"
                        >
                          <icon icon="tabler:edit" />
                        </el-button>
                      </el-tooltip>
                    </el-button-group>
                  </span>
                </div>
                <hr />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                v-for="(response, response_index) in monitor[0].responses"
                :key="response_index"
                :md="12"
              >
                <div>
                  {{ response.question.question }}
                </div>
                <div>
                  <QuestionResponseInputs
                    :data="response.question"
                    :submit-status="monitor[0].is_submitted"
                    :analysis="response"
                    @string-response="updateField(response.id, $event, 'response')"
                    @array-response="updateField(response.id, $event, 'response_array')"
                  />
                  <el-input
                    v-if="response.question.requires_details === 1 && monitor[0].is_submitted === 0"
                    v-model="response.details"
                    type="textarea"
                    placeholder="Please provide extra details to your response..."
                    variant="outlined"
                    rows="3"
                    @change="updateField(response.id, $event, 'details')"
                  />
                  <hr />
                </div>
              </el-col>
            </el-row>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions @click:next="next" @click:prev="prev" />
      </template>
    </v-stepper>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import QuestionResponseInputs from './QuestionResponseInputs.vue'

export default {
  components: {
    QuestionResponseInputs
  },
  data() {
    return {
      form: {},
      stepperItems: [],
      monitors: [],
      projectId: null,
      step: 0,
      loadSubmit: false,
      disabled: true,
      loading: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  mounted() {
    this.setProjectId()
  },
  methods: {
    async setProjectId() {
      this.loading = true
      await this.$store.dispatch('navItems/fetchActivatedModules', this.selectedClient)
      this.clientActivatedProjects.forEach((project) => {
        if (project.available_module) {
          if (project.available_module.slug === 'isms') {
            this.projectId = project.id
          }
        }
      })
      if (this.projectId !== null) {
        this.fetchQuestionDetails()
      }
    },
    updateStepperItems() {
      const items = []
      for (const key in this.monitors) {
        items.push(key)
      }
      this.stepperItems = items
    },
    updateField(id, value, field) {
      const params = {
        field,
        value
      }

      // assessment.loader = true
      const updateResources = new Resource('isms/compliance/update-compliance-response')
      updateResources
        .update(id, params)
        .then((response) => {})
        .catch(() => {})
    },
    fetchQuestionDetails() {
      const param = { project_id: this.projectId }
      this.loading = true
      const fetchDetailsResources = new Resource('isms/compliance/create-compliance-monitor')
      fetchDetailsResources
        .store(param)
        .then((response) => {
          this.monitors = response.monitors
          this.updateStepperItems()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    submitResponse(monitorId) {
      this.loadSubmit = true
      const submitResponseResources = new Resource('isms/compliance/submit-responses')
      submitResponseResources
        .update(monitorId, null)
        .then((response) => {
          this.monitors = response.monitors
          this.loadSubmit = false
          this.$message('Submitted Successfully')
        })
        .catch(() => {
          this.loadSubmit = false
        })
    }
  }
}
</script>
