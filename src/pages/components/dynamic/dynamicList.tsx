import { useEffect, useState } from "react";
import { Dynamic } from "../../../types/dynamic";
import { trpc } from "../../../utils/trpc";
import DynamicCard from "./dynamicCard";
import { Loader } from "@mantine/core";
import Editor from "../editor";
import dynamic from "next/dynamic";
const oldDynamics: Dynamic[] = [];
export const DynamicList = ({
  userId,
  mutate,
  searchData,
  isLoading,
}: {
  userId?: string;
  mutate?: unknown;
  searchData?: string;
  isLoading?: unknown;
}) => {
  const [index, setIndex] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>();

  const dynamics: Dynamic[] = trpc.dynamic.getDynamics.useQuery({
    userId,
    index: index,
    size: 6,
    searchData,
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
      if (result + 400 >= trueHeight) {
        if (dynamics) {
          setIndex(index + 1);
          oldDynamics.push(...dynamics);
        }
      }
    };
  }, [dynamics, index]);
  useEffect(() => {
    oldDynamics;
    setIndex(1);
    if (dynamics) oldDynamics.push(...dynamics);
    setRefresh(!refresh);
  }, [searchData]);
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
      {oldDynamics.length !== 0
        ? oldDynamics.map((item) => {
            return <DynamicCard key={item.id} dynamic={item} />;
          })
        : dynamics
        ? dynamics.map((item) => <DynamicCard key={item.id} dynamic={item} />)
        : undefined}

      {!dynamics ? <Loader size="sm" /> : undefined}
    </>
  );
};

export default DynamicList;
