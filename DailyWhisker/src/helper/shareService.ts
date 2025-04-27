/**
 * Share Service
 *
 * Captures an HTML element, uploads it to Firebase Storage, and returns a shareable download URL.
 */
import html2canvas from "html2canvas";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../database/firestore";

/**
 * Converts a given HTML element into a PNG image and uploads it to Firebase Storage.
 *
 * @param cardElement - The HTML element to capture.
 * @returns A promise that resolves to the download URL of the uploaded image.
 */
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
