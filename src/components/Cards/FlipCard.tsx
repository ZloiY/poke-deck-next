import { useSpring, a } from "@react-spring/web";
import { Pokemon } from "pokenode-ts";
import { memo, useEffect, useState } from "react";

import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";

export const FlipCard = memo(({ pokemon, keepFlipped = false }: { pokemon: Pokemon, keepFlipped?: boolean }) => {
  const [isHovered, toggleHovered] = useState<boolean>(false);

  useEffect(() => {
    toggleHovered(keepFlipped);
  }, [keepFlipped])

  const { transform, opacity } = useSpring({
    opacity: isHovered ? 1 : 0,
    transform: `perspective(600px) rotateY(${isHovered ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const unHover = () => {
    if (!keepFlipped) {
      toggleHovered(false);
    }
  }

  return (<div
    className="relative"
    onMouseEnter={() => toggleHovered(true)}
    onMouseLeave={unHover}>
      <a.div className="z-10" style={{ opacity: opacity.to(o => 1 - o), transform }}>
        <PreviewCard pokemon={pokemon} />
      </a.div>
      <a.div className="absolute top-0 z-30" style={{
          opacity,
          transform,
          rotateY: '180deg',
        }}>
        <DetailsCard pokemon={pokemon} />
      </a.div>
  </div>)
});