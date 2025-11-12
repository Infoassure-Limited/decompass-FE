<template>
  <el-card v-if="user">
    <h3>USER BIODATA</h3>
    <!-- User Avatar & Action Buttons -->
    <el-row :gutter="20">
      <el-col :lg="8">
        <div align="center" style="background: #f0f0f0; padding: 10px">
          <img
            :src="baseServerUrl + 'storage/' + form.photo"
            alt="Photo"
            width="100"
            onerror="this.src='/images/profile-image.png'"
            style="border: #000000 solid 3px; border-radius: 5px"
          />
          <div>
            <br />
            <h5>{{ user.name }}</h5>
            <small class="font-weight-bold">{{ user.email }}</small
            ><br />
            <span class="font-weight-bold">{{ user.phone }}</span>
          </div>
          <!-- <el-avatar
            :src="baseServerUrl +'storage/'+user.photo"
            variant="light-primary"
            onerror="this.src='/images/profile-image.png'"
            size="120px"
            rounded
          /> -->
          <!-- <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h2 class="mb-0">
                {{ user.first_name +' ' + user.last_name }}
              </h2>
              <small class="font-weight-bold">{{ user.email }}</small><br>
              <span class="font-weight-bold">{{ user.phone }}</span>
            </div>
          </div> -->
        </div>
        <br />
        <!-- We want to make sure only the owner of the data can modify it-->
        <div v-if="userData.id === user.id">
          <el-button type="info" @click="changePhoto()"> Change Photo </el-button>
          <el-button type="danger" @click="dialogVisible = true"> Update Password </el-button>
        </div>
      </el-col>
      <el-col :lg="16">
        <v-text-field
          variant="outlined"
          label="Full Name"
          v-model="form.name"
          class="round"
          name="login-email"
          placeholder="Full Name"
        />
        <v-text-field
          variant="outlined"
          label="Email"
          v-model="form.email"
          type="email"
          class="round"
          name="login-email"
          placeholder="Email"
        />
        <v-text-field
          variant="outlined"
          label="Phone"
          v-model="form.phone"
          class="round"
          placeholder="Phone"
        />
        <div>
          <el-button type="primary" @click="updateBioData"> Update </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="Change Password" v-model="dialogVisible" width="30%">
      <div v-loading="load">
        <el-form
          v-loading="load"
          method="POST"
          class="auth-login-form mt-2"
          @submit.prevent="updatePassword"
        >
          <v-text-field
            variant="outlined"
            label="Email"
            v-model="form.email"
            type="email"
            class="round"
            name="login-email"
            placeholder="Email"
            disabled
          />
          <v-text-field
            variant="outlined"
            label="Old Password"
            v-model="form.password"
            class="round"
            name="old-password"
            placeholder="Enter old password"
            :type="show1 ? 'text' : 'password'"
          >
            <template v-slot:append-inner>
              <icon
                @click="show1 = !show1"
                :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                class="cursor-pointer"
              />
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.new_password"
            :type="show1 ? 'text' : 'password'"
            variant="outlined"
            label="New Password"
            :error-messages="v$.form.new_password.$errors.map((e) => e.$message)"
            @blur="v$.form.new_password.$touch"
          >
            <template v-slot:append-inner>
              <icon
                @click="show1 = !show1"
                :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                class="cursor-pointer"
              />
            </template>
          </v-text-field>
          <br />
          <v-text-field
            v-model="form.confirm_password"
            :type="show1 ? 'text' : 'password'"
            variant="outlined"
            label="Confirm Password"
            :error-messages="v$.form.confirm_password.$errors.map((e) => e.$message)"
            @blur="v$.form.confirm_password.$touch"
          >
            <template v-slot:append-inner>
              <icon
                @click="show1 = !show1"
                :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                class="cursor-pointer"
              />
            </template>
          </v-text-field>
          <br />
          <el-form-group>
            <Recaptcha ref="recaptcha" @verify="validate" />
          </el-form-group>
          <el-Button
            :disabled="v$.form.$invalid"
            type="success"
            class="w-[100%]"
            size="large"
            :loading="loading"
            @click="executeRecaptcha"
          >
            Update Password
          </el-Button>
          <br />
          <!-- <a href="/dashboard">
                I will do that later from my profile
              </a> -->
        </el-form>
      </div>
      <!-- <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="dialogVisible = false">Cancel</el-button>
        </span>
      </template> -->
    </el-dialog>
    <el-dialog title="Upload Photo" v-model="isUploadPhotoSidebarActive" width="30%">
      <UploadPhoto v-if="isUploadPhotoSidebarActive" :user="user" @save="updatePhoto" />
    </el-dialog>
  </el-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, password } from '@validations'
import Recaptcha from '@/views/Components/Recaptcha.vue'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'
import Resource from '@/api/resource'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    Recaptcha,
    UploadPhoto
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      // avatarText,
      // resolveUserRoleVariant,
      form: {
        photo: '',
        name: '',
        email: '',
        password: '',
        new_password: '',
        confirm_password: '',
        include_old_password: true
      },
      g_recaptcha_response: '',
      dialogVisible: false,
      load: false,
      show1: false,
      isUploadPhotoSidebarActive: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    userData() {
      return this.$store.getters.userData
    }
  },
  validations() {
    return {
      form: {
        new_password: password(this.form.new_password),
        confirm_password: { required, sameAsPassword: sameAs(this.form.new_password) }
      }
    }
  },
  mounted() {
    this.form = this.user
  },
  methods: {
    validate(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.updatePassword()
    },
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    updatePassword() {
      if (this.form.confirm_password === this.form.new_password && this.form.new_password !== '') {
        this.load = true
        this.$store
          .dispatch('user/updatePassword', {
            email: this.form.email,
            old_password: this.form.password,
            password: this.form.new_password,
            recaptcha: this.g_recaptcha_response,
            include_old_password: true
          })
          .then(() => {
            this.$message('Password updated successfully')
            this.logout()
          })
          .catch((error) => {
            console.log(error)
            this.load = false
            this.$message({
              message: error.response.data.message,
              type: 'danger'
            })
          })
      } else {
        this.$alert('New Password does not match')
      }
    },
    changePhoto() {
      this.isUploadPhotoSidebarActive = true
    },
    updatePhoto(photo) {
      this.form.photo = photo
      this.isUploadPhotoSidebarActive = false
    },
    updateBioData() {
      this.updating = true
      const userResource = new Resource('users/update-profile')
      userResource
        .update(this.user.id, this.user)
        .then(() => {
          this.updating = false
          this.$message({
            message: 'Profile updated successfully',
            type: 'success'
          })
        })
        .catch((error) => {
          console.log(error)
          this.updating = false
        })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login').catch(() => {})
    }
  }
}
</script>

<style scoped>
.card-body {
  padding: 0.5rem;
}
.padded-th {
  padding: 1rem;
}
</style>
