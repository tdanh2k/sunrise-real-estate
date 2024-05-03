import {
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import image from "../../../assets/not_found.svg";
import classes from "./NotFound.module.css";
import { Link } from "@tanstack/react-router";

export const NotFoundComponent = () => {
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Có gì đó không đúng...</Title>
          <Text c="dimmed" size="lg">
            Trang bạn cần tìm không tồn tại. Có thể bạn nhập sai địa chỉ, hoặc trang này đã được dời sang một URL khác.
          </Text>
          <Button
            component={Link}
            to="/"
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
          >
            Quay về trang chủ
          </Button>
        </div>
        <Image src={image} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
};
