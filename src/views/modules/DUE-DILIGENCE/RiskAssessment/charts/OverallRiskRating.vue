<template>
  <div>
    <div v-if="loadingAnalysis">
      <el-row :gutter="5">
        <el-col :md="6">
          <el-card>
            <el-skeleton :loading="loadingAnalysis" :rows="4" animated />
          </el-card>
        </el-col>
        <el-col :md="12">
          <el-card>
            <el-skeleton :loading="loadingAnalysis" :rows="4" animated />
          </el-card>
        </el-col>
        <el-col :md="6">
          <aside>
            <el-skeleton :loading="loadingAnalysis" :rows="4" animated />
          </aside>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row :gutter="5">
        <el-col :md="6">
          <el-card>
            <highcharts :options="highCart" />
          </el-card>
        </el-col>
        <el-col :md="12">
          <el-card>
            <highcharts :options="controlEffectivenessChart" />
          </el-card>
        </el-col>
        <el-col :md="6">
          <aside>
            <div style="text-align: center; margin-top: 120px; margin-bottom: 110px">
              <h4>Overall Risk Level</h4>
              <img :src="`/images/project-icons/${overall_risk_level}-impact-level.png`" />
              <p>
                <strong>{{ overall_risk_level.toUpperCase() }}</strong
                ><br />
                Risk Score: {{ average_risk_score }}
              </p>
            </div>
          </aside>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedVendor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      loadingAnalysis: false,
      categories_count: 0,
      overall_risk_level: 'medium',
      average_risk_score: 5,
      highCart: {
        chart: {
          type: 'column',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0
          }
        },
        title: {
          text: 'Risk Severity',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            borderRadius: 5,
            dataLabels: {
              enabled: true
            }
          }
        },
        xAxis: {
          categories: ['Low', 'Medium', 'High']
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Scale'
          },
          stackLabels: {
            enabled: false
          }
        },
        colors: ['green', 'yellow', 'red'],
        series: [],
        credits: {
          enabled: false
        }
      },
      controlEffectivenessChart: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 10,
            beta: 0
          }
        },
        title: {
          text: 'Control Effectiveness',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          // pointFormat: '{series.name}:<b>{point.y}</b><br>{point.percentage:.1f}%',
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
            innerSize: 100, // what makes it donut
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
      }
    }
  },
  watch: {
    selectedVendor() {
      this.loadResources()
    }
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      this.fetchEnterpriseRiskScore()
    },
    fetchEnterpriseRiskScore() {
      this.loadingAnalysis = true
      const fetchRAResource = new Resource('vdd/reports/enterprise-risk-score')
      fetchRAResource
        .list({ vendor_id: this.selectedVendor.id })
        .then((response) => {
          // console.log(response)
          this.highCart.series = response.risk_severity_series
          this.highCart.subtitle.text = this.selectedVendor.name
          this.controlEffectivenessChart.series = response.effectiveness_series
          this.controlEffectivenessChart.subtitle.text = this.selectedVendor.name
          this.overall_risk_level = response.overall_risk_level[0].toLowerCase()
          this.average_risk_score = response.average_risk_score
          this.loadingAnalysis = false
        })
        .catch(() => {
          this.loadingAnalysis = false
        })
    }
  }
}
</script>
