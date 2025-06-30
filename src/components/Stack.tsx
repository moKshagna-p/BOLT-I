import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type CardData = {
  id: number | string;
  img: string;
  name?: string;
  company?: string;
};

type CardRotateProps = {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

function CardRotate({ children, onSendToBack, sensitivity, onSwipeLeft, onSwipeRight }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: any, info: { offset: { x: number; y: number } }) {
    if (info.offset.x > sensitivity) {
      onSwipeRight && onSwipeRight();
      onSendToBack();
    } else if (info.offset.x < -sensitivity) {
      onSwipeLeft && onSwipeLeft();
      onSendToBack();
    } else if (
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

type StackProps = {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  cardsData?: CardData[];
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  onSwipeLeft?: (card: CardData) => void;
  onSwipeRight?: (card: CardData) => void;
  onCardClick?: (card: CardData) => void;
};

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  onSwipeLeft,
  onSwipeRight,
  onCardClick,
}: StackProps) {
  const [cards, setCards] = useState<CardData[]>(
    cardsData.length
      ? cardsData
      : [
        { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format", name: "John Doe", company: "Acme Inc." },
        { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format", name: "Jane Smith", company: "Beta LLC" },
        { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format", name: "Alice Lee", company: "Gamma Corp." },
        { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format", name: "Bob Brown", company: "Delta Ltd." }
      ]
  );

  const sendToBack = (id: number | string) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation
          ? Math.random() * 10 - 5
          : 0;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            onSwipeLeft={onSwipeLeft ? () => onSwipeLeft(card) : undefined}
            onSwipeRight={onSwipeRight ? () => onSwipeRight(card) : undefined}
          >
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{
                borderColor: 'rgba(139,92,246,0.2)',
                background: 'rgba(0,0,0,0.75)',
                boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18), 0 4px 16px 0 rgba(139,92,246,0.1)',
                width: cardDimensions.width,
                height: cardDimensions.height,
                position: 'relative',
              }}
              onClick={() => onCardClick && onCardClick(card)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              <img
                src={card.img}
                alt={`card-${card.id}`}
                className="w-full h-full object-cover pointer-events-none"
              />
              {(card.name || card.company) && (
                <div
                  className="absolute bottom-0 left-0 w-full px-6 py-4 backdrop-blur-md"
                  style={{
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    background: 'linear-gradient(90deg, #3b2170ee 0%, #312e81ee 100%)',
                  }}
                >
                  {card.name && (
                    <div className="text-lg font-bold text-white drop-shadow-sm truncate">
                      {card.name}
                    </div>
                  )}
                  {card.company && (
                    <div className="text-sm text-white/80 font-medium truncate">
                      {card.company}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
} 