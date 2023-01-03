import RelationCard from "./relationCard";
import { Container } from "@mantine/core";
import { trpc } from "../../../utils/trpc";
const RelationList = ({ type, userId }: { type: string; userId: string }) => {
  const relationIds: { fans?: string; followings?: string } =
    trpc.userRelation.getRelations.useQuery({
      userId,
      type,
    }).data as { fans?: string; followings?: string };
  const userIds = relationIds?.fans
    ? relationIds?.fans
    : relationIds?.followings;
  const userIdList: Array<string> = JSON.parse(userIds ?? "[]");
  return (
    <>
      <Container mih={100} bg="white">
        {userIdList
          ? userIdList.map((userId: string) => (
              <RelationCard key={userId} userId={userId} />
            ))
          : undefined}
      </Container>
    </>
  );
};

export default RelationList;
