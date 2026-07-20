import type { StoryType } from "../types/story";

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
          barWidth = isAnimate ? "100%" : "0%";
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
                  index === currentStoryIndex && isAnimate
                    ? "width 3000ms linear"
                    : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
