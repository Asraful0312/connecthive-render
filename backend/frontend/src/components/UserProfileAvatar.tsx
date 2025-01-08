import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type Props = {
  imageUrl: string;
  className?: string;
  alt: string;
};

const UserProfileAvatar = ({ imageUrl, className, alt }: Props) => {
  return (
    <MorphingDialog
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        <Avatar className={cn(`w-24 h-24`, className)}>
          <AvatarImage src={imageUrl} alt={alt} />
        </Avatar>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative">
          <MorphingDialogImage
            src={imageUrl}
            alt={alt}
            className="h-auto w-full max-w-[90vw] rounded-[4px] object-cover lg:h-[90vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

export default UserProfileAvatar;
