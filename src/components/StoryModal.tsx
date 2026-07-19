import { useEffect, useState } from "react";
import { type StoryType } from "./StoriesBar";

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
  // Tracks the loading animation percentage (0 to 100) of the currently active story bar
  const [progress, setProgress] = useState(0);

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

  // Exact 3 seconds progress bar timer handler
  useEffect(() => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 30); // 30ms per step * 100 steps = 3000ms (Exactly 3 seconds total duration) OR 3000/100 = 30ms per step
    return () => {
      clearInterval(interval);
    };
  }, [currentStory.id, onNext]);

  useEffect(() => {
    if (progress >= 100) {
      onNext();
    }
  }, [progress, onNext]);

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

  // Local code-based vector icon used as a fallback profile picture when 'avatar' is missing
  // It draws a clean gray silhouette without needing any internet image link
  const localDefaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dbdbdb"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  // 6. Check if screen is mobile size; returns true if under 500px, otherwise false
  const isMobile = windowWidth < 500;

  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    // 1. BLACK FULL-SCREEN OVERLAY DIV: Dark background that covers the entire screen
    <div
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        flexDirection: "row",
        gap: "20px",
      }}
    >
      {/* Desktop Left Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        style={{
          // Hide the element on mobile screens (none), otherwise show it using flexbox layout (flex)
          display: isMobile ? "none" : "flex",
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          color: "white",
          fontSize: "24px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          cursor: "pointer",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ‹
      </button>

      {/* 2. WHITE CARD CONTAINER DIV: Main card that contains the header and the image */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #dbdbdb",
          width: "100%",
          maxWidth: "400px",
          overflow: "hidden",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* 3. DIV: MULTIPLE SEGMENTS PROGRESS BARS CONTAINER */}
        <div
          style={{
            padding: "10px 16px 2px 16px",
            backgroundColor: "#ffffff",
            display: "flex",
            gap: "6px",
          }}
        >
          {stories.map((storyItem, index) => {
            let barWidth = "0%";

            if (index < currentStoryIndex) {
              barWidth = "100%";
            } else if (index === currentStoryIndex) {
              barWidth = `${progress}%`;
            }
            return (
              <div
                key={storyItem.id}
                style={{
                  height: "3px",
                  flex: 1,
                  backgroundColor: "#efefef",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: barWidth,
                    backgroundColor: "#262626",
                    transition:
                      index === currentStoryIndex
                        ? "width 30ms linear"
                        : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 4. MAIN HEADER BAR DIV: Holds the user section on the left and the close button on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            fontWeight: "600",
            fontSize: "14px",
            color: "#000000",
            justifyContent: "space-between",
          }}
        >
          {/* 4. USER DETAILS WRAPPER DIV: Keeps the avatar photo and username aligned side-by-side in one line */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={
                currentStory.avatar ? currentStory.avatar : localDefaultAvatar
              }
              alt="profile"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <span>{currentStory.name}</span>
          </div>

          {/* Close button inside the main header bar */}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#262626",
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>

        {/* 5. New Wrapper Box DIV: Keeps absolute tap zones limited only to the image area */}
        <div style={{ position: "relative", width: "100%" }}>
          <img
            src={currentStory.image}
            alt={currentStory.name}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              maxHeight: "70vh",
            }}
          />
          {/* Only show these hidden tap zones on mobile screen sizes */}
          {isMobile && (
            <>
              {/* Invisible layer on the left 50% area to triggers the previous story */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />

              {/* Invisible layer on the right 50% area to triggers the next story */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "50%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
            </>
          )}
        </div>
      </div>
      {/* Right (Next) Navigation Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        style={{
          display: isMobile ? "none" : "flex",
          background: "rgba(255, 255, 255, 0.2)",
          border: "none",
          color: "white",
          fontSize: "24px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          cursor: "pointer",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ›
      </button>
    </div>
  );
}
