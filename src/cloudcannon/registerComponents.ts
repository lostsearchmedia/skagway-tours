// Register Astro components for live re-rendering in CloudCannon's Visual
// Editor. Only loaded inside CloudCannon — see BaseLayout.astro.
//
// To enable component re-rendering on a section, wrap it in
// <div data-editable="component" data-component="<key>" data-prop="...">
// and register the component below.

import { registerAstroComponent } from "@cloudcannon/editable-regions/astro";
import Hero from "../components/Hero.astro";
import PageHero from "../components/PageHero.astro";
import TourCard from "../components/TourCard.astro";

registerAstroComponent("hero", Hero);
registerAstroComponent("page-hero", PageHero);
registerAstroComponent("tour-card", TourCard);
