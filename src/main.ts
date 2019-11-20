import MothershipLogger from "./logger";

if (typeof window.MothershipConfig !== "undefined") {
  const options = window.MothershipConfig;
  window.Mothership = new MothershipLogger(options);
} else {
  console.warn("Mothership: You need to set (at minimum) window.MothershipConfig={ apiKey: xxxxx } ")
}
