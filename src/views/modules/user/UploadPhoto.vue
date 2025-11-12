<template>
  <el-row v-loading="loading">
    <!-- first name -->
    <div v-if="user" align="center">
      <img
        align="center"
        :src="baseServerUrl + 'storage/' + user.photo"
        alt="Photo"
        onerror="this.src='/images/profile-image.png'"
        width="100"
      />
      <br />
      <label>Change Photo</label>
      <input type="file" class="form-control" @change="onImageChange" />
    </div>
    <el-col v-if="error" cols="12">
      <el-alert variant="danger" show>
        <div class="alert-body">
          <span
            ><strong>{{ error_message }}</strong></span
          >
        </div>
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isUploadPhotoSidebarActive',
    event: 'update:is-upload-photo-sidebar-active'
  },
  props: {
    isUploadPhotoSidebarActive: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      error: false,
      photoToBeUploaded: ''
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  methods: {
    onImageChange(e) {
      // console.log(e)

      this.photoToBeUploaded = e.target.files[0]

      this.submitUpload()
    },
    submitUpload() {
      this.loading = true
      const formData = new FormData()
      formData.append('photo', this.photoToBeUploaded)
      formData.append('user_id', this.user.id)
      const updatePhotoResource = new Resource('users/upload-photo')
      updatePhotoResource
        .store(formData)
        .then((response) => {
          this.$emit('save', response)
          this.loading = false
          this.$emit('update:is-upload-photo-sidebar-active', false)
        })
        .catch((e) => {
          this.$message(e.response.message)
        })
    }
  }
}
</script>
