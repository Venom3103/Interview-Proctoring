import React,{useEffect,useRef,useState} from 'react';

export default function VoiceInterviewer({ sessionId, questions, onAnswerEvaluated }){
  const [speaking,setSpeaking]=useState(false);
  const [listening,setListening]=useState(false);
  const synthRef=useRef(window.speechSynthesis);
  const recognitionRef=useRef(null);
  const questionIndexRef=useRef(0);

  useEffect(()=>{
    if(!('webkitSpeechRecognition' in window)&&!('SpeechRecognition' in window)) return;
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SpeechRecognition();
    rec.continuous=false; rec.interimResults=false; rec.lang='en-US';
    rec.onresult=async e=>{
      const transcript=e.results[0][0].transcript;
      setListening(false);
      const curQ=questions[questionIndexRef.current]?.text || 'No question';
      const resp=await fetch('/api/ai-evaluate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:curQ,answerText:transcript,sessionId})});
      const data=await resp.json();
      onAnswerEvaluated && onAnswerEvaluated(data);
      speak(`Got it. ${data.result?.feedback||'Thank you.'}`);
      questionIndexRef.current++;
      if(questionIndexRef.current<questions.length) askQuestion(questions[questionIndexRef.current].text);
    };
    rec.onerror=err=>{ console.error(err); setListening(false); };
    recognitionRef.current=rec;
  },[questions]);

  const speak=text=>{
    if(!text) return;
    setSpeaking(true);
    const utter=new SpeechSynthesisUtterance(text);
    utter.onend=()=>setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const askQuestion=text=>{
    window.currentQuestionText=text;
    speak(text);
    const onEnd=()=>{ setListening(true); recognitionRef.current.start(); window.speechSynthesis.removeEventListener('end',onEnd); };
    window.speechSynthesis.addEventListener('end',onEnd);
  };

  return(
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Voice Interviewer</h3>
      <p>Speaking: {speaking?'yes':'no'} | Listening: {listening?'yes':'no'}</p>
      {questions.length>0 && <button className="btn" onClick={()=>askQuestion(questions[0].text)}>Start Interview</button>}
    </div>
  );
}
