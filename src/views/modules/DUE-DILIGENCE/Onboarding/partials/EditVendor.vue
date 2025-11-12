<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Login-->
      <b-col v-loading="loader" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
        <form-wizard
          color="#7367F0"
          :title="null"
          :subtitle="null"
          shape="circle"
          step-size="xs"
          finish-button-text="Submit"
          back-button-text="Previous"
          class="wizard-vertical mb-3"
          @on-complete="formSubmitted"
        >
          <!-- personal details tab -->
          <tab-content title="Company Information" :before-change="validationFormInfo">
            <b-row>
              <b-col md="6">
                <b-form-group label="Name of Organization" label-for="name">
                  <validation-provider
                    #default="{ errors }"
                    name="Name of Organization"
                    rules="required"
                  >
                    <b-form-input
                      id="name"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Example Company Ltd."
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Contact Email" label-for="email">
                  <validation-provider
                    #default="{ errors }"
                    name="Contact Email"
                    rules="required|email"
                  >
                    <b-form-input
                      id="email"
                      v-model="form.contact_email"
                      :state="errors.length > 0 ? false : null"
                      placeholder="example@domain.com"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Contact Phone Number" label-for="phone">
                  <validation-provider
                    #default="{ errors }"
                    name="Contact Phone Number"
                    rules="required|integer:min:11|integer:max:11"
                  >
                    <b-form-input
                      id="phone"
                      v-model="form.contact_phone"
                      :state="errors.length > 0 ? false : null"
                      placeholder="08012345678"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Contact Address" label-for="website">
                  <b-form-input
                    id="website"
                    v-model="form.contact_address"
                    placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </tab-content>
        </form-wizard>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'
import Resource from '@/api/resource'

export default {
  components: {
    FormWizard,
    TabContent
  },
  props: {
    selectedVendor: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const maxDate = new Date()
    return {
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        id: '',
        name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: ''
      },
      logoToBeUploaded: '',
      genders: ['Male', 'Female'],
      loader: false,
      imgUrl: '' // require('@/assets/images/pages/login/lms2.jpg')
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  mounted() {
    this.setFormProperties(this.selectedVendor)
  },
  methods: {
    setFormProperties(selectedVendor) {
      this.form = selectedVendor
    },
    onImageChange(e) {
      // console.log(e)

      this.logoToBeUploaded = e.target.files[0]

      // this.submitUpload()
    },
    formSubmitted() {
      const formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('name', this.form.name)
      formData.append('contact_email', this.form.contact_email)
      formData.append('contact_phone', this.form.contact_phone)
      formData.append('contact_address', this.form.contact_address)
      formData.append('navbar_bg', this.form.navbar_bg)
      formData.append('sidebar_bg', this.form.sidebar_bg)
      formData.append('logo', this.logoToBeUploaded)
      const registerResource = new Resource('vdd/update-vendor')
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(formData)
        .then(() => {
          this.loader = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Data updated',
              icon: 'CheckIcon',
              variant: 'success'
            }
          })

          // this.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          // this.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
          //   dangerouslyUseHTMLString: true,
          // })
          // this.$router.push({ path: '/login' })
          // send mail
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
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then((success) => {
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
