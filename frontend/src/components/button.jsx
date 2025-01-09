export function Button({ children, onClick, className = '', ...props }) {
    return (
      <button
        className={`bg-telegram-accent hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }
  
  