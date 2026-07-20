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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        color: "#fff",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          color: "#333",
          padding: "25px",
          borderRadius: "12px",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "18px", marginBottom: "15px" }}>
          Create Your Story
        </h2>
        {/* Live Preview Box */}
        <img
          src={tempImage}
          alt="Preview"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "2px solid #ddd",
          }}
        />
        {/* Name Input field */}
        <input
          type="text"
          placeholder="Enter your name..."
          value={inputName}
          onChange={(e) => onNameChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        />
        {/* Avatar Dropdown */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <label style={{ fontSize: "14px", color: "#666" }}>
            Select Profile Avatar
          </label>
          <select
            value={selectedAvatar}
            onChange={(e) => onAvatarChange(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="1">Avatar 1 (Female)</option>
            <option value="7">Avatar 2 (Male)</option>
            <option value="12">Avatar 3 (Cool)</option>
            <option value="60">Avatar 4 (Tech)</option>
          </select>
        </div>
        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#eee",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onPublish}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#0095f6",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Publish Story
          </button>
        </div>
      </div>
    </div>
  );
}
