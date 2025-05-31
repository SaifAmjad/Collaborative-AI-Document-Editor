const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: process.env.BASE_URL,
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
