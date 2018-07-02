import React, { Component } from 'react';
import './App.css';
import {SpeechRecognition,speechSynthesis,SpeechSynthesisUtterance} from './SpeechRecognition';



class SpeechComponent extends Component
{
recognition = new SpeechRecognition();

componentWillMount = () =>{
  this.recognition.lang = 'en-US';
  this.recognition.interimResults = false;
  this.recognition.maxAlternatives = 1;

  this.recognition.onresult = (event) => {
    var last = event.results.length - 1;
    var recognised = event.results[last][0].transcript;
    //console.log(event.results[last][0]);
    console.log('recognised : '+recognised+'\n Confidence: ' + event.results[0][0].confidence);
    this.props.callback(recognised,event.results[0][0].confidence);
  }
  this.recognition.onend = function() {
    console.info("voice recognition ended...");
}

}
componentDidMount =() =>{
  this.Speak(this.props.label);
  this.props.allowRecognition(this.startRecognition); 
  this.startRecognition();
}
componentDidUpdate = () =>{
  this.Speak(this.props.label);
}

startRecognition = () => {
  this.recognition.start();
  console.log('Ready to receive a  command.');
}

Speak=(text) => {
  var synth = speechSynthesis;
  var utterThis = new SpeechSynthesisUtterance(text);
  synth.speak(utterThis);
}

  render()
  {
    return(
    <div className="controls">
        {this.props.label}
    </div>
  );}
}

class App extends Component {
  state={label:`which of these cuties will be your starter pokemon ! \n will it be squirtle? charmander? or bulbasaur? `,
        responses:["squirtle","charmander","bulbasaur"]};
  startRecognition=()=>{console.log("undefined recognition")}
  userSays=(words,confidence)=>{
    if(this.state.responses.indexOf(words)===-1)
    {
      this.setState({label:`I'm not sure i understand,  "${words}" is not a valid choice! \n just speak the pokemon's name.`});
      setTimeout(this.startRecognition,500);
    }else{
      this.setState({label:` "${words}" is a great choice !`});
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
      <SpeechComponent label={this.state.label} callback={this.userSays} allowRecognition={startRecognition => this.startRecognition =startRecognition}></SpeechComponent>
      <button onClick={this.startRecognition}> Text</button>
      </div>
    );
  }
}

export default App;
