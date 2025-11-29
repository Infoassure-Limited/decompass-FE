<template>
  <el-row class="match-height">
    <el-col :md="12">
      <s-o-a-graphical-summary v-if="summary !== null" :summary="summary" />
    </el-col>
    <el-col :md="12">
      <s-o-a-tabular-summary
        v-if="summary !== null"
        :selected-client="selectedClient"
        :data="summary.tabular_presentations"
      />
    </el-col>
  </el-row>
</template>
<script>
import SOAGraphicalSummary from '../charts/SOAGraphicalSummary.vue'
import SOATabularSummary from '../charts/SOATabularSummary.vue'
import Resource from '@/api/resource'

export default {
  components: {
    SOAGraphicalSummary,
    SOATabularSummary
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      summary: null
    }
  },
  watch: {
    selectedClient() {
      this.fetchReportSummary()
    }
  },
  created() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      const param = { client_id: this.selectedClient.id }
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list(param).then((response) => {
        this.summary = response
      })
    }
  }
}
</script>
