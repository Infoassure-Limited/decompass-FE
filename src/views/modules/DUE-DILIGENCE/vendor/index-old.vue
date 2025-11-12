<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside v-if="getOtherToken" width="250px">
      <div style="text-align: center">
        <img src="/images/logo/logo.png" alt="logo" width="200" class="mx-auto" />
        <h1 style="font-size: 40px; font-weight: 600"> VMS </h1>
        <span>Vendor Management System</span>
      </div>
      <el-menu>
        <el-menu-item @click="setPage('#onboarding')">
          <icon icon="tabler:building" />
          <template v-slot:title>
            <span>Onboarding</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="setPage('#risk-assessment')">
          <icon icon="tabler:help" />
          <template v-slot:title>
            <span>Vendor Assessment</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="setPage('#contracts')">
          <icon icon="tabler:file" />
          <template v-slot:title>
            <span>Contracts & SLA</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="setPage('#finance')">
          <icon icon="tabler:coin" />
          <template v-slot:title>
            <span>Financials & Billing</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="setPage('#vrm')">
          <icon icon="tabler:ticket" />
          <template v-slot:title>
            <el-tooltip content="Vendor Relationship Management">
              <span>VRM</span>
            </el-tooltip>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        v-if="getOtherToken"
        style="background-color: rgb(187, 144, 2); color: #fcfcfc; text-align: right"
      >
        <el-tooltip class="item" effect="dark" content="In-app Mailbox" placement="top-start">
          <span @click="setPage('#mailbox')" style="cursor: pointer; color: #fcfcfc">
            <icon icon="tabler:inbox" size="30" />
          </span>
        </el-tooltip>
        <el-dropdown @command="logout">
          <span class="mt-3" style="cursor: pointer; color: #fcfcfc">
            <icon icon="tabler:user" size="30" />
            {{ otherUserData.name }}
          </span>
          <template v-slot:dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a"> Logout </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <el-main>
        <div v-if="getOtherToken">
          <div v-if="page === '#onboarding'">
            <onboarding :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#mailbox'">
            <mail-box />
          </div>
          <div v-if="page === '#risk-assessment'">
            <risk-assessment :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#finance'">
            <financial-and-billing :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#contracts'">
            <contract-and-sla :vendor-id="otherUserData.vendor_id" />
          </div>
          <div v-if="page === '#vrm'">
            <VRM :vendor-id="otherUserData.vendor_id" />
          </div>
        </div>
        <div v-else>
          <other-user-login product-module="vdd" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import checkPermission from '@/utils/permission'
import MailBox from './email/Email.vue'
import Onboarding from './partials/Onboarding.vue'
import RiskAssessment from './partials/RiskAssessment.vue'
import FinancialAndBilling from './partials/FinancialAndBilling.vue'
import ContractAndSla from './partials/ContractAndSLA.vue'
import VRM from './partials/VRM.vue'
import OtherUserLogin from '@/views/Authentication/OtherUserLogin.vue'

export default {
  components: {
    MailBox,
    Onboarding,
    RiskAssessment,
    OtherUserLogin,
    FinancialAndBilling,
    ContractAndSla,
    VRM
  },
  data() {
    return {
      business_impact_analyses: [],
      loading: false,
      page: '#onboarding'
    }
  },
  computed: {
    getOtherToken() {
      return this.$store.getters.other_user_token
    },
    otherUserData() {
      return this.$store.getters.otherUserData
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    checkPermission,
    async logout() {
      await this.$store.dispatch('user/logoutOtherUser')
    },
    setCurrentPage() {
      this.page = window.location.hash !== '' ? window.location.hash : '#onboarding'
    },
    setPage(value) {
      this.page = value
      this.$router.push({ hash: `${value}` })
    }
  }
}
</script>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
</style>
