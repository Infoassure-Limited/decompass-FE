<template>
  <div>
    <div v-if="uploadBulk">
      <el-button type="danger" @click="uploadBulk = false">
        <icon icon="tabler:arrow-left" />
        <span class="align-middle">Back</span>
      </el-button>
      <create-bulk-question @save="updateTable" />
    </div>
    <div v-else v-loading="loading">
      <div>
        <el-row>
          <el-col :md="12">
            <el-select
              v-model="form.vendor_id"
              placeholder="Select Vendor"
              style="width: 80%"
              @change="fetchVendorResponses()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
            <span
              v-if="form.vendor_id !== null"
              style="cursor: pointer"
              @click="fetchVendorResponses()"
            >
              <el-tooltip content="Refresh">
                <icon icon="tabler:reload" class="ml-5" size="30" />
              </el-tooltip>
            </span>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <v-btn color="black" variant="flat" @click="showQuestionSetupModal = true">
                <icon icon="tabler:settings" />
                <span class="align-middle">Set Vendor Questions</span>
              </v-btn>
            </span>
          </el-col>
          <!-- <el-col
            cols="12"
          >
            <el-select
              v-model="form.vendor_id"
              placeholder="Select Vendor"
              style="width: 50%"
              @input="fetchVendorResponses()"
            >
              <el-option
                v-for="(client, index) in vendors"
                :key="index"
                :value="client.id"
                :label="client.name"
              />
            </el-select>
          </el-col> -->
        </el-row>
      </div>
      <hr />
      <el-tabs tab-position="left" style="height: 500px" stretch>
        <el-tab-pane v-for="(questions, index) in answers" :key="index" :id="index" lazy>
          <template #label>
            <span>{{ index }} <icon icon="tabler:arrow-badge-right" /></span>
            <hr />
          </template>
          <vendor-responses :questions="questions" :vendor-id="form.vendor_id" :is-admin="true" />
        </el-tab-pane>
      </el-tabs>
      <create-question
        v-if="isCreateQuestionSidebarActive"
        v-model="isCreateQuestionSidebarActive"
        @save="updateTable"
      />
      <edit-question
        v-if="isEditQuestionSidebarActive"
        v-model="isEditQuestionSidebarActive"
        :selected-question="editable_row"
        @update="updateEditedTableRow"
      />
      <el-drawer
        title="Setup Vendor Questionaire"
        v-model="showQuestionSetupModal"
        direction="rtl"
        size="95%"
        :destroy-on-close="true"
        :before-close="updateTable"
      >
        <!-- <template slot="title">
            <h2>Subscribe from the list of packages</h2>
          </template> -->
        <strong>
          Set applicable audit questions for a specific vendor from your question bank
        </strong>
        <setup-vendor-questions :vendors="vendors" :selected-vendor-id="form.vendor_id" />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import VendorResponses from './partials/VendorResponses.vue'
// import Report from '../Report.vue'
import SetupVendorQuestions from './partials/SetupVendorQuestions.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    VendorResponses,
    SetupVendorQuestions
  },
  data() {
    return {
      uploadBulk: false,
      loading: false,
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      showQuestionSetupModal: false,
      pageLength: 10,
      dir: false,
      answers: [],
      categorized_questions: [],
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      vendors: [],
      query: {
        page: 1,
        limit: 10,
        client_id: ''
      },
      form: {
        vendor_id: null,
        client_id: ''
      }
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    this.fetchVendors()
  },
  methods: {
    checkPermission,
    fetchVendors() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-approved-vendors')
      fetchStaffResource.list({ all: true }).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    },
    fetchVendorResponses() {
      this.showQuestionSetupModal = false
      // const { limit, page } = this.query
      const { form } = this
      if (form.vendor_id !== null) {
        form.client_id = this.selectedClient.id
        this.loading = true
        const fetchQuestionsResource = new Resource('vdd/responses/fetch')
        fetchQuestionsResource.list(form).then((response) => {
          this.answers = response.answers
          this.loading = false
        })
      }
    },
    updateTable() {
      this.fetchVendorResponses()
    },
    editThisRow(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.editable_row = selectedRow
      this.isEditQuestionSidebarActive = true
    },
    handleEdit(index, row) {
      // const editableRow = selected_row;
      this.editable_row = row
      this.isEditQuestionSidebarActive = true
      // console.log(index, row)
    },
    handleDelete(index, row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyQuestionsResource = new Resource('vdd/questions/destroy')
        destroyQuestionsResource.destroy(row.id).then(() => {
          this.fetchVendorResponses()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchVendorResponses()
    }
  }
}
</script>
<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
