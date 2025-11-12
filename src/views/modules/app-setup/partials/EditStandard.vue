<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Edit Standard </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label="Select Unit" label-for="v-standard">
                <el-select v-model="form.consulting_id" style="width: 100%">
                  <el-option
                    v-for="(consulting, index) in consultings"
                    :key="index"
                    :value="consulting.id"
                    :label="consulting.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <!-- first name -->
            <el-col cols="12">
              <el-form-group label="Update Standard" label-for="v-level_group">
                <el-form-input v-model="form.name" placeholder="example: ISO 27001" />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <br />
              <el-form-group label="Select Extra Activities" label-for="v-activities">
                <el-select v-model="form.assessment_activities" style="width: 100%" multiple>
                  <el-option
                    v-for="(activity, index) in activities"
                    :key="index"
                    :value="activity.value"
                    :label="activity.label"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <!-- Level Name -->
            <!-- <el-col cols="12">
              <el-form-group
                label="Standard Description"
                label-for="v-level_group"
              >
                <el-form-textarea
                  v-model="form.description"
                  placeholder="Briefly describe this standard"
                />
              </el-form-group>
            </el-col> -->
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
              </el-button>
            </el-col>
            <el-col v-if="error" cols="12">
              <el-alert variant="danger" show>
                <div class="alert-body">
                  <span
                    ><strong>{{ error_message }}</strong></span
                  >
                </div>
              </el-alert>
            </el-col>
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
    prop: 'isEditStandardSidebarActive',
    event: 'update:is-edit-standard-sidebar-active'
  },
  props: {
    isEditStandardSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedStandard: {
      type: Object,
      default: () => null
    },
    consultings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        consulting_id: '',
        description: '',
        assessment_activities: []
      },
      loading: false,
      error: false,
      error_message: ''
    }
  },
  computed: {
    activities() {
      return this.$store.getters.assessmentActivity
    }
  },
  created() {
    this.formatForm()
  },
  methods: {
    formatForm() {
      const assessmentActivity = this.selectedStandard.assessment_activities
      const assessmentActivityArray =
        assessmentActivity !== null ? assessmentActivity.split('|') : null
      this.form.id = this.selectedStandard.id
      this.form.name = this.selectedStandard.name
      this.form.consulting_id = this.selectedStandard.consulting_id
      this.form.description = this.selectedStandard.description
      this.form.assessment_activities = assessmentActivityArray
    },
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('standards/update')
      const param = this.form
      updateCurriculumSetupResource
        .update(param.id, param)
        .then((response) => {
          this.loading = false
          this.$emit('update', response)
          this.$emit('update:is-edit-standard-sidebar-active', false)
        })
        .catch(() => {
          this.$alert('An error occured. A duplicate entry is probably detected.')
          this.loading = false
        })
    }
  }
}
</script>
