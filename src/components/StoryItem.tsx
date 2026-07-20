import type { StoryType } from "../types/story";

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
      style={{
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={story.avatar ? story.avatar : localDefaultAvatar}
        alt={story.name}
        // Sets circle size, border, and padding for the avatar (i.e. Circular avatar styling)
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          padding: "2px",
          border: "2px solid transparent", // Makes border clear so gradient can show through
          // First part adds white gap, second adds Insta colors
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(45deg, #f99d1c, #da2f7f, #7c3cb5)",
          backgroundOrigin: "border-box", // Stretches the gradient colors to fill the entire border area
          backgroundClip: "content-box, border-box", // Protects the center photo and keeps colors only on the ring
        }}
      />
      {/* Displays the user's name */}
      <p
        style={{
          fontSize: "12px",
          marginTop: "6px",
          color: "#555",
        }}
      >
        {story.name}{" "}
      </p>
    </div>
  );
}
