/**
 * 研究提示詞配置
 */

export const researchPrompt = {
  name: "research",
  description: "獲取深入的研究分析",
  arguments: [
    {
      name: "topic",
      description: "研究主題",
      required: true
    },
    {
      name: "depth",
      description: "研究深度 (basic, medium, deep)",
      required: false
    }
  ]
};