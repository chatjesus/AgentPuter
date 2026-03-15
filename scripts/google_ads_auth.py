#!/usr/bin/env python3
"""
Google Ads OAuth2 授权脚本
生成授权链接，用户手动访问后获取 Refresh Token。

使用方法:
    source scripts/.venv/bin/activate
    python scripts/google_ads_auth.py
"""

import json
import os
from google_auth_oauthlib.flow import InstalledAppFlow

# Google Ads API 所需的 OAuth Scopes
SCOPES = ["https://www.googleapis.com/auth/adwords"]

# 使用 installed app 类型的凭证
CREDENTIALS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "credentials",
    "client_secret_726088151743-8viddm8sst7jhapunh46n5fdb86m1jh1.apps.googleusercontent.com.json",
)

OUTPUT_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "credentials",
    "google_ads_token.json",
)


def main():
    print("=" * 60)
    print("Google Ads OAuth2 授权工具")
    print("=" * 60)
    print()

    if not os.path.exists(CREDENTIALS_FILE):
        print(f"错误: 找不到凭证文件: {CREDENTIALS_FILE}")
        return

    with open(CREDENTIALS_FILE, "r") as f:
        creds_data = json.load(f)

    client_type = "installed" if "installed" in creds_data else "web"
    client_id = creds_data[client_type]["client_id"]
    client_secret = creds_data[client_type]["client_secret"]

    # 创建 OAuth Flow，使用手动模式（不自动开浏览器）
    flow = InstalledAppFlow.from_client_secrets_file(
        CREDENTIALS_FILE,
        scopes=SCOPES,
        redirect_uri="http://localhost:8080/",
    )

    # 生成授权 URL
    auth_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        include_granted_scopes="true",
    )

    print("请在浏览器中打开以下链接，完成 Google 账户授权:")
    print()
    print(auth_url)
    print()
    print("=" * 60)
    print("授权完成后，浏览器会跳转到 localhost 页面。")
    print("请复制浏览器地址栏中的完整 URL 粘贴到这里:")
    print("=" * 60)
    print()

    redirect_url = input("粘贴回调 URL: ").strip()

    # 从回调 URL 中提取授权码
    flow.fetch_token(authorization_response=redirect_url)
    credentials = flow.credentials

    # 保存 token
    token_data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": credentials.refresh_token,
        "token": credentials.token,
        "token_uri": credentials.token_uri,
        "scopes": list(credentials.scopes),
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(token_data, f, indent=2)

    print()
    print("=" * 60)
    print("授权成功！")
    print("=" * 60)
    print()
    print(f"Refresh Token: {credentials.refresh_token}")
    print()
    print(f"Token 已保存到: {OUTPUT_FILE}")
    print()
    print("MCP 环境变量配置:")
    print(f"  GOOGLE_ADS_CLIENT_ID={client_id}")
    print(f"  GOOGLE_ADS_CLIENT_SECRET={client_secret}")
    print(f"  GOOGLE_ADS_REFRESH_TOKEN={credentials.refresh_token}")
    print(f"  GOOGLE_ADS_CUSTOMER_ID=8756791823")

    # 生成 .env 文件
    env_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "credentials",
        "google_ads.env",
    )
    with open(env_file, "w") as f:
        f.write(f"GOOGLE_ADS_CLIENT_ID={client_id}\n")
        f.write(f"GOOGLE_ADS_CLIENT_SECRET={client_secret}\n")
        f.write(f"GOOGLE_ADS_REFRESH_TOKEN={credentials.refresh_token}\n")
        f.write(f"GOOGLE_ADS_CUSTOMER_ID=8756791823\n")
        f.write(f"# GOOGLE_ADS_DEVELOPER_TOKEN=你的开发者Token\n")

    print(f"\n.env 文件已生成: {env_file}")


if __name__ == "__main__":
    main()
