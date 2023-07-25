type ButtonProps = {
  variant: "primary" | "secondary";
  children: string;
  onClick?: () => void;
  disabled?: boolean;
};

const variants = {
  primary: " border-lightgreen bg-softgreen text-darkblue",
  secondary: " border-lightblue bg-darkblue text-fontblue",
};

export default function Button({
  variant,
  children,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={` ${variants[variant]}  cursor-pointer rounded-[5px] border px-3 py-1 font-sans text-base font-semibold transition-all duration-200 hover:shadow-md hover:brightness-[0.87] hover:contrast-[1.15] hover:drop-shadow-sm hover:saturate-[1.2]  hover:filter disabled:opacity-60 `}
    >
      {children}
    </button>
  );
}
