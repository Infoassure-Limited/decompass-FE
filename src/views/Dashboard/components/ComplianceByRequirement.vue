<template>
  <div style="min-height: 400px">
    <el-skeleton :loading="load" :rows="6" animated />
    <div v-if="showChart">
      <highcharts :options="chart_report" />
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    selectedModule: {
      type: String,
      required: true
    },
    filterBy: {
      type: Object,
      default: () => ({
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: ''
      })
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          inverted: false,
          options3d: {
            enabled: false
          }
        },
        title: {
          text: 'Compliance by Requirement',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
          series: {
            // borderRadius: '1%',
          },
          column: {
            stacking: 'normal'
          }
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          max: 100,
          title: {
            text: 'Percentage (%)'
          },
          stackLabels: {
            enabled: true
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      },
      projectId: null,
      load: false,
      showChart: false,
      group_by: 'clause_id',
      clauses: [],
      clause_id: ''
    }
  },
  watch: {
    selectedProject() {
      this.fetchReportSummary()
    },
    filterBy() {
      this.fetchReportSummary()
    }
  },
  mounted() {
    this.fetchReportSummary()
  },
  methods: {
    fetchReportSummary() {
      this.load = true
      this.showChart = false
      const param = {
        project_id: this.selectedProject.id,
        group_by: this.filterBy.group_by,
        clause_id: this.filterBy.clause_id,
        assignee_id: this.filterBy.assignee_id,
        date: this.filterBy.date
      }
      const fetchConsultingsResource = new Resource(`${this.selectedModule}/reports/clause-report`)
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.chart_report.series = response.series
          this.chart_report.xAxis.categories = response.categories
          this.chart_report.title.text = response.title
          this.chart_report.subtitle.text = response.subtitle
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    }
  }
}
</script>
