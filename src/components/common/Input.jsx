const Input = ({ icon, type = "text", placeholder, ...props }) => {
  return (
    <div className="relative mb-4">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        className={`w-full px-4 py-2 ${
          icon ? "pl-10" : ""
        } border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}

export default Input 