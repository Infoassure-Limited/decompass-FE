<template>
  <el-card>
    <!-- <div
      slot="header"
      class="clearfix"
    >
      <strong>Risk Score Count by Requirements</strong>
    </div> -->
    <div v-if="loadingAnalysis">
      <el-skeleton :loading="loadingAnalysis" :rows="7" animated />
    </div>
    <div v-else>
      <highcharts v-if="categories_count > 0" :options="riskAssessmentReportChart" />
      <el-empty v-else :description="`No Data Found for ${selectedVendor.name}`" />
    </div>
  </el-card>
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
      vendors: [],
      riskAssessmentReportChart: {
        chart: {
          type: 'bar',
          options3d: {
            enabled: false
          }
        },
        title: {
          text: 'Risk Score Count by Requirements',
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
          categories: []
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
      this.fetchRiskAssessmentAnalysis()
    },
    fetchRiskAssessmentAnalysis() {
      this.loadingAnalysis = true
      const fetchRAResource = new Resource('vdd/reports/vendor-risk-assessment-analysis')
      fetchRAResource
        .list({ vendor_id: this.selectedVendor.id })
        .then((response) => {
          this.riskAssessmentReportChart.series = response.series
          this.riskAssessmentReportChart.xAxis.categories = response.risk_categories
          this.riskAssessmentReportChart.subtitle.text = this.selectedVendor.name
          this.categories_count = response.risk_categories.length
          this.loadingAnalysis = false
        })
        .catch(() => {
          this.loadingAnalysis = false
        })
    }
    // fetchEnterpriseRiskScore() {
    //
    //   this.loadingAnalysis = true
    //   const fetchRAResource = new Resource('vdd/reports/enterprise-risk-score')
    //   fetchRAResource.list({ vendor_id: this.selectedVendor.id })
    //     .then(response => {
    //       console.log(response)
    //       this.loadingAnalysis = false
    //     }).catch(() => { this.loadingAnalysis = false })
    // },
  }
}
</script>
