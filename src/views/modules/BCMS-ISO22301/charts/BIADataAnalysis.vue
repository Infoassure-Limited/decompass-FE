<template>
  <div style="min-height: 200px">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12">
        <aside>
          <el-select
            v-model="business_unit_id"
            placeholder="Select Business Unit"
            style="width: 100%"
            filterable
            @change="fetchReportSummary()"
          >
            <el-option
              v-for="(business_unit, index) in business_units"
              :key="index"
              :value="business_unit.id"
              :label="business_unit.unit_name"
            />
          </el-select>
        </aside>
      </el-col>
    </el-row>
    <el-row v-if="business_unit_id !== null" v-loading="loading" class="match-height">
      <el-col :md="18">
        <aside>
          <highcharts :options="chart_report" />
        </aside>
      </el-col>
      <el-col :md="6">
        <aside>
          <highcharts :options="riskSeverityChart" />
        </aside>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      chart_report: {
        chart: {
          // type: 'column',
          inverted: false,
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          },
          events: {
            drilldown(e) {
              this.setTitle(
                { text: e.point.name },
                { text: 'Data Showing Time-Bound Disruption for each Impact Area' }
              )
            },
            drillup() {
              this.setTitle(
                { text: 'BIA Data Analysis for each Business Process' },
                { text: 'Drilldown to view Time-Bound Disruption to Process' }
              )
            }
          }
        },
        title: {
          text: 'BIA Data Analysis for each Business Process'
        },
        subtitle: {
          text: 'Drilldown to view Time-Bound Disruption to Process'
        },
        accessibility: {
          announceNewData: {
            enabled: true
          }
        },
        xAxis: {
          type: 'category', // categories: [],
          labels: {
            skew3d: false,
            style: {
              fontSize: '14px'
            }
          },
          title: {
            text: 'Business Process'
          },
          scrollbar: {
            enabled: true
          }
        },
        yAxis: {
          min: 0,
          max: 5,
          tickInterval: 1,
          title: {
            text: 'Impact Level'
          }
        },
        plotOptions: {
          //   column: {
          //     pointPadding: 0.2,
          //     borderWidth: 0,
          //   },
          series: {
            dataLabels: {
              enabled: false
              // rotation: 180,
            }
            // borderRadius: 7,
          }
        },
        series: [],
        drilldown: {
          allowPointDrilldown: true,
          series: []
        },

        // colors: ['#063', '#910000'],
        credits: {
          enabled: false
        }
      },
      riskSeverityChart: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0
          }
        },
        title: {
          text: 'Priority Count',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%'
          // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
          announceNewData: {
            enabled: true
          },
          point: {
            // valueSuffix: '%',
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            // innerSize: 100, // what makes it donut
            dataLabels: {
              enabled: false
              // format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            showInLegend: true
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      },
      risk_level: '',
      risk_score: 0,
      showChart: false,
      matrix: '3x3',
      business_units: [],
      business_unit_id: null
    }
  },
  watch: {
    selectedClient() {
      this.business_unit_id = null
      this.fetchBusinessUnits()
    }
  },
  mounted() {
    if (this.selectedClient.id !== null) {
      this.fetchBusinessUnits()
    }
  },
  methods: {
    fetchBusinessUnits() {
      this.business_unit_id = null
      const fetchBUResource = new Resource('business-units/fetch-business-units')
      fetchBUResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.business_units = response.business_units
          if (this.business_units.length > 0) {
            this.business_unit_id = this.business_units[0].id
            this.fetchReportSummary()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeImpactImage(str) {
      if (str) {
        return `images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return 'images/project-icons/no-impact-level.png'
    },
    fetchReportSummary() {
      this.loading = true
      this.showChart = false
      const param = { business_unit_id: this.business_unit_id }
      const fetchConsultingsResource = new Resource('bcms/reports/bia-data-analysis')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.matrix = response.matrix
          this.chart_report.series = response.series
          this.chart_report.drilldown.series = response.drilldown_series
          // this.chart_report.xAxis.categories = response.categories
          // this.chart_report.subtitle.text = response.subtitle
          //  this.chart_report.title.text = response.title

          this.risk_level = response.risk_level
          this.risk_score = response.risk_score
          this.riskSeverityChart.series = response.pie_chart_series
          this.loading = false
          this.showChart = true
        })
        .catch()
    }
  }
}
</script>
