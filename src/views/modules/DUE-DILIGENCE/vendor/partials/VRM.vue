<template>
  <el-card>
    <div v-loading="loading">
      <div v:slot="header">
        <b-row>
          <b-col cols="6">
            <h3>Vendor Relationship Management</h3>
          </b-col>
        </b-row>
      </div>
      <hr />
      <el-tabs>
        <el-tab-pane lazy>
          <template v-slot:label>
            <span>Issues & Tickets</span>
          </template>
          <Tickets :vendor-id="vendorId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import Tickets from './Tickets.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // VueGoodTable,
    Tickets
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
