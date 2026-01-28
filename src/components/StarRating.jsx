import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

export default function StarRating({ 
  value = 0, 
  onChange, 
  size = 'medium', 
  readonly = false,
  showValue = false 
}) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const sizeClass = sizes[size] || sizes.medium;

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleKeyDown = (e, rating) => {
    if (!readonly && onChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          disabled={readonly}
          className={`
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded
            ${!readonly && 'active:scale-95'}
          `}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          tabIndex={readonly ? -1 : 0}
        >
          <Star
            className={`
              ${sizeClass}
              transition-colors duration-200
              ${star <= value 
                ? 'fill-amber-500 text-amber-500' 
                : 'fill-none text-gray-300'
              }
              ${!readonly && star <= value && 'drop-shadow-sm'}
            `}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-bold text-gray-700">
          {value > 0 ? value.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  readonly: PropTypes.bool,
  showValue: PropTypes.bool,
};
