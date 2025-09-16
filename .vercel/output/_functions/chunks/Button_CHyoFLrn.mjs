import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, g as renderSlot } from './astro/server_BsvY2apF.mjs';
import 'kleur/colors';

const $$Astro = createAstro("https://project-harmonia.vercel.app");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    href,
    variant = "primary",
    size = "md",
    class: className = "",
    ...rest
  } = Astro2.props;
  const variants = {
    primary: "bg-sage text-white hover:bg-gold hover:text-ebony",
    secondary: "bg-gold text-ebony hover:bg-sage hover:text-white",
    outline: "bg-transparent border-2 border-sage text-sage hover:bg-sage hover:text-white"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };
  const baseClasses = "inline-block font-slogan rounded-full transition-all duration-300 transform hover:-translate-y-1";
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  const Tag = href ? "a" : "button";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class": classes, ...rest }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/jules/Downloads/harmonia/src/components/ui/Button.astro", void 0);

export { $$Button as $ };
