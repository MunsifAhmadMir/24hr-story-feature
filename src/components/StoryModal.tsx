import StoryProgressBar from "./StoryProgressBar";
import UserBadge from "./UserBadge";
import { useEffect, useState } from "react";
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
//  MAIN COMPONENT
// ======================================================================================

export default function StoryModal({
  onClose,
  currentStory,
  stories,
  onNext,
  onPrev,
}: StoryModalProps) {
  // Stores the current screen width in pixels to handle responsive layouts (mobile vs desktop)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // Is boolean flag se pure CSS transition smooth chalay ga bina state looping ke
  const [isAnimate, setIsAnimate] = useState(false);

  // Tracks where the user first touches the screen on the horizontal axis
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  // Tracks where the user lifts their finger off the screen on the horizontal axis
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const currentStoryIndex = stories.findIndex((s) => s.id === currentStory.id);

  useEffect(() => {
    // 2. Function that captures and updates the new screen width during a resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    // 3. Setup a "Watchman" (listener) to trigger the handleResize function on every screen change
    window.addEventListener("resize", handleResize);
    // 4. Cleanup: Removes the listener when the modal closes to prevent memory leaks
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 5. Empty/Dependency Array [] ensures this setup runs ONLY ONCE when the component loads

  // FIXED: Warning aur Flicker khatam karne ke liye simple hardware-accelerated timers
  useEffect(() => {
    setIsAnimate(false); // Reset timeline line to 0% immediately

    let firstFrameId: number;
    let secondFrameId: number;

    firstFrameId = requestAnimationFrame(() => {
      secondFrameId = requestAnimationFrame(() => {
        setIsAnimate(true);
      });
    });

    // Exact 3000ms timer to auto-advance the story layout
    const storyTimeout = setTimeout(() => {
      onNext();
    }, 3000);

    // Safely destroy both animation threads and the timeout
    return () => {
      cancelAnimationFrame(firstFrameId);
      if (secondFrameId) {
        cancelAnimationFrame(secondFrameId);
      }
      clearTimeout(storyTimeout);
    };
  }, [currentStory.id, onNext]);

  // ------------------------------------------
  //
  // ------------------------------------------
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  // ------------------------------------------
  //
  // ------------------------------------------
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  // ------------------------------------------
  //
  // ------------------------------------------
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const difference = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (difference > minSwipeDistance) {
      onNext();
    } else if (difference < -minSwipeDistance) {
      onPrev();
    }

    // Reset states for the next swipe action
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // 6. Check if screen is mobile size; returns true if under 500px,
  // otherwise false
  const isMobile = windowWidth < 500;

  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    //  1. BLACK FULL-SCREEN OVERLAY DIV: Dark background that covers
    // the entire screen
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={styles.overlay}
    >
      <img src={currentStory.image} alt="" className={styles.blurBg} />

      {/* Desktop Left Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className={styles.navbutton}
      >
        ‹
      </button>

      {/* Main Container Card */}

      {/* Renders equal-width multi-segment progress bars using
        hardware-accelerated // CSS transitions to smoothly track active
        playback without interface flickering */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.cardContainer}
      >
        <StoryProgressBar
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          isAnimate={isAnimate}
        />
        {/* Main User Profile Header Bar */}
        <div className={styles.headerBar}>
          {/* Keeps the avatar photo and username aligned side-by-side 
          in one line */}
          <UserBadge
            avatar={currentStory.avatar}
            name={currentStory.name}
            size={32}
            textColor="#ffffff"
          />

          {/* Close button inside the main header bar */}
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        {/* Story Asset Frame Area:
        Keeps absolute tap zones limited only to the image area */}
        <div className={styles.imageWrapper}>
          <img
            src={currentStory.image}
            alt={currentStory.name}
            className={styles.storyImage}
          />
          {/* Only show these hidden tap zones on mobile screen sizes */}
          {isMobile && (
            <>
              {/* Invisible layer on the left 50% area to triggers the 
              previous story */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className={`${styles.tapZone} ${styles.leftTap}`}
              />

              {/* Invisible layer on the right 50% area to triggers 
              the next story */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className={`${styles.tapZone} ${styles.rightTap}`}
              />
            </>
          )}
        </div>
      </div>
      {/* Desktop Right Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className={styles.navbutton}
      >
        ›
      </button>
    </div>
  );
}
