import React from "react";
import { User } from "next-auth";
import Image from "next/image";
import { Icon, IconFallback } from "./ui/avatar";

type Props = {
  user: User;
};

const UserIcon = ({ user }: Props) => {
  return (
    <Icon>
      {user.image ? (
        <div className="relative w-ful h-full aspect-square">
          <Image
            fill
            src={user.image}
            referrerPolicy="no-referrer"
            alt="User Credentials"
          />
        </div>
      ) : (
        <IconFallback>
          <span className="sr-only">{user?.name}</span>
        </IconFallback>
      )}
    </Icon>
  );
};

export default UserIcon;