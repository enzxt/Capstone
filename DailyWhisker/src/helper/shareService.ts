/**
 * shareService
 *
 * Captures an HTML element as a canvas using html2canvas, converts it to a PNG data URL,
 * uploads the image to Firebase Storage under the "shared-cards" directory with a unique filename,
 * retrieves and returns the download URL for the uploaded image.
 */
import html2canvas from "html2canvas";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../database/firestore";

export async function shareCard(cardElement: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(cardElement, { scale: 2 });
    const dataURL = canvas.toDataURL("image/png");

    const fileName = `shared-cards/cat-${Date.now()}.png`;
    const storageReference = storageRef(storage, fileName);

    await uploadString(storageReference, dataURL, "data_url");

    const downloadURL = await getDownloadURL(storageReference);
    return downloadURL;
  } catch (error) {
    console.error("Error sharing card:", error);
    throw error;
  }
}
