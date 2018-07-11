import React, { Component } from 'react';
import {SpeechRecognition,speechSynthesis,SpeechSynthesisUtterance} from './SpeechRecognition';

class SpeechComponent extends Component
{

state={recognitionEnded:false,speaking:false,lastSpoken:""}
recognition = new SpeechRecognition();
synth = speechSynthesis;
utterThis = new SpeechSynthesisUtterance("");

componentWillMount = () =>{
  this.recognition.lang = 'en-US';
  this.recognition.interimResults = false;
  this.recognition.maxAlternatives = 10;

  this.recognition.onresult = (event) => {
    let last = event.results.length - 1;
    let recognised = event.results[last];
    let simplifiedResults=[];
    for (let x of recognised)
    {
      simplifiedResults.push(x.transcript)
    }
    console.log(simplifiedResults);

    console.log('recognised : '+simplifiedResults+'\n Confidence: ' + event.results[0][0].confidence);
    this.props.recognitionCallback(simplifiedResults,event.results[0][0].confidence);
  }
  this.recognition.onend = () => {
    console.info("voice recognition ended...");
    this.setState({listening:false})
  }
}

componentDidMount =() =>{
  this.props.allowSpeak(this.Speak); 
  this.props.allowRecognition(this.startRecognition); 
  this.props.allowAnnounce(this.Announce);
}


startRecognition = () => {
  if(!this.state.listening)
    {
    this.recognition.start();
    this.setState({listening:true})
    console.log('Ready to receive a  command.');
  }
}

Speak=(text) => {
  if(text !== this.state.lastSpoken)
  {
  this.utterThis = new SpeechSynthesisUtterance(text);
  this.synth.speak(this.utterThis);
  this.setState({speaking:true,lastSpoken:text})
  this.utterThis.onend = () =>{ 
    console.info("speech ended...");
    this.setState({speaking:false})
    this.startRecognition();
  }
  }
}

Announce=(text)=>{
  if(text !== this.state.lastSpoken)
  {
  this.utterThis = new SpeechSynthesisUtterance(text);
  this.synth.speak(this.utterThis);
  this.setState({speaking:true,lastSpoken:text})
  this.utterThis.onend = () =>{ 
    console.info("speech ended...");
    this.setState({speaking:false})
  }
  }
}

  render()
  {
    let button1;
    if(!this.state.listening && !this.state.speaking)
     button1= <div className="listen"><button className="listen__button fas fa-microphone" onClick={this.startRecognition}> </button></div>;
    if(this.state.listening && !this.state.speaking)
      button1= <div className="listen--listening"><span className="fas fa-microphone"></span></div>;
    else if (this.state.speaking)
      button1= <div className="listen--speaking"><span className="fas fa-volume-up"></span></div>;

    return(
    <div className="controls">
        {button1}
        <div className="controls__text">{this.props.label}</div>
    </div>
  );}
}

export default SpeechComponent;