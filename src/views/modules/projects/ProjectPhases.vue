<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Project Phases</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-client project'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="showModal = true"
              >
                <icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col cols="6">
            <el-select
              v-model="standard_id"
              placeholder="Select Standard"
              filterable
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
        </el-row>
      </div>
    </template>
    <label>Update by changing the value in the text box</label>
    <v-client-table
      :data="project_phases"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template v-slot:title="{ row }">
        <div>
          <input
            v-model="row.title"
            class="form-control"
            @blur="updateProjectPhase(row.id, $event)"
          />
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-button
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyProjectPhase(props.row)"
          >
            <icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <el-modal v-model="showModal" hide-footer centered title="Enter Phase Title">
      <el-row v-loading="loading" :gutter="20">
        <el-col :xs="24">
          <el-select
            v-model="form.standard_ids"
            placeholder="Select Standard"
            filterable
            multiple
            collapse-tags
            style="width: 100%"
          >
            <el-option
              v-for="(standard, index) in standards"
              :key="index"
              :value="standard.id"
              :label="standard.name"
            />
          </el-select>
        </el-col>
        <el-col :xs="24">
          <small
            >You can enter multiple phase titles, just separate them with a vertical bar
            <code>|</code> <br />for example: Phase 1|Phase 2|Phase 3</small
          >
          <el-input v-model="form.titles" placeholder="Phase 1|Phase 2|Phase 3" />
          <hr />
        </el-col>
        <el-col :xs="24">
          <el-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :disabled="form.titles === ''"
            variant="gradient-primary"
            @click="submitProjectPhases()"
          >
            <icon icon="SaveIcon" class="mr-50" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
      </el-row>
    </el-modal>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {},
  data() {
    return {
      loading: false,
      showModal: false,
      pageLength: 10,
      dir: false,
      columns: ['action', 'standard.name', 'title'],

      options: {
        headings: {
          'standard.name': 'Standard',
          title: 'Title'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['title'],
        // filterable: false,
        filterable: ['title']
      },
      project_phases: [],
      form: {
        titles: '',
        standard_ids: []
      },
      standards: [],
      standard_id: ''
    }
  },
  created() {
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchProjectPhases() {
      this.loading = true
      const fetchProjectsResource = new Resource('project-plans/fetch-project-phases')
      fetchProjectsResource.list({ standard_id: this.standard_id }).then((response) => {
        this.project_phases = response.project_phases
        this.loading = false
      })
    },
    fetchStandards() {
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list().then((response) => {
        this.standards = response.standards
      })
    },
    submitProjectPhases() {
      // this.showModal = false
      this.loading = true
      const saveProjectsResource = new Resource('project-plans/store-project-phases')
      saveProjectsResource.store(this.form).then(() => {
        this.showModal = false
        this.form = { titles: '' }
        this.fetchProjectPhases()
        this.loading = false
      })
    },
    updateProjectPhase(id, event) {
      //
      const updateProjectsResource = new Resource('project-plans/update-project-phases')
      updateProjectsResource.update(id, { title: event.target.value }).then(() => {
        // this.fetchProjectPhases()
      })
    },
    destroyProjectPhase(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('project-plans/destroy-project-phases')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchProjectPhases()
          this.loading = false
        })
      }
    }
  }
}
</script>
