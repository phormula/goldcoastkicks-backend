export interface PushNotification {
  name?: string
  data: { [key: string]: string }
  notification: PNotification
  android?: AndroidConfig
  webpush?: WebpushConfig
  apns?: ApnsConfig
  fcm_options?: FcmOptions
  token?: string
  tokens?: string[]
  topic?: string
  condition?: string
}

interface PNotification {
  title: string
  body: string
  image?: string
  group?: string
}

interface AndroidConfig {
  collapse_key?: string
  priority?: AndroidMessagePriority
  ttl?: string
  restricted_package_name?: string
  data?: { [key: string]: string }
  notification?: AndroidNotification
  fcm_options?: AndroidFcmOptions
  direct_boot_ok?: boolean
}
enum AndroidMessagePriority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

interface AndroidNotification {
  group?: string
  title?: string
  body?: string
  icon?: string
  color?: string
  sound?: string
  tag?: string
  click_action?: string
  body_loc_key?: string
  body_loc_args?: string[]
  title_loc_key?: string
  title_loc_args?: string[]
  channel_id?: string
  ticker?: string
  sticky?: boolean
  event_time?: string
  local_only?: boolean
  notification_priority?: NotificationPriority
  default_sound?: boolean
  default_vibrate_timings?: boolean
  default_light_settings?: boolean
  vibrate_timings?: string[]
  visibility?: Visibility
  notification_count?: number
  light_settings?: LightSettings
  image?: string
}

enum NotificationPriority {
  PRIORITY_UNSPECIFIED = 'PRIORITY_UNSPECIFIED',
  PRIORITY_MIN = 'PRIORITY_MIN',
  PRIORITY_LOW = 'PRIORITY_LOW',
  PRIORITY_DEFAULT = 'PRIORITY_DEFAULT',
  PRIORITY_HIGH = 'PRIORITY_HIGH',
  PRIORITY_MAX = 'PRIORITY_MAX',
}

enum Visibility {
  VISIBILITY_UNSPECIFIED = 'VISIBILITY_UNSPECIFIED',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  SECRET = 'SECRET',
}

interface LightSettings {
  color: any
  light_on_duration: string
  light_off_duration: string
}

interface AndroidFcmOptions {
  analytics_label: string
}

interface WebpushConfig {
  headers: { [key: string]: string }
  data: { [key: string]: string }
  notification: Notification
  fcm_options: WebpushFcmOptions
}

interface WebpushFcmOptions {
  link: string
  analytics_label: string
}

interface ApnsConfig {
  headers: { [key: string]: string }
  payload: any
  fcm_options: ApnsFcmOptions
}

interface ApnsFcmOptions {
  analytics_label: string
  image: string
}

interface FcmOptions {
  analytics_label: string
}
