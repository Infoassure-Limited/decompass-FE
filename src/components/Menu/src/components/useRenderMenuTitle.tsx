import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = useI18n()
    const { title = 'Please set title', icon, hint } = meta

    if (!icon && !hint) {
      return (
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t(title as string)}
        </span>
      )
    } else if (!icon && hint) {
      return (
        <el-tooltip content={t(hint as string)} placement="right" effect="dark">
          <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t(title as string)}
          </span>
        </el-tooltip>
      )
    } else if (icon && hint) {
      return (
        <>
          <Icon icon={meta.icon}></Icon>
          <el-tooltip content={t(hint as string)} placement="right" effect="dark">
            <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t(title as string)}
            </span>
          </el-tooltip>
        </>
      )
    } else {
      return (
        <>
          <Icon icon={meta.icon}></Icon>

          <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t(title as string)}
          </span>
        </>
      )
    }
  }

  return {
    renderMenuTitle
  }
}
