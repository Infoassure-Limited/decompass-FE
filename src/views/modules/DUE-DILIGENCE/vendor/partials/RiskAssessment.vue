<template>
  <el-card>
    <div v-loading="loading">
      <div v:slot="header">
        <el-row>
          <el-col :md="21">
            <h3>Vendor Assessment</h3>
          </el-col>
        </el-row>
      </div>
      <hr />
      <el-tabs tab-position="left" style="height: 500px" stretch>
        <el-tab-pane v-for="(questions, index) in answers" :key="index" lazy>
          <template v-slot:label>
            <span>{{ index }} <icon icon="tabler:arrow-badge-right" /></span>
            <hr />
          </template>
          <vendor-responses
            :questions="questions"
            :vendor-id="vendorId"
            @submitted="fetchVendorResponses"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import VendorResponses from '@/views/modules/DUE-DILIGENCE/RiskAssessment/partials/VendorResponses.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    VendorResponses
  },
  props: {
    vendorId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      pageLength: 10,
      dir: false,
      answers: [],
      categorized_questions: [],
      savedCategories: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      vendors: [],
      form: {
        vendor_id: ''
      }
    }
  },
  created() {
    this.fetchVendorResponses()
  },
  methods: {
    checkPermission,
    fetchVendorResponses() {
      this.showQuestionSetupModal = false
      // const { limit, page } = this.query
      const { form } = this
      form.vendor_id = this.vendorId
      this.loading = true
      const fetchQuestionsResource = new Resource('vdd/answers/fetch')
      fetchQuestionsResource.vList(form).then((response) => {
        this.answers = response.answers
        this.loading = false
      })
    }
  }
}
</script>
