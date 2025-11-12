<template>
  <el-card>
    <el-tabs vertical content-class="mt-1">
      <el-tab lazy title="Areas">
        <areas />
      </el-tab>
      <el-tab lazy title="Controls">
        <controls />
      </el-tab>
    </el-tabs>
  </el-card>
</template>

<script>
import checkPermission from '@/utils/permission'
import Areas from './Areas.vue'
import Controls from './Controls.vue'

export default {
  components: {
    Areas,
    Controls
  },
  data() {
    return {}
  },
  methods: {
    checkPermission
  }
}
</script>
