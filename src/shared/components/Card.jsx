import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

/**
 * Modern Card Component with animations
 */
const Card = ({
  children,
  hover: hoverProp,
  animate = true,
  padding = 6,
  ...props
}) => {
  const isInteractive = Boolean(props.onClick);
  const hover = hoverProp ?? isInteractive;
  const hoverEffect = hover
    ? {
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }
    : {};

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <MotionBox
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderRadius="xl"
      boxShadow="md"
      p={padding}
      transition="all 0.3s"
      _hover={hoverEffect}
      {...animationProps}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default Card;
