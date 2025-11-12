<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditClauseSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-clause-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0"> Edit Clause </h5>
          <div>
            <b-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">
            <!-- <b-col cols="12">
              <b-form-group
                label="Select Standard"
                label-for="v-standard"
              >
                <el-select
                  v-model="form.standard_id"
                  style="width: 100%"
                >
                  <el-option
                    v-for="(standard, index) in standards"
                    :key="index"
                    :value="standard.id"
                    :label="standard.name"
                  />
                </el-select>
              </b-form-group>
            </b-col> -->
            <!-- first name -->
            <b-col cols="12">
              <b-form-group label="Update Requirement" label-for="v-level_group">
                <b-form-input v-model="form.name" placeholder="example: PART V" />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Description" label-for="v-description">
                <b-form-input
                  v-model="form.description"
                  placeholder="example:  PRINCIPLES AND LAWFUL BASIS GOVERNING PROCESSING OF PERSONAL DATA"
                />
              </b-form-group>
            </b-col>
            <!-- <b-col cols="12">
              <b-form-group
                label="Will clauses stated above have audit questions for clients?"
              >
                <el-radio-group
                  v-model="form.will_have_audit_questions"
                  size="mini"
                >
                  <el-radio
                    :label="1"
                    border
                  >
                    YES
                  </el-radio>
                  <el-radio
                    :label="0"
                    border
                  >
                    NO
                  </el-radio>
                </el-radio-group>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                label="Will clauses stated above require document uploads from clients?"
              >
                <el-radio-group
                  v-model="form.requires_document_upload"
                  size="mini"
                >
                  <el-radio
                    :label="1"
                    border
                  >
                    YES
                  </el-radio>
                  <el-radio
                    :label="0"
                    border
                  >
                    NO
                  </el-radio>
                </el-radio-group>
              </b-form-group>
            </b-col> -->
            <!-- <b-col cols="12">
              <b-form-group
                label="Clause Description"
                label-for="v-level_group"
              >
                <b-form-textarea
                  v-model="form.description"
                  placeholder="Briefly describe this clause"
                />
              </b-form-group>
            </b-col> -->
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
              </b-button>
            </b-col>
            <b-col v-if="error" cols="12">
              <b-alert variant="danger" show>
                <div class="alert-body">
                  <span
                    ><strong>{{ error_message }}</strong></span
                  >
                </div>
              </b-alert>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isEditClauseSidebarActive',
    event: 'update:is-edit-clause-sidebar-active'
  },
  props: {
    isEditClauseSidebarActive: {
      type: Boolean,
      required: true
    },
    selectedClause: {
      type: Object,
      default: () => null
    },
    standards: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        clause_id: ''
      },
      loading: false,
      error: false,
      error_message: ''
    }
  },
  created() {
    this.form = this.selectedClause
  },
  methods: {
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('ndpa/clauses/update')
      const param = this.form
      updateCurriculumSetupResource.update(param.id, param).then((response) => {
        this.loading = false
        this.$emit('update', response)
        this.$emit('update:is-edit-clause-sidebar-active', false)
      })
    }
  }
}
</script>
