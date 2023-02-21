import { atom } from "jotai";
import { Pokemon } from "pokenode-ts";
import { SelectingPokemonsService } from "../services/selectPokemonService";

export const { setNewStorage, useSelectPokemons } = SelectingPokemonsService(atom<Pokemon[]>([]));