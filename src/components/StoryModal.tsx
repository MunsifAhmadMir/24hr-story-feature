import { useEffect, useRef, useState } from "react";
import StoryProgressBar from "./StoryProgressBar";
import UserBadge from "./UserBadge";
import type { StoryType } from "../types/story";
import styles from "./StoryModal.module.css";

interface StoryModalProps {
  onClose: () => void;
  currentStory: StoryType;
  stories: StoryType[];
  onNext: () => void;
  onPrev: () => void;
}

// ======================================================================================
// MAIN COMPONENT
// ======================================================================================

export default function StoryModal({
  onClose,
  currentStory,
  stories,
  onNext,
  onPrev,
}: StoryModalProps) {
  // Component state and refs
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isAnimate, setIsAnimate] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Always stores the latest onNext function in the ref
  const onNextRef = useRef(onNext);

  // Extracts the index of the current story
  const currentStoryIndex = stories.findIndex((s) => s.id === currentStory.id);

  // Keep the latest onNext reference updated
  useEffect(() => {
    onNextRef.current = onNext;
  });

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Runs only once when the component mounts.

  // Story timer
  useEffect(() => {
    setIsAnimate(true);

    const storyTimeout = setTimeout(() => {
      onNextRef.current();
    }, 3000);

    return () => {
      clearTimeout(storyTimeout);
    };
  }, [currentStory.id]);

  // Swipe gesture handlers
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const difference = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (difference > minSwipeDistance) {
      onNext();
    } else if (difference < -minSwipeDistance) {
      onPrev();
    }

    // Reset the values for the swipe.
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Mobile screen check
  const isMobile = windowWidth < 500;

  // ======================================================================================
  // RENDER UI (RETURN)
  // ======================================================================================

  return (
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={styles.overlay}
    >
      <img src={currentStory.image} alt="" className={styles.blurBg} />

      {/* Desktop previous button */}
      <button
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        className={styles.navbutton}
      >
        ‹
      </button>

      {/* Main story card */}
      <div
        onClick={(event) => event.stopPropagation()}
        className={styles.cardContainer}
      >
        {/* Story progress indicator */}
        <StoryProgressBar
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          isAnimate={isAnimate}
        />
        {/* Story header */}
        <div className={styles.headerBar}>
          {/* User information */}
          <UserBadge
            avatar={currentStory.avatar}
            name={currentStory.name}
            size={32}
            textColor="#ffffff"
          />

          {/* Close button */}
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* Story image container */}
        <div className={styles.imageWrapper}>
          <img
            src={currentStory.image}
            alt={currentStory.name}
            className={styles.storyImage}
          />

          {/* Mobile tap zones */}
          {isMobile && (
            <>
              {/* Left tap zone */}
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  onPrev();
                }}
                className={`${styles.tapZone} ${styles.leftTap}`}
              />

              {/* Right tap zone */}
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                className={`${styles.tapZone} ${styles.rightTap}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Desktop next button */}
      <button
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        className={styles.navbutton}
      >
        ›
      </button>
    </div>
  );
}
