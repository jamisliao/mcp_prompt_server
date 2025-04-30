/**
 * 代碼審查提示詞配置
 */

export const codeReviewPrompt = {
  name: "code-review",
  description: "獲取專業的代碼審查反饋",
  arguments: [
    {
      name: "filePath",
      description: "需要審查的代碼檔案路徑",
      required: true
    },
    {
      name: "focus",
      description: "審查重點，用逗號分隔，或'all'代表全部",
      required: false
    }
  ]
};