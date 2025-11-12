<template>
  <div v-loading="load">
    <el-row :gutter="5">
      <el-col :lg="12">
        <el-select
          v-model="form.standard_id"
          placeholder="Select Standard"
          style="width: 100%"
          @input="fetchProjectPhases()"
        >
          <el-option
            v-for="(standard, index) in standards"
            :key="index"
            :value="standard.id"
            :label="standard.name"
          />
        </el-select>
      </el-col>
      <el-col :lg="12">
        <el-select
          v-model="form.project_phase_id"
          v-loading="loadProjectPhase"
          placeholder="Select Project Phase"
          style="width: 100%"
        >
          <el-option
            v-for="(project_phase, index) in project_phases"
            :key="index"
            :value="project_phase.id"
            :label="project_phase.title"
          />
        </el-select>
      </el-col>
    </el-row>
    <br />
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Action</th>
          <th>Task</th>
          <th>Responsibility</th>
          <th>Resource</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(detail, index) in details" :key="index">
          <td>
            <span>
              <el-button
                v-if="details.length > 1"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeDetail(index)"
              />
              <el-button
                v-if="index + 1 === details.length"
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addDetail(index)"
              />
            </span>
          </td>
          <td>
            <el-input v-model="detail.task" placeholder="Enter Task" type="text" />
          </td>
          <td>
            <el-input
              v-model="detail.responsibility"
              placeholder="Who is responsible?"
              type="text"
            />
          </td>
          <td>
            <el-input v-model="detail.resource" placeholder="Enter Resource" type="text" />
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="4">
            <label class="label label-danger"
              >Please fill all empty fields before adding another row</label
            >
          </td>
        </tr>
        <tr v-if="!isRowEmpty()">
          <td colspan="3"> &nbsp; </td>
          <td>
            <el-button round type="success" @click="submit()"> Submit </el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    standards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      details: [],
      dialogVisible: false,
      fill_fields_error: false,
      showSaveButton: true,
      load: false,
      loadProjectPhase: false,
      rowIndex: '',
      form: {
        project_phase_id: '',
        standard_id: ''
      },
      project_phases: []
    }
  },
  created() {
    this.addDetail()
  },
  methods: {
    fetchProjectPhases() {
      this.loadProjectPhase = true
      const fetchProjectsResource = new Resource('project-plans/fetch-project-phases')
      fetchProjectsResource.list({ standard_id: this.form.standard_id }).then((response) => {
        this.loadProjectPhase = false
        this.project_phases = response.project_phases
      })
    },
    isRowEmpty() {
      const checkEmptyLines = this.details.filter(
        (detail) => detail.task === '' || detail.responsibility === '' || detail.resource === ''
        // detail.rep_coordinate === ''
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addDetail() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          task: '',
          responsibility: '',
          resource: ''
        })
      }
    },
    removeDetail(detailId) {
      this.fill_fields_error = false
      if (!this.repBlockRemoval) {
        this.details.splice(detailId, 1)
      }
    },
    submit() {
      this.$confirm('Are you sure you want to submit these entries?', 'Warning', {
        confirmButtonText: 'Yes Submit',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Sending...',
          // });
          this.load = true
          if (this.details.length > 0) {
            const { form } = app
            form.details = this.details
            const submitResource = new Resource('project-plans/store-gen-project-plans')
            submitResource
              .store(form)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: 'Action Successful'
                })
                this.details = [
                  {
                    task: '',
                    responsibility: '',
                    resource: ''
                  }
                ]
                this.form.project_phase_id = ''
                this.load = false
              })
              .catch(() => {
                this.$message({
                  type: 'danger',
                  message: 'An error Occured'
                })
                this.load = false
              })
          }
          // this.loadForm = false;
        })
        .catch(() => {
          this.load = false
        })
    }
  }
}
</script>
