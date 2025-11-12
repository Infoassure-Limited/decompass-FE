<template>
  <el-row :gutter="20">
    <el-col :md="12">
      <v-text-field
        v-model="form.name"
        label="Name of Organization"
        placeholder="Example Company Ltd."
      />
    </el-col>
    <el-col :md="12">
      <v-text-field
        v-model="form.contact_email"
        label="Contact Email"
        placeholder="example@domain.com"
      />
    </el-col>
    <el-col :md="12">
      <v-text-field
        v-model="form.contact_phone"
        label="Contact Phone Number"
        placeholder="08012345678"
      />
    </el-col>
    <el-col :md="12">
      <v-text-field
        v-model="form.contact_address"
        label="Contact Address"
        placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
      />
    </el-col>
    <!-- <el-col :md="12">
      <label>Change Navbar Color</label>
      <el-color-picker v-model="form.navbar_bg" show-alpha :predefine="predefineColors" />
      <hr />
      <label label="Change Side Menu Color">Change Side Menu Color</label>
      <el-color-picker v-model="form.sidebar_bg" show-alpha :predefine="predefineColors" />
    </el-col> -->
    <el-col :md="12">
      <label>Change Logo</label>
      <input type="file" class="form-control" @change="onImageChange" />
    </el-col>
    <el-col :md="12">
      <span class="school-logo">
        <img align="center" :src="baseServerUrl + 'storage/' + form.logo" alt="logo" width="150" />
      </span>
    </el-col>
    <el-col :md="24">
      <el-button type="success" @click="formSubmitted"> Update </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  props: {
    selectedPartner: {
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
      loader: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.setFormProperties(this.selectedPartner)
  },
  methods: {
    setFormProperties(selectedPartner) {
      this.form = selectedPartner
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
      this.loader = true
      const registerResource = new Resource('partners/update')
      // const email = form.admin_email
      registerResource
        .store(formData)
        .then(() => {
          this.loader = false
          this.$message("Partner's information updated", 'Success', {
            type: 'success',
            duration: 5000
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
          this.$message(error.response.data.message, 'Error', {
            type: 'danger',
            duration: 5000
          })

          this.loader = false
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
