import { Dynamic } from "../../../types/dynamic";
import { trpc } from "../../../utils/trpc";
import DynamicCard from "./dynamicCard";
export const DynamicList = ({
  dynamic,
  userId,
}: {
  dynamic?: Dynamic[];
  userId?: string;
}) => {
  const dynamics: Dynamic[] = dynamic
    ? dynamic.map((item) => {
        return { ...item, isUp: false, isDown: false };
      })
    : (trpc.dynamic.getAllDynamics.useQuery({ userId }).data as Dynamic[]);

  return (
    <>
      {dynamics ? (
        dynamics.map((item, index) => {
          return <DynamicCard key={index} dynamic={item} />;
        })
      ) : (
        <h3>无博客</h3>
      )}
    </>
  );
};

export default DynamicList;
