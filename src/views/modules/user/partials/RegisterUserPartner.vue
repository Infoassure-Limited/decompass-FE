<template>
  <el-tabs content-class="mt-1" vertical>
    <el-tab lazy>
      <template #title>
        <feather-icon icon="PlusIcon" />
        <span>New Registration</span>
      </template>

      <div class="auth-wrapper auth-v2">
        <el-row class="auth-inner m-0">
          <!-- Login-->
          <el-col v-loading="loader" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
            <div class="mel-1 font-weight-bold" title-tag="h2">
              <h4>Kindly fill the form below to register a user</h4>
            </div>
            <form-wizard
              color="#000000"
              :title="null"
              :subtitle="null"
              shape="circle"
              step-size="xs"
              finish-button-text="Submit User"
              back-button-text="Previous"
              class="wizard-vertical mel-3"
              @on-complete="submitPartnerUser"
            >
              <!-- Admission details tab -->
              <tab-content title="User Information" :before-change="validationFormAdministrator">
                <validation-observer ref="administratorRules" tag="form">
                  <el-row>
                    <el-col md="12">
                      <el-form-group label="Select Partner Company" label-for="partner_id">
                        <el-select v-model="partnerUserform.partner_id" style="width: 100%">
                          <el-option
                            v-for="(partner, index) in partners"
                            :key="index"
                            :value="partner.id"
                            :label="partner.name"
                          />
                        </el-select>
                      </el-form-group>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col md="6">
                      <el-form-group label="First Name" label-for="first_name">
                        <validation-provider
                          #default="{ errors }"
                          name="First Name"
                          rules="required"
                        >
                          <el-form-input
                            id="first_name"
                            v-model="partnerUserform.admin_first_name"
                            :state="errors.length > 0 ? false : null"
                            placeholder="Enter First Name"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </el-form-group>
                    </el-col>
                    <el-col md="6">
                      <el-form-group label="Last Name" label-for="last_name">
                        <validation-provider
                          #default="{ errors }"
                          name="Last Name"
                          rules="required"
                        >
                          <el-form-input
                            id="last_name"
                            v-model="partnerUserform.admin_last_name"
                            :state="errors.length > 0 ? false : null"
                            placeholder="Enter Last Name"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </el-form-group>
                    </el-col>
                    <el-col md="6">
                      <el-form-group label="Valid Email" label-for="email">
                        <validation-provider #default="{ errors }" name="Email" rules="required">
                          <el-form-input
                            id="email"
                            v-model="partnerUserform.admin_email"
                            placeholder="Enter Email Address"
                            :state="errors.length > 0 ? false : null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                          <small class="text-primary"
                            ><strong
                              >On successful registration a notification will be sent to this
                              e-mail</strong
                            ></small
                          >
                        </validation-provider>
                      </el-form-group>
                    </el-col>
                    <el-col md="6">
                      <el-form-group label="Phone Number" label-for="phone">
                        <validation-provider
                          #default="{ errors }"
                          name="Phone Number"
                          rules="required|integer:min:11|integer:max:11"
                        >
                          <el-form-input
                            id="phone"
                            v-model="partnerUserform.admin_phone"
                            :state="errors.length > 0 ? false : null"
                            placeholder="Enter Phone Number"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </el-form-group>
                    </el-col>
                    <el-col md="6">
                      <el-form-group
                        label="Designation"
                        label-for="designation"
                        rules="integer:min:11|integer:max:11"
                      >
                        <el-form-input
                          id="phone2"
                          v-model="partnerUserform.designation"
                          placeholder="Your designation at work"
                        />
                      </el-form-group>
                    </el-col>
                  </el-row>
                </validation-observer>
              </tab-content>
            </form-wizard>
          </el-col>
          <!-- /Login-->
        </el-row>
      </div>
    </el-tab>
    <el-tab lazy>
      <template #title>
        <feather-icon icon="UserPlusIcon" />
        <span>Attach Existing User to Partner</span>
      </template>
      <div>
        <el-row>
          <el-col md="6">
            <el-form-group label="Select Partner Company" label-for="partner_id">
              <el-select v-model="form.partner_id" filterable style="width: 100%">
                <el-option
                  v-for="(partner, index) in partners"
                  :key="index"
                  :value="partner.id"
                  :label="partner.name"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="4">
            <el-form-group label="Select User" label-for="user_id">
              <el-select v-model="form.user_id" filterable style="width: 100%">
                <el-option
                  v-for="(user, index) in users"
                  :key="index"
                  :value="user.id"
                  :label="`${user.name} (${user.email})`"
                />
              </el-select>
            </el-form-group>
          </el-col>
          <el-col md="2">
            <br />
            <el-button type="success" @click="attachPartnerUser()"> Attach </el-button>
          </el-col>
        </el-row>
      </div>
    </el-tab>
  </el-tabs>
</template>

<script>
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      partners: [],
      form: {
        partner_id: '',
        user_id: ''
      },
      partnerUserform: {
        partner_id: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        required
      },
      empty_partnerUserform: {
        partner_id: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        required
      },
      users: [],
      genders: ['Male', 'Female'],
      loader: false
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {
    this.fetchPartners()
    this.fetchPartnerUsers()
  },
  methods: {
    fetchPartners() {
      const fetchPartnerResource = new Resource('partners')
      fetchPartnerResource.list({ option: 'all' }).then((response) => {
        this.partners = response.partners
      })
    },
    fetchPartnerUsers() {
      const fetchPartnerResource = new Resource('users/fetch-partner-users')
      fetchPartnerResource.list().then((response) => {
        this.users = response.users
      })
    },
    attachPartnerUser() {
      const fetchPartnerResource = new Resource('partners/attach-partner-user')
      fetchPartnerResource.update(this.form.partner_id, { user_id: this.form.user_id }).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'User Attached Successful',
            icon: 'CheckIcon',
            variant: 'success'
          }
        })
      })
    },
    submitPartnerUser() {
      const registerResource = new Resource('partners/register-partner-user')
      const { partnerUserform } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(partnerUserform)
        .then(() => {
          this.partnerUserform = this.empty_partnerUserform
          this.loader = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Partner User Registration Successful',
              icon: 'CheckIcon',
              variant: 'success'
            }
          })
        })
        .catch((error) => {
          console.log(error)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.message,
              icon: 'XOctagonIcon',
              variant: 'danger'
            }
          })

          this.loader = false
        })
    },
    validationFormAdministrator() {
      return new Promise((resolve, reject) => {
        this.$refs.administratorRules.validate().then((success) => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
