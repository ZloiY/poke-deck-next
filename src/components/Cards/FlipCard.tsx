import { useSpring, a } from "@react-spring/web";
import { Pokemon } from "pokenode-ts";
import { memo, useEffect, useMemo, useState } from "react";

import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";

export const FlipCard = memo(({ pokemon, keepFlipped = 'Preview', selectedPokemons = [] }: { pokemon: Pokemon, selectedPokemons?: Pokemon[], keepFlipped?: FlipState }) => {
  const isSelected = useMemo(() => !!selectedPokemons.find((selectedPokemon) => selectedPokemon.name == pokemon.name), [selectedPokemons, pokemon.name]);
  const [isHovered, toggleHovered] = useState<FlipState>(() => isSelected ? 'Details' : keepFlipped);

  useEffect(() => {
    toggleHovered(isSelected ? 'Details' : keepFlipped);
  }, [keepFlipped, isSelected])

  const { transform, opacity } = useSpring({
    opacity: isHovered == 'Details' ? 1 : 0,
    transform: `perspective(600px) rotateY(${isHovered == 'Details' ? 180 : 0}deg)`,
    config: { mass: 8, tension: 550, friction: 80 },
  })

  const unHover = () => {
    if (keepFlipped != 'Details' && !isSelected) {
      toggleHovered('Preview');
    }
  }

  return (<div
    className="relative"
    onMouseEnter={() => toggleHovered('Details')}
    onMouseLeave={unHover}>
      <a.div className="z-10" style={{ opacity: opacity.to(o => 1 - o), transform }}>
        <PreviewCard pokemon={pokemon} />
      </a.div>
      <a.div className="absolute top-0 z-30" style={{
          opacity,
          transform,
          rotateY: '180deg',
        }}>
        <DetailsCard pokemon={pokemon} isSelected={isSelected}/>
      </a.div>
  </div>)
});