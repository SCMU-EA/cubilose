import { Stack, Container } from "@mantine/core";
import { Dynamic } from "../../../types/dynamic";
import DynamicCard from "./dynamicCard";
export const DynamicList = ({ dynamic }: { dynamic: Dynamic[] }) => {
  const dynamicsPorps: Dynamic[] = dynamic;
  const dynamics: Dynamic[] = dynamicsPorps.map((item) => {
    return { ...item, isUp: false, isDown: false };
  });

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
