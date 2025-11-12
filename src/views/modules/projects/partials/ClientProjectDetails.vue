<template>
  <div>
    <div v-if="selectedProject.title === 'NDPA'">
      <n-d-p-a :project="selectedProject" :is-admin="true" />
    </div>
  </div>
</template>

<script>
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
import NDPA from '@/views/modules/NDPA/index.vue'

export default {
  components: {
    NDPA
  },
  props: {
    selectedClient: {
      type: Object,
      required: true
    },
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
