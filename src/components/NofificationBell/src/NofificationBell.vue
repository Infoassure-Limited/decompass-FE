<template>
  <div>
    <audio id="myAudio">
      <source src="/alert.mp3" type="audio/mpeg" />
    </audio>
    <button id="play_audio" @click="playAudio()"></button>
    <el-dropdown class="custom-hover" trigger="click">
      <span v-if="unreadNotificationCount > 0" class="el-dropdown-link">
        <el-badge :value="unreadNotificationCount" :max="10" class="item">
          <icon icon="tabler:bell" :size="25" />
        </el-badge>
      </span>
      <span v-else class="el-dropdown-link">
        <icon icon="tabler:bell" :size="25" />
      </span>
      <template #dropdown>
        <el-dropdown-menu v-if="notifications.length > 0">
          <el-dropdown-item v-for="(notification, index) in notifications" :key="index">
            <div>
              <span class="font-weight-bolder">
                {{ notification.data.title }}
              </span>
              <div style="max-height: 70px; overflow: auto">
                <!--eslint-disable-next-line vue/no-v-html vue/max-attributes-per-line -->
                <small class="notification-text" v-html="notification.data.description"></small>
              </div>
              <small class="pull-right mt-1">{{ moment(notification.created_at).fromNow() }}</small>
            </div>
          </el-dropdown-item>
          <el-dropdown-item class="dropdown-menu-footer">
            <el-button type="primary" style="width: 100%" @click="loadNotifications"
              >Read all notifications
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-else>
          <el-dropdown-item>
            <div>
              <small class="notification-text">You have no notifications</small>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import moment from 'moment'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      // settings: {
      //   maxScrollbarLength: 60,
      //   wheelSpeed: 0.60,
      // },
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false
      }
    }
  },
  computed: {
    unreadNotificationCount() {
      return this.$store.getters.userData.unreadNotificationCount
    },
    notifications() {
      return this.$store.getters.userData.notifications
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag
    },
    listenForChanges() {
      window.Pusher = Pusher
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        encrypted: true,
        authEndpoint: `${import.meta.env.VITE_BASE_SERVER_URL}api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${this.$store.getters.token}`
          }
        }
      })
      const currentUserId = this.$store.getters.userId
      return window.Echo.private(`App.Models.User.${currentUserId}`).notification(
        (notification) => {
          // this.playAudio()
          // console.log(notification)
          const playButton = document.getElementById('play_audio')
          if (playButton !== null) {
            playButton.click()
          }
          this.fetchUserNotifications()
          this.$notify({
            title: notification.title, // .response.statusText,
            icon: 'tabler:alert-triangle',
            type: 'success'
          })
        }
      )
    }
  },
  mounted() {
    this.fetchUserNotifications()
  },
  methods: {
    moment,
    fetchUserNotifications() {
      const userNotifications = new Resource('user-notifications')
      userNotifications.list().then((response) => {
        // console.log(response.notifications)
        this.$store.dispatch('user/setNotifications', response.notifications)
        this.$store.dispatch('user/setUnreadNotificationCount', response.unread_notifications)

        this.listenForChanges
      })
    },
    pushNotification(notification) {
      const data = {
        title: notification.title,
        description: notification.description
      }

      notification.data = data
      this.$store.dispatch('user/addNewNotifications', notification)
      this.$store.dispatch('user/setUnreadNotificationCount', 1)
    },
    playAudio() {
      const audio = document.getElementById('myAudio')
      audio.play()
    },
    loadNotifications() {
      // document.getElementById('close_notification_pane').click()
      // this.show_notification = false
      // then update notifications as read
      this.$router.push('/notifications/all')
    }
  }
}
</script>
