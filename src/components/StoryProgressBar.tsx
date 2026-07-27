import styles from "./StoryProgressBar.module.css";
import type { StoryType } from "../types/story";

// Story progress bar component props
interface StoryProgressBarProps {
  stories: StoryType[];
  currentStoryIndex: number;
  isAnimate: boolean;
}

// ======================================================================================
// MAIN COMPONENT
// ======================================================================================

export default function StoryProgressBar({
  stories,
  currentStoryIndex,
  isAnimate,
}: StoryProgressBarProps) {
  // ======================================================================================
  // RENDER UI (RETURN)
  // ======================================================================================

  return (
    <div className={styles.progressContainer}>
      {stories.map((storyItem, index) => {
        // The default fill state of each progress bar
        let barWidth = "0%";

        // An animation class will be applied for the active story
        const fillClassName = `${styles.barFill} ${
          index === currentStoryIndex && isAnimate ? styles.animatedFill : ""
        }`;

        // Determines the progress width based on the current story
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
                // Disable transitions for completed stories to prevent
                // visual flickering during rapid navigation
                transition: index < currentStoryIndex ? "none" : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
