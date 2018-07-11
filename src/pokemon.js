
export const calcDamage=(p,a,d,iscrit,isstab)=>{
    var random =0.85+(0.15*Math.random());
    var stabvalue = isstab? 1.5 : 1;
    var crit = iscrit? 2:1;
    var effectivenessvalue=1;
    var m=1*crit*random*stabvalue*effectivenessvalue;
    return Math.floor((((42*p*a/d)/50)+2)*m);
  }
  export  const isCrit=(user,movemultiplier)=>{
    var p=(user.speed*movemultiplier)/(2*256);
    var cvalue=Math.random();
      return (cvalue<p);
  }
  export  const isStab=(user,move)=>{
      return (user.types.indexOf(move.type)>-1);
  }

  export  const canEscape=(user,opponent,times)=>{
    let result=(((user.speed*128)/opponent.speed)+(30*times))%256;
    console.log(result)
    return ((result)>Math.floor(Math.random()*256) )? true: false;
}
  
  export   const moveData={
      tackle:()=> {return ({name:"tackle",type:"normal",cat:"physical",power:40,accuracy:100,maxpp:35,
      apply:function (user,opponent)
          {
            console.log(this);
            var crit=1;
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
          }});},
      scratch:()=> {return ({name:"scratch",type:"normal",cat:"physical",power:40,accuracy:100,maxpp:35,
      apply:function(user,opponent)
          {
            var crit=1;
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
          }});},
    vineWhip:()=> {return ({name:"vine whip", type:"grass",cat:"physical",power:45,accuracy:100,maxpp:25,
      apply:function(user,opponent)
          {
            var crit=1; 
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
          }});},
    razorLeaf:()=> {return ({name:"razor leaf",type:"grass",cat:"physical",power:55,accuracy:95,maxpp:25,
      apply:function(user,opponent)
          {
            var crit=4;
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
          }});},
    doubleEdge:()=> {return ({name:"double edge",type:"normal",cat:"physical",power:120,accuracy:100,maxpp:15,
      apply:function(user,opponent)
          {
            var crit=1; 
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            console.log(dmg)
  
            opponent.hp-=dmg;
            user.hp-=Math.floor(0.33*dmg);
            return {damage:dmg,isCrit:iscrit};
          }});},
    ember:()=> {return ({name:"ember",type:"fire",cat:"special",power:40,accuracy:100,maxpp:25,
      apply:function(user,opponent)
          { 
            //burn chance 5% (? todo?)
            var crit=4; 
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.spatt,opponent.spdef,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
          }});},
    dragonRage:()=> {return ({name:"dragon rage",type:"dragon",cat:"special",power:0,accuracy:100,maxpp:10,
      apply:function(user,opponent)
          { 
            opponent.hp-=40;
            return {damage:40,isCrit:false};
          }});},
    slash:()=> {return ({name:"slash",type:"normal",cat:"physical",power:70,accuracy:100,maxpp:20,
      apply:function(user,opponent)
          {
            var crit=4;
  
            var iscrit=isCrit(user,crit); 
            var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
            opponent.hp-=dmg;
            return {damage:dmg,isCrit:iscrit};
                  }});},      
    waterGun:()=> {return ({name:"water gun",type:"water",cat:"special",power:40,accuracy:100,maxpp:25,
    apply:function(user,opponent)
        { 
          var crit=1; 
  
          var iscrit=isCrit(user,crit); 
          var dmg=calcDamage(this.power,user.spatt,opponent.spdef,iscrit,isStab(user,this));
          opponent.hp-=dmg;
          return {damage:dmg,isCrit:iscrit};
              }});},      
    bite:()=> {return ({name:"bite",type:"dark",cat:"physical",power:60,accuracy:100,maxpp:25,
    apply:function(user,opponent)
        { 
          var crit=1; 
          var iscrit=isCrit(user,crit); 
          var dmg=calcDamage(this.power,user.att,opponent.def,iscrit,isStab(user,this));
          opponent.hp-=dmg;
          return {damage:dmg,isCrit:iscrit};
              }});},     
    hydroPump:()=> {return ({name:"hydro pump",type:"water",cat:"special",power:110,accuracy:80,maxpp:5,
    apply:function(user,opponent)
        { 
          var crit=1; 
          var iscrit=isCrit(user,crit); 
          var dmg=calcDamage(this.power,user.spatt,opponent.spdef,iscrit,isStab(user,this));
          opponent.hp-=dmg;
          return {damage:dmg,isCrit:iscrit};
              }});},
    flareBlitz:()=> {return ({name:"flare blitz",type:"fire",cat:"physical",power:120,accuracy:100,maxpp:15,
    apply:function(user,opponent)
        { 
          var crit=1; 
          var iscrit=isCrit(user,crit); 
          var dmg=calcDamage(this.power,user.spatt,opponent.spdef,iscrit,isStab(user,this));
          opponent.hp-=dmg;
          user.hp-=Math.floor(dmg*0.33);
          return {damage:dmg,isCrit:iscrit};
              }});},
              
  }
  
  const randomMoves=()=>{
    let selectedMoves=[];
    let moves={};
    let arrayMoves=Object.keys(moveData);
    for(let i=0;i<4;i++)
    { 
      let selected=arrayMoves[Math.floor(Math.random()*arrayMoves.length)];

      while(selectedMoves.indexOf(selected)!==-1)
      {
        selected=arrayMoves[Math.floor(Math.random()*arrayMoves.length)];
      }
      selectedMoves.push(selected);
      moves[selected]={...moveData[selected](),usedpp:0}
    }
    console.log(moves);

    return moves;
  }

  
  export  const pokemonData={
    bulbasaur:()=>{ 
      return({types:["grass"],hp:200,maxhp:200, att:92,def:92,spatt:121,spdef:121,speed:85,
      moves:randomMoves()});},
    charmander:()=>{ return({types:["fire"],hp:188,maxhp:188, att:98,def:81,spatt:112,spdef:94,speed:121,
      moves:randomMoves()});},
    squirtle:()=>{ return({types:["water"],hp:198,maxhp:198, att:90,def:121,spatt:94,spdef:119,speed:81,
      moves:randomMoves()});},
    
  };
/* 
  export  const pokemonData={
    bulbasaur:()=>{ 
      return({types:["grass"],hp:200,maxhp:200, att:92,def:92,spatt:121,spdef:121,speed:85,
      moves:{ 
        tackle:{...moveData.tackle(),usedpp:0},
        vineWhip:{...moveData.vineWhip(),usedpp:0},
        razorLeaf:{...moveData.razorLeaf(),usedpp:0},
        doubleEdge:{...moveData.doubleEdge(),usedpp:0},
    }});},
    charmander:()=>{ return({types:["fire"],hp:188,maxhp:188, att:98,def:81,spatt:112,spdef:94,speed:121,
      moves:{ 
        scratch:{...moveData.scratch(),usedpp:0},
        ember:{...moveData.ember(),usedpp:0},
        flareBlitz:{...moveData.flareBlitz(),usedpp:0},
        slash:{...moveData.slash(),usedpp:0},
    }});},
    squirtle:()=>{ return({types:["water"],hp:198,maxhp:198, att:90,def:121,spatt:94,spdef:119,speed:81,
      moves:{ 
        tackle:{...moveData.tackle(),usedpp:0},
        waterGun:{...moveData.waterGun(),usedpp:0},
        bite:{...moveData.bite(),usedpp:0},
        hydroPump:{...moveData.hydroPump(),usedpp:0},
    }});},
    
  }; */
  
  