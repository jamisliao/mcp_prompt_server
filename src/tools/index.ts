/**
 * 工具模組
 * 定義並實現各種工具
 */

import { Tool, McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// 導出工具列表
export const TOOLS: Tool[] = [
  {
    name: "format_code",
    description: "格式化代碼並提供語法高亮",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "要格式化的代碼" },
        language: { type: "string", description: "代碼的程式語言" }
      },
      required: ["code"]
    }
  },
  {
    name: "generate_prompt",
    description: "根據主題生成自定義提示詞",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "提示詞主題" },
        style: { type: "string", description: "提示詞風格 (educational, professional, creative)" },
        length: { type: "string", description: "提示詞長度 (short, medium, long)" }
      },
      required: ["topic"]
    }
  }
];

/**
 * 處理工具呼叫
 * @param toolName 工具名稱
 * @param args 工具參數
 */
export async function handleToolCall(toolName: string, args: any) {
  switch (toolName) {
    case "format_code":
      return await handleFormatCode(args);
    case "generate_prompt":
      return await handleGeneratePrompt(args);
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `未知工具: ${toolName}`
      );
  }
}

/**
 * 處理代碼格式化工具
 * @param args 工具參數
 */
async function handleFormatCode(args: any) {
  const { code, language = "text" } = args;
  
  if (!code) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "未提供代碼"
    );
  }
  
  // 這裡可以添加實際的代碼格式化邏輯
  // 目前只是簡單返回代碼，在實際應用中可以整合格式化庫
  
  return {
    content: [{
      type: "text",
      text: `已格式化的代碼 (${language}):\n\n\`\`\`${language}\n${code}\n\`\`\``
    }]
  };
}

/**
 * 處理提示詞生成工具
 * @param args 工具參數
 */
async function handleGeneratePrompt(args: any) {
  const { topic, style = "professional", length = "medium" } = args;
  
  if (!topic) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      "未提供主題"
    );
  }
  
  let promptStyle = "";
  switch (style) {
    case "educational":
      promptStyle = "教育性的、解釋性的";
      break;
    case "professional":
      promptStyle = "專業的、技術性的";
      break;
    case "creative":
      promptStyle = "創意的、啟發性的";
      break;
    default:
      promptStyle = "專業的";
  }
  
  let promptLength = "";
  switch (length) {
    case "short":
      promptLength = "簡潔的";
      break;
    case "medium":
      promptLength = "適中的";
      break;
    case "long":
      promptLength = "詳盡的";
      break;
    default:
      promptLength = "適中的";
  }
  
  const generatedPrompt = `
# ${topic} - ${promptStyle}提示詞

請提供一個${promptLength}，${promptStyle}的${topic}分析。

## 要求
1. 提供關於${topic}的背景信息
2. 分析主要問題和挑戰
3. 探討可能的解決方案
4. 總結關鍵見解

請確保內容專業、準確，並提供有價值的見解。
`;
  
  return {
    content: [{
      type: "text",
      text: generatedPrompt
    }]
  };
}