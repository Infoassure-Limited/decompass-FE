<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateEvidenceSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-evidence-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Create Evidence </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label="Select Unit" label-for="v-evidence">
                <el-select
                  v-model="selectedConsulting"
                  value-key="id"
                  style="width: 100%"
                  @input="setStandards()"
                >
                  <el-option
                    v-for="(consulting, index) in consultings"
                    :key="index"
                    :value="consulting"
                    :label="consulting.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Select Standard" label-for="v-evidence">
                <el-select v-model="form.standard_id" style="width: 100%">
                  <el-option
                    v-for="(standard, index) in standards"
                    :key="index"
                    :value="standard.id"
                    :label="standard.name"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <!-- first name -->
            <el-col cols="12">
              <el-form-group label="Evidence Title" label-for="v-title">
                <el-form-input v-model="form.title" placeholder="Enter Evidence Title" />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Upload Type" label-for="v-upload_type">
                <el-select v-model="form.upload_type" style="width: 100%">
                  <el-option
                    v-for="(upload_type, index) in upload_types"
                    :key="index"
                    :value="upload_type"
                    :label="upload_type.toUpperCase()"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col v-if="form.upload_type === 'multiple'" cols="12">
              <el-form-group
                label="Expected suel-document titles"
                label-for="v-sub_document_titles"
              >
                <el-form-input
                  v-model="form.sub_document_titles"
                  placeholder="example: Document Title 1|Document Title 2|Document Title 3"
                /> </el-form-group
              ><br />
              <small
                >You can enter multiple expected document title, just separate them with a vertical
                bar <code>|</code></small
              >
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateEvidenceSidebarActive',
    event: 'update:is-create-evidence-sidebar-active'
  },
  props: {
    isCreateEvidenceSidebarActive: {
      type: Boolean,
      required: true
    },
    consultings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        title: '',
        consulting_id: '',
        standard_id: '',
        upload_type: 'single',
        sub_document_titles: ''
      },
      upload_types: ['single', 'multiple'],
      selectedConsulting: {},
      standards: [],
      loading: false
    }
  },
  methods: {
    setStandards() {
      this.form.consulting_id = this.selectedConsulting.id
      this.standards = this.selectedConsulting.standards
    },
    submit() {
      this.loading = true
      const saveEvidenceResource = new Resource('evidence/store')
      const param = this.form
      saveEvidenceResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response)
          this.$emit('update:is-create-evidence-sidebar-active', false)
        })
        .catch((error) => {
          this.loading = false
          this.$message(error)
        })
    }
  }
}
</script>
