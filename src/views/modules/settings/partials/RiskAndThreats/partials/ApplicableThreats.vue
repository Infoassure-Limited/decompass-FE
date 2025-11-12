<template>
  <div>
    <div>
      Pick from the suggested threats as applicable. When done, click on Save. <br />You can also
      define new threats for {{ selectedAssetType.name }} by clicking on the button below.<br />

      <el-button class="" type="primary" @click="showNewThreatModal = true">
        <icon icon="tabler:plus" />Define New Threats
      </el-button>
    </div>
    <div v-loading="loadSearch" style="max-height: 550px; overflow: auto">
      <el-table
        :data="threats"
        row-key="id"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="threats" label="Threats" />
        <el-table-column label="Vulnerabilities">
          <template #default="scope">{{ scope.row.vulnerabilities.join(', ') }}</template>
        </el-table-column>
      </el-table>
      <el-dialog
        v-model="showNewThreatModal"
        :title="`Define new threats & vulnerabilities for ${selectedAssetType.name}`"
        centered
        width="70%"
        hide-footer
      >
        <CreateNewThreat
          v-if="showNewThreatModal"
          :asset-type="selectedAssetType"
          @saved="(setApplicableThreats(), (showNewThreatModal = false))"
        />
      </el-dialog>
    </div>
    <el-row>
      <el-col :md="24">
        <el-button-group class="pull-right">
          <el-button
            :disabled="form.threats.length < 1"
            type="success"
            @click="$emit('done', form.threats)"
          >
            <icon icon="tabler:device-floppy" />Save
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import CreateNewThreat from './CreateNewThreat.vue'
export default {
  components: {
    CreateNewThreat
  },
  props: {
    selectedAssetType: {
      type: Object,
      default: () => ({ name: '' })
    }
  },
  data() {
    return {
      loadSearch: false,
      showNewThreatModal: false,
      threats: [],
      form: {
        threats: []
      }
    }
  },
  watch: {
    selectedAssetType() {
      this.setApplicableThreats()
    }
  },
  mounted() {
    this.setApplicableThreats()
  },
  methods: {
    handleSelectionChange(val) {
      const selectedData = []
      selectedData.push(
        ...val.map((item) => {
          return {
            threat: item.threats,
            vulnerabilities: item.vulnerabilities,
            control_descriptions: [],
            showNewInput: false
          }
        })
      )
      this.form.threats = selectedData
    },
    setApplicableThreats() {
      this.form.threats = []
      this.loadSearch = true
      const fetchEntryResource = new Resource('risk-library/fetch-threats')
      fetchEntryResource
        .list({ asset_type: this.selectedAssetType.name })
        .then((response) => {
          this.threats = response.threats
          this.loadSearch = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.console.log(error.response.data.error)
          this.loadSearch = false
        })
    },
    filterMethod(query, item) {
      return item.threats.toLowerCase().includes(query.toLowerCase())
    }
  }
}
</script>
