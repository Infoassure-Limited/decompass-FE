<template>
  <aside style="min-height: 200px">
    <el-row :gutter="10">
      <el-col :md="18">
        <highcharts v-if="showChart" :options="chart_report" class="mb-2" />
        <risk-ranking-matrix :matrix="matrix" />
      </el-col>
      <el-col :md="6">
        <highcharts v-if="showChart" :options="riskSeverityChart" class="mb-2" />
        <el-card>
          <div align="center">
            <h4>Average Risk Rating</h4>
            <img :src="changeImpactImage(risk_level)" />
          </div>
          <p>
            Risk Score: <strong>{{ risk_score }}</strong
            ><br />
            Risk Level: <strong>{{ risk_level }}</strong>
          </p>
        </el-card>
      </el-col>
    </el-row>
  </aside>
</template>
<script>
import RiskRankingMatrix from '@/views/modules/settings/partials/RiskAndThreats/partials/RiskRankingMatrix.vue'
import Resource from '@/api/resource'

export default {
  components: {
    RiskRankingMatrix
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      chart_report: {
        chart: {
          type: 'column',
          inverted: true,
          options3d: {
            enabled: false,
            alpha: 0,
            beta: 0,
            depth: 100,
            viewDistance: 25
          },
          // scrollablePlotArea: {
          //   minWidth: 900,
          //   scrollPositionX: 1,
          // },
          events: {
            drilldown(e) {
              this.setTitle(
                { text: 'Risk Severity by Asset' },
                { text: `Data showing risk analysis for ${e.point.name}` }
              )
            },
            drillup() {
              this.setTitle(
                { text: 'Risk Severity by Asset Type' },
                { text: 'Drilldown to view details for each asset' }
              )
            }
          }
        },
        title: {
          text: 'Risk Severity by Asset Types'
        },
        subtitle: {
          text: 'Drilldown to view details for each asset'
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
            text: 'Asset Types'
          },
          min: 0,
          max: undefined,
          scrollbar: {
            enabled: false
          }
        },
        yAxis: {
          min: 0,
          max: undefined,
          tickInterval: 10,
          title: {
            text: 'Risk Count'
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: 'bold',
              color: 'gray'
            }
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: false
              // rotation: 180,
            }
            // borderRadius: 7,
          }
        },
        colors: [],
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
            enabled: true,
            alpha: 50,
            beta: 0,
            depth: 100,
            viewDistance: 25
          }
        },
        title: {
          text: 'Overall Risk Severity',
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
        series: [
          {
            name: 'Value Count',
            colorByPoint: true,
            data: []
          }
        ],
        credits: {
          enabled: false
        }
      },
      risk_level: '',
      risk_score: 0,
      load: false,
      showChart: false,
      matrix: '3x3'
    }
  },
  watch: {
    selectedClient() {
      this.fetchReportSummary()
    }
  },
  mounted() {
    if (this.selectedClient.id !== null) {
      this.fetchReportSummary()
    }
  },
  methods: {
    changeImpactImage(str) {
      if (str) {
        return `/images/project-icons/${str.toLowerCase()}-impact-level.png`
      }
      return '/images/project-icons/no-impact-level.png'
    },
    fetchReportSummary() {
      this.load = true
      this.showChart = false
      const param = { client_id: this.selectedClient.id }
      const fetchConsultingsResource = new Resource('reports/asset-risk-analysis')
      fetchConsultingsResource
        .list(param)
        .then((response) => {
          this.matrix = response.matrix
          this.chart_report.series = response.series
          // this.chart_report.xAxis.categories = response.categories

          this.chart_report.drilldown.series = response.drilldown_series
          // this.chart_report.subtitle.text = response.subtitle
          // this.chart_report.title.text = response.title

          this.risk_level = response.risk_level
          this.risk_score = response.risk_score
          this.riskSeverityChart.series = [
            {
              name: 'Severity Count',
              colorByPoint: true,
              data: [
                {
                  name: 'Low',
                  y: response.total_low,
                  color: '#00a65a',
                  sliced: true,
                  selected: true
                },
                {
                  name: 'Medium',
                  y: response.total_medium,
                  color: '#FFFF00'
                },
                {
                  name: 'High',
                  y: response.total_high,
                  color: '#DD2C2C'
                }
              ]
            }
          ]
          this.load = false
          this.showChart = true
        })
        .catch((this.load = false))
    }
  }
}
</script>
