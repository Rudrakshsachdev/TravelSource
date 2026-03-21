import styles from "./HeroCards.module.css";

const HERO_CARDS = [
  { id: 1, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80" },
  { id: 2, image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&q=80" },
  { id: 3, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80" },
  { id: 4, image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=500&q=80" },
];

const HeroCards = () => {
  return (
    <div className={styles.cardsSection}>
      <div className={styles.topHalfBackground}></div>
      <div className={styles.bottomHalfBackground}></div>
      
      <div className={styles.cardsWrapper}>
        <div className={styles.cardsContainer}>
          {HERO_CARDS.map((card) => (
            <div key={card.id} className={styles.card}>
              <img src={card.image} alt="Destination highlight" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCards;
