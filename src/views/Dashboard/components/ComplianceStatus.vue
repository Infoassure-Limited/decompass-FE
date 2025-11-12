<template>
  <el-row :gutter="5">
    <el-col :md="18">
      <ComplianceByRequirement
        :selected-module="selectedModule"
        :selected-project="selectedProject"
      />
    </el-col>
    <el-col :md="6">
      <aside>
        <highcharts :options="overall_compliance" />
      </aside>
      <highcharts :options="task_completion" />
    </el-col>
  </el-row>
</template>
<script>
import Resource from '@/api/resource'
import ComplianceByRequirement from './ComplianceByRequirement.vue'

export default {
  components: {
    ComplianceByRequirement
  },
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      overall_compliance: {
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: '100%'
        },
        title: {
          text: 'Compliance Status'
        },

        pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ['50%', '75%'],
          size: '100%'
        },

        // the value axis
        yAxis: {
          min: 0,
          max: 100,
          tickPixelInterval: 72,
          tickPosition: 'inside',
          tickColor: 'var(--highcharts-background-color, #FFFFFF)',
          tickLength: 20,
          tickWidth: 2,
          minorTickInterval: null,
          labels: {
            distance: 20,
            style: {
              fontSize: '14px'
            }
          },
          lineWidth: 0,
          plotBands: [
            {
              from: 0,
              to: 40,
              color: '#DF5353', // red
              thickness: 20,
              borderRadius: '10%'
            },
            {
              from: 40,
              to: 70,
              color: '#f19710', // orange
              thickness: 20,
              borderRadius: '0%'
            },
            {
              from: 70,
              to: 90,
              color: '#DDDF0D', // yellow
              thickness: 20,
              borderRadius: '0%'
            },
            {
              from: 90,
              to: 100,
              color: '#55BF3B', // green
              thickness: 20,
              borderRadius: '10%'
            }
          ]
        },

        series: [
          {
            name: 'Compliance Status',
            data: [0],
            tooltip: {
              valueSuffix: ' %'
            },
            dataLabels: {
              format: '{y} %',
              borderWidth: 0,
              color: '#333333',
              style: {
                fontSize: '16px'
              }
            },
            dial: {
              radius: '80%',
              backgroundColor: 'gray',
              baseWidth: 12,
              baseLength: '0%',
              rearLength: '0%'
            },
            pivot: {
              backgroundColor: 'gray',
              radius: 6
            }
          }
        ],
        credits: {
          enabled: false
        }
      },
      task_completion: {
        chart: {
          type: 'pie',
          options3d: {
            enabled: false,
            alpha: 30,
            beta: 0
          }
        },
        title: {
          text: 'Task Completion',
          align: 'center'
        },
        subtitle: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br>{point.percentage:.1f}%'
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
            innerSize: 200, // what makes it donut
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
      }
    }
  },
  mounted() {
    this.fetchComplianceStatus()
  },
  methods: {
    fetchComplianceStatus() {
      this.loading = true
      const param = {
        project_id: this.selectedProject.id
      }
      const fetchResource = new Resource(`${this.selectedModule}/reports/compliance-status`)
      fetchResource.list(param).then((response) => {
        this.overall_compliance.series[0].data = [response.compliance_status]
        this.task_completion.series = response.pie_chart_series
        this.loading = false
      })
    }
  }
}
</script>
