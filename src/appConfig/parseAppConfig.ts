import { AppConfigType } from '../types/AppConfig.type'

export const initialAppConfig: AppConfigType = {
  active: true,
}

export const parseAppConfig = (stored: unknown): AppConfigType => {
  if (typeof stored !== 'object' || stored === null || !('active' in stored)) {
    return initialAppConfig
  }

  const { active } = stored as { active: unknown }

  return {
    active: active !== false,
  }
}
