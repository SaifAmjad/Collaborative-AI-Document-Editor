const { HfInference } = require("@huggingface/inference");
const OpenAI = require("openai");

// const hf = new HfInference("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");
// const openai = new OpenAI({ apiKey: "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" });

// const handleSuggestion = async (text, socket) => {
//   try {
//     const result = await hf.textGeneration({
//       model: "tiiuae/falcon-7b-instruct",
//       inputs: `There is a text from user which you should rephrase or suggest better sentence from it \n\nUser: ${text}\n\nAI:`,
//       parameters: { max_new_tokens: 100, temperature: 0.7, top_p: 0.9 },
//     });

//     socket.emit("suggestion_back",result);
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const handleSuggestionWithOpenAI = async (text, socket) => {
//     try {
//         const completion = await openai.completions.create({
//             model: "gpt-3.5-turbo",
//             inputs: `There is a text from user which you should rephrase or suggest better sentence from it. User: ${text}`,
//             max_tokens: 50,
//           });

//       socket.emit("suggestion_back",completion);
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   };

// module.exports={handleSuggestion,handleSuggestionWithOpenAI}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const reWriteAI = async (req, res) => {
  const { content } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
  messages: [
    {
      role: "user",
      content: `Rewrite this text only. Do not explain anything. Just return the Rewriten text:\n\n${content}`,
    },
  ],
    });

    return res
      .status(200)
      .json({ success: true, text: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Network Error" });
  }
};

const summarizeAI = async (req, res) => {
  const { content } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-30b-a3b:free",
      messages: [ 
        {
          role: "system",
          content:
            "Respond only with HTML body content that includes headings, bold, italic, lists, and paragraphs. Don't explain the content.",
        },
        {
          role: "user",
          content: `Format the following content with rich text (use h1, h2, bold, italic, lists, etc.):\n\n${content}`,
        },
      ],
    });

    return res
      .status(200)
      .json({ success: true, text: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Network Error" });
  }
};

const shortenAI = async (req, res) => {
  const { content } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-30b-a3b:free",
      messages: [
        {
          role: "user",
          content: `Shorten this text only. Do not explain anything. Just return the Shorten text:\n\n${content}`,
        },
      ],
    });

    return res
      .status(200)
      .json({ success: true, text: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Network Error" });
  }
};

const expandAI = async (req, res) => {
  const { content } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-30b-a3b:free",
      messages: [
        {
          role: "user",
          content: `Expand this text only. Do not explain anything. Just return the Expand text:\n\n${content}`,
        },
      ],
    });

    return res
      .status(200)
      .json({ success: true, text: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Network Error" });
  }
};

module.exports = { reWriteAI, summarizeAI, shortenAI, expandAI };
