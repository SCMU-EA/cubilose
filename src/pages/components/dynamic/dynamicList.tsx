import { useEffect, useState } from "react";
import { Dynamic } from "../../../types/dynamic";
import { trpc } from "../../../utils/trpc";
import DynamicCard from "./dynamicCard";
import { LoadingOverlay } from "@mantine/core";
import Editor from "../editor";
export const DynamicList = ({
  userId,
  mutate,
  isLoading,
}: {
  userId?: string;
  mutate: any;
  isLoading: any;
}) => {
  const [pageSize, setPageSize] = useState<number>(6);
  const dynamics: Dynamic[] = trpc.dynamic.getDynamics.useQuery({
    userId,
    index: 1,
    size: pageSize,
    orderBy: "createTime",
  }).data as Dynamic[];

  useEffect(() => {
    window.onscroll = function () {
      // scrollTop是滚动条滚动时，距离顶部的距离
      const visionHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      const scrolledHeight =
        document.documentElement.scrollTop || document.body.scrollTop;

      const trueHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const result = visionHeight + scrolledHeight;

      console.log("r:", result, "t:", trueHeight, result > trueHeight);
      if (result + 1 >= trueHeight) {
        setPageSize(pageSize + 6);
      }
    };
  }, [dynamics]);

  return (
    <>
      {userId ? undefined : (
        <Editor
          mutate={mutate}
          isLoading={isLoading}
          addNewDynamic={(dynamic: Dynamic) => {
            dynamics.unshift(dynamic);
            console.log(dynamic);
          }}
        ></Editor>
      )}
      {dynamics ? (
        dynamics.map((item, index) => {
          return <DynamicCard key={index} dynamic={item} />;
        })
      ) : (
        <LoadingOverlay visible overlayBlur={2}></LoadingOverlay>
      )}
    </>
  );
};

export default DynamicList;
