// src/components/blocks/BlockForm/BlockForm.barba.ts

import barba from "@barba/core";
import { gsap } from "gsap";

export default function registerBlockFormHooks() {
  if (typeof window === "undefined" || !barba) return;

  // 1) Delegated listener on document that catches any <form id="block-form">
  document.addEventListener("submit", async (e) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLFormElement) || target.id !== "block-form") {
      return;
    }
    e.preventDefault();

    const form = target as HTMLFormElement;
    const success = document.getElementById("form-success");
    if (!success) return;

    // Grab values (optional logging)
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    console.log("🧾 Form values:", values);

    // Disable the submit button
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = "Submitting...";
    }

    // Simulate async (replace with real fetch/axios if needed)
    await new Promise((res) => setTimeout(res, 1000));

    // Hide the form and show success message
    form.classList.add("hidden");
    success.classList.remove("hidden");
  });

  // 2) Animate the whole #blockform container on every Barba navigation,
  //    but delay until after the overlay+fade is done (1 s).
  barba.hooks.afterEnter(({ next }: any) => {
    setTimeout(() => {
      const container = next.container as HTMLElement;
      const el = container.querySelector<HTMLElement>("#blockform");
      if (!el) return;

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }, 1000); // ← match your overlay+fade duration (1 s)
  });
}

registerBlockFormHooks();

