import { createFileRoute } from "@tanstack/react-router";
import { FC } from "react";

const PostType: FC = () => {
    return <></>
}

export const Route = createFileRoute("/management/_management/posts/_posts/post_type")({
    component: PostType
})