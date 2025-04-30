/**
 * 分析提示詞配置
 */

export const analyzePrompt = {
  name: "analyze",
  description: "對內容進行全面分析",
  arguments: [
    {
      name: "content",
      description: "需要分析的內容",
      required: true
    },
    {
      name: "aspects",
      description: "需要分析的方面，用逗號分隔，或'all'代表全部",
      required: false
    }
  ]
};