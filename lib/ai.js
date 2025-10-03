import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function generateQuestions({ role, skills, experience, num = 6 }) {
  const prompt = `You are an interview generator.
Generate ${num} questions for a ${role} with ${experience} experience.
Focus on these skills: ${skills.join(', ')}.
Output JSON array [{id, type(mcq|open|coding), text, difficulty}].`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Structured interview questions generator' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    })
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  try { return JSON.parse(text); } catch(e) {
    const match = text.match(/(\[.*\])/s);
    if(match) return JSON.parse(match[1]);
    throw new Error('OpenAI did not return valid JSON questions.');
  }
}

export async function evaluateAnswer({ question, answer }) {
  const prompt = `You are a strict interviewer/assessor.
Question: ${question}
Candidate Answer: ${answer}
Provide JSON: {score:0-100, feedback:"short", details:"detailed reasoning"}.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'Objective grading' }, { role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 600
    })
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  try { return JSON.parse(text); } catch(e) {
    const match = text.match(/\{.*\}/s);
    if(match) return JSON.parse(match[0]);
    return { score:0, feedback:text.slice(0,300), details:text };
  }
}
