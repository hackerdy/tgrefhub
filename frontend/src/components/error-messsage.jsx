export default function ErrorMessage({ message }) {
    return (
      <div className="min-h-screen bg-[#17212b] flex items-center justify-center p-4">
        <div className="bg-[#242f3d] rounded-xl p-6 text-center max-w-md w-full">
          <div className="text-red-500 text-lg font-medium mb-2">Error</div>
          <p className="text-[#8e99a8]">{message}</p>
        </div>
      </div>
    )
  }
  
  