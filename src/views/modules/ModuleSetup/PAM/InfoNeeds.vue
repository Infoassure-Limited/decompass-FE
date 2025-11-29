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
      <aside>
        <p>Select Information Need Category</p>
        <el-select
          v-model="form.info_need_category_id"
          placeholder="Select Information Need Category"
          style="width: 50%"
          @change="fetchInfoNeeds()"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </aside>
    </div>
    <v-client-table :data="info_needs" :columns="columns" :options="options">
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

      <template v-slot:measures="{ row }">
        <el-button link type="primary" @click="showMeasures(row)">
          <Icon icon="tabler:eye" /> Click to View
        </el-button>
      </template>
      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button type="default" @click="editablerow = row.id">
                <Icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete">
              <el-button type="danger" plain @click="destroyRow(row)">
                <Icon icon="tabler:trash" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-dialog
      v-if="isCreateSidebarActive"
      v-model="isCreateSidebarActive"
      title="Create Information Needs"
      width="40%"
      destroy-on-close
    >
      <CreateInfoNeed
        v-if="categories.length > 0"
        :categories="categories"
        @save="fetchInfoNeeds"
      />
    </el-dialog>
    <el-drawer
      v-if="showMeasuresModal"
      v-model="showMeasuresModal"
      :title="`Measures for ${selectedInfoNeed.name}`"
      size="87%"
      direction="rtl"
      destroy-on-close
    >
      <Measures :info-need-id="selectedInfoNeed.id" />
    </el-drawer>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateInfoNeed from './partials/CreateInfoNeed.vue'
import Measures from '@/views/modules/ModuleSetup/PAM/Measures.vue'

export default {
  components: {
    CreateInfoNeed,
    Measures
  },
  data() {
    return {
      editablerow: null,
      loading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      page: 'table',
      columns: ['name', 'measures', 'action'],
      options: {
        headings: {
          measures: 'Measures'
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
      info_needs: [],
      categories: [],
      selectedInfoNeed: null,
      showMeasuresModal: false,
      form: {
        info_need_category_id: ''
      }
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    checkPermission,
    fetchCategories() {
      const fetchCategoriesResource = new Resource('pam/fetch-infoneed-categories')
      fetchCategoriesResource
        .list()
        .then((response) => {
          this.categories = response.categories
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchInfoNeeds() {
      this.isCreateSidebarActive = false
      this.loading = true
      const fetchInfoNeedsResource = new Resource('pam/fetch-infoneeds')
      fetchInfoNeedsResource
        .list(this.form)
        .then((response) => {
          this.info_needs = response.info_needs
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showMeasures(infoNeed) {
      this.selectedInfoNeed = infoNeed
      this.showMeasuresModal = true
    },
    editRow(id, event) {
      const updateResource = new Resource('pam/update-infoneed')
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
        const destroyResource = new Resource('pam/destroy-infoneed')
        destroyResource.destroy(row.id).then(() => {
          this.fetchInfoNeeds()
          this.loading = false
        })
      }
    }
  }
}
</script>
