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
    this.setState({listening:false})
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
  this.setState({listening:true})
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

class App extends Component {

  sysResponses=[
  // choose starter
  (response) => {
    this.setState({label:` "${response}" is a great choice ! ,say "I choose you" to proceed`,
    responses: ["I choose you"],
    invalid:`do you want to continue with ${response}?`,
    invalidResponses:["yes","no"],
    pokemon:response,
    respond:this.sysResponses[1],
    });
  },
  //confirm starter
  (response) => {
    if(response === "I choose you" || response === "yes" )
    {
        // next screen
        this.setState({label:` "${this.state.pokemon}" is now yours ! `,
        responses: [""],
        invalid:``,
        invalidResponses:[""],
        respond:this.sysResponses[2],
        });
        // open next part of the component in x seconds
    }
    else if (response ==="no")
    {
      // go back to initial state
      this.setState({
        label:`which of these cuties will be your starter pokemon !`,
        responses:["squirtle","charmander","bulbasaur"],
        invalid:"will it be squirtle? charmander? or bulbasaur? , just speak the pokemon's name.",
        invalidResponses:[],
        pokemon:"",
        respond:this.sysResponses[0],
        })
    }
  },
  (response) =>{
    console.log("empty state");
    this.setState({label:`  ! `,
        responses: [],
        invalid:`?`,
        invalidResponses:[""],
        respond:this.sysResponses[3],
        });
  },
  (response) =>{
    console.log("empty state");
  },
  (response) =>{
    console.log("empty state");
  },
  (response) =>{
    console.log("empty state");
  },
  (response) =>{
    console.log("empty state");
  },
  ];

  //initial state
  state={
        label:`which of these cuties will be your starter pokemon !`,
        responses:["squirtle","charmander","bulbasaur"],
        invalid:"will it be squirtle? charmander? or bulbasaur? , just speak the pokemon's name.",
        invalidResponses:[],
        pokemon:"",
        respond:this.sysResponses[0],
        };

  startRecognition=()=>{console.log("undefined recognition")}
  speak=()=>{console.log("undefined speak")}

  start=setTimeout(()=>{this.speak(this.state.label)},1000);

  userSays=(words,confidence)=>{

    if(this.state.responses.indexOf(words)===-1)
    {
      //invalid response
      if(this.state.invalidResponses.length>0)
      {
        this.setState({label:`I'm not sure i understand  "${words}", ${this.state.invalid}`,
                       responses:this.state.invalidResponses});
      }
      this.setState({label:`I'm not sure i understand  "${words}", ${this.state.invalid}`});

    }else{
      this.state.respond(words);
    } 

    this.speak(this.state.label);
    console.log(`words ${words} with confidence ${confidence}`);

  }
//      <button onClick={()=>{this.speak(this.state.label)}}>speak</button>

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

      </div>

    );
  }
}

export default App;
