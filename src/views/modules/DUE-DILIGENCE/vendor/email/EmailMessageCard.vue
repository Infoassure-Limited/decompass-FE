<template>
  <el-card no-body>
    <el-card-header v-if="message.sender" class="email-detail-head">
      <div class="user-details d-flex justify-content-between align-items-center flex-wrap">
        <el-avatar variant="info" size="25">
          <feather-icon icon="UserIcon" />
        </el-avatar>

        <div class="mail-items">
          <strong class="ml-1 mb-0">
            {{ message.sender_name }}
          </strong>
          <el-dropdown variant="link" no-caret toggle-class="p-0" class="email-info-dropup">
            <template #button-content>
              <span class="font-small-3 text-muted mr-25">{{ message.sender }}</span>
              <feather-icon icon="ChevronDownIcon" size="10" />
            </template>
            <table
              v-if="message.recipients !== null"
              class="table table-sm table-borderless font-small-3"
            >
              <tbody>
                <tr>
                  <td class="text-right text-muted align-top"> From: </td>
                  <td>{{ message.sender_name }}-({{ message.sender }})</td>
                </tr>
                <tr>
                  <td class="text-right text-muted align-top"> To: </td>
                  <td class="text-right text-muted align-top"> From: </td>
                  <td>{{ message.sender_name }}-({{ message.sender }})</td>
                </tr>
                <tr>
                  <td class="text-right text-muted align-top"> To: </td>
                  <td>{{ message.recipients.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </el-dropdown>
        </div>
      </div>
      <div class="mail-meta-item d-flex align-items-center">
        <small class="mail-date-time text-muted">{{
          moment(message.created_a).format('lll')
        }}</small>
        <!-- <small class="mail-date-time text-muted">{{
          formatDateToMonthShort(message.created_at, { hour: 'numeric', minute: 'numeric' })
        }}</small> -->
      </div>
    </el-card-header>

    <el-card-body class="mail-message-wrapper pt-2">
      <!-- eslint-disable vue/no-v-html -->
      <div class="mail-message" v-html="message.message"></div>
    </el-card-body>
  </el-card>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    message: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: () => 'inbox'
    }
  },
  methods: {
    moment
  }
}
</script>
