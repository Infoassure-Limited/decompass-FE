<template>
  <el-row :gutter="6">
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="blue" icon="tabler:file-description" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.total_policies }}
            </h2>
            <span>Total Policies</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="green" icon="tabler:news" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.published_policies }}
            </h2>
            <span>Published</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="orange" icon="tabler:file-pencil" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.draft_policies }}
            </h2>
            <span>Draft</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="black" icon="tabler:file-search" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.review_policies }}
            </h2>
            <span>Reviewed</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="black" icon="tabler:file-search" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.review_needed }}
            </h2>
            <span>Review Needed</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="brown" icon="tabler:file-stack" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.archived_policies }}
            </h2>
            <span>Archived</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
    <el-col :xs="24">
      <el-card>
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="50">
            <icon size="30" color="red" icon="tabler:file-x" />
          </el-avatar>
          <div class="truncate">
            <h2 class="font-weight-bolder">
              {{ dashboardData.expiring_soon }}
            </h2>
            <span>Expiring Soon</span>
          </div>
        </el-card-body>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    dashboardData: {
      type: Object,
      required: true
    }
  }
}
</script>
