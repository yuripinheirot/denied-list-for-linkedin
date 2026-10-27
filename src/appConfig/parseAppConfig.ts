import { AppConfigType } from '../types/AppConfig.type'

export const initialAppConfig: AppConfigType = {
  active: true,
  autoClosePostApplyModal: true,
}

export const parseAppConfig = (stored: unknown): AppConfigType => {
  if (typeof stored !== 'object' || stored === null || !('active' in stored)) {
    return initialAppConfig
  }

  const { active, autoClosePostApplyModal } = stored as {
    active: unknown
    autoClosePostApplyModal: unknown
  }

  return {
    active: active !== false,
    autoClosePostApplyModal: autoClosePostApplyModal !== false,
  }
}
