import { Banner } from "./-components/Banner";
import { BestFlatList } from "./-components/BestFlatList";
import { FlatList } from "./-components/FlatList";
import { References } from "./-components/References";
import { Subscribe } from "./-components/Subscribe";
import { TeamList } from "./-components/TeamList";
import { createFileRoute } from "@tanstack/react-router";

const Home = () => {
  return (
    <>
      <Banner />
      <FlatList />
      <BestFlatList />
      <Subscribe />
      <TeamList />
      <References />
    </>
  );
};

export const Route = createFileRoute("/_client/")({
  component: Home,
});
