import PropTypes from 'prop-types';

export function ErrorAlert({ message, onRetry }) {
    return (
      <div className="bg-[#242f3d] rounded-xl p-4 text-center">
        <p className="text-[#ef5350] mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[#3390ec] hover:underline"
          >
            Try Again
          </button>
        )}
        </div>
      );
  }
  
  ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func,
  };
  
  