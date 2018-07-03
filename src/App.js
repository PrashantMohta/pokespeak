import React, { Component } from 'react';
import './App.css';
import {SpeechRecognition,speechSynthesis,SpeechSynthesisUtterance} from './SpeechRecognition';



class SpeechComponent extends Component
{

state={recognitionEnded:false,speaking:false}
recognition = new SpeechRecognition();
synth = speechSynthesis;
utterThis = new SpeechSynthesisUtterance("");

componentWillMount = () =>{
  this.recognition.lang = 'en-US';
  this.recognition.interimResults = false;
  this.recognition.maxAlternatives = 1;

  this.recognition.onresult = (event) => {
    var last = event.results.length - 1;
    var recognised = event.results[last][0].transcript;
    //console.log(event.results[last][0]);
    console.log('recognised : '+recognised+'\n Confidence: ' + event.results[0][0].confidence);
    this.props.recognitionCallback(recognised,event.results[0][0].confidence);
  }
  this.recognition.onend = () => {
    console.info("voice recognition ended...");
    this.setState({recognitionEnded:true})
  }
}

componentDidMount =() =>{
  this.props.allowSpeak(this.Speak); 
  this.props.allowRecognition(this.startRecognition); 
  //this.Speak(this.props.label);
  //this.startRecognition();
}
//componentDidUpdate = () =>{
  //this.Speak(this.props.label);
//}

startRecognition = () => {
  this.recognition.start();
  this.setState({recognitionEnded:false})
  console.log('Ready to receive a  command.');
}

Speak=(text) => {
  this.utterThis = new SpeechSynthesisUtterance(text);
  this.synth.speak(this.utterThis);
  this.setState({speaking:true})
  this.utterThis.onend = () =>{ 
    console.info("speech ended...");
    this.setState({speaking:false})
    this.startRecognition();
  }
}

  render()
  {
    let button1;
    if(this.state.recognitionEnded && !this.state.speaking)
    button1= <button onClick={this.startRecognition}> restart recognition </button>;
    
    return(
    <div className="controls">
        {this.props.label}
        {button1}
    </div>
  );}
}

class App extends Component {
  state={label:`which of these cuties will be your starter pokemon ! \n will it be squirtle? charmander? or bulbasaur? `,
        responses:["squirtle","charmander","bulbasaur"]};

  startRecognition=()=>{console.log("undefined recognition")}
  speak=()=>{console.log("undefined speak")}

  start=setTimeout(()=>{this.speak(this.state.label)},500);
  userSays=(words,confidence)=>{
    if(this.state.responses.indexOf(words)===-1)
    {
      this.setState({label:`I'm not sure i understand,  "${words}" is not a valid choice! \n just speak the pokemon's name.`});
      this.speak(this.state.label)
    }else{
      this.setState({label:` "${words}" is a great choice !`});
      this.speak(this.state.label)
    }
    console.log(`words ${words} with confidence ${confidence}`);
  }

  render() {
    return (
      <div >
        
      <h2 className="headingtext"> Choose your pokemon !</h2>
      <div className="Chooser">
        <div className="chooser__bulbasaur">
            <img className="pokemon bulbasaur" src="images/bulbasaur_front.png" alt="bulbasaur"/>
        </div>
        <div className="chooser__squirtle">
          <img className="pokemon squirtle" src="images/squirtle_front.png" alt="bulbasaur"/>
        </div>
        <div className="chooser__charmander">
          <img className="pokemon charmander" src="images/charmander_front.png" alt="bulbasaur"/>
        </div>
      </div>

      <SpeechComponent label={this.state.label} 
      recognitionCallback={this.userSays} 
      allowRecognition={startRecognition => {this.startRecognition =startRecognition} } 
      allowSpeak={Speak => {this.speak =Speak;}}>
      </SpeechComponent>
      <button onClick={()=>{this.speak(this.state.label)}}>speak</button>

      </div>
      
    );
  }
}

export default App;
