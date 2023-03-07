import { atom, PrimitiveAtom, useAtom } from "jotai";
import { Pokemon } from "pokenode-ts";

export const SelectingPokemonsService = (initialStorage: PrimitiveAtom<Pokemon[]>) => {
  let currentPokemonsStorage = initialStorage;
  const pushPokemonAtom = atom(null, (get, set, update: Pokemon) => set(currentPokemonsStorage, [...get(currentPokemonsStorage), update]))
  const resetPokemonsAtom = atom(null,
    (_get, set, _update) => set(currentPokemonsStorage, []));
  const removePokemonAtom = atom(null,
    (get, set, update: { name: string }) =>
      set(currentPokemonsStorage, get(currentPokemonsStorage).filter((pokemon) => pokemon.name != update.name)));

  return {
    setNewStorage: (newStorage: PrimitiveAtom<Pokemon[]>) => {
      currentPokemonsStorage = newStorage;
    },
    useSelectPokemons: () => {
      const [pokemons] = useAtom(currentPokemonsStorage);
      const [_, pushPokemon] = useAtom(pushPokemonAtom);
      const [__, resetPokemons] = useAtom(resetPokemonsAtom);
      const [___, removePokemon] = useAtom(removePokemonAtom);

      return { pokemons, pushPokemon, removePokemon, resetPokemons }
    }
  }
}