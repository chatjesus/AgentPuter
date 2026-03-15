/**
 * GA4 漏斗事件追踪工具
 * 追踪用户从落地页到完成部署的完整路径
 *
 * 漏斗步骤:
 *   1. page_view (自动)     — 用户访问落地页
 *   2. sign_up              — 用户注册 / 登录
 *   3. select_model         — 选择 AI 模型
 *   4. connect_telegram     — 完成 Telegram 配对
 *   5. begin_checkout       — 点击付款按钮
 *   6. purchase             — 付款成功，进入部署
 *   7. deploy_complete      — 部署完成，进入 Dashboard
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type FunnelEvent =
  | "sign_up"
  | "select_model"
  | "connect_telegram"
  | "connect_telegram_post_deploy"
  | "connect_discord"
  | "click_deploy"
  | "begin_checkout"
  | "purchase"
  | "deploy_complete";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * 发送 GA4 自定义事件
 */
export function trackEvent(event: FunnelEvent, params?: EventParams) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, {
      event_category: "funnel",
      ...params,
    });
  }
}

/**
 * 发送 GA4 页面浏览（SPA 路由变化时手动触发）
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title || document.title,
    });
  }
}
