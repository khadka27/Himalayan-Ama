import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

interface AnimatedInsProps {
  instructors: any[];
}

export function AnimatedIns({ instructors }: AnimatedInsProps) {
  return <AnimatedTestimonials testimonials={instructors} />;
}
