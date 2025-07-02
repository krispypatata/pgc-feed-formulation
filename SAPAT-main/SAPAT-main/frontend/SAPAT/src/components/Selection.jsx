export default function Selection({ name, color }) {
  const displayName = name.split(' ')
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-2 rounded-full border"
        style={{
          borderColor: color, // Dynamically set the border color
        }}
      />
      <div
        className="rounded-sm p-1 text-xs text-white"
        style={{
          backgroundColor: color, // Dynamically set the background color of the name box
        }}
      >
        {`${displayName[0]} ${displayName[1]}`}
      </div>
    </div>
  )
}
