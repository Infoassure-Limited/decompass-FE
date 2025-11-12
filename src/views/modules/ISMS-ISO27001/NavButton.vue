<template>
  <div>
    <el-button-group>
      <el-tooltip content="Dashboard">
        <el-button type="default" size="large" @click="$emit('view', '#dashboard')">
          <icon :size="30" icon="tabler:dashboard" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Compliance Assessment">
        <el-button type="default" @click="$emit('view', '#compliance')">
          <icon :size="30" icon="tabler:file-check" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Asset Management">
        <el-button type="default" @click="$emit('view', '#asset-management')">
          <icon :size="30" icon="tabler:asset" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Risk Management">
        <el-button type="default" @click="$emit('view', '#risk-assessment')">
          <icon :size="30" icon="tabler:file-text-shield" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Policy Management">
        <el-button type="default" @click="$emit('view', '#policy-assessment')">
          <icon :size="30" icon="tabler:file-text" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="Incident Management">
        <el-button type="default" @click="$emit('view', '#incident-assessment')">
          <icon :size="30" icon="tabler:alert-triangle" />
        </el-button>
      </el-tooltip>
    </el-button-group>
    <hr />
  </div>
</template>
