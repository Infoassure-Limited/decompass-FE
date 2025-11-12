<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isProjectSettingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-project-setting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Project Settings </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label-for="v-standard">
                <label>Start Date</label>
                <el-date-picker
                  v-model="project.start_date"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set start date"
                  style="width: 100%"
                  @input="setDate($event, project, 'start_date')"
                />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group>
                <label>Deadline</label>
                <el-date-picker
                  v-model="project.deadline"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set a deadline"
                  style="width: 100%"
                  :picker-options="pickerOptions2"
                  @input="setDate($event, project, 'deadline')"
                />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group>
                <label>Project Completion Date</label>
                <el-date-picker
                  v-model="project.date_completed"
                  type="date"
                  format="dd-MM-yyyy"
                  value-format="yyyy-MM-dd"
                  placeholder="Set completion date"
                  style="width: 100%"
                  :picker-options="pickerOptions"
                  @input="setDate($event, project, 'date_completed')"
                />
              </el-form-group>
              <br />
            </el-col>
            <el-col cols="12">
              <label>Document Uploads</label>
              <el-form-group>
                <select
                  v-model="project.allow_document_uploads"
                  @change="
                    changeDocumentUploadRestriction(project, $event, 'allow_document_uploads')
                  "
                >
                  <option :value="0" label="Disabled"></option>
                  <option :value="1" label="Enabled"></option>
                </select>
              </el-form-group>
              <br />
            </el-col>
            <!-- submit and reset -->
            <!-- <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="form.standards.length < 1"
                @click="submit()"
              >
                Submit
              </el-button>
            </el-col> -->
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isProjectSettingSidebarActive',
    event: 'update:is-project-setting-sidebar-active'
  },
  props: {
    isProjectSettingSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedProject: {
      type: Object,
      required: true
    }
    // registeredStandards: {
    //   type: Array,
    //   required: true,
    // },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      form: {
        standards: [],
        consulting_id: '',
        client_id: ''
      },
      loading: false,
      project: {},
      selectedConsulting: {}
    }
  },
  created() {
    this.project = this.selectedProject
  },
  methods: {
    setDate(event, project, field) {
      const param = { field, date: event }

      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      // this.loading = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource
        .update(project.id, param)
        .then(() => {
          this.$message('Action Successful')
          // this.fetchProjects()
          // this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },
    changeDocumentUploadRestriction(project, event, field) {
      const { value } = event.target
      const param = { value, field }

      if (window.confirm('Click OK to confirm')) {
        // this.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource
          .update(project.id, param)
          .then(() => {
            this.$message('Action Successful')
            this.fetchProjects()
            // this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    submit() {
      this.loading = true
      const saveCurriculumSetupResource = new Resource('projects/save')
      const param = this.form
      param.consulting_id = this.selectedConsulting.id
      saveCurriculumSetupResource
        .store(param)
        .then(() => {
          this.loading = false
          // this.$message('Action Successful')
          this.$notify({
            title: 'Action Successful',
            message: 'The specified project have been created for the client'
          })
          this.form = {
            standards: [],
            consulting_id: '',
            client_id: ''
          }
          this.$emit('save')
          // this.$emit('update:is-project-setting-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
