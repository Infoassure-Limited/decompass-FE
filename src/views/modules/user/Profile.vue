<template>
  <div class="dashboard-container">
    <UserBioData :user="userData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserBioData from '@/views/modules/user/UserBioData.vue'

export default {
  // name: 'Dashboard',
  components: {
    UserBioData
  },
  data() {
    return {
      currentRoleId: null,
      role: null
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {}
}
</script>
