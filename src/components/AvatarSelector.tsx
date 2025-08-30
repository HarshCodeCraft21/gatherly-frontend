import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

// Import avatar images
import avatar1 from "@/assets/avatars/avatar-1.png";
import avatar2 from "@/assets/avatars/avatar-2.png";
import avatar3 from "@/assets/avatars/avatar-3.png";
import avatar4 from "@/assets/avatars/avatar-4.png";
import avatar5 from "@/assets/avatars/avatar-5.png";
import avatar6 from "@/assets/avatars/avatar-6.png";
import avatar7 from "@/assets/avatars/avatar-7.png";
import avatar8 from "@/assets/avatars/avatar-8.png";
import avatar9 from "@/assets/avatars/avatar-9.png";
import avatar10 from "@/assets/avatars/avatar-10.png";

const avatarOptions = [
  { id: 1, src: avatar1, alt: "Professional woman" },
  { id: 2, src: avatar2, alt: "Business man with glasses" },
  { id: 3, src: avatar3, alt: "Asian professional woman" },
  { id: 4, src: avatar4, alt: "African American professional" },
  { id: 5, src: avatar5, alt: "Senior professional woman" },
  { id: 6, src: avatar6, alt: "Hispanic professional man" },
  { id: 7, src: avatar7, alt: "Young blonde professional" },
  { id: 8, src: avatar8, alt: "Indian professional woman" },
  { id: 9, src: avatar9, alt: "Professional with red hair" },
  { id: 10, src: avatar10, alt: "Senior professional man" },
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarSelect: (avatar: string) => void;
}

const AvatarSelector = ({ currentAvatar, onAvatarSelect }: AvatarSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleAvatarSelect = (avatarSrc: string) => {
    onAvatarSelect(avatarSrc);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-gray-600 bg-purple-primary hover:bg-purple-primary/90 p-0"
        >
          <Camera className="h-4 w-4 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4 p-4">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar.src)}
              className={`relative rounded-full transition-all hover:scale-105 ${
                currentAvatar === avatar.src
                  ? "ring-4 ring-purple-primary"
                  : "hover:ring-2 hover:ring-purple-primary/50"
              }`}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;