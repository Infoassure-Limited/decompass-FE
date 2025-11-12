<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="sidebar-content email-app-sidebar">
        <div class="email-app-menu">
          <div class="form-group-compose text-center compose-btn">
            <el-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              block
              @click="
                ($emit('update:shall-show-email-compose-modal', true), $emit('close-left-sidebar'))
              "
            >
              Compose
            </el-button>
          </div>
          <!-- <vue-perfect-scrollbar
            :settings="perfectScrollbarSettings"
            class="sidebar-menu-list scroll-area"
          > -->
          <!-- Filters -->
          <el-list-group class="list-group-messages">
            <el-list-group-item
              v-for="filter in emailFilters"
              :key="filter.title + $route.path"
              :to="filter.route"
              @click="($emit('close-left-sidebar'), $emit('reload-page'))"
            >
              <feather-icon :icon="filter.icon" size="18" class="mr-75" />
              <span class="align-text-bottom line-height-1">{{ filter.title }}</span>
              <el-badge
                v-if="emailsMeta[filter.title.toLowerCase()]"
                pill
                :variant="resolveFilterBadgeColor(filter.title)"
                class="float-right"
              >
                {{ emailsMeta[filter.title.toLowerCase()] }}
              </el-badge>
            </el-list-group-item>
          </el-list-group>
          <!-- </vue-perfect-scrollbar> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { isDynamicRouteActive } from '@core/utils/utils'

export default {
  components: {},
  props: {
    shallShowEmailComposeModal: {
      type: Boolean,
      required: true
    },
    emailsMeta: {
      type: Object,
      required: true
    }
  },
  setup() {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 60
    }

    const emailFilters = [
      { title: 'Inbox', icon: 'MailIcon', route: { name: 'apps-email' } },
      {
        title: 'Sent',
        icon: 'SendIcon',
        route: { name: 'apps-email-folder', params: { folder: 'sent' } }
      }
      // { title: 'Draft', icon: 'Edit2Icon', route: { name: 'apps-email-folder', params: { folder: 'draft' } } },
      // { title: 'Starred', icon: 'StarIcon', route: { name: 'apps-email-folder', params: { folder: 'starred' } } },
      // { title: 'Spam', icon: 'InfoIcon', route: { name: 'apps-email-folder', params: { folder: 'spam' } } },
      // { title: 'Trash', icon: 'TrashIcon', route: { name: 'apps-email-folder', params: { folder: 'trash' } } },
    ]

    const emailLabel = [
      {
        title: 'Personal',
        color: 'success',
        route: { name: 'apps-email-label', params: { label: 'personal' } }
      },
      {
        title: 'Company',
        color: 'primary',
        route: { name: 'apps-email-label', params: { label: 'company' } }
      },
      {
        title: 'Important',
        color: 'warning',
        route: { name: 'apps-email-label', params: { label: 'important' } }
      },
      {
        title: 'Private',
        color: 'danger',
        route: { name: 'apps-email-label', params: { label: 'private' } }
      }
    ]

    const resolveFilterBadgeColor = (filter) => {
      if (filter === 'Draft') return 'light-warning'
      if (filter === 'Spam') return 'light-danger'
      return 'light-primary'
    }

    return {
      // UI
      perfectScrollbarSettings,
      // isDynamicRouteActive,
      resolveFilterBadgeColor,

      // Filter & Labels
      emailFilters,
      emailLabel
    }
  }
}
</script>

<style></style>
