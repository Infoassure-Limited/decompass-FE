<template>
  <el-card>
    <v-client-table :data="certificates" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:report="{ row }">
        <div>
          <input
            class="form-control"
            type="file"
            @change="onImageChange($event, row.id, 'report')"
          /><br />
          <el-alert v-if="row.report !== null" :closable="false" type="success">
            <a :href="baseServerUrl + 'storage/' + row.report" target="_blank">
              <el-button round type="primary"> <icon icon="DownloadIcon" /> View </el-button>
            </a>
          </el-alert>
        </div>
      </template>
      <template v-slot:original="{ row }">
        <div>
          <input
            class="form-control"
            type="file"
            @change="onImageChange($event, row.id, 'original')"
          /><br />
          <el-alert v-if="row.original !== null" :closable="false" type="success">
            <a
              v-if="row.original !== null"
              :href="baseServerUrl + 'storage/' + row.original"
              target="_blank"
            >
              <el-button round type="primary"> <icon icon="DownloadIcon" /> View </el-button>
            </a>
            <a v-else :href="baseServerUrl + 'storage/' + row.preview" target="_blank">
              <el-button round type="primary"> <icon icon="DownloadIcon" /> View </el-button>
            </a>
          </el-alert>
        </div>
      </template>
      <template v-slot:client_comment_on_preview="{ row }">
        <div>
          <el-input
            v-model="row.client_comment_on_preview"
            type="textarea"
            placeholder="Client's comment on the certificate preview will be shown here"
            readonly
          />
        </div>
      </template>
    </v-client-table>
    <add-project
      v-if="isCreateProjectSidebarActive"
      v-model="isCreateProjectSidebarActive"
      :clients="clients"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
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
      loading: false,
      isCreateProjectSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: ['project.standard.name', 'report', 'client_comment_on_preview', 'original'],

      options: {
        headings: {
          'project.standard.name': 'Project',
          original: 'Certificate'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['project.standard.name'],
        // filterable: false,
        filterable: ['project.standard.name']
      },
      certificates: [],
      clients: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchProjects()
    }
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    fetchProjects() {
      this.loading = true
      this.certificates = []
      const fetchProjectsResource = new Resource('projects/client-project-certificates')
      fetchProjectsResource.list({ client_id: this.selectedClient.id }).then((response) => {
        this.certificates = response.certificates // .data
        this.loading = false
      })
    },
    onImageChange(e, id, certType) {
      this.uploadableFile = e.target.files[0]
      this.submit(id, certType)
    },
    submit(id, certType) {
      this.load = true
      const formData = new FormData()
      formData.append('project_certificate_id', id)
      formData.append('file_uploaded', this.uploadableFile)
      formData.append('cert_type', certType)
      const uploadFileResource = new Resource('projects/upload-certificate')
      uploadFileResource
        .store(formData)
        .then(() => {
          this.load = false
          this.uploadableFile = null
          this.form = {
            title: '',
            link: ''
          }
          this.$message('File upload successful')

          this.fetchProjects()
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
