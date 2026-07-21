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
        <img src={tempImage} alt="Preview" className={styles.previewImage} />

        {/* Name Input field */}
        <input
          type="text"
          placeholder="Enter your name..."
          value={inputName}
          onChange={(e) => onNameChange(e.target.value)}
          className={styles.nameInput}
        />

        {/* Avatar Dropdown Wrapper*/}
        <div className={styles.dropdownRow}>
          <label className={styles.dropdownLabel}>Select Profile Avatar</label>
          <select
            value={selectedAvatar}
            onChange={(e) => onAvatarChange(e.target.value)}
            className={styles.avatarSelect}
          >
            <option value="none">None (Default Icon)</option>
            <option value="1">Avatar 1 (Female)</option>
            <option value="7">Avatar 2 (Male)</option>
            <option value="12">Avatar 3 (Cool)</option>
            <option value="60">Avatar 4 (Tech)</option>
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
