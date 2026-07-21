import type { StoryType } from "../types/story";
import styles from "./StoryItem.module.css";

/*
 * StoryItem
 * Displays a single story preview with a circular image and username.
 */

// Props received by the StoryItem component
interface StoryItemProps {
  story: StoryType;
  onStoryClick: (id: number) => void;
}

export default function StoryItem({ story, onStoryClick }: StoryItemProps) {
  // Local code-based vector icon used as a fallback profile picture when 'avatar' is missing
  // It draws a clean gray silhouette without needing any internet image link
  const localDefaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dbdbdb"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  return (
    <div
      onClick={function () {
        onStoryClick(story.id);
      }}
      // Each story as a vertical card (image top, name bottom, centered)
      // OR
      // / Vertical layout for a single story
      className={styles.itemContainer}
    >
      <img
        src={story.avatar ? story.avatar : localDefaultAvatar}
        alt={story.name}
        // Sets circle size, border, and padding for the avatar (i.e. Circular avatar styling)
        className={styles.avatarRing}
      />
      {/* Displays the user's name */}
      <p className={styles.username}>{story.name} </p>
    </div>
  );
}
