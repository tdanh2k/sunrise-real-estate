import { createLazyFileRoute } from "@tanstack/react-router";
import { Banner } from "../-components/Banner";
import { BestFlatList } from "../-components/BestFlatList";
import { FlatList } from "../-components/FlatList";
import { References } from "../-components/References";
import { Subscribe } from "../-components/Subscribe";
import { TeamList } from "../-components/TeamList";

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

export const Route = createLazyFileRoute("/_client/")({
  component: Home,
});
