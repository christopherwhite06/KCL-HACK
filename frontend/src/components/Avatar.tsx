type AvatarProps = { initials: string; color: string; size?: number };

export default function Avatar({ initials, color, size = 48 }: AvatarProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 800, color: "white", flexShrink: 0,
      boxShadow: `0 4px 16px ${color}44`,
    }}>{initials}</div>
  );
}
