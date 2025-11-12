<template>
  <div>
    <ul
      v-infinite-scroll="fetchTaskComments"
      :infinite-scroll-immediate="false"
      class="infinite-list"
    >
      <template v-if="comments.length > 0">
        <template v-for="(comment, index) in comments" :key="index">
          <template v-if="userId === comment.comment_by">
            <div align="right">
              <small class="mb-1">
                <strong>{{ comment.commenter.name }}</strong>
                &nbsp;<em>{{ moment(comment.created_at).format('lll') }}</em>
              </small>
            </div>
            <li class="mb-2 ml-20 myChat">
              {{ comment.comment }}
            </li>
          </template>
          <template v-else>
            <small class="mb-1">
              <strong>{{ comment.commenter.name }}</strong>
              &nbsp;<em>{{ moment(comment.created_at).format('lll') }}</em>
            </small>
            <li class="mb-2 mr-20 infinite-list-item">
              {{ comment.comment }}
            </li>
          </template>
        </template>
      </template>
      <template v-else>
        <el-empty
          image="/images/comments.png"
          :image-size="100"
          description="Be the first to say something"
        />
      </template>
      <li v-loading="loading"></li>
    </ul>
    <div>
      <el-input
        v-model="form.comment"
        class="mb-1"
        style="width: 100%"
        :rows="3"
        type="textarea"
        placeholder="Type message here..."
      />
      <el-tooltip content="Send">
        <el-button type="success" @click="sendComment()">
          <icon icon="tabler:send" /> Send
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    task: {
      type: Object,
      default: () => null
    },
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      comments: [],
      form: {
        comment: ''
      },
      empty_form: {
        comment: ''
      },
      query: {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userData.id
    }
  },
  mounted() {
    this.fetchTaskComments()
  },
  methods: {
    moment,
    fetchTaskComments(event) {
      if (this.task !== null) {
        this.loading = true
        const { query } = this
        const commentResource = new Resource(
          `${this.selectedModule}/calendar/comments/fetch-task-comments`
        )
        commentResource
          .list({ task_id: this.task.id, page: query.page })
          .then((response) => {
            this.comments.push(...response.comments.data)
            this.query.total = response.comments.total
            this.query.page += 1
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
          })
      }
    },
    sendComment() {
      const createTaskResource = new Resource(
        `${this.selectedModule}/calendar/comments/post-task-comment`
      )
      const { form } = this
      form.assigned_task_id = this.task.id
      this.loader = true
      createTaskResource
        .store(form)
        .then((response) => {
          this.form = this.empty_form
          this.comments.push(response.comment)
          this.loader = false
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    }
  }
}
</script>
<style scoped>
.infinite-list {
  height: 480px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: solid 2px #cccccc;
  color: #000000;
  border-radius: 0 10px 10px 10px;
}

.myChat {
  padding: 10px;
  display: flex;
  background: var(--el-color-primary-light-9);
  border: solid 2px var(--el-color-primary-light-5);
  color: var(--el-color-primary);
  border-radius: 10px 0 10px 10px;
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
