<template>
  <el-row :gutter="20">
    <el-col :md="24">
      <label label-for="roles" rules="required">Select Control</label>
      <el-select v-model="form.clause_id" filterable style="width: 100%">
        <el-option
          v-for="(clause, index) in clauses"
          :key="index"
          :value="clause.id"
          :label="`${clause.name} - ${clause.description}`"
        />
      </el-select>
    </el-col>
  </el-row>
  <div style="max-height: 400px; overflow: auto; padding: 20px">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(detail, index) in details"
        :key="index"
        :title="`${index + 1} - ${detail.name}`"
        :name="index"
      >
        <template #title>
          <strong
            >{{ index + 1 }} - {{ detail.name !== '' ? detail.name : 'Define New Task' }}</strong
          >
        </template>
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :md="12">
            <v-text-field
              v-model="detail.activity_no"
              density="compact"
              variant="outlined"
              type="text"
              label="Control No."
              placeholder="e.g. 4.1-a"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              v-model="detail.name"
              density="compact"
              variant="outlined"
              label="Process Title"
              placeholder="e.g. Identify external factors"
            />
          </el-col>
          <el-col :md="12">
            <v-textarea
              v-model="detail.description"
              density="compact"
              variant="outlined"
              rows="3"
              label="Description"
              placeholder="e.g. Document external factors (legal, regulatory, market trends, technology) that affect the ISMS."
            />
          </el-col>
          <el-col :md="12">
            <v-textarea
              v-model="detail.implementation_guide"
              density="compact"
              variant="outlined"
              rows="3"
              label="Suggest implementation guide"
              placeholder="e.g Use online legal databases, industry publications, and tech blogs. Note each factor with a brief summary and source"
            />
          </el-col>
          <el-col :md="12">
            <label for="">List of Tasks</label>
            <small>List all tasks here. Hit the ENTER key to add multiple tasks</small>
            <el-input-tag
              v-model="detail.tasks"
              size="large"
              placeholder="List all tasks here. Hit the ENTER key to add multiple tasks"
            />
          </el-col>
          <el-col :md="12">
            <label for="">Expected Document/Evidence Template</label>
            <el-select
              v-model="detail.document_template_ids"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="Select"
              style="width: 100%"
              filterable
            >
              <el-option-group
                v-for="(documentTemplates, index) in templates"
                :key="index"
                :label="index"
              >
                <el-option
                  v-for="template in documentTemplates"
                  :key="template.id"
                  :label="template.title"
                  :value="template.id"
                />
              </el-option-group>
            </el-select>
          </el-col>
        </el-row>
        <el-button-group>
          <el-button v-if="details.length > 1" type="danger" @click="removeLine(index)">
            <icon icon="tabler:trash" />
          </el-button>
          <el-button
            v-if="index + 1 === details.length"
            type="success"
            @click="(addLine(index), (activeName = parseInt(index + 1)))"
          >
            <icon icon="tabler:plus" /> Add New
          </el-button>
        </el-button-group>
      </el-collapse-item>
    </el-collapse>
    <div v-if="fill_fields_error">
      <label class="alert alert-danger"
        >Please fill all empty fields before adding another row</label
      >
    </div>
  </div>
  <el-button
    class="pull-right"
    :loading="loader"
    :disabled="rowIsEmpty()"
    type="primary"
    @click="formSubmitted"
  >
    Submit All
  </el-button>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    clauses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const maxDate = new Date()
    return {
      activeName: 0,
      max: maxDate,

      form: {
        clause_id: '',
        details: []
      },
      empty_form: {
        clause_id: '',
        details: []
      },
      loader: false,
      details: [],
      fill_fields_error: false,
      loadTasks: false,
      other_tasks: [],
      templates: []
    }
  },
  created() {
    this.fetchDocumentTemplates()
    this.addLine()
  },
  methods: {
    rowIsEmpty() {
      return this.details.some((detail) => detail.name === '' || detail.activity_no === '')
    },
    addLine() {
      this.fill_fields_error = false

      if (this.rowIsEmpty() && this.details.length > 0) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          activity_no: '',
          name: '',
          implementation_guide: '',
          tasks: [],
          description: '',
          document_template_ids: []
        })
      }
    },
    fetchDocumentTemplates() {
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.form).then((response) => {
        this.templates = response.document_templates
      })
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.details.splice(detailId, 1)
      }
    },
    formSubmitted() {
      const createTaskResource = new Resource('isms/calendar/store-clause-activity-tasks')
      const { form } = this
      form.details = this.details
      this.loader = true
      createTaskResource
        .store(form)
        .then(() => {
          this.form = this.empty_form
          this.loader = false

          this.$message('Action Successful')
          // this.$router.push({ path: 'login' })
          this.$emit('saved')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    }
  }
}
</script>
