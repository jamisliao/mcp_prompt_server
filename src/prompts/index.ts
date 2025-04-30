/**
 * 提示詞模組
 * 定義並處理各種提示詞模板
 */

import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';

// 導入各種提示詞
import { developmentPrompt } from './development.js';
import { researchPrompt } from './research.js';
import { analyzePrompt } from './analyze.js';
import { codeReviewPrompt } from './code-review.js';

// 匯出所有提示詞
export const PROMPTS = {
  "development": developmentPrompt,
  "research": researchPrompt,
  "analyze": analyzePrompt,
  "code-review": codeReviewPrompt
};

/**
 * 處理提示詞渲染
 * @param promptName 提示詞名稱
 * @param args 提示詞參數
 */
export async function renderPrompt(promptName: string, args: any) {
  const promptHandlers: Record<string, (args: any) => Promise<any>> = {
    "development": renderDevelopmentPrompt,
    "research": renderResearchPrompt,
    "analyze": renderAnalyzePrompt,
    "code-review": renderCodeReviewPrompt
  };
  
  const handler = promptHandlers[promptName];
  if (!handler) {
    throw new McpError(ErrorCode.InvalidRequest, `未知提示詞: ${promptName}`);
  }
  
  return await handler(args);
}

/**
 * 開發提示詞渲染
 */
async function renderDevelopmentPrompt(args: any) {
  const task = args?.task || "未指定任務";
  const language = args?.language || "未指定語言";
  
  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "我已準備好協助您的開發工作。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `我需要你以資深軟體工程師的身份協助我完成以下開發任務：
          
任務描述: ${task}
程式語言: ${language}

請提供：
1. 詳細的解決方案設計
2. 完整且可執行的代碼
3. 代碼的詳細解釋
4. 潛在的優化和改進建議
5. 錯誤處理策略

請特別注意代碼的效能、可維護性和安全性。`
        }
      }
    ]
  };
}

/**
 * 研究提示詞渲染
 */
async function renderResearchPrompt(args: any) {
  const topic = args?.topic || "未指定主題";
  const depth = args?.depth || "medium";
  
  let depthInstructions = "";
  switch (depth) {
    case "basic":
      depthInstructions = "提供主題的基本概述和關鍵點";
      break;
    case "medium":
      depthInstructions = "提供深入分析和多角度的觀點";
      break;
    case "deep":
      depthInstructions = "提供專家級別的分析，包括技術細節和學術觀點";
      break;
  }
  
  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "我已準備好協助您進行研究。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `我需要您幫我研究以下主題: ${topic}

研究要求:
- ${depthInstructions}
- 提供清晰的結構和分類
- 包含最新的相關資訊
- 最後總結關鍵發現

請以專業研究員的身份進行這項工作。`
        }
      }
    ]
  };
}

/**
 * 分析提示詞渲染
 */
async function renderAnalyzePrompt(args: any) {
  const content = args?.content || "未提供內容";
  const aspectsArg = args?.aspects || "all";
  
  // 解析要分析的方面
  const aspects = aspectsArg === "all" 
    ? ["優點", "缺點", "機會", "威脅", "建議"]
    : aspectsArg.split(",").map((a: string) => a.trim());
  
  const aspectsText = aspects.map((a: string) => `- ${a}`).join("\n");
  
  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "我已準備好為您提供分析。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `請對以下內容進行全面分析：

===內容開始===
${content}
===內容結束===

請分析以下方面：
${aspectsText}

請提供具體細節和依據，並保持客觀專業的分析視角。`
        }
      }
    ]
  };
}

/**
 * 根據檔案擴展名判斷程式語言
 * @param filePath 檔案路徑
 * @returns 程式語言名稱
 */
function detectLanguageFromExtension(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  const extensionToLanguage: Record<string, string> = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React JSX',
    '.tsx': 'React TSX',
    '.py': 'Python',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.h': 'C/C++ Header',
    '.cs': 'CSharp',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.m': 'Objective-C',
    '.sql': 'SQL',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.sh': 'Shell',
    '.ps1': 'PowerShell',
    '.xml': 'XML',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.md': 'Markdown',
    '.r': 'R',
    '.pl': 'Perl',
    '.lua': 'Lua',
    '.dart': 'Dart',
    '.elm': 'Elm',
    '.ex': 'Elixir',
    '.exs': 'Elixir',
    '.erl': 'Erlang',
    '.hs': 'Haskell',
    '.fs': 'F#',
    '.fsx': 'F#',
    '.vb': 'Visual Basic',
    '.clj': 'Clojure',
    '.groovy': 'Groovy',
    '.tf': 'Terraform',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.proto': 'Protocol Buffers'
  };
  
  return extensionToLanguage[extension] || 'Unknown';
}

/**
 * 判斷是否為代碼檔案（根據擴展名）
 * @param filePath 檔案路徑
 * @returns 是否為代碼檔案
 */
function isCodeFile(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();
  
  // 排除的擴展名
  const excludedExtensions = [
    '', // 無擴展名
    '.md', '.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.ico',
    '.mp3', '.mp4', '.avi', '.mov', '.wmv',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.exe', '.dll', '.so', '.dylib',
    '.log', '.lock', '.bak', '.tmp', '.swp'
  ];
  
  return !excludedExtensions.includes(extension);
}

/**
 * 遞歸獲取目錄下的所有代碼檔案
 * @param dirPath 目錄路徑
 * @param maxFiles 最大檔案數量
 * @param recursive 是否遞歸搜索子目錄
 * @returns 檔案路徑數組
 */
async function getCodeFilesFromDirectory(
  dirPath: string, 
  maxFiles: number = 20, 
  recursive: boolean = true
): Promise<string[]> {
  let result: string[] = [];
  
  // 讀取目錄內容
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  
  // 處理檔案
  for (const entry of entries) {
    // 如果已達到最大檔案數，停止處理
    if (result.length >= maxFiles) break;
    
    const fullPath = path.join(dirPath, entry.name);
    
    // 跳過隱藏檔案和目錄
    if (entry.name.startsWith('.')) continue;
    
    if (entry.isFile()) {
      // 如果是代碼檔案，添加到結果列表
      if (isCodeFile(fullPath)) {
        result.push(fullPath);
      }
    } else if (entry.isDirectory() && recursive) {
      // 如果是目錄且啟用了遞歸，遞歸處理
      const subDirFiles = await getCodeFilesFromDirectory(
        fullPath, 
        maxFiles - result.length, // 更新剩餘檔案數量
        recursive
      );
      result = result.concat(subDirFiles);
    }
  }
  
  return result;
}

/**
 * 程式碼審查提示詞渲染
 */
async function renderCodeReviewPrompt(args: any) {
  const filePath = args?.filePath;
  if (!filePath) {
    throw new McpError(ErrorCode.InvalidRequest, "必須提供檔案路徑");
  }
  
  // 獲取審查重點，默認設為代碼質量、效能優化、安全性和最佳實踐
  const focus = args?.focus || "code-quality,performance,security,best-practices";
  
  // 判斷 filePath 是檔案還是目錄
  let stats: fs.Stats;
  try {
    stats = await fs.promises.stat(filePath);
  } catch (error) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `無法訪問路徑: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  // 根據 filePath 是檔案還是目錄生成不同的提示詞
  if (stats.isFile()) {
    // 單個檔案的情況
    return await renderSingleFileReview(filePath, focus);
  } else if (stats.isDirectory()) {
    // 目錄的情況
    return await renderDirectoryReview(filePath, focus);
  } else {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `提供的路徑既不是檔案也不是目錄: ${filePath}`
    );
  }
}

/**
 * 單個檔案的程式碼審查
 */
async function renderSingleFileReview(filePath: string, focus: string) {
  // 讀取檔案內容
  let code: string;
  try {
    code = await fs.promises.readFile(filePath, 'utf8');
  } catch (error) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `無法讀取檔案: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  // 根據檔案擴展名判斷程式語言
  const language = detectLanguageFromExtension(filePath);
  
  // 解析審查重點
  const focusAreas = focus === "all" 
    ? ["代碼質量", "效能優化", "安全性", "可讀性", "錯誤處理", "設計模式", "最佳實踐"]
    : focus.split(",").map((f: string) => f.trim());
  
  const focusText = focusAreas.map((f: string) => `- ${f}`).join("\n");
  
  // 獲取檔案名稱
  const fileName = path.basename(filePath);
  
  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "我已準備好為您進行代碼審查。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `請對以下${language}檔案進行專業審查：

檔案名稱: ${fileName}
路徑: ${filePath}

\`\`\`${language}
${code}
\`\`\`

請重點關注以下方面：
${focusText}

請提供：
1. 代碼問題與改進建議
2. 高質量的修改方案
3. 最佳實踐建議
4. 優化思路

請以資深開發工程師的角度給出專業、實用的建議。`
        }
      }
    ]
  };
}

/**
 * 目錄的程式碼審查
 */
async function renderDirectoryReview(dirPath: string, focus: string) {
  // 獲取目錄下的所有代碼檔案
  const maxFilesToAnalyze = 15; // 設定一個合理的上限
  const codeFiles = await getCodeFilesFromDirectory(dirPath, maxFilesToAnalyze, true);
  
  if (codeFiles.length === 0) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `在目錄 ${dirPath} 中沒有找到任何代碼檔案`
    );
  }
  
  // 解析審查重點
  const focusAreas = focus === "all" 
    ? ["代碼質量", "效能優化", "安全性", "可讀性", "錯誤處理", "設計模式", "最佳實踐"]
    : focus.split(",").map((f: string) => f.trim());
  
  const focusText = focusAreas.map((f: string) => `- ${f}`).join("\n");
  
  // 為每個檔案讀取內容
  const filesContent: { path: string; name: string; language: string; code: string }[] = [];
  
  for (const filePath of codeFiles) {
    try {
      const code = await fs.promises.readFile(filePath, 'utf8');
      const language = detectLanguageFromExtension(filePath);
      const fileName = path.basename(filePath);
      const relativePath = path.relative(dirPath, filePath);
      
      filesContent.push({
        path: relativePath,
        name: fileName,
        language,
        code
      });
    } catch (error) {
      // 如果某個檔案讀取失敗，記錄錯誤但繼續處理其他檔案
      process.stderr.write(`警告: 無法讀取檔案 ${filePath}: ${error}\n`);
    }
  }
  
  // 構建代碼審查提示詞
  let fileListText = filesContent.map((file, index) => 
    `${index + 1}. ${file.path} - ${file.language}`
  ).join("\n");
  
  let filesCodeText = filesContent.map(file => 
    `===== 檔案: ${file.path} =====\n\n\`\`\`${file.language}\n${file.code}\n\`\`\``
  ).join("\n\n");
  
  // 目錄名稱
  const dirName = path.basename(dirPath);
  
  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "我已準備好為您進行目錄的代碼審查。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `請對以下目錄中的代碼進行全面審查：

目錄名稱: ${dirName}
目錄路徑: ${dirPath}

檔案清單 (共 ${filesContent.length} 個檔案):
${fileListText}

請重點關注以下方面：
${focusText}

以下是所有檔案的代碼：

${filesCodeText}

請提供：
1. 整體代碼庫的評價與架構分析
2. 各檔案的主要問題與改進建議
3. 代碼一致性和最佳實踐檢查
4. 跨檔案的優化機會
5. 安全性與效能問題

請以資深開發工程師的角度給出專業、實用的審查報告。`
        }
      }
    ]
  };
}