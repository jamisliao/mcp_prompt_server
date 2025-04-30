/**
 * 開發提示詞配置
 */

export const developmentPrompt = {
  name: "development",
  description: "獲取針對軟體開發任務的專業指導",
  arguments: [
    {
      name: "task",
      description: "開發任務的描述",
      required: true
    },
    {
      name: "language",
      description: "使用的程式語言",
      required: true
    }
  ]
};