<template>
  <el-card class="app-container">
    <div class="block">
      <legend>{{ title }}</legend>
      <div v-if="notifications.length > 0">
        <el-timeline v-loading="listLoading" style="height: 400px; overflow: auto">
          <el-timeline-item
            v-for="(activity_log, index) in notifications"
            :key="index"
            :timestamp="moment(activity_log.created_at).fromNow()"
            placement="top"
            color="#0bbd87"
          >
            <el-card>
              <p>{{ activity_log.data.title }}</p>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="activity_log.data.description"></span>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else>
        <el-empty description="You have no notification" />
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="query.page"
        v-model:limit="query.limit"
        @pagination="markAsRead"
      />
    </div>
  </el-card>
</template>

<script>
import moment from 'moment'
import Resource from '@/api/resource'
import Pagination from '@/views/Components/Pagination-main/index.vue'

const markNotificationAsRead = new Resource('notification/mark-as-read')
export default {
  components: {
    Pagination
  },
  props: {
    title: {
      type: String,
      default: 'Notification'
    }
  },
  data() {
    return {
      show_notification: true,
      listLoading: false,
      query: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  computed: {
    notifications() {
      return this.$store.getters.userData.notifications
    }
  },
  created() {
    this.markAsRead()
  },
  methods: {
    moment,
    markAsRead() {
      const { limit, page } = this.query
      this.listLoading = true
      markNotificationAsRead.list(this.query).then((response) => {
        const { data } = response.notifications
        data.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.notifications.total
        this.$store.dispatch('user/setNotifications', data)
        this.$store.dispatch('user/setUnreadNotificationCount', response.unread_notifications)
        this.listLoading = false
      })
    }
  }
}
</script>
