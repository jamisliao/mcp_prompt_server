#!/usr/bin/env node
/**
 * MCP Prompt Server
 * 主要入口檔案，處理 MCP 通訊與協議
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
  McpError,
  ErrorCode,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";

// 導入提示詞模組
import { PROMPTS, renderPrompt } from './prompts/index.js';
// 導入工具模組
import { TOOLS, handleToolCall } from './tools/index.js';

/**
 * 初始化 MCP 服務器
 * 設定基本資訊與能力
 */
const server: Server = new Server(
  {
    name: "mcp-prompt-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    },
  }
);

// 處理工具列表請求
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS
}));

// 處理工具呼叫請求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await handleToolCall(request.params.name, request.params.arguments);
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const message = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InternalError, `工具執行錯誤: ${message}`);
  }
});

// 處理提示詞列表請求
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: Object.values(PROMPTS)
}));

// 處理提示詞獲取請求
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const promptName = request.params.name;
  
  try {
    return await renderPrompt(promptName, request.params.arguments);
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    const message = error instanceof Error ? error.message : String(error);
    throw new McpError(ErrorCode.InvalidRequest, `提示詞處理錯誤: ${message}`);
  }
});

// 啟動服務器
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  // 使用 stderr 輸出錯誤信息，不會干擾 MCP 協議
  process.stderr.write(`啟動失敗: ${error}\n`);
  process.exit(1);
});

// 處理程序退出事件
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});