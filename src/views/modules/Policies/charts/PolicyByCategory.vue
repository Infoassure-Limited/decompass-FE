<template>
  <el-card>
    <template v-slot:header>
      <div class="clearfix">
        <strong>Policy By Category</strong>
      </div>
    </template>
    <highcharts :options="highChart" />
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
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
        xAxis: {
          type: 'category'
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Policy Count'
          },
          stackLabels: {
            enabled: true
          }
        },
        tooltip: {
          pointFormat: 'Policy Count: <b>{point.y}</b>'
        },
        series: [
          {
            name: 'Polity By Category',
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
  mounted() {
    this.setChartData()
  },
  methods: {
    setChartData() {
      const seriesData = []
      this.data.forEach((element) => {
        seriesData.push([`${element.name}`, element.count])
      })

      this.highChart.series[0].data = seriesData
    }
  }
}
</script>
