import { DOG_GENDER, DogGender } from "@/lib/bark/enums/dog-gender";
import { IMG_PATH } from "@/lib/image-path";
import { Dog } from "lucide-react";
import Image from "next/image";

export function DogAvatar(props: { dogGender: DogGender }) {
  const { dogGender } = props;
  const size = 24;
  if (dogGender === DOG_GENDER.MALE) {
    return (
      <Image
        src={IMG_PATH.BROWN_DOG_AVATAR}
        width={size}
        height={size}
        alt="Generic male dog avatar"
      />
    );
  }
  if (dogGender === DOG_GENDER.FEMALE) {
    return (
      <Image
        src={IMG_PATH.BORDER_COLLIE_DOG_AVATAR}
        width={size}
        height={size}
        alt="Generic female dog avatar"
      />
    );
  }
  return <Dog size={size} />;
}
