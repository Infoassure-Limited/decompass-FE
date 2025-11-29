<template>
  <div v-loading="loading">
    <div>
      <el-row>
        <el-col :md="12" />
        <el-col :md="12">
          <span class="pull-right">
            <el-button type="primary" @click="isCreateSidebarActive = true">
              <Icon icon="tabler:plus" />
              <span class="align-middle">Create New</span>
            </el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <v-client-table :data="measures" :columns="columns" :options="options">
      <template v-slot:name="{ row }">
        <div>
          <div v-if="editablerow === row.id">
            <input
              v-model="row.name"
              type="text"
              class="form-control"
              @blur="editRow(row.id, $event)"
            />
          </div>
          <div v-else>
            {{ row.name }}
          </div>
        </div>
      </template>
      <template v-slot:info_needs="{ row }">
        <el-button link type="primary" @click="showInfoNeed(row)">
          <Icon icon="tabler:eye" /> Click to View
        </el-button>
      </template>
      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button @click="editablerow = row.id">
                <Icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete">
              <el-button plain @click="destroyRow(row)">
                <Icon icon="tabler:trash" color="red" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-dialog
      v-model="isCreateSidebarActive"
      title="Create Information Needs Measures"
      width="40%"
      destroy-on-close
    >
      <CreateMeasures :info-need-id="infoNeedId" @saved="fetchMeasures" />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateMeasures from './partials/CreateMeasures.vue'
import InfoNeeds from '@/views/modules/ModuleSetup/PAM/InfoNeeds.vue'

export default {
  components: {
    CreateMeasures
  },
  props: {
    infoNeedId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      editablerow: null,
      loading: false,
      isCreateSidebarActive: false,
      showInfoNeedsModal: false,
      pageLength: 10,
      dir: false,
      page: 'table',
      columns: ['title', 'measurement_need', 'action'],
      options: {
        headings: {},
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
      measures: [],
      selectedMeasure: null
    }
  },
  created() {
    this.fetchMeasures()
  },
  methods: {
    checkPermission,
    fetchMeasures() {
      this.isCreateSidebarActive = false
      this.loading = true
      const fetchMeasuresResource = new Resource('pam/measures')
      fetchMeasuresResource
        .list({ info_need_id: this.infoNeedId })
        .then((response) => {
          this.measures = response.measures
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    editRow(id, event) {
      const updateResource = new Resource('pam/update-infoneed-measure')
      updateResource.update(id, { name: event.target.value }).then(() => {
        this.editablerow = null
        this.$message({
          message: 'Updated',
          type: 'success'
        })
        this.loading = false
      })
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyResource = new Resource('pam/destroy-infoneed-measure')
        destroyResource.destroy(row.id).then(() => {
          this.fetchMeasures()
          this.loading = false
        })
      }
    }
  }
}
</script>
