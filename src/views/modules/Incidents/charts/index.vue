<template>
  <el-card>
    <el-row v-if="loading" :gutter="15">
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton :loading="loading" :rows="4" animated />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="!loading">
      <el-row :gutter="6">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-dark" size="50">
                <feather-icon size="35" icon="UsersIcon" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mb-25 font-weight-bolder">
                  {{ vendor_count }}
                </h2>
                <span>Total Vendors</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-warning" size="50">
                <feather-icon size="35" icon="UserIcon" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mb-25 font-weight-bolder">
                  {{ pending_approval }}
                </h2>
                <span>Pending</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-success" size="50">
                <feather-icon size="35" icon="UserCheckIcon" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mb-25 font-weight-bolder">
                  {{ approved_vendors }}
                </h2>
                <span>Approved</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-danger" size="50">
                <feather-icon size="35" icon="UserXIcon" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mb-25 font-weight-bolder">
                  {{ rejected_vendors }}
                </h2>
                <span>Rejected</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <!-- <el-col
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
            >
              <el-card>
                <div
                  slot="header"
                  class="clearfix"
                >
                  <strong>Category Description</strong>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(category, index) in categories"
                      :key="index"
                    >
                      <td>{{ category.slug }}</td>
                      <td>{{ category.name }} <br> <small><em>{{ category.description }}</em></small></td>
                    </tr>
                  </tbody>
                </table>
              </el-card>

            </el-col> -->
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
          <el-card>
            <template v-slot:header>
              <div class="clearfix">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Vendors By Inherent Risk Rating"
                  placement="top-start"
                >
                  <strong>Vendors By IRR <i class="el-icon-question"></i></strong>
                </el-tooltip>
              </div>
            </template>
            <apexchart v-if="series3" :options="chartOptions3" :series="series3" />
            <el-empty v-else />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
          <el-card>
            <template v-slot:header>
              <div class="clearfix">
                <strong>Vendors By Category</strong>
              </div>
            </template>
            <apexchart v-if="series1" :options="chartOptions1" :series="series1" />
            <el-empty v-else />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
          <el-card>
            <template v-slot:header>
              <div class="clearfix">
                <strong>Vendors Approval</strong>
              </div>
            </template>
            <apexchart v-if="series2" :options="chartOptions2" :series="series2" />
            <el-empty v-else />
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <v-client-table :data="vendors" v-loading="loading" :columns="columns" :options="options">
            <template v-slot:inherent_risk_rating="{ row }">
              <div>
                <el-tag v-if="row.inherent_risk_rating === 3" effect="dark" type="danger">
                  High
                </el-tag>
                <el-tag v-if="row.inherent_risk_rating === 2" effect="dark" type="warning">
                  Medium
                </el-tag>
                <el-tag v-if="row.inherent_risk_rating === 1" effect="dark" type="success">
                  Low
                </el-tag>
              </div>
            </template>
            <template v-slot:second_approval="{ row }">
              <div>
                <div v-if="row.second_approval !== null">
                  <el-tag v-if="row.second_approval.action === 'Approve'" type="success">
                    Approved
                  </el-tag>
                  <el-tag v-if="row.second_approval.action === 'Reject'" type="danger">
                    Rejected
                  </el-tag>
                </div>
                <div v-else>
                  <el-tag type="warning"> Pending </el-tag>
                </div>
              </div>
            </template>
            <template v-slot:action="props">
              <div>
                <el-button variant="secondary" @click="editVendor(props.row)">
                  <span><feather-icon icon="EditIcon" /></span>
                </el-button>
              </div>
            </template>
          </v-client-table>
          <hr />
          <el-row :gutter="20">
            <pagination
              v-show="total > 10"
              :total="total"
              v-model:page="query.page"
              v-model:limit="query.limit"
              @pagination="fetchDashboardVendors"
            />
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import Pagination from '@/views/Components/Pagination-main/index.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      categories: [],
      vendors: [],
      query: {
        page: 1,
        limit: 50
      },
      total: 0,
      columns: [
        'name',
        'category.slug',
        'business_type',
        'second_approval',
        'inherent_risk_rating'
      ],

      options: {
        headings: {
          name: 'Vendor Name',
          'category.slug': 'Category',
          second_approval: 'Status',
          inherent_risk_rating: 'Inherent Risk Rating'

          // id: 'S/N',
        },
        filterByColumn: false,
        // rowAttributesCallback(row) {
        //   if (row.second_approval === null) {
        //     return { style: 'background: #fcf1c0; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Approve') {
        //     return { style: 'background: #eaf8e5; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Reject') {
        //     return { style: 'background: #f5dbd3; color: #000000' }
        //   }
        //   return {}
        // },
        sortable: [],
        // filterable: false,
        filterable: false
      },
      vendor_count: 0,
      approved_vendors: 0,
      rejected_vendors: 0,
      pending_approval: 0,
      loading: false,
      series1: [],
      chartOptions1: {
        chart: {
          type: 'bar'
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories: [],
          floating: true
        }
      },
      series2: [],
      chartOptions2: {
        chart: {
          type: 'pie'
        },
        colors: ['#ff9f43', '#ea5455', '#28c76f'],
        labels: ['Pending', 'Rejected', 'Approved'],
        legend: {
          position: 'bottom'
        }
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     chart: {
        //       width: 200,
        //     },
        //     legend: {
        //       position: 'bottom',
        //     },
        //   },
        // }],
      },
      series3: [],
      chartOptions3: {
        chart: {
          type: 'donut'
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90
            // offsetY: 10,
          }
        },
        colors: ['#28c76f', '#ff9f43', '#ea5455'],
        labels: ['Low', 'Medium', 'High'],
        legend: {
          position: 'bottom'
        }
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     chart: {
        //       width: 200,
        //     },
        //     legend: {
        //       position: 'bottom',
        //     },
        //   },
        // }],
      }
    }
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      this.fetchVendorCategories()
      this.fetchVendorsStat()
      this.fetchDashboardVendors()
    },
    fetchVendorsStat() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchStaffResource
        .list(this.query)
        .then((response) => {
          this.vendor_count = response.vendor_count
          this.approved_vendors = response.approved_vendors
          this.rejected_vendors = response.rejected_vendors
          this.pending_approval = response.pending_approval
          this.series1 = response.vendor_categories_series
          this.chartOptions1.xaxis.categories = response.vendor_categories
          this.series2 = [this.pending_approval, this.rejected_vendors, this.approved_vendors]
          this.categories = response.categories
          this.series3 = response.vendor_ratings_series
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchVendorCategories() {
      const fetchCategoryResource = new Resource('vdd/fetch-vendor-categories')
      fetchCategoryResource
        .list()
        .then((response) => {
          this.categories = response.categories
        })
        .catch()
    },
    fetchDashboardVendors() {
      const { limit, page } = this.query
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list(this.query).then((response) => {
        this.vendors = response.vendors.data
        this.vendors.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.vendors.total
        this.loading = false
      })
    }
  }
}
</script>
