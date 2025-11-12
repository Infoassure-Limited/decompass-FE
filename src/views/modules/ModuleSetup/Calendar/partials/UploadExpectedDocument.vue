<template>
  <div v-loading="load">
    Title: {{ uploadTemplate.title }}
    <table class="table">
      <thead>
        <tr>
          <th>Choose File</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input class="form-control" type="file" @change="onImageChange" />
          </td>
          <td>
            <span>
              <el-button
                type="success"
                :disabled="form.title === '' || uploadableFile === null"
                @click="submit()"
              >
                <icon icon="tabler:upload" />
              </el-button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    uploadTemplate: {
      type: Object,
      default: () => null
    },
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showTable: false,
      form: {
        title: ''
      },
      fill_fields_error: false,
      load: false,
      uploadableFile: null
    }
  },
  created() {
    this.form.title = this.uploadTemplate.title
  },
  methods: {
    onImageChange(e) {
      this.uploadableFile = e.target.files[0]
    },
    submit() {
      this.load = true
      const formData = new FormData()
      formData.append('title', this.form.title)
      formData.append('file_uploaded', this.uploadableFile)
      formData.append('upload_id', this.uploadTemplate.id)
      const updatePhotoResource = new Resource(`${this.selectedModule}/uploads/upload-file`)
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.load = false
          this.uploadableFile = null
          this.form = {
            title: '',
            link: ''
          }
          this.$emit('reload')
          this.$message('File upload successful')
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
