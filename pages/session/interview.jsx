import React,{useEffect,useState} from 'react';
import VoiceInterviewer from '../../components/VoiceInterviewer';
import WebcamCapture from '../../components/WebcamCapture';
import FocusDetection from '../../components/FocusDetection';
import ObjectDetection from '../../components/ObjectDetection';
import dbConnect from '../../lib/db';
import Question from '../../models/Question';

export default function Interview({initialQuestions, sessionId}){
  const [questions,setQuestions]=useState(initialQuestions||[]);

  const handleAnswerEvaluated=data=>{
    console.log('Answer evaluated:',data);
    // update integrity score if needed
  };

  return(
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Session</h2>
      <div className="flex gap-4">
        <div className="w-2/3">
          <VoiceInterviewer sessionId={sessionId} questions={questions} onAnswerEvaluated={handleAnswerEvaluated}/>
        </div>
        <div className="w-1/3 flex flex-col gap-2">
          <WebcamCapture sessionId={sessionId}/>
          <FocusDetection sessionId={sessionId}/>
          <ObjectDetection sessionId={sessionId}/>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({query}){
  await dbConnect();
  const { session_id }=query;
  const qDoc=await Question.findById(session_id);
  return { props:{ initialQuestions:qDoc?.questions||[], sessionId:session_id } };
}
