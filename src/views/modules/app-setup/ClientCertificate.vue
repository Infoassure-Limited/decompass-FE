<template>
  <el-card>
    <el-tabs pills nav-class="nav-pill-primary" content-class="mt-1">
      <el-tab lazy>
        <template #title>
          <feather-icon icon="FileTextIcon" />
          <span>Upload Certificates</span>
        </template>
        <upload-certificates />
      </el-tab>
    </el-tabs>
  </el-card>
</template>

<script>
import UploadCertificates from './partials/UploadCertificates.vue'

export default {
  components: {
    UploadCertificates
  }
}
</script>
