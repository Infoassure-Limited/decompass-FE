<template>
  <div>
    <el-skeleton :loading="loading" :rows="4" animated />
    <div v-if="!loading">
      <el-card>
        <template v-slot:header>
          <div class="clearfix">
            <strong>Vendors By Category</strong>
          </div>
        </template>
        <highcharts :options="highChart" />
      </el-card>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      loading: false,
      highChart: {
        chart: {
          type: 'bar',
          options3d: {
            enabled: false
          }
        },
        title: {
          text: '',
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
            // stacking: 'normal',
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
            enabled: true
          }
        },
        series: [],
        credits: {
          enabled: false
        }
      }
    }
  },
  mounted() {
    this.fetchVendorsRatings()
  },
  methods: {
    fetchVendorsRatings() {
      this.loading = true
      const fetchReportResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchReportResource
        .list({ chart_type: 'category' })
        .then((response) => {
          this.highChart.series = response.vendor_categories_series
          this.highChart.xAxis.categories = response.vendor_categories
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
