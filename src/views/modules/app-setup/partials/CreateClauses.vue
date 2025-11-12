<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateClauseSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-clause-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Create Clauses </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <el-form-group label="Select Standard" label-for="v-standard">
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
            <el-col cols="12">
              <el-form-group label="Enter Clauses" label-for="v-level_group">
                <small style="color: brown"
                  >You can enter multiple clauses for the selected standard, just separate them with
                  a vertical bar, <code>|</code></small
                >
                <el-form-input v-model="form.names" placeholder="Enter Clauses Here" />
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group label="Will clauses stated above have audit questions for clients?">
                <el-radio-group v-model="form.will_have_audit_questions" size="mini">
                  <el-radio :label="1" border> YES </el-radio>
                  <el-radio :label="0" border> NO </el-radio>
                </el-radio-group>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <el-form-group
                label="Will clauses stated above require document uploads from clients?"
              >
                <el-radio-group v-model="form.requires_document_upload" size="mini">
                  <el-radio :label="1" border> YES </el-radio>
                  <el-radio :label="0" border> NO </el-radio>
                </el-radio-group>
              </el-form-group>
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
    prop: 'isCreateClauseSidebarActive',
    event: 'update:is-create-clause-sidebar-active'
  },
  props: {
    isCreateClauseSidebarActive: {
      type: Boolean,
      required: true
    },
    standards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        names: '',
        standard_id: '',
        requires_document_upload: 1,
        will_have_audit_questions: 1
      },
      loading: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      const saveCurriculumSetupResource = new Resource('clauses/save')
      const param = this.form
      saveCurriculumSetupResource.store(param).then((response) => {
        this.loading = false
        this.$emit('save', response)
        this.$emit('update:is-create-clause-sidebar-active', false)
      })
    }
  }
}
</script>
