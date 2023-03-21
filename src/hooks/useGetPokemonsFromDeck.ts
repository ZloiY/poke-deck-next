import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { z } from "zod";
import { api } from "../utils/api";

export const useGetPokemonsFromDeck = () => {
  const route = useRouter();
  const [deckId, setDeckId] = useState<string>('');

  useEffect(() => {
    const result = z.object({
      deckId: z.string()
    }).strip().safeParse(route.query);
    if (result.success) {
      setDeckId(result.data.deckId);
    }
  }, []);

  return api.pokemon.getPokemonsByDeckId.useQuery(deckId, { enabled: deckId.length > 0 });
}
