import { Check } from "lucide-react";

const variants = {
  completed: `border-brightgreen`,
  open: `border-lightblue`,
};

export default function TodoDisplay({
  description,
  variant,
}: {
  description: string;
  variant: "completed" | "open";
}) {
  return (
    <div className="flex flex-row gap-3">
      <div
        className={`h-[24px] w-[24px] rounded-[5px] border bg-darkblue ${variants[variant]} p-[1px]`}
      >
        {variant === "completed" && (
          <Check size={20} className="stroke-brightgreen" />
        )}
      </div>
      <p className="font-sans text-base">{description}</p>
    </div>
  );
}
