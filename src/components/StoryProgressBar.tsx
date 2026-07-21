import styles from "./StoryProgressBar.module.css";
import type { StoryType } from "../types/story";

interface StoryProgressBarProps {
  stories: StoryType[];
  currentStoryIndex: number;
  isAnimate: boolean;
}

// ======================================================================================
//  MAIN COMPONENT
// ======================================================================================

export default function StoryProgressBar({
  stories,
  currentStoryIndex,
  isAnimate,
}: StoryProgressBarProps) {
  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    <div className={styles.progressContainer}>
      {stories.map((storyItem, index) => {
        let barWidth = "0%";

        const fillClassName = `${styles.barFill} ${
          index === currentStoryIndex && isAnimate ? styles.animatedFill : ""
        }`;

        if (index < currentStoryIndex) {
          barWidth = "100%";
        } else if (index === currentStoryIndex) {
          barWidth = isAnimate ? "100%" : "0%";
        }

        return (
          <div key={storyItem.id} className={styles.barTrack}>
            <div
              className={fillClassName}
              style={{
                width: barWidth,
                transition: index < currentStoryIndex ? "none" : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
