import styles from "./CreateStoryModal.module.css";

interface CreateStoryModalProps {
  tempImage: string;
  inputName: string;
  selectedAvatar: string;

  onNameChange: (value: string) => void;
  onAvatarChange: (value: string) => void;

  onCancel: () => void;
  onPublish: () => void;
}

export default function CreateStoryModal({
  tempImage,
  inputName,
  selectedAvatar,
  onNameChange,
  onAvatarChange,
  onCancel,
  onPublish,
}: CreateStoryModalProps) {
  if (!tempImage) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <h2 className={styles.title}>Create Your Story</h2>

        {/* Live Preview Box */}
        <img
          src={tempImage}
          alt="Selected story preview"
          className={styles.previewImage}
        />

        {/* Name Input field */}
        <input
          type="text"
          placeholder="Enter your name..."
          value={inputName}
          onChange={(event) => onNameChange(event.target.value)}
          className={styles.nameInput}
        />

        {/* Avatar Dropdown Wrapper*/}
        <div className={styles.dropdownRow}>
          <label htmlFor="avatar-select" className={styles.dropdownLabel}>
            Select Profile Avatar
          </label>
          <select
            id="avatar-select"
            value={selectedAvatar}
            onChange={(event) => onAvatarChange(event.target.value)}
            className={styles.avatarSelect}
          >
            <option value="none">None (Default Icon)</option>
            <option value="48">Avatar 1 (Female)</option>
            <option value="12">Avatar 2 (Male)</option>
            <option value="50">Avatar 3 (Cool)</option>
            <option value="18">Avatar 4 (Tech)</option>
          </select>
        </div>
        {/* Action Buttons Row*/}
        <div className={styles.buttonGroup}>
          <button
            onClick={onCancel}
            className={`${styles.btnBase} ${styles.btnCancel}`}
          >
            Cancel
          </button>
          <button
            onClick={onPublish}
            className={`${styles.btnBase} ${styles.btnPublish}`}
          >
            Publish Story
          </button>
        </div>
      </div>
    </div>
  );
}
