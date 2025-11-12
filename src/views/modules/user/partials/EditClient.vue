<template>
  <el-row :gutter="20">
    <el-col :md="24">
      <v-text-field
        variant="outlined"
        id="name"
        v-model="form.name"
        label="Name of Organization"
        placeholder="Example Company Ltd."
      />
    </el-col>
    <el-col :md="24">
      <v-text-field
        variant="outlined"
        id="email"
        v-model="form.contact_email"
        label="Contact Email"
        placeholder="example@domain.com"
      />
    </el-col>
    <el-col :md="24">
      <v-text-field
        variant="outlined"
        id="phone"
        v-model="form.contact_phone"
        label="Contact Phone Number"
        placeholder="08024345678"
      />
    </el-col>
    <el-col :md="24">
      <v-text-field
        variant="outlined"
        id="website"
        v-model="form.contact_address"
        label="Contact Address"
        placeholder="243 Tom Dick and Harry Close, Lagos, Nigeria"
      />
    </el-col>
    <el-col :md="24">
      <!-- Navbar Color -->
      <label>Change Navbar Color</label>
      <el-color-picker v-model="form.navbar_bg" show-alpha :predefine="predefineColors" />
    </el-col>
    <el-col :md="24">
      <!-- Sidebar Color -->
      <label>Change Side Menu Color</label>
      <el-color-picker v-model="form.sidebar_bg" show-alpha :predefine="predefineColors" />
    </el-col>
    <el-col :md="24">
      <span class="school-logo">
        <el-img
          align="center"
          :src="baseServerUrl + 'storage/' + form.logo"
          alt="logo"
          width="150"
        />
      </span>
      <br />
      <label>Change Logo</label>
      <input type="file" class="form-control" @change="onImageChange" />
    </el-col>
    <el-col :md="24">
      <el-button type="success" @click="formSubmitted"> Submit </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClient: {
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
      genders: ['Male', 'Female']
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.setFormProperties(this.selectedClient)
  },
  methods: {
    setFormProperties(selectedClient) {
      this.form = selectedClient
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
      const registerResource = new Resource('clients/update')
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(formData)
        .then(() => {
          this.loader = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Client's information updated",
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
