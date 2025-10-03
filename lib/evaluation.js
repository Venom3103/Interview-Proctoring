import fetch from 'node-fetch';

export async function runCode({ code, language }) {
  const JUDGE0_URL = process.env.JUDGE0_URL;
  const JUDGE0_KEY = process.env.JUDGE0_KEY;

  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: { 'X-Auth-Token': JUDGE0_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_code: code, language_id: language })
  });

  const data = await res.json();
  return data; // contains stdout, stderr, status etc.
}
