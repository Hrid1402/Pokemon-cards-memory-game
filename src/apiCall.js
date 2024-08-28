export async function getPokemons(n) {
    try{
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`);
        return pokemon.json();
    }catch(error){
        console.log(error);
        return null;
    }
    
}