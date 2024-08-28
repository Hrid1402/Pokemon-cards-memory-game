import { useEffect, useState } from 'react'
import './styles/App.css'
import './styles/cards.css'
import './styles/gameOver.css'
import {getPokemons} from './apiCall.js'
import loadingICON from './assets/loadingICON.png'
import backCard from './assets/backCard.png'
import { DifficultyButton } from './components/buttons.jsx'
import { GenBtn } from './components/genBtn.jsx'
import { v4 as uuidv4 } from 'uuid'




let allPokemons = [];
let pokemonTotal = 12;
const amountOfPokemons = {
  easy: 12,
  medium: 18,
  hard: 24,
  master: 50
}
const pokemonGen = {
  1: 1,
  2: 152,
  3: 252,
  4: 387,
  5: 494,
  6: 650,
  7: 722,
  8: 810,
  9: 906
}

let clickedPokemons = [];
function App() {
  const [pokemonsLeft, setPokemonsLeft] = useState(pokemonTotal);
  const [curPokemons, setCurPokemons] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gen, setGen] = useState(1);
  

  async function createPokemonCards(n, gen) {
    let f = pokemonGen[gen];

    for(let i = 0; i < n; i++) {
      let pokemon = await getPokemons(f);
      allPokemons.push({sprite:pokemon.sprites.other["official-artwork"].front_default, name:pokemon.name});
      f++;
    }
  }
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
  }
  function setRandomPokemons(allPokemons){
    let randomPokemons = [];
    let copy = [...allPokemons];
    const freePokemons = allPokemons.filter(pokemon => !clickedPokemons.includes(pokemon.name));
    const amountNewPokemons = (freePokemons.length <= 12) ? Math.floor(Math.random() * freePokemons.length) + 1 : Math.floor(Math.random() * 12) + 1;
    const extraPokemons = 12 - amountNewPokemons;


    
    for (let i = 0; i < amountNewPokemons; i++) {
      let randomIndex = Math.floor(Math.random() * freePokemons.length);
      randomPokemons.push(freePokemons[randomIndex]);
      freePokemons.splice(randomIndex, 1);
    }
    for (let i = 0; i < extraPokemons; i++) {
      let randomIndex;
      do{
        randomIndex = Math.floor(Math.random() * copy.length);
      }while(randomPokemons.includes(copy[randomIndex]));
      randomPokemons.push(copy[randomIndex]);
      copy.splice(randomIndex, 1);
      
    }
    const finalMixedPokemons = shuffleArray(randomPokemons);
    setCurPokemons(finalMixedPokemons);


  }
  


  function changeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty);
    pokemonTotal = amountOfPokemons[newDifficulty];
    setPokemonsLeft(pokemonTotal);
    console.log(`You selected ${newDifficulty} difficulty`);
  }
  useEffect(() => {
    if (difficulty !== null) {
        const fetchPokemons = async () => {
        await createPokemonCards(pokemonTotal, gen);
        setRandomPokemons(allPokemons);
        setIsLoading(false);
      };
      fetchPokemons();
    }
  }, [difficulty]);

  function MainMenu({curDifficulty, curPokemons}){

    function playAnimation(animation) {
      return new Promise((resolve) => {
        const cards = document.querySelectorAll('.card');
        setCardClasses("card");
        setCardClasses("card " + animation);
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
    
    const [cardClasses, setCardClasses] = useState("card");
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const freePokemons = allPokemons.filter(pokemon => !clickedPokemons.includes(pokemon.name));
    function DialogBox({isWinner}){
      return(
        <div className='endScreen'>
          <div className='content'>
            {isWinner?<h1>YOU WON</h1>:<h1 className='txtGameOver'>GAME OVER</h1>}
            {isWinner?null:<h2 className='txt_left'>You caught {clickedPokemons.length} pokemons!</h2>}
            {isWinner?null:<h2 className='txt_P_left'>Pokemons left:</h2>}
            <div className='container_left_p'>
              {isWinner?null:
                freePokemons.map((pokemon) => {
                  return(
                    <div key={uuidv4()} className='P_left'>
                      <img src={pokemon.sprite} alt={pokemon.name}/>
                    </div>
                  )
                })
                }
            </div>
            <button className='restartBtn' onClick={() => window.location.reload()}>Play Again</button>
            
          </div>
        </div>
      )
    }


    useEffect(() => {
      if(pokemonsLeft<1){
        setIsGameOver(true);
        setIsWinner(true);
      }
      if(!isGameOver){
        const runAnimations = async () => {
        await playAnimation('flip');
          //await playAnimation('flip2');
        };
        runAnimations();
      }
      
    }, [pokemonsLeft]);


    function handleCardClick(name){
      if(clickedPokemons.includes(name)){
        console.log(`You already clicked ${name}!!!!!`);
        setIsGameOver(true);
      }else{
        console.log(`----------------${name} clicked`);
        clickedPokemons.push(name);
        const newPokemonsLeft = pokemonsLeft - 1;
        setPokemonsLeft(newPokemonsLeft);
        if(newPokemonsLeft < 1){
          console.log("YOU WON!");
          setIsGameOver(true);
          setIsWinner(true);
        }else{
          setRandomPokemons(allPokemons);
        }
      }
    }
    function PokemonCard({name, sprite}){
      return( 
        <div key={uuidv4()} className={cardClasses} onClick={() => handleCardClick(name)} >
          <img className='front' src={sprite} alt={name}/>
          <img className='back' src={backCard} />
        </div>
        )
    }
    
    if(curDifficulty == null){
      return(
        <section>
          <GenBtn txt={gen} gen={gen} callback={()=>setGen((gen<9)?gen+1:1)}/>
          <h1 className='MainText'>Pokémon Memory Cards Game</h1>
          <p className="subTitle">
            In each round, spot and click the different Pokémon card without repeating your previous choices. 
          </p>
          <p>Choose your difficulty:</p>
          <div className='buttons'>
            <DifficultyButton txt="Easy" difficulty={"easy"} callback={changeDifficulty}/>
            <DifficultyButton txt="Medium" difficulty={"medium"} callback={changeDifficulty}/>
            <DifficultyButton txt="Hard" difficulty={"hard"} callback={changeDifficulty}/>
            <DifficultyButton txt="MASTER" difficulty={"master"} callback={changeDifficulty}/>
          </div>
        </section>
      )
    }else if(isLoading){
      return(
        <div className='loading'>
          <img src={loadingICON} alt=""/>
          <h1>Loading...</h1>
        </div>
      )
    }else{
      return(
        <div className='gameBlock'>
          {isGameOver ? <DialogBox isWinner={isWinner}/>: null}
          <h1 className='TXTmenu'>Pokemons left: {pokemonsLeft}</h1>
          <div className='cards'>
            {curPokemons.map((pokemon) => {
              return(
                <PokemonCard name={pokemon.name} sprite={pokemon.sprite} key={uuidv4()}/>
              )
            })}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      
      <MainMenu curDifficulty={difficulty} curPokemons={curPokemons}></MainMenu>
    </>
    
    
  )
}

export default App
