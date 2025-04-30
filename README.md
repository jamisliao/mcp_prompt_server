# MCP Prompt Server

基於 Model Context Protocol 的自定義提示詞服務器，專為 Claude Desktop 設計。

## 功能

- 提供多種預定義提示詞模板
- 可擴展的工具功能
- 與 Claude Desktop 無縫整合

## 安裝與配置

### 前提條件

- Node.js (>= 18)
- Claude Desktop 應用

### 安裝依賴

```bash
# 進入專案目錄
cd /Users/jamis.liao/opensource/mcp_prompt_server

# 安裝依賴
npm install

# 構建專案
npm run build
```

### Claude Desktop 整合

在 Claude Desktop 配置文件中添加以下配置：

**macOS**:
編輯 `~/Library/Application\ Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "prompt-server": {
      "command": "node",
      "args": ["/Users/jamis.liao/opensource/mcp_prompt_server/dist/index.js"]
    }
  }
}
```

## 使用方法

1. 啟動 Claude Desktop
2. 開始新對話
3. 點擊輸入框旁的迴紋針圖標
4. 選擇 "Choose an integration" > "prompt-server"
5. 選擇您想使用的提示詞模板

## 可用提示詞

- **development**: 獲取軟體開發任務的專業指導
- **research**: 獲取深入的研究分析
- **analyze**: 對內容進行全面分析
- **code-review**: 獲取專業的代碼審查反饋

## 可用工具

- **format_code**: 格式化代碼並提供語法高亮
- **generate_prompt**: 根據主題生成自定義提示詞

## 開發與擴展

### 添加新提示詞

1. 在 `src/prompts/` 目錄中添加新的提示詞定義檔案
2. 在 `src/prompts/index.ts` 中導入並註冊新提示詞
3. 實現對應的提示詞渲染函數

### 添加新工具

1. 在 `src/tools/index.ts` 中添加新工具的定義
2. 實現對應的工具處理函數

## 專案結構

```
mcp_prompt_server/
├── src/
│   ├── index.ts        # 入口文件
│   ├── tools/          # 自定義工具實作
│   │   └── index.ts    # 工具定義和處理邏輯
│   └── prompts/        # 提示詞模板
│       ├── index.ts    # 提示詞處理邏輯
│       ├── development.js
│       ├── research.js
│       ├── analyze.js
│       └── code-review.js
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 許可證

MIT