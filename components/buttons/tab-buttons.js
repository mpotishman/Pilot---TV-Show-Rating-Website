export default function TabButtons({children, active, onClick}) {
  return (
    <button 
      onClick={onClick} 
      className={`
        cursor-pointer 
        text-gray-400
        hover:text-white 
        transition-colors 
        duration-300 
        px-4 
        h-16 
        flex 
        items-center 
        relative 
        group 
        ${active ? 'text-white border-b-2 border-[#ff6b6b]' : ''}
      `}
    >
      {children}
      
      {/* Animated underline for hover (when not active) */}
      {!active && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b6b] transition-all duration-300 group-hover:w-full" />
      )}
    </button>
  )
}