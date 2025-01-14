import { LuMessageCirclePlus } from "react-icons/lu";

const EmptyMessage = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <LuMessageCirclePlus className="size-20 shrink-0 " strokeWidth={1} />
        <p className="text-center text-lg">
          Select a <span className="text-purple-500">conversation</span> to
          start messaging
        </p>
      </div>
    </div>
  );
};

export default EmptyMessage;
