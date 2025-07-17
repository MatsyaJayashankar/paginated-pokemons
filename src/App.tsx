import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    fetchPokemons();
  }, []);
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [pokemons]);

  const fetchPokemons = async () => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${5}&offset=${offset}`
    ).then((res) => res.json());
    setTotal(res.count);
    setOffset((prev) => prev + 5);
    console.log(res);
    //fetch image
    const imageData = await Promise.all(
      res.results.map(async (pokemon) => {
        const results = await fetch(pokemon.url).then((res) => res.json());
        return { name: pokemon.name, image: results.sprites.front_default };
      })
    );
    setPokemons((prev) => [...prev, ...imageData]);
  };

  return (
    <>
      <h1>Paginated Pokemons</h1>
      <div
        className=" grid grid-cols-5 max-h-100 overflow-auto gap-1 bg-cyan-950"
        ref={ref}
      >
        {pokemons.map((pokemon, idx) => (
          <div
            key={idx}
            className="rounded p-2 m-1 shadow hover:shadow-[0_0_7px_red] bg-green-200 hover:scale-110"
          >
            <img src={pokemon.image} />
            <h6 className='text-black'>{pokemon.name}</h6>
          </div>
        ))}
      </div>
      <p>
        showing {pokemons.length} of {total}
      </p>
      {pokemons.length < total && (
        <button onClick={fetchPokemons}>Load More</button>
      )}
    </>
  );
}

export default App;
