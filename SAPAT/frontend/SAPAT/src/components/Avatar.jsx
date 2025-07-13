function Avatar({ src, name }) {
  const IMAGE_SIZE = 32

  return (
    <div className="tooltip" data-tip={name}>
      <img
        src={src}
        alt="avatar"
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
        className="rounded-full"
      />
    </div>
  )
}

export default Avatar
