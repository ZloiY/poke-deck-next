import { atom, useAtom } from "jotai";
import { Pokemon } from "pokenode-ts";

const addedPokemonsAtom = atom<Pokemon[]>([]);
const pushPokemonAtom = atom(null, (get, set, update: Pokemon) =>
  set(addedPokemonsAtom, [...get(addedPokemonsAtom), update]),
);
const removePokemonAtom = atom(null, (get, set, update: Pokemon) => set(addedPokemonsAtom, get(addedPokemonsAtom).filter((pokemon) => pokemon.name != update.name)));
const resetPokemonsAtom = atom(null, (_get, set, _update) => set(addedPokemonsAtom, []))

export const useSelectPokemons = () => {
  const [pokemons, setAddedPokemons] = useAtom(addedPokemonsAtom);
  const [_, pushPokemon] = useAtom(pushPokemonAtom);
  const [__, resetPokemons] = useAtom(resetPokemonsAtom);
  const [___, removePokemon] = useAtom(removePokemonAtom);

  return { pokemons, pushPokemon, removePokemon, resetPokemons }
}