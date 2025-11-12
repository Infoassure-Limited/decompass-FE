<template>
  <el-row :gutter="10">
    <el-col :md="16">
      <div v-loading="load" style="min-height: 200px">
        <highcharts v-if="showChart" :options="chart_report" />
      </div>
    </el-col>
    <el-col :md="8">
      <hr />
      <div style="text-align: center">
        <h3>Assessment Completion</h3>
        <el-progress
          type="dashboard"
          :percentage="parseInt(total_progress)"
          :stroke-width="20"
          :width="200"
          :color="customColorMethod"
        />
        <div style="margin-top: -70px; margin-bottom: 70px">
          <strong>Complete</strong>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    },
    selectedProject: {
      type: Object,
      default: () => null
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
          type: 'areaspline',
          // inverted: true,
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          }
        },
        title: {
          text: 'Percentage Completion by Requirement'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          type: 'category',
          labels: {
            // rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          title: {
            text: 'Scale (%)'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Completion: <b>{point.y:.1f} %</b>'
        },
        series: [
          {
            name: 'Completion',
            colorByPoint: true,
            data: [],
            dataLabels: {
              enabled: true
              // rotation: -90,
              // color: '#FFFFFF',
              // align: 'right',
              // format: '{point.y:.1f}', // one decimal
              // y: 10, // 10 pixels down from the top
              // style: {
              //   fontSize: '13px',
              //   fontFamily: 'Verdana, sans-serif',
              // },
            }
          }
        ],
        credits: {
          enabled: false
        }
      },
      projectId: null,
      load: false,
      showChart: false,
      total_progress: 0,
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
        client_id: this.selectedClient.id,
        group_by: this.filterBy.group_by,
        clause_id: this.filterBy.clause_id,
        assignee_id: this.filterBy.assignee_id,
        date: this.filterBy.date
      }
      const fetchConsultingsResource = new Resource('ndpa/reports/completion-report')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.chart_report.series[0].data = response.data
          this.chart_report.title.text = response.title
          // this.chart_report.subtitle.text = response.subtitle
          this.total_progress = response.total_progress
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    },
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    }
  }
}
</script>
