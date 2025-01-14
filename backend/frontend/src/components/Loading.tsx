import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="absolute inset-0 z-[100000] flex items-center justify-center bg-white/20 blur">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
