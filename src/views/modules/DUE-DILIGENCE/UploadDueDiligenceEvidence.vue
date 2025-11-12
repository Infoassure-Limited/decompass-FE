<template>
  <div v-loading="load">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>File</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-input v-model="form.title" type="text" outline placeholder="Title of document" />
          </td>
          <td>
            <input class="form-control" type="file" @change="onImageChange" />
          </td>
          <td>
            <span>
              <b-button
                variant="success"
                class="btn-icon"
                :disabled="form.title === '' || uploadableFile === null"
                @click="submit()"
              >
                <feather-icon icon="UploadIcon" /> Upload
              </b-button>
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
    answerId: {
      type: Number,
      default: () => null
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
  methods: {
    onImageChange(e) {
      this.uploadableFile = e.target.files[0]
    },
    submit() {
      this.load = true
      const formData = new FormData()
      formData.append('title', this.form.title)
      formData.append('file_uploaded', this.uploadableFile)
      formData.append('answer_id', this.answerId)
      const updatePhotoResource = new Resource('vdd/answers/upload-due-diligence-evidence')
      updatePhotoResource
        .vStore(formData)
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
