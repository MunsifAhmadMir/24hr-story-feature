import type { StoryType } from "../types/story";
import styles from "./StoryItem.module.css";

// Story item component props
interface StoryItemProps {
  story: StoryType;
  onStoryClick: (id: number) => void;
}

// ======================================================================================
// MAIN COMPONENT
// ======================================================================================

export default function StoryItem({ story, onStoryClick }: StoryItemProps) {
  // Fallback avatar used when no profile image is available
  const localDefaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dbdbdb"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  // Replace broken avatar images with the fallback avatar
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = localDefaultAvatar;
  };

  // ======================================================================================
  // RENDER UI (RETURN)
  // ======================================================================================

  return (
    <div
      onClick={() => onStoryClick(story.id)}
      className={styles.itemContainer}
    >
      {/* Story avatar */}
      <img
        src={story.avatar || localDefaultAvatar}
        alt={story.name}
        className={styles.avatarRing}
        onError={handleImageError}
      />

      {/* User name */}
      <p className={styles.username}>{story.name}</p>
    </div>
  );
}
