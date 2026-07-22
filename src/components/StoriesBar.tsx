import StoryItem from "./StoryItem";
import { useRef } from "react"; // <-- Create the Ref hook
import type { StoryType } from "../types/story";
import styles from "./StoriesBar.module.css";

/*
 * StoriesBar
 * Displays a horizontal list of story previews.
 * Manages the stories data and renders each StoryItem.
 */

interface StoriesBarProps {
  // Callback function triggered when a user selects a specific story badge/item
  onSelectStoryById: (id: number) => void;
  onUploadStory: (base64Image: string) => void;
  stories: StoryType[];
}
// ======================================================================================
// STORIES BAR COMPONENT
// Purpose: Displays a list of user stories with a custom "+" button to upload new media.
//
// Key Features:
// 1. Hidden File Input: Built-in HTML `<input type="file">` is hidden via CSS for aesthetic styling.
// 2. DOM Manipulation via Ref: `fileInputRef` triggers the hidden input's `.click()` method
//    programmatically when the styled custom "+" button is clicked.
// 3. Event Handling: `handleFileChange` catches the native browser change event once a file
//    is successfully selected by the user.
// ======================================================================================

// ======================================================================================
// 1. MAIN COMPONENT (Renders the horizontal list of user stories at the top of the feed)
// ======================================================================================

export default function StoriesBar({
  onSelectStoryById,
  onUploadStory,
  stories,
}: StoriesBarProps) {
  // ------------------------------------------
  // HOOKS & REFS (Always at the top level!)
  // ------------------------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    scrollContainerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUploadStory(reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    <div className={styles.barWrapper}>
      <button
        onClick={() => scroll(-200)}
        className={`${styles.navArrow} ${styles.leftArrow}`}
      >
        ‹
      </button>
      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={styles.plusButtonContainer}
        >
          <input
            id="stories-bar-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className={styles.plusCircle}>+</div>
          <p className={styles.label}>Your Story</p>
        </div>
        {stories.map((story) => (
          <StoryItem
            key={story.id}
            story={story}
            onStoryClick={onSelectStoryById}
          />
        ))}
      </div>
      <button
        onClick={() => scroll(200)}
        className={`${styles.navArrow} ${styles.rightArrow}`}
      >
        ›
      </button>
    </div>
  );
}
