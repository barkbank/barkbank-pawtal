import { DOG_GENDER, DogGender } from "@/lib/data/db-enums";
import { IMG_PATH } from "@/lib/image-path";
import Image from "next/image";

export function BarkDogAvatar(props: {
  gender: DogGender;
  className?: string;
}) {
  const { gender, className } = props;
  const imgSrc =
    gender === DOG_GENDER.MALE
      ? IMG_PATH.BROWN_DOG_AVATAR
      : IMG_PATH.BORDER_COLLIE_DOG_AVATAR;

  return (
    <Image
      src={imgSrc}
      alt="Generic dog avatar for dog details"
      width={100}
      height={100}
      className={className}
    />
  );
}
