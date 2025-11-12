<template>
  <div class="container" v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="24">
        <div class="pull-right">
          <el-button @click="showForm = true"> <icon icon="tabler:upload" /> Upload </el-button>
        </div>
        <h4>Resolution Responses/Evidences</h4>
      </el-col>
      <el-col v-if="task !== null" :md="24">
        <el-card v-for="(evidence, index) in task.evidences" :key="index" class="mb-1">
          <el-tooltip content="Click to view">
            <a :href="baseServerUrl + 'storage/' + evidence.file_path" target="_blank">{{
              evidence.file_name
            }}</a>
          </el-tooltip>
          <hr />
          <div style="max-height: 100px; overflow: auto">
            <span v-html="evidence.comments"></span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="showForm" title="Upload Evidence" destroy-on-close hide-footer>
      <el-row :gutter="10">
        <el-col :md="18">
          <v-textarea
            v-model="comments"
            :rows="3"
            label="Solution to task"
            placeholder="Type a comment about the solution to this task"
            variant="outlined"
          />
        </el-col>
        <el-col :md="18">
          <p>Upload supporting evidence (.pdf, .png and .jpg extensions only)</p>
          <input
            placeholder="Click to select file"
            class="form-control mb-2"
            type="file"
            @change="onImageChange"
          />
        </el-col>
        <el-col :md="8">
          <el-button :disabled="uploadedFile === null" type="success" @click="submitFile">
            Submit
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import { themeOptions } from '@/components/CodeEditor/src/config/config'
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      loading: false,
      client_users: [],
      uploadedFile: null,
      comments: ''
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  methods: {
    onImageChange(e) {
      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf' && fileType !== 'image/png' && fileType !== 'image/jpeg') {
        this.$alert('Only .pdf, .png and .jpg file formats are acceptable.')
        return false
      }

      this.uploadedFile = e.target.files[0]
      return true
    },
    submitFile() {
      const formData = new FormData()
      formData.append('file', this.uploadedFile)
      formData.append('task_id', this.task.id)
      formData.append('incident_id', this.task.incident_id)
      formData.append('comments', this.comments)
      const uploadEvidence = new Resource('isms/incidents/upload-task-evidence')
      uploadEvidence
        .store(formData)
        .then(() => {
          this.$emit('uploaded')
          this.$message({
            message: 'File Uploaded Successfully!!!',
            type: 'success'
          })
          this.loadForm = false
          this.showForm = false
        })
        .catch((error) => {
          this.loadForm = false
          console.log(error.message)
        })
    }
  }
}
</script>
