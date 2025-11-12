<template>
  <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
    <el-dialog v-if="modalShow" v-model="modalShow" width="33%">
      <template #header>
        <span>Task Details</span>
      </template>
      <el-alert v-if="selectedData.progress === 1" type="success" effect="dark" :closable="false">
        {{ selectedData.status.toUpperCase() }}
      </el-alert>
      <p><strong>Task:</strong> {{ selectedData.name }}</p>
      <div v-if="selectedData.uid">
        <p><strong>Start Date:</strong> {{ selectedData.start_date }}</p>
        <p><strong>End Date:</strong> {{ selectedData.end_date }}</p>
        <!-- Add more details as needed -->
      </div>
      <template v-if="selectedData.uid && selectedData.progress < 1" v-slot:footer>
        <span class="dialog-footer">
          <el-button type="success" @click="markTaskAsDone(selectedData.uid)"
            >Mark as Completed</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
export default {
  name: 'GanttChart',
  props: {
    selectedModule: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      chartOptions: {
        title: {
          text: 'Tasks Calendar'
        },
        subtitle: {
          text: 'Click on a task to view details'
        },
        // Highcharts Gantt chart options
        series: [
          {
            name: 'Task',
            data: [],
            dataLabels: {
              enabled: true,
              // format: '{point.action}',
              style: {
                fontWeight: 'normal',
                textOutline: 'none'
              }
            }
          }
        ],
        xAxis: [
          {
            custom: {
              weekendPlotBands: true
            }
          },
          {}
        ],
        plotOptions: {
          series: {
            point: {
              events: {
                click: (event) => {
                  this.openModal(event.point)
                }
              }
            }
          }
        },
        yAxis: {
          grid: {
            borderColor: 'rgba(128,128,128,0.2)',
            columns: [
              {
                title: {
                  text: 'Task'
                }
              },
              {
                title: {
                  text: 'Assignee'
                },
                labels: {
                  format: '{point.owner}'
                }
              }
            ]
          }
        },
        // navigator: {
        //   enabled: true,
        //   liveRedraw: true,
        //   series: {
        //     type: 'gantt',
        //     pointPlacement: 0.5,
        //     pointPadding: 0.25,
        //     accessibility: {
        //       enabled: false
        //     }
        //   },
        //   yAxis: {
        //     min: 0,
        //     max: 3,
        //     reversed: true,
        //     categories: []
        //   }
        // },

        scrollbar: {
          enabled: true
        },
        credits: {
          enabled: false
        }
        // ... other Gantt specific options like xAxis, yAxis, etc.
      },
      modalShow: false,
      selectedData: null
    }
  },
  mounted() {
    this.fetchMyCalendarData()
  },
  methods: {
    openModal(data) {
      this.modalShow = true
      this.selectedData = data
    },
    fetchMyCalendarData() {
      // Fetch data for the calendar
      const fetchResource = new Resource(`${this.selectedModule}/calendar/fetch-my-calendar-data`)
      fetchResource
        .list()
        .then((response) => {
          // console.log('Fetched calendar data:', response.data)
          this.chartOptions.series[0].data = response.data
        })
        .catch(() => {
          console.error('Failed to fetch calendar data')
        })
    },
    markTaskAsDone(taskId) {
      if (confirm('Click OK to mark this task as completed?')) {
        const fetchResource = new Resource(`${this.selectedModule}/calendar/mark-task-as-done`)
        fetchResource
          .update(taskId)
          .then(() => {
            this.$message.success('Task marked as completed successfully')
            this.modalShow = false
            this.fetchMyCalendarData() // Refresh the calendar data after marking as done
          })
          .catch(() => {
            console.error('Failed to mark task as done')
          })
      }
      // Logic to mark the task as done
    }
  }
}
</script>
