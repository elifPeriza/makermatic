export default function HourGlass({ className }: { className?: string }) {
  return (
    <>
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="31"
        viewBox="0 0 20 31"
        fill="none"
      >
        <path
          d="M13.9823 2H6.01773C1.3963 2 1.03986 6.49559 3.53494 8.9429L16.4651 21.6582C18.9601 24.1055 18.6037 28.6011 13.9823 28.6011H6.01773C1.3963 28.6011 1.03986 24.1055 3.53494 21.6582L16.4651 8.9429C18.9601 6.49559 18.6037 2 13.9823 2Z"
          stroke="#A6B1E1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}
