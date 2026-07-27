import StoryItem from "./StoryItem";
import { useRef, useEffect } from "react";
import type { StoryType } from "../types/story";
import styles from "./StoriesBar.module.css";

/*
 * StoriesBar
 * Displays a horizontal list of story previews.
 * Manages the stories data and renders each StoryItem.
 */

interface StoriesBarProps {
  // Callback function triggered when a user selects a specific story badge/item
  onSelectStory: (id: number) => void;
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
// MAIN COMPONENT (Renders the horizontal list of user stories at the top of the feed)
// ======================================================================================

export default function StoriesBar({
  onSelectStory,
  onUploadStory,
  stories,
}: StoriesBarProps) {
  // ------------------------------------------
  // HOOKS & REFS (Always at the top level!)
  // ------------------------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleGlobalTrigger = () => {
      handlePlusClick();
    };

    window.addEventListener("trigger-story-upload", handleGlobalTrigger);
    return () => {
      window.removeEventListener("trigger-story-upload", handleGlobalTrigger);
    };
  }, []);

  // ------------------------------------------
  // STORY CLICK & RENDER LOGIC
  // ------------------------------------------
  // Click handler for individual story circles to log action and notify parent App component
  function handleStoryClick(id: number) {
    // Send the clicked story's ID back up to the parent component to open the modal
    onSelectStory(id);
  }

  // Renders a single story item
  function renderStory(story: StoryType) {
    return (
      <StoryItem key={story.id} story={story} onStoryClick={handleStoryClick} />
    );
  }

  // ------------------------------------------
  // FILE UPLOAD LOGIC (FileReader)
  // ------------------------------------------
  function handlePlusClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      /**
       * CRITICAL ORDER RULE:
       * Always attach event listeners (onload / onerror) BEFORE triggering the read operation.
       * This prevents a race condition where small files finish scanning faster than JavaScript
       * can register the listeners, causing the callbacks to never fire.
       */

      // 1. SUCCESS CALLBACK: Fires only when the file is fully and successfully read
      reader.onload = () => {
        const base64String = reader.result as string;
        onUploadStory(base64String);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      // 2. ERROR CALLBACK: Fallback safety if the browser fails to process the file
      reader.onerror = () => {
        console.error("Error! FileReader failed to process the chosen file.");
        alert("Could not read the file. Please try uploading another image.");
      };

      // 3. ACTION TRIGGER: Turn on the scanner machine to process the file asynchronously
      reader.readAsDataURL(file);
    }
  }

  // ====================================================================================
  // SCREEN RENDER (RETURN)
  // ====================================================================================

  return (
    <div className={styles.barWrapper}>
      <button
        onClick={scrollLeft}
        className={`${styles.navArrow} ${styles.leftArrow}`}
      >
        ‹
      </button>
      {/* Horizontal scrollable container for story items */}

      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        {/* ---- NEW: PLUS BUTTON START ---- */}
        <div onClick={handlePlusClick} className={styles.plusButtonContainer}>
          {/* Hidden input element */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div className={styles.plusCircle}>+</div>
          <p className={styles.label}>Your Story</p>
        </div>

        {stories.map(renderStory)}
      </div>
      <button
        onClick={scrollRight}
        className={`${styles.navArrow} ${styles.rightArrow}`}
      >
        ›
      </button>
    </div>
  );
}
