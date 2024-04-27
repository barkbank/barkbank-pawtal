import { BarkButton } from "@/components/bark/bark-button";
import { BarkH1 } from "@/components/bark/bark-typography";
import { RoutePath } from "@/lib/route-path";

export default async function Page(props: { params: { dogId: string } }) {
  const {
    params: { dogId },
  } = props;
  return (
    <div className="p-3">
      <BarkH1>Edit Dog {dogId}</BarkH1>
      <BarkButton variant="brandInverse" href={RoutePath.USER_MY_PETS}>
        Back
      </BarkButton>
    </div>
  );
}
