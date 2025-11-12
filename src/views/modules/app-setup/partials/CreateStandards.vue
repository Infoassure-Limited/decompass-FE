<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Create Standards </h5>
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
              <el-form-group label="Enter Name(s) of Standard" label-for="v-level_group">
                <el-form-input
                  v-model="form.names"
                  placeholder="example: ISO 27001|ISO 22301|ISO 20000"
                />
              </el-form-group>
              <small
                >You can enter multiple standard names, just separate them with a vertical bar
                <code>|</code></small
              >
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
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active'
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true
    },
    consultings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        names: '',
        consulting_id: '',
        assessment_activities: []
      },
      loading: false
    }
  },
  computed: {
    activities() {
      return this.$store.getters.assessmentActivity
    }
  },
  methods: {
    submit() {
      this.loading = true
      const saveCurriculumSetupResource = new Resource('standards/save')
      const param = this.form
      saveCurriculumSetupResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response)
          this.$emit('update:is-create-standard-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error.response.data.error)
        })
    }
  }
}
</script>
