import React, { Component } from 'react';
import SpeechComponent from "./SpeechComponent"
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
import {pokemonData,canEscape} from "./pokemon";
import './App.css';

function intersect(a, b) {
  return [...new Set(a)].filter(x => new Set(b).has(x));
}


class App extends Component {
  
  
  sysResponses=[
  // choose starter
  (response) => {
    this.setState({label:` "${response}" is a great choice ! ,say "I choose you" to proceed`,
    responses: ["i choose you"],
    invalid:`do you want to continue with ${response}?`,
    invalidResponses:["yes","no"],
    pokemon:response,
    respond:this.sysResponses[1],
    });
    
  },
  //confirm starter
  (response) => {
    if(response === "i choose you" || response === "yes" )
    {
        var opponent="";
        // create user pokemon object and opponent pokemon object
        if(this.state.pokemon==="bulbasaur"){opponent="charmander"}
        if(this.state.pokemon==="charmander"){opponent="squirtle"}
        if(this.state.pokemon==="squirtle"){opponent="bulbasaur"}

        this.setState({label:` "${this.state.pokemon}" is now yours ! would you like to take ${this.state.pokemon} for a battle?`,
        responses: ["yes" , "no"],
        invalid:`Do you want to battle with ${this.state.pokemon}? say yes or no `,
        invalidResponses:[],
        respond:this.sysResponses[2],
        opponent:opponent,
        userPokemon:pokemonData[this.state.pokemon](),
        opponentPokemon:pokemonData[opponent](),
        });

        //test the pokemon fights
        //console.log(JSON.stringify(this.state.userPokemon) +"\n"+JSON.stringify(this.state.opponentPokemon));
        //console.log(this.state.userPokemon.moves.doubleEdge.apply(this.state.userPokemon,this.state.opponentPokemon))
        //console.log(JSON.stringify(this.state.userPokemon) +"\n"+JSON.stringify(this.state.opponentPokemon));

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
    //go to first battle
    if(response ==="yes")
      {
      setTimeout(()=>{this.history.push( `${process.env.PUBLIC_URL}/battle/${this.state.pokemon}`);},1000);
      this.setState({    
          heading:" Wild Encounter!",
          label:` you have found a wild pokemon ! do you want to [fight] or [run] ? `,
          responses: ["fight","run"],
          invalid:`say [fight] or [run] !`,
          invalidResponses:[],
          respond:this.sysResponses[3],
          });
        }
      else if(response ==="no"){
        this.setState({
        heading:" Wild Encounter!",
        label:` you are attacked by a wild pokemon ! do you want to [fight] or [run] ? `,
        responses: ["fight","run"],
        invalid:`say [fight] or [run] !`,
        invalidResponses:[],
        respond:this.sysResponses[3],
        });  
       }
  },
  (response) =>{
    
    let userMoves=[];
    let firstAttacker= this.state.userPokemon.speed > this.state.opponentPokemon.speed  ? "user":"opponent" ;

    for (let move in this.state.userPokemon.moves)
    {
        userMoves.push(`${this.state.userPokemon.moves[move].name}`);
    }
    console.log(userMoves)
    if (response ==="fight"){
    if(firstAttacker ==="opponent")
    {
      this.opponentAttack();
      this.setState({
        heading:" Battle !",
        responses: [...userMoves],
        invalid:`command the pokemon by saying the "move-name" `,
        invalidResponses:[],
        respond:this.sysResponses[4],
        });  
 
    }else{
      this.setState({
        heading:" Battle !",
        label:`${this.state.pokemon} looks ready to battle, what should ${this.state.pokemon}  do?`,
        responses: [...userMoves],
        invalid:`command the pokemon by saying the "move-name"`,
        invalidResponses:[],
        respond:this.sysResponses[4],
        });  
      }
    
   
   } else if (response ==="run"){
     if(canEscape(this.state.userPokemon,this.state.opponentPokemon,(this.state.escapeTryCount+1)))
     {
      let newHp=this.state.userPokemon.hp+Math.floor( (0.3+Math.random()) * this.state.userPokemon.maxhp );
      newHp= newHp>this.state.userPokemon.maxhp ? this.state.userPokemon.maxhp : newHp;
      let fauxuserPokemon=pokemonData[this.state.pokemon]();
      fauxuserPokemon.hp =newHp;

      this.setState({
        label:"escaped successfully!",
        userPokemon:fauxuserPokemon,
      });
      this.reset();
     }
     else{
      this.setState({
        heading:" Battle !",
        label:`${this.state.pokemon} could not flee the battle, what should ${this.state.pokemon}  do?`,
        responses: [...userMoves],
        invalid:`command the pokemon by saying the "move-name" `,
        invalidResponses:[],
        respond:this.sysResponses[4],
        });  
     /*  if(firstAttacker === "opponent")
      {
        this.opponentAttack();
        this.setState({
          heading:" Battle !",
          responses: [...userMoves],
          invalid:`command the pokemon by saying the "move-name" `,
          invalidResponses:[],
          respond:this.sysResponses[4],
          });   
  
      }
      else{
      this.setState({
      heading:" Battle !",
      label:`${this.state.pokemon} could not flee the battle, what should ${this.state.pokemon}  do?`,
      responses: [...userMoves],
      invalid:`command the pokemon by saying the "move-name" `,
      invalidResponses:[],
      respond:this.sysResponses[4],
      });   
      } */
     }
    
   }
  },

  (response) =>{
    // get move name
    let moveName;
    if(response.split(" ").length ===2)
      moveName= response.split(" ")[0] +response.split(" ")[1].charAt(0).toUpperCase() + response.split(" ")[1].slice(1);
    else
      moveName= response.split(" ")[0];
    if(this.battlecheck())
      this.userAttack(moveName);

  },

  (response) =>{
    console.log("empty state");
  },
  (response) =>{
    console.log("empty state");
  },
  ];

  userAttack=(moveName)=>{
    let results=this.state.userPokemon.moves[moveName].apply(this.state.userPokemon,this.state.opponentPokemon);
    this.setState({label:`${this.state.pokemon} used ${moveName} `,
    invalid:`command the pokemon by saying the "move-name" `,
    invalidResponses:[],
    respond:this.sysResponses[4],
    }); 
    if(results.isCrit)
    {
      setTimeout(()=>{
        this.setState({label:`A critical hit!`})
        this.speak(this.state.label);
        setTimeout(()=>{
            this.battle();
        },2000);
        },2000);
    }
    else{
      setTimeout(()=>{
          this.battle();
      },2000);
    }
  }
  opponentAttack=()=>{
    let oppmoves = [];
    for (let move in this.state.opponentPokemon.moves)
  {
      oppmoves.push(this.state.opponentPokemon.moves[move]);
  }
    let oppMoveName=oppmoves[Math.floor(Math.random() * oppmoves.length)];
    console.log(oppMoveName);
    let result=oppMoveName.apply(this.state.opponentPokemon,this.state.userPokemon);
    let crittext="",whatdo="";
    if(result.isCrit)
    { 
      crittext=", it was a critical hit!";
    }

    if(this.state.userPokemon.hp>0)
    {
      whatdo=`, what will ${this.state.pokemon} do`; 

      this.setState({label:`Wild ${this.state.opponent} used ${oppMoveName.name} ${crittext} ${whatdo}`});
      this.speak(this.state.label);
    }
    else{
      this.setState({label:`Wild ${this.state.opponent} used ${oppMoveName.name} ${crittext} ${whatdo}`});
      this.speak(this.state.label);  
    }

    setTimeout(()=>{this.battlecheck()},2000);


  }
  reset=()=>{
    setTimeout(()=>{
      let opponents=["bulbasaur","squirtle","charmander"];
      let opponent=opponents[Math.floor(Math.random()*opponents.length)];

      this.setState(
        {
        heading:" Wild Encounter!",
        label:` you are attacked by a wild pokemon ! do you want to [fight] or [run] ? `,
        responses: ["fight","run"],
        invalid:`say [fight] or [run] !`,
        invalidResponses:[],
        respond:this.sysResponses[3],
      opponent:opponent,
      opponentPokemon:pokemonData[opponent](),
      });
      this.speak(this.state.label);
    },3000);
  }
  battlecheck=()=>{
    if(this.state.opponentPokemon.hp<1) 
    {
      let newHp=this.state.userPokemon.hp+Math.floor( (0.1+Math.random()*0.5) * this.state.userPokemon.maxhp );
      newHp= newHp>this.state.userPokemon.maxhp ? this.state.userPokemon.maxhp : newHp;
      let fauxuserPokemon=this.state.userPokemon;
      fauxuserPokemon.hp =newHp;
      //progress further
      this.reset();
      this.setState({    
          heading:" You Won!",
          wins:this.state.wins+1,
          escapeTryCount:0, // reset escape probability
          label:`Wild ${this.state.opponent} fainted.`,
          responses: [],
          invalid:`you have won!`,
          invalidResponses:[],
          respond:(response)=>{console.log(response);},
          });
        
      this.setState({});
      this.speak(this.state.label);
      return false;
    } 
     // lose logic
     else if(this.state.userPokemon.hp<1) 
      {
         this.setState({    
          heading:" Defeated!",
          label:`${this.state.pokemon} fainted! you have lost! do you want to restart ?`,
          responses: ["yes","no"],
          invalid:`you have lost!`,
          invalidResponses:[],
          respond:(response)=>{
            if(response==="yes")
            {
              this.setState({
                heading:" Select starter Pokemon !",
                label:`which of these cuties will be your starter pokemon !`,
                responses:["squirtle","charmander","bulbasaur"],
                invalid:"will it be squirtle? charmander? or bulbasaur? , just speak the pokemon's name.",
                invalidResponses:[],
                pokemon:"",
                respond:this.sysResponses[0],
                });
              this.history.push(process.env.PUBLIC_URL +`/`);
            }
            else if(response==="no"){
              this.setState({
                heading:" Thank you for playing !",
                label:`Thank you for playing !`,
                responses:[],
                invalid:" reload the page to play again !",
                invalidResponses:[],
                pokemon:"",
                respond:(response)=>{console.log(response)},
                });
              this.history.push(process.env.PUBLIC_URL +`/`);
            }
          },
         });
       
       this.speak(this.state.label);
       return false;
      }
     return true;
  }

  battle=()=>{
    let res= this.battlecheck();
    console.log(res);
  if( res && this.state.opponentPokemon.hp>0) 
    {
      this.opponentAttack();
    } 

  };
  //initial state
  state={
        heading:" Select starter Pokemon !",
        label:`which of these cuties will be your starter pokemon !`,
        responses:["squirtle","charmander","bulbasaur"],
        invalid:"will it be squirtle? charmander? or bulbasaur? , just speak the pokemon's name.",
        invalidResponses:[],
        pokemon:"",
        wins:0,
        escapeTryCount:0,
        respond:this.sysResponses[0],
        };
 
  //testing
  /* 
  state={ 
    heading:" Battle !",
    label:` you are attacked by a wild pokemon ! do you want to [fight] or [run] ? `,
    responses: ["fight","run"],
    invalid:`say [fight] or [run] !`,
    invalidResponses:[],
    respond:this.sysResponses[3],
    pokemon:"squirtle",
    opponent:"squirtle",
    userPokemon:pokemonData["squirtle"](),
    opponentPokemon:pokemonData["squirtle"](),
  } */

  startRecognition=()=>{console.log("undefined recognition")}
  speak=()=>{console.log("undefined speak")}
  announce=()=>{console.log("undefined announce")}

  start=setTimeout(()=>{this.speak(this.state.label)},1000);

  userSays=(words,confidence)=>{
    words=words.map(word => word.toLowerCase());
    let commonWords =intersect(this.state.responses,words);
    console.log(commonWords);
    if(commonWords.length === 0)//this.state.responses.indexOf(words)===-1)
    {
      //invalid response
      if(this.state.invalidResponses.length>0)
      {
        this.setState({label:`I'm not sure i understand  "${words[0]}", ${this.state.invalid}`,
                       responses:this.state.invalidResponses});
      }
      this.setState({label:`I'm not sure i understand  "${words[0]}", ${this.state.invalid}`});

    }else{
      //valid response so use callback to generate reply
      this.state.respond(commonWords[0]);
    } 

    this.speak(this.state.label);
    console.log(`words ${words} with confidence ${confidence}`);

  }

  render() {
    return (
      <div >
        <div className="visualscontainer">
            <h2 className="headingtext">{this.state.heading} <div>{process.env.PUBLIC_URL}</div></h2>
            <Router>
              <div>
                <Routechanger ghistory={(history) =>{  this.history = history;}}/>
                < Route exact path={process.env.PUBLIC_URL + "/"} component={StarterChooser} />
                < Route path={process.env.PUBLIC_URL + "/battle/:pokemon"} render={ routeProps =>  <Battle {...routeProps} user={this.state.pokemon} opponent={this.state.opponent} pokemon={{user:this.state.userPokemon,opponent:this.state.opponentPokemon}} moves={this.state.userPokemon.moves}/>} />
              </div>
            </Router>

        </div>
        <SpeechComponent label={this.state.label} 
        recognitionCallback={this.userSays} 
        allowRecognition={startRecognition => {this.startRecognition =startRecognition} } 
        allowSpeak={Speak => {this.speak =Speak;}}
        allowAnnounce={Announce => {this.announce =Announce;}}>
        </SpeechComponent>

      </div>

    );
  }
}

function StarterChooser()
{
  return (
<div className="chooser">
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
  );
}

 const Routechanger = withRouter((props,history)=>
{
  props.ghistory(props.history);
  return ("");
})

function Battle(props)
{
  let movelist =Object.keys(props.moves);
  movelist=movelist.map(
    function(name, index){
     let seperate = name.replace( /([A-Z])/g, " $1" ).toLowerCase(); // seperate move name
     let finalmove = seperate.charAt(0).toUpperCase() + seperate.slice(1); // capitalize the first letter 
     return finalmove;
  })
  console.log(movelist);

  let userHPwidth= (props.pokemon.user.hp/props.pokemon.user.maxhp);
  let opponentHPwidth= (props.pokemon.opponent.hp/props.pokemon.opponent.maxhp);
  console.log(props.pokemon.opponent.hp/props.pokemon.opponent.maxhp);
  return (
    <div> 
    <div className="battle">
          
          <div className="battle__opponent">
                <img className={`battle__pokemon--opponent ${props.opponent}`} src={`${process.env.PUBLIC_URL}/images/${props.opponent}_front.png`} alt={`${props.opponent}`}/>
          </div>
          <div className="battle__user">
                <img className={`battle__pokemon--user ${props.user}`} src={`${process.env.PUBLIC_URL}/images/${props.user}_back.png`} alt={`${props.user}`}/>
          </div>
       
          <div className="battle__userhud">
            <div className="battle__hudname">{props.user.charAt(0).toUpperCase() + props.user.slice(1)}</div>
            <div className="battle__hudlvl">lv100</div>
            <div className="battle__hudhp">
              <div className="battle__hudhptext">HP</div>
              <div className="battle__hudhpbar" style={{width:`calc( (100vw - 266px) * ${userHPwidth})`}}></div>
            </div>
            <div className="battle__hudhpvalue">{props.pokemon.user.hp}/{props.pokemon.user.maxhp}</div>

          </div>
          <div className="battle__opponenthud">
            <div className="battle__hudname">{props.opponent.charAt(0).toUpperCase() + props.opponent.slice(1)}</div>
              <div className="battle__hudlvl">lv100</div>
              <div className="battle__hudhp">
                <div className="battle__hudhptext">HP</div>
                <div className="battle__hudhpbar" style={{width:`calc( (100vw - 266px) * ${opponentHPwidth})`}}></div>
              </div>
          </div>
    </div> 
    <div className="moves">
        <div className="moves__hint"> {props.user}'s moves :</div> 
          {
            movelist.map(function(name, index){
                    return <div className={`moves__move${index+1}`} key={ index }>{name}</div>;
                  })
          }
    </div> 
    </div> 
  );
}
//      `this is battle with => {props.match.params.pokemon}`

export default App;
