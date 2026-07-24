import styles from "./StoryProgressBar.module.css";
import type { StoryType } from "../types/story";

// ✅ THE FIX: Props ko bilkul sahi tarteeb di taake TypeScript error khatam ho jaye
interface StoryProgressBarProps {
  stories: StoryType[];
  currentStoryIndex: number;
  isAnimate: boolean;
}

export default function StoryProgressBar({
  stories,
  currentStoryIndex,
  isAnimate,
}: StoryProgressBarProps) {
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
                // Tezi se click karne par bars ka takraao khatam karne wala logic
                transition: index < currentStoryIndex ? "none" : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
