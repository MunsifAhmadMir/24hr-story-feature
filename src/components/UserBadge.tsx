import styles from "./UserBadge.module.css";

interface UserBadgeProps {
  avatar?: string;
  name: string;
  size?: number;
  textColor?: string;
}

export default function UserBadge({
  avatar,
  name,
  size = 32,
  textColor = "#000000",
}: UserBadgeProps) {
  // Local code-based vector icon used as a fallback profile picture when 'avatar' is missing
  // It draws a clean gray silhouette without needing any internet image link
  const localDefaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dbdbdb"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  return (
    <div className={styles.badgeContainer}>
      <img
        src={avatar ? avatar : localDefaultAvatar}
        alt={`${name}'s profile`}
        className={styles.avatar}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <span className={styles.username} style={{ color: textColor }}>
        {name}
      </span>
    </div>
  );
}
