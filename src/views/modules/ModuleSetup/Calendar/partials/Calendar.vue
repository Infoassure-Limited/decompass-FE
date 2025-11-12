<template>
  <div>
    <highcharts :options="chartOptions" :constructor-type="'ganttChart'" />
    <el-dialog v-if="modalShow" v-model="modalShow" width="33%">
      <template #header>
        <span>Task Details</span>
      </template>
      <el-alert v-if="selectedData.progress === 1" type="success" effect="dark" :closable="false">
        Completed
      </el-alert>
      <p><strong>Task:</strong> {{ selectedData.name }}</p>
      <div v-if="selectedData.uid">
        <p><strong>Start Date:</strong> {{ selectedData.start_date }}</p>
        <p><strong>End Date:</strong> {{ selectedData.end_date }}</p>
        <!-- Add more details as needed -->
      </div>
      <template
        v-if="
          selectedData.uid && selectedData.progress === 1 && selectedData.status !== 'completed'
        "
        v-slot:footer
      >
        <span class="dialog-footer">
          <el-button type="primary" @click="markTaskAsDone(selectedData.uid)"
            >Confirm Completion</el-button
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
    const day = 24 * 36e5,
      today = Math.floor(Date.now()),
      data = [
        {
          name: 'New offices',
          id: 'new_offices',
          owner: 'Peter'
        },
        {
          name: 'Prepare office building',
          id: 'prepare_building',
          parent: 'new_offices',
          start: today - 2 * day,
          end: today + 6 * day,
          completed: {
            amount: 0.2
          },
          owner: 'Linda'
        },
        {
          name: 'Inspect building',
          id: 'inspect_building',
          dependency: 'prepare_building',
          parent: 'new_offices',
          start: today + 6 * day,
          end: today + 8 * day,
          owner: 'Ivy'
        },
        {
          name: 'Passed inspection',
          id: 'passed_inspection',
          dependency: 'inspect_building',
          parent: 'new_offices',
          start: today + 9.5 * day,
          milestone: true,
          owner: 'Peter'
        },
        {
          name: 'Relocate',
          id: 'relocate',
          dependency: 'passed_inspection',
          parent: 'new_offices',
          owner: 'Josh'
        },
        {
          name: 'Relocate staff',
          id: 'relocate_staff',
          parent: 'relocate',
          start: today + 10 * day,
          end: today + 11 * day,
          owner: 'Mark'
        },
        {
          name: 'Relocate test facility',
          dependency: 'relocate_staff',
          parent: 'relocate',
          start: today + 11 * day,
          end: today + 13 * day,
          owner: 'Anne'
        },
        {
          name: 'Relocate cantina',
          dependency: 'relocate_staff',
          parent: 'relocate',
          start: today + 11 * day,
          end: today + 14 * day,
          owner: 'Berta'
        }
      ]
    return {
      chartOptions: {
        // Highcharts Gantt chart options
        series: [
          {
            name: 'Task',
            data: [],
            dataLabels: {
              enabled: true,
              // format: '{point.name}',
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
        // accessibility: {
        //   point: {
        //     descriptionFormat:
        //       '{yCategory}. ' +
        //       '{#if completed}Task {(multiply completed.amount 100):.1f}% ' +
        //       'completed. {/if}' +
        //       'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.'
        //   }
        // },
        yAxis: {
          grid: {
            borderColor: 'rgba(128,128,128,0.2)',
            columns: [
              {
                title: {
                  text: 'Task'
                }
                // categories: ['Prepare', 'Execute']
              },
              {
                title: {
                  text: 'Assignee'
                },
                labels: {
                  format: '{point.owner}'
                }
                // labels: {
                //   formatter: (ctx) => data[ctx.value]?.owner || 'NN'
                // }
              }
            ]
          }
        },
        navigator: {
          enabled: true,
          liveRedraw: true,
          series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25,
            accessibility: {
              enabled: false
            }
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
          }
        },

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
    this.fetchProjectCalendarData()
  },
  methods: {
    openModal(data) {
      this.modalShow = true
      this.selectedData = data
    },
    fetchProjectCalendarData() {
      // Fetch data for the calendar
      const fetchResource = new Resource(
        `${this.selectedModule}/calendar/fetch-project-calendar-data`
      )
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
        const fetchResource = new Resource(`${this.selectedModule}/calendar/mark-task-as-completed`)
        fetchResource
          .update(taskId)
          .then(() => {
            this.$message.success('Task marked as completed successfully')
            this.modalShow = false
            this.fetchProjectCalendarData() // Refresh the calendar data after marking as done
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
