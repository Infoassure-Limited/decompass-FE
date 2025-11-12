<template>
  <div>
    <el-skeleton :loading="loading" :rows="4" animated />
    <div v-if="!loading">
      <el-card>
        <template v-slot:header>
          <div class="clearfix">
            <strong>Vendors Approval</strong>
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
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 0
          }
        },
        title: {
          text: '',
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
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderRadius: 8,
            // innerSize: 150, // what makes it donut
            dataLabels: {
              enabled: false,
              format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %'
              // format: '<b>{point.name}:</b> {point.y}<br>{point.percentage:.1f} %',
              // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
            showInLegend: true
          }
        },
        // colors: ['#34db31', '#db9731', '#db3131'],
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
        .list({ chart_type: 'approval' })
        .then((response) => {
          this.highChart.series = response.series
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
