import axios from "axios";

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";
const HF_API_TOKEN = `Bearer ${process.env.HF_API_TOKEN}`;

export async function askLibraryAssistant(question: string) {
  const payload = {
    inputs: `### Instruction:\n${question}\n\n### Response:`,
    parameters: {
      max_new_tokens: 200,
      temperature: 0.7,
    },
  };

  try {
    const res = await axios.post(HF_API_URL, payload, {
      headers: {
        Authorization: HF_API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    console.log("HuggingFace raw response:", res.data);

    if (Array.isArray(res.data) && res.data[0]?.generated_text) {
      const output = res.data[0].generated_text;
      const answer = output.split("### Response:")[1]?.trim();
      return answer || "Xin lỗi, tôi chưa có câu trả lời phù hợp.";
    }

    if (res.data?.error) {
      console.error("HuggingFace error:", res.data.error);
      return `Model hiện chưa sẵn sàng: ${res.data.error}`;
    }

    return "Phản hồi không hợp lệ từ AI.";
  } catch (err: any) {
    console.error("AI error:", err.response?.data || err.message);
    return "Đã xảy ra lỗi khi gọi Hugging Face.";
  }
}
