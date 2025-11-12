<template>
  <div>
    <el-row v-if="loading" :gutter="15">
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
      >
        <el-card>
          <el-skeleton :loading="loading" :rows="3" animated />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="!loading">
      <el-row :gutter="6">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="20" color="black" icon="tabler:users" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ user_count }}
                </h2>
                <span>Registered Users</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar variant="light-warning" size="50">
                <icon size="20" color="orange" icon="tabler:packages" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ projects }}
                </h2>
                <span>Subscribed Modules</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card>
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar size="50">
                <icon size="20" color="green" icon="tabler:user-check" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
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
              <el-avatar size="50">
                <icon size="20" color="red" icon="tabler:user-cancel" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ rejected_vendors }}
                </h2>
                <span>Rejected</span>
              </div>
            </el-card-body>
          </el-card>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  props: {
    data: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      user_count: 0,
      projects: 0,
      rejected_vendors: 0,
      pending_approval: 0,
      loading: false
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData() {
      this.loading = true
      setTimeout(() => {
        this.user_count = this.data.users
        this.projects = this.data.projects
        this.loading = false
      }, 1000)
    }
  }
}
</script>
