import { useSpring, a } from "@react-spring/web";
import { memo, useEffect, useState } from "react";

import { DetailsCard } from "./DetailsCard";
import { PreviewCard } from "./PreviewCard";

export const FlipCard = memo(({ name, keepFlipped = false }: { name: string, keepFlipped?: boolean }) => {
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
      <a.div style={{ opacity: opacity.to(o => 1 - o), transform }}>
        <PreviewCard name={name} />
      </a.div>
      <a.div className="absolute top-0" style={{
          opacity,
          transform,
          rotateY: '180deg',
        }}>
        <DetailsCard name={name} />
      </a.div>
  </div>)
});