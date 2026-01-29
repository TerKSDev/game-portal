interface AvatarPlaceholderProps {
  name: string;
  size?: number;
}

export default function AvatarPlaceholder({
  name,
  size = 160,
}: AvatarPlaceholderProps) {
  const initial = name?.charAt(0).toUpperCase() || "?";

  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-cyan-500 to-cyan-600",
      "from-teal-500 to-teal-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const gradientColor = getColorFromName(name || "");
  const fontSize = size / 2.5;

  return (
    <div
      className={`bg-linear-to-br ${gradientColor} flex items-center justify-center text-white font-bold shadow-lg`}
      style={{ width: size, height: size, fontSize: `${fontSize}px` }}
    >
      {initial}
    </div>
  );
}
