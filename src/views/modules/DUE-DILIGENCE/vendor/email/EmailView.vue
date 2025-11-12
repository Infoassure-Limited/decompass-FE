<template>
  <div v-if="selectedMessage !== null" class="email-app-details">
    <!-- Email Header -->
    <div class="email-detail-header">
      <!-- Header: Left -->

      <div class="pull-right">
        <el-button-group>
          <el-button type="info" size="small" @click="handleReply = true">
            <feather-icon icon="CornerUpLeftIcon" />
            <span class="align-middle ml-50">Reply</span>
          </el-button>
          <!-- <el-button
              type="success"
              size="small"
              @click="handleForward = true"
            >
              <feather-icon icon="CornerUpRightIcon" />
              <span class="align-middle ml-50">Forward</span>
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteMessage('delete_' + type)"
            >
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </el-button> -->
        </el-button-group>
      </div>
      <div class="email-header-left d-flex align-items-center">
        <span class="go-back mr-1">
          <feather-icon
            :icon="$store.state.appConfig.isRTL ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
            size="20"
            class="align-bottom"
            @click="$emit('close-email-view')"
          />
        </span>
        <h4 class="email-subject mb-0">
          {{ selectedMessage.subject }}
        </h4>
      </div>
    </div>

    <!-- Email Details -->
    <div :settings="perfectScrollbarSettings" class="email-scroll-area scroll-area">
      <br />
      <!-- Email Thread -->
      <el-row>
        <el-col cols="12">
          <email-message-card
            :message="selectedMessage"
            :type="type"
            :options="options"
            :recipients="recipients"
          />
        </el-col>
      </el-row>
      <template v-if="selectedMessage.replies !== null">
        <strong>Replies</strong>
        <el-row v-for="threadMail in selectedMessage.replies" :key="threadMail.id">
          <el-col cols="12">
            <email-message-card :message="threadMail" />
          </el-col>
        </el-row>
      </template>
    </div>

    <!-- REPLY MESSAGE DIALOG -->
    <el-dialog title="Reply Message" v-model:visible="handleReply" :modal-append-to-body="false">
      <el-input v-model="replied_message" type="textarea" :rows="7" />
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleReply = false">Cancel</el-button>
          <el-button type="primary" @click="replyMessage('reply')">Send</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- REPLY MESSAGE DIALOG -->
    <!-- FORWARD MESSAGE DIALOG -->
    <el-dialog
      title="Forward Message"
      v-model:visible="handleForward"
      :modal-append-to-body="false"
    >
      <el-select
        v-model="selected_option"
        style="width: 100%"
        placeholder="Select Recipients' Category"
        @input="setRecipients()"
      >
        <el-option
          v-for="(option, index) in options"
          :key="index"
          :label="option.toUpperCase()"
          :value="option"
        />
      </el-select>
      <el-select
        v-model="forward_recipients"
        style="width: 100%"
        placeholder="Select Recipients"
        filterable
        multiple
        collapse-tags
      >
        <el-option
          v-for="(recipient, index) in selected_recipients"
          :key="index"
          :label="
            recipient.user
              ? recipient.user.first_name +
                ' ' +
                recipient.user.last_name +
                ' (' +
                recipient.user.username +
                ')'
              : ''
          "
          :value="recipient.user_id"
        />
      </el-select>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleForward = false">Cancel</el-button>
          <el-button type="success" @click="updateMessage('forward')">Forward</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- FORWARD MESSAGE DIALOG -->
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import useEmail from './useEmail'
import EmailMessageCard from './EmailMessageCard.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // SFC
    EmailMessageCard
  },
  props: {
    emailViewData: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    recipients: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: () => 'inbox'
    }
    // opendedEmailMeta: {
    //   type: Object,
    //   required: true,
    // },
  },
  setup(props) {
    const { resolveLabelColor } = useEmail()

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150
    }

    const showWholeThread = ref(false)

    watch(
      () => props.emailViewData.id,
      () => {
        showWholeThread.value = false
      }
    )

    return {
      // UI
      perfectScrollbarSettings,
      showWholeThread,

      // useEmail
      resolveLabelColor
    }
  },
  data() {
    return {
      handleReply: false,
      handleForward: false,
      replied_message: '',
      forward_recipients: [],
      selected_option: '',
      selected_recipients: [],
      selectedMessage: null
    }
  },
  created() {
    this.selectedMessage = this.emailViewData
  },
  methods: {
    replyMessage(action) {
      const param = {
        message: this.replied_message,
        action,
        recipients: this.forward_recipients
      }
      const updateMessageResource = new Resource('vdd/messages/reply')
      updateMessageResource
        .vUpdate(this.selectedMessage.id, param)
        .then((response) => {
          this.selectedMessage = response.message_details
          this.handleReply = false
          this.handleForward = false
        })
        .catch(() => {})
    },
    updateMessage(action) {
      const param = {
        message: this.replied_message,
        action,
        recipients: this.forward_recipients
      }
      const updateMessageResource = new Resource('vdd/messages/update')
      updateMessageResource
        .vUpdate(this.selectedMessage.id, param)
        .then((response) => {
          this.selectedMessage = response.message_details
          this.handleReply = false
          this.handleForward = false
        })
        .catch(() => {})
    },
    deleteMessage(action) {
      if (window.confirm('Are you sure you want to delete conversation?')) {
        const param = {
          message: this.replied_message,
          action,
          recipients: this.forward_recipients
        }
        const updateMessageResource = new Resource('vdd/messages/update')
        updateMessageResource
          .vUpdate(this.selectedMessage.id, param)
          .then((response) => {
            this.selectedMessage = response.message_details
            this.$emit('close-email-view')
            this.handleReply = false
            this.handleForward = false
          })
          .catch(() => {})
      }
    },
    setRecipients() {
      this.selected_recipients = this.recipients[this.selected_option]
    }
  }
}
</script>
