<template>
  <div>
    <el-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 v-if="isAdmin" class="mel-0"> Fill the fields as applicable </h5>
          <h5 v-else class="mel-0"> Consultant's Remarks </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div v-if="isAdmin" class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <label>Status</label>
              <el-form-group label-for="v-status">
                <el-select
                  v-model="form.status"
                  placeholder="Select Status"
                  style="width: 100%"
                  @blur="saveRemark('status')"
                >
                  <el-option
                    v-for="(status, index) in statuses"
                    :key="index"
                    :value="status"
                    :label="status"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <el-col cols="12">
              <label>General Remark</label>
              <el-form-group label-for="v-remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  placeholder="Type your remark here..."
                  style="width: 100%"
                  @blur="saveRemark('remark')"
                />
              </el-form-group>
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="$emit('reload')"
              >
                Submit
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <el-col cols="12">
              <label>Status</label>
              <p>{{ form.status }}</p>
            </el-col>
            <el-col cols="12">
              <label>General Remark</label>
              <p>{{ form.remark }}</p>
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active'
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true
    },
    document: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      form: {
        id: '',
        status: '',
        remark: ''
      },
      loading: false,
      statuses: ['Pending on Client', 'Pending on Consultant', 'Reviewed'],
      selectedConsulting: {}
    }
  },
  created() {
    this.form = this.document
  },
  methods: {
    saveRemark(field) {
      const { form } = this
      // console.log(document[field])
      const param = { value: form[field], field }
      const fetchConsultingsResource = new Resource('clauses/remark-on-upload')
      fetchConsultingsResource.update(form.id, param).then(() => {})
    }
  }
}
</script>
