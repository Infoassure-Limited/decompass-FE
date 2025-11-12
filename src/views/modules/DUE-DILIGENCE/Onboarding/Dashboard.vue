<template>
  <div>
    <div style="cursor: pointer; margin-bottom: 5px" @click="loadResources()">
      <el-button type="primary" plain @click="loadResources()">
        <icon icon="tabler:reload" /> Reload
      </el-button>
    </div>
    <DataCount v-if="showChart" />
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
        <VendorByIRR v-if="showChart" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <VendorByCategory v-if="showChart" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
        <VendorByApproval v-if="showChart" />
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
              <b-button variant="secondary" @click="editVendor(props.row)">
                <span><feather-icon icon="EditIcon" /></span>
              </b-button>
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
</template>

<script>
import Pagination from '@/views/Components/Pagination-main/index.vue'
import DataCount from './charts/DataCount.vue'
import VendorByIRR from './charts/VendorByIRR.vue'
import VendorByCategory from './charts/VendorByCategory.vue'
import VendorByApproval from './charts/VendorByApproval.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    DataCount,
    VendorByIRR,
    VendorByCategory,
    VendorByApproval
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
          inherent_risk_rating: 'Rating'

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
      showChart: true,
      loading: false
    }
  },
  created() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      this.showChart = false
      setTimeout(() => {
        this.showChart = true
      }, 100)

      this.fetchVendorCategories()
      this.fetchDashboardVendors()
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
