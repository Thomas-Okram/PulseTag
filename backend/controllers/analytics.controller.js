import { Analytics } from "../models/analytics.model.js";
import geoip from "geoip-lite";
export const trackEvent = async (req, res) => {
  try {
    const visitorIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(visitorIP);
    const event = new Analytics({
      userId: req.userId,
      action: req.body.action,
      visitorIP,
      location: geo?.city || "Unknown",
    });
    await event.save();
    res
      .status(200)
      .json({ success: true, message: "Event tracked successfully" });
  } catch (error) {
    console.error("Error in trackEvent:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
