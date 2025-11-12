<template>
  <el-card>
    <el-tabs pills nav-class="nav-pill-primary" content-class="mt-1">
      <!-- This tabs content will always be mounted -->
      <el-tab>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Feedback Form Config</span>
        </template>
        <form-fields />
      </el-tab>
    </el-tabs>
  </el-card>
</template>

<script>
import FormFields from './FormFields.vue'

export default {
  components: {
    FormFields
  }
}
</script>
