export function Input({ className = '', ...props }) {
    return (
      <input
        className={`w-full bg-telegram-secondary text-telegram-text px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-accent ${className}`}
        {...props}
      />
    )
  }
  
  