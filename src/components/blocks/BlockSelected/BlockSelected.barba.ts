import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import barba from "@barba/core";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function registerBlockDescriptionHooks(): void {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(({ next }: any) => {
      
    
  });
}

registerBlockDescriptionHooks();
