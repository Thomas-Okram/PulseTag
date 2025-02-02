import QRCode from "qrcode";

export const generateQRCode = async (profileUrl) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      errorCorrectionLevel: "H",
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};
