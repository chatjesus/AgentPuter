/**
 * 多语言 (i18n) 工具
 */

// 支持的语言列表
export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "zh", name: "Chinese Simplified", nativeName: "简体中文", dir: "ltr" },
  { code: "zh-tw", name: "Chinese Traditional", nativeName: "繁體中文", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];

// 非英文的语言代码（用于路由）
export const NON_EN_LOCALES = SUPPORTED_LOCALES.filter((l) => l.code !== "en");

// locale code -> OG locale
export const OG_LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  zh: "zh_CN",
  "zh-tw": "zh_TW",
  es: "es_ES",
  ja: "ja_JP",
  ko: "ko_KR",
  de: "de_DE",
  fr: "fr_FR",
  pt: "pt_BR",
  ru: "ru_RU",
  ar: "ar_SA",
};

export function getLocaleInfo(code: string) {
  return SUPPORTED_LOCALES.find((l) => l.code === code);
}

export function isValidLocale(code: string): code is LocaleCode {
  return SUPPORTED_LOCALES.some((l) => l.code === code);
}

/**
 * 服务端：从 cookie 读取用户语言偏好
 */
export async function getServerLocale(): Promise<LocaleCode> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const saved = cookieStore.get("tinyclaw-locale")?.value;
    if (saved && isValidLocale(saved)) return saved;
  } catch {
    // 非服务端环境 或 cookie 不存在
  }
  return "en";
}

// 深合并工具：用 base 填补 target 里缺失的 key
function deepMerge<T extends Record<string, unknown>>(base: T, target: Partial<T>): T {
  const result = { ...base };
  for (const key in target) {
    const bv = base[key];
    const tv = target[key];
    if (tv !== undefined && tv !== null) {
      if (typeof bv === "object" && !Array.isArray(bv) && typeof tv === "object" && !Array.isArray(tv)) {
        (result as Record<string, unknown>)[key] = deepMerge(bv as Record<string, unknown>, tv as Record<string, unknown>);
      } else {
        (result as Record<string, unknown>)[key] = tv;
      }
    }
  }
  return result;
}

// 加载翻译 JSON（自动深合并英文回退，防止 key 缺失返回 undefined）
export async function loadTranslations(locale: LocaleCode) {
  const en = await import("@/locales/en.json").then((m) => m.default || m);
  if (locale === "en") return en;
  try {
    const target = await import(`@/locales/${locale}.json`).then((m) => m.default || m);
    return deepMerge(en, target);
  } catch {
    return en;
  }
}

// 翻译类型定义
export interface Translations {
  meta: {
    title: string;
    description: string;
    og_description: string;
  };
  nav: {
    brand: string;
    blog: string;
    contact: string;
  };
  hero: {
    title_line1: string;
    title_line2: string;
    subtitle: string;
  };
  models: {
    heading: string;
  };
  channels: {
    heading: string;
    coming_soon: string;
  };
  cta: {
    button: string;
    note: string;
    slots: string;
  };
  comparison: {
    label: string;
    title_line1: string;
    title_line2: string;
    traditional: string;
    tinyclaw: string;
    total: string;
    total_time: string;
    tinyclaw_time: string;
    tinyclaw_desc: string;
    tinyclaw_subdesc: string;
    non_technical_note: string;
    steps: { label: string; time: string }[];
  };
  usecases: {
    heading: string;
    subheading: string;
    ps: string;
    rows: string[][];
  };
  footer: {
    built_by: string;
    privacy: string;
    terms: string;
  };
  setup: {
    connect_telegram: string;
    how_to_get_token: string;
    step1_open: string;
    step2_type: string;
    step3_follow: string;
    step4_copy: string;
    step5_paste: string;
    enter_token: string;
    invalid_token: string;
    connecting: string;
    save_connect: string;
    global_search: string;
    model_heading: string;
    channel_heading: string;
    coming_soon: string;
    connected: string;
    sign_out: string;
    deploy_btn: string;
    redirecting_checkout: string;
    pricing: string;
    pricing_credits: string;
    slots: string;
    loading: string;
    network_error: string;
    checkout_failed: string;
    channel_optional: string;
    connect_telegram_now: string;
    setup_telegram_token: string;
    skip_after_payment: string;
    connect_discord_now: string;
    setup_discord_token: string;
    whatsapp_no_token: string;
    whatsapp_qr_hint: string;
    plan_heading: string;
    plan_selected: string;
    plan_starter_label: string;
    plan_starter_first_month: string;
    plan_starter_then: string;
    plan_starter_feat1: string;
    plan_starter_feat2: string;
    plan_starter_feat3: string;
    plan_pro_label: string;
    plan_pro_no_trial: string;
    plan_pro_feat1: string;
    plan_pro_feat2: string;
    plan_pro_feat3: string;
    pricing_starter_today: string;
    pricing_starter_note: string;
    trial_badge: string;
    trial_for_7_days: string;
    trial_then_price: string;
    trial_pricing_line: string;
  };
  creating: {
    setting_up: string;
    model_label: string;
    preparing: string;
    creating_cloud: string;
    almost_done: string;
    time_hint: string;
    error_title: string;
    error_desc: string;
    retry: string;
    checking: string;
    loading: string;
    contact_support: string;
    contact_support_short: string;
  };
  dashboard: {
    agent_ready: string;
    running_model: string;
    sign_out: string;
    webchat_title: string;
    webchat_desc: string;
    open_webchat: string;
    vps_demo: string;
    webchat_pending: string;
    telegram_title: string;
    telegram_connected: string;
    telegram_pair_now: string;
    telegram_connected_msg: string;
    telegram_ready: string;
    telegram_step1: string;
    telegram_configure: string;
    telegram_configuring: string;
    telegram_step2: string;
    telegram_pair_placeholder: string;
    telegram_pairing: string;
    telegram_connect: string;
    telegram_paired: string;
    telegram_refreshing: string;
    telegram_failed: string;
    telegram_pair_failed: string;
    telegram_how_to_title: string;
    telegram_guide_step1: string;
    telegram_guide_step2: string;
    telegram_guide_step3: string;
    telegram_guide_step4: string;
    telegram_guide_step5: string;
    telegram_token_saved: string;
    telegram_pair_guide_step1: string;
    telegram_pair_guide_step2: string;
    telegram_pair_guide_step3: string;
    vps_title: string;
    vps_ip: string;
    vps_port: string;
    vps_ssh: string;
    vps_password: string;
    subscription_title: string;
    subscription_status: string;
    subscription_renews: string;
    manage_subscription: string;
    manage_loading: string;
    manage_failed: string;
    model_switch_btn: string;
    model_switching: string;
    model_current: string;
    model_switch_note: string;
    model_switching_desc: string;
    model_switch_success: string;
    model_switch_failed: string;
    powered_by: string;
    discord_setup_now: string;
    discord_token_configured: string;
    discord_step1_title: string;
    discord_step1_note: string;
    discord_step2_title: string;
    discord_step2_desc: string;
    discord_step2_cmd_note: string;
    discord_how_to: string;
    discord_step_new_app: string;
    discord_step_add_bot: string;
    discord_step_add_bot2: string;
    discord_step_reset_token: string;
    discord_step_intent: string;
    discord_step_url_gen: string;
    discord_configured: string;
    discord_reloading: string;
    discord_configuring: string;
    discord_connect_btn: string;
    discord_failed: string;
    whatsapp_scan_to_connect: string;
    whatsapp_linked: string;
    whatsapp_no_token_desc: string;
    whatsapp_activating: string;
    whatsapp_activate_btn: string;
    whatsapp_activate_failed: string;
    whatsapp_activated: string;
    whatsapp_scan_instructions: string;
    whatsapp_qr_expired: string;
    whatsapp_qr_generating: string;
    whatsapp_qr_placeholder: string;
    whatsapp_qr_no_qr: string;
    whatsapp_qr_expires_hint: string;
    whatsapp_refresh_qr: string;
    whatsapp_generate_qr: string;
    whatsapp_open_webchat: string;
    whatsapp_step2_title: string;
    whatsapp_step2_desc: string;
    whatsapp_applying: string;
    whatsapp_apply_btn: string;
    whatsapp_apply_failed: string;
    whatsapp_live_title: string;
    whatsapp_live_desc: string;
    feishu_title: string;
    feishu_connect_now: string;
    feishu_connected: string;
    feishu_desc: string;
    feishu_app_id_label: string;
    feishu_app_id_placeholder: string;
    feishu_app_secret_label: string;
    feishu_app_secret_placeholder: string;
    feishu_verify_token_label: string;
    feishu_verify_token_placeholder: string;
    feishu_encrypt_key_label: string;
    feishu_encrypt_key_placeholder: string;
    feishu_webhook_url_label: string;
    feishu_save_btn: string;
    feishu_saving: string;
    feishu_save_failed: string;
    feishu_configured_title: string;
    feishu_configured_desc: string;
    feishu_how_to: string;
    feishu_step_create_app: string;
    feishu_step_add_bot: string;
    feishu_step_enable_events: string;
    feishu_step_set_webhook: string;
    feishu_step_get_tokens: string;
  };
  faq: { q: string; a: string }[];
}
