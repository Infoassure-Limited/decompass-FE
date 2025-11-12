<template>
  <div>
    <div v-if="display === 'table'">
      <div>
        <el-row>
          <el-col :md="12">
            <h4>Manage Business Processes & Validation</h4>
          </el-col>
          <el-col v-if="checkPermission(['create-business-process'])" :md="12">
            <span class="pull-right">
              <el-button type="primary" @click="isCreateBusinessProcessActive = true">
                <Icon icon="tabler-plus" />
                <span class="align-middle">Create New Process</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <v-client-table
        :data="business_processes"
        v-loading="loading"
        :columns="columns"
        :options="options"
      >
        <template v-slot:teams="{ row }">
          <div>
            <ol>
              <li v-for="team in row.teams" :key="team">
                {{ team }}
              </li>
            </ol>
          </div>
        </template>
        <template v-slot:status="{ row }">
          <div>
            <el-badge :value="row.status" :type="formatColor(row.status)" />
            <div v-if="canChangeStatus && checkPermission(['create-business-process'])">
              <el-select v-model="row.status" @change="changeStatus(row, $event)">
                <el-option
                  v-for="(status, index) in statuses"
                  :key="index"
                  :value="status"
                  :label="status"
                />
              </el-select>
              <!-- <el-button
              v-if="row.status == 'Pending'"
              type="success"
              size="mini"
              @click="changeStatus(row, 'Completed')"
            >
              Mark As Completed
            </el-button>
            <el-button
              v-else
              type="danger"
              size="mini"
              @click="changeStatus(row, 'Pending')"
            >
              Mark As Pending
            </el-button> -->
            </div>
          </div>
        </template>
        <template v-slot:flow_chart_diagram="{ row }">
          <div>
            <img
              v-if="row.flow_chart_diagram !== null"
              :src="`${baseServerUrl}storage/${row.flow_chart_diagram}`"
              width="100"
              alt="Diagram Not Uploaded"
              @click="((selectedDiagram = row.flow_chart_diagram), (enlargeDiagram = true))"
            />
          </div>
        </template>
        <template v-slot:action="props">
          <div>
            <el-button-group>
              <el-tooltip content="View Details" placement="top">
                <el-button type="default" @click="editProcess(props.row)">
                  <Icon icon="tabler-eye" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="checkPermission(['create-business-process'])"
                content="Upload Process Flow Diagram"
                placement="top"
              >
                <el-button type="info" plain @click="uploadProcessFlow(props.row)">
                  <Icon icon="tabler-upload" />
                </el-button>
              </el-tooltip>
            </el-button-group>
            <!-- <el-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </el-button> -->
          </div>
        </template>
      </v-client-table>
    </div>
    <el-drawer
      v-model="isCreateBusinessProcessActive"
      title="Create Business Process"
      direction="rtl"
      size="87%"
      destroy-on-close
    >
      <create-business-process
        :business-unit-id="businessUnitId"
        :client-id="clientId"
        @save="fetchBusinessProcesses"
      />
    </el-drawer>
    <el-drawer
      v-model="isEditBusinessProcessActive"
      title="Edit Business Process"
      direction="rtl"
      size="87%"
      destroy-on-close
    >
      <edit-business-process
        :business-process="selectedBusinessProcess"
        @updated="fetchBusinessProcesses"
      />
    </el-drawer>
    <el-dialog
      v-model="showModal"
      title="Upload Process Flow Diagram (Expected File Format: jpeg, jpg, or png)"
      centered
      size="lg"
      hide-footer
    >
      <div v-loading="uploading">
        <input class="form-control" type="file" @change="onImageChange" />
        <br />
        <el-button
          variant="success"
          class="btn-icon"
          :disabled="uploadableFile === null"
          @click="submitUpload()"
        >
          Submit
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="enlargeDiagram"
      title="Uploaded Process Flow Diagram"
      centered
      size="lg"
      hide-footer
    >
      <div align="center">
        <img :src="`${baseServerUrl}storage/${selectedDiagram}`" alt="Diagram Not Uploaded" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateBusinessProcess from './CreateBusinessProcess.vue'
import EditBusinessProcess from './EditBusinessProcess.vue'

export default {
  components: {
    CreateBusinessProcess,
    EditBusinessProcess
  },
  props: {
    businessUnitId: {
      type: Number,
      default: null
    },
    clientId: {
      type: Number,
      default: null
    },
    canChangeStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCreateBusinessProcessActive: false,
      isEditBusinessProcessActive: false,
      statuses: ['In Progress', 'Completed', 'Complete and Validated'],
      loading: false,
      display: 'table',
      pageLength: 10,
      dir: false,
      columns: [
        // 'client_id',
        // 'business_unit_id',
        'generated_process_id',
        'name',
        'process_owner',
        'teams',
        'flow_chart_diagram',
        'status',
        'action'
        // 'minimum_no_of_people_involved',
        // 'product_or_service_delivered',
        // 'regulatory_obligations',
        // 'applications_used',
        // 'business_units_depended_on',
        // 'processes_depended_on',
        // 'key_vendors_or_external_dependencies',
        // 'vital_non_electronic_records',
        // 'vital_electronic_records',
        // 'alternative_workaround_during_system_failure',
        // 'key_individuals_process_depends_on',
        // 'peak_periods',
        // 'remote_working',
      ],
      options: {
        headings: {
          generated_process_id: 'ID',
          process_owner: 'Process Owner',
          flow_chart_diagram: 'Flow Chart Diagram'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:'
        },
        sortable: [],
        // filterable: false,
        filterable: []
      },
      business_processes: [],
      selectedBusinessProcess: null,
      showModal: false,
      uploadableFile: null,
      uploading: false,
      enlargeDiagram: false,
      selectedDiagram: null
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchBusinessProcesses()
  },
  methods: {
    checkPermission,
    fetchBusinessProcesses() {
      this.isCreateBusinessProcessActive = false
      this.isEditBusinessProcessActive = false
      this.loading = true
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource
        .list({ business_unit_id: this.businessUnitId })
        .then((response) => {
          this.business_processes = response.business_processes
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatColor(status) {
      let statusColor = 'danger'
      switch (status) {
        case 'Complete and Validated':
          statusColor = 'success'
          break
        case 'Completed':
          statusColor = 'primary'
          break
        default:
          break
      }
      return statusColor
    },
    changeStatus(row, status) {
      console.log(status)
      this.loading = true
      const changeStatusResource = new Resource('business-units/change-process-status')
      changeStatusResource
        .update(row.id, { status })
        .then(() => {
          this.loading = false
          this.fetchBusinessProcesses()
        })
        .catch(() => {
          this.loading = false
        })
    },
    editProcess(row) {
      this.selectedBusinessProcess = row
      this.isEditBusinessProcessActive = true
    },
    uploadProcessFlow(row) {
      this.selectedBusinessProcess = row
      this.showModal = true
    },
    onImageChange(e) {
      this.uploadableFile = e.target.files[0]
    },
    submitUpload() {
      this.uploading = true
      const formData = new FormData()
      formData.append('id', this.selectedBusinessProcess.id)
      formData.append('file_uploaded', this.uploadableFile)
      const updatePhotoResource = new Resource('business-units/upload-process-flow')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.uploading = false
          this.uploadableFile = null
          this.fetchBusinessProcesses()
          this.$message('File upload successful')
          this.showModal = false
        })
        .catch((e) => {
          this.uploading = false
          this.$message(e.response.data.message)
        })
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('business_units/destroy')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchBusinessProcesss()
          this.loading = false
        })
      }
    }
  }
}
</script>
