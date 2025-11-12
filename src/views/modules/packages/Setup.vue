<template>
  <div>
    <SetupNDPA v-if="projectModule === 'ndpa'" :module-id="moduleId" />
  </div>
</template>

<script>
import SetupNDPA from '@/views/modules/NDPA/Setup/index.vue'

export default {
  components: {
    SetupNDPA
  },
  data() {
    return {
      projectModule: '',
      moduleId: null
    }
  },
  created() {
    this.projectModule = this.$route.params.module
    this.moduleId = this.$route.params.id
  },
  methods: {}
}
</script>
