import { Box } from "@chakra-ui/react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

interface WrapperProps {
  children: any;
  variant?: "regular" | "small";
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => (
  <Box maxW={variant === "regular" ? "3xl" : "lg"} mx="auto" mt="8" w="100%">
    {children}
  </Box>
);
