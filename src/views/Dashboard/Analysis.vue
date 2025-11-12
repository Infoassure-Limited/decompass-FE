<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script type="text/babel">
import AdminDashboard from './roles/Admin.vue'
import SuperAdminDashboard from './roles/Super.vue'
import PartnerDashboard from './roles/Partner.vue'
import UsersDashboard from './roles/User.vue'

export default {
  components: {
    AdminDashboard,
    // SuperAdminDashboard,
    // PartnerDashboard,
    UsersDashboard
  },
  data() {
    return {
      currentRole: 'UsersDashboard'
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    }
  },
  created() {
    // if (this.userData.roles.includes('super') || this.userData.roles.includes('admin') || this.userData.roles.includes('user')) {
    //   this.currentRole = 'AdminDashboard'
    // }
    if (this.userData.login_as === 'super') {
      this.currentRole = 'SuperAdminDashboard'
    } else if (this.userData.login_as === 'partner') {
      this.currentRole = 'PartnerDashboard'
    } else if (this.userData.login_as === 'admin' || this.userData.login_as === 'user') {
      this.currentRole = 'AdminDashboard'
    }
  }
}
</script>
