<template>
  <div v-loading="load">
    <el-row :gutter="10">
      <el-col :md="24">
        <upload-excel-component class="mt-5 mb-5" type="business_units" @saved="$emit('saved')" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadExcelComponent from '@/views/Components/UploadExcel/FileUpload.vue'

export default {
  components: {
    UploadExcelComponent
  },
  props: {
    assetTypes: {
      type: Array,
      default: () => []
    },
    clientId: {
      type: Number,
      default: null
    },
    staff: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>
