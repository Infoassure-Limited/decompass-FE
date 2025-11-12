<template>
  <b-row class="auth-inner m-0">
    <!-- Login-->
    <b-col v-loading="loading" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
      <div class="mb-1 font-weight-bold" title-tag="h2">
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
        class="wizard-vertical mb-3"
        @on-complete="submitClientUser"
      >
        <!-- Admission details tab -->
        <tab-content title="User Information" :before-change="validationFormAdministrator">
          <validation-observer ref="administratorRules" tag="form">
            <b-row>
              <b-col md="12">
                <b-form-group label="Select Company" label-for="vendor_id">
                  <validation-provider #default="{ errors }" name="Company" rules="required">
                    <el-select
                      id="vendor_id"
                      v-model="clientUserform.vendor_id"
                      :state="errors.length > 0 ? false : null"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="(client, index) in vendors"
                        :key="index"
                        :value="client.id"
                        :label="client.name"
                      />
                    </el-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="clientUserform.vendor_id !== ''">
              <b-col md="6">
                <b-form-group label="First Name" label-for="first_name">
                  <validation-provider #default="{ errors }" name="First Name" rules="required">
                    <b-form-input
                      id="first_name"
                      v-model="clientUserform.admin_first_name"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Enter First Name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Last Name" label-for="last_name">
                  <validation-provider #default="{ errors }" name="Last Name" rules="required">
                    <b-form-input
                      id="last_name"
                      v-model="clientUserform.admin_last_name"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Enter Last Name"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Valid Email" label-for="email">
                  <validation-provider #default="{ errors }" name="Email" rules="required">
                    <b-form-input
                      id="email"
                      v-model="clientUserform.admin_email"
                      placeholder="Enter Email Address"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small
                    ><br />
                    <small class="text-primary"
                      ><strong
                        >On successful registration a notification will be sent to this
                        e-mail</strong
                      ></small
                    >
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Phone Number" label-for="phone">
                  <validation-provider
                    #default="{ errors }"
                    name="Phone Number"
                    rules="required|integer:min:11|integer:max:11"
                  >
                    <b-form-input
                      id="phone"
                      v-model="clientUserform.admin_phone"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Enter Phone Number"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Designation"
                  label-for="designation"
                  rules="integer:min:11|integer:max:11"
                >
                  <b-form-input
                    id="phone2"
                    v-model="clientUserform.designation"
                    placeholder="Your designation at work"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </validation-observer>
        </tab-content>
      </form-wizard>
    </b-col>
    <!-- /Login-->
  </b-row>
</template>

<script>
import { FormWizard, TabContent } from 'vue3-form-wizard'
// import { ValidationProvider, ValidationObserver } from 'vee-validate'
import 'vue3-form-wizard/dist/style.css'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    // ValidationProvider,
    // ValidationObserver,
    FormWizard,
    TabContent
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      vendors: [],
      loading: false,
      form: {
        vendor_id: '',
        user_id: ''
      },
      clientUserform: {
        vendor_id: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        role: 'vendor'
      },
      empty_clientUserform: {
        vendor_id: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        role: 'vendor'
      },
      users: [],
      genders: ['Male', 'Female'],
      loader: false,
      imgUrl: '' // require('@/assets/images/pages/login/lms2.jpg'),
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  mounted() {
    this.fetchVendors()
    // this.fetchClientUsers()
  },
  methods: {
    fetchVendors() {
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list({ all: true }).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    },
    // fetchvendors() {
    //
    //   const fetchClientResource = new Resource('vendors')
    //   fetchClientResource.list({ option: 'all' })
    //     .then(response => {
    //       this.vendors = response.vendors
    //     })
    // },
    // fetchClientUsers() {
    //
    //   const fetchPartnerResource = new Resource('users/fetch-client-users')
    //   fetchPartnerResource.list()
    //     .then(response => {
    //       this.users = response.users
    //     })
    // },
    // attachClientUser() {
    //
    //   const fetchPartnerResource = new Resource('vdd/attach-client-user')
    //   fetchPartnerResource.update(this.form.vendor_id, { user_id: this.form.user_id })
    //     .then(() => {
    //       this.$toast({
    //         component: ToastificationContent,
    //         props: {
    //           title: 'User Attached Successful',
    //           icon: 'CheckIcon',
    //           variant: 'success',
    //         },
    //       })
    //     })
    // },
    submitClientUser() {
      const registerResource = new Resource('vdd/register-vendor-user')
      const { clientUserform } = app
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(clientUserform)
        .then(() => {
          this.$emit('saved')
          this.clientUserform = this.empty_clientUserform
          this.loader = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Vendor User Registration Successful',
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
