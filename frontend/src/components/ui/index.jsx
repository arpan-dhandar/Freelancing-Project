import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      className = "",
      type = "button",
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-pill transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-ink text-white hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0",
      red: "bg-scarr-red text-white hover:-translate-y-0.5 hover:shadow-btn-red active:translate-y-0",
      outline:
        "border border-border bg-surface text-ink hover:border-ink hover:shadow-pop-sm",
      ghost: "text-ink-muted hover:bg-surface-2 hover:text-ink",
      danger: "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200",
    };

    const sizes = {
      sm: "text-xs px-4 py-2",
      md: "text-sm px-5 py-2.5",
      lg: "text-sm px-7 py-3.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...rest}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : children}
      </button>
    );
  },
);
Button.displayName = "Button";

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      required,
      className = "",
      error,
      ...rest
    },
    ref,
  ) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={name} className="scarr-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        // Note: ...rest allows props like autoComplete to pass through
        className={`scarr-input ${error ? "border-red-400 focus:border-red-400" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      value,
      onChange,
      rows = 4,
      className = "",
      ...rest
    },
    ref,
  ) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={name} className="scarr-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`scarr-input resize-none ${className}`}
        {...rest}
      />
    </div>
  ),
);
Textarea.displayName = "Textarea";

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_COLORS = {
  default: "bg-surface-2 text-ink-muted border-border",
  red: "bg-scarr-red-light text-scarr-red border-transparent",
  blue: "bg-pastel-blue text-blue-700 border-transparent",
  green: "bg-pastel-green text-green-700 border-transparent",
  yellow: "bg-pastel-yellow text-yellow-700 border-transparent",
  purple: "bg-pastel-purple text-purple-700 border-transparent",
};

export const Badge = ({ children, color = "default", className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-bold border ${BADGE_COLORS[color] || BADGE_COLORS.default} ${className}`}
  >
    {children}
  </span>
);

// ── StarRating ────────────────────────────────────────────────────────────────
export const StarRating = ({
  value = 0,
  size = "md",
  interactive = false,
  onChange,
}) => {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizes[size]} ${star <= Math.round(value) ? "text-yellow-400" : "text-border"} ${interactive ? "cursor-pointer hover:text-yellow-300 transition-colors" : ""}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          onClick={() => interactive && onChange?.(star)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const GigCardSkeleton = () => (
  <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-card">
    <Skeleton className="w-full aspect-[4/3]" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-14 rounded-pill" />
      </div>
    </div>
  </div>
);

// ── Eyebrow ───────────────────────────────────────────────────────────────────
export const Eyebrow = ({ children, className = "" }) => (
  <p className={`section-eyebrow ${className}`}>
    <span className="w-4 h-px bg-scarr-red inline-block" />
    {children}
  </p>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = ({ className = "" }) => (
  <div className={`w-full h-px bg-border ${className}`} />
);

// ── EmptyState ────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, desc, action }) => (
  <div className="py-24 text-center border-2 border-dashed border-border rounded-3xl bg-canvas/50">
    {icon && <div className="text-5xl mb-4 grayscale opacity-50">{icon}</div>}
    <p className="text-lg font-display font-bold text-ink mb-2">{title}</p>
    {desc && (
      <p className="text-sm text-ink-muted mb-6 max-w-xs mx-auto">{desc}</p>
    )}
    <div className="flex justify-center">{action}</div>
  </div>
);
