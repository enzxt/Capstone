/**
 * Cat Data Populator Module
 *
 * This module deletes all existing documents from the Firestore "cats" collection 
 * and creates 50 new cat documents with unique names, descriptions, randomly selected 
 * breed IDs, and image URLs fetched from The Cat API.
 */
import fetch from "node-fetch";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDByjlGFC5Hj2-i_v96Han7vgLvTtSnnsY",
  authDomain: "capstone-7965e.firebaseapp.com",
  projectId: "capstone-7965e",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const CAT_API_KEY = "YOUR_CAT_API_KEY";
const BREED_IDS = [
  "abys", // Abyssinian
  "beng", // Bengal
  "mcoo", // Maine Coon
  "sphy", // Sphynx
  "siam", // Siamese
  "pers", // Persian
  "ragd", // Ragdoll
  "norw", // Norwegian Forest
];

const catNames = [
  "Bella", "Tigger", "Chloe", "Oliver", "Simba", "Lucy", "Milo", "Lily",
  "Max", "Nala", "Zoe", "Charlie", "Luna", "Sophie", "Jack", "Stella",
  "Leo", "Mia", "Cleo", "Tiger", "Smokey", "Oscar", "Jasper", "Daisy",
  "Gizmo", "Bailey", "Oreo", "Archie", "Rocky", "Simone", "Willow", "Hazel",
  "Coco", "Frankie", "Bean", "Phoebe", "Penny", "Zelda", "Ellie", "Pepper",
  "Rosie", "Athena", "Maple", "Ginger", "Misty", "Harley", "Lucky", "Olive",
  "Poppy", "Mocha"
];

const catDescriptions = [
  "Friendly cat who loves belly rubs.",
  "Enjoys chasing laser pointers for hours.",
  "Prefers sunbathing near the window.",
  "Incredibly talkative and opinionated feline.",
  "Skilled at opening cabinet doors.",
  "Nap champion who adores fluffy blankets.",
  "Likes to greet visitors at the door.",
  "Expert at giving gentle nose boops.",
  "Adores cardboard boxes and crinkly bags.",
  "Demands cuddles every morning without fail.",
  "Often found perched on top of the fridge.",
  "Gentle soul with a melodic purr.",
  "Enjoys watching birds through the window.",
  "Plays fetch like a mini retriever.",
  "Constant companion who follows you around.",
  "Mischievous kitty who hides socks.",
  "Obsessed with catnip mice and feathers.",
  "Talks back when called by name.",
  "Never says no to a warm lap.",
  "Extremely curious about running water.",
  "Happy to greet other household pets.",
  "Prefers sleeping in laundry baskets.",
  "Demure meows but huge personality.",
  "Soft fur that demands constant petting.",
  "Polite beggar at dinnertime for treats.",
  "Loves to snooze in sunbeams daily.",
  "Zoomies occur every night at 3 AM.",
  "Picky about food, but loves fish flavors.",
  "Chirps at squirrels outside the window.",
  "Kneads blankets like a tiny breadmaker.",
  "Constantly tries to sit on laptops.",
  "Affectionate cuddler when the mood strikes.",
  "Watches TV with rapt attention.",
  "Always ready for a game of chase.",
  "Big eyes that melt your heart.",
  "Shy with strangers, but super loyal.",
  "Expert biscuit-maker with gentle paws.",
  "Loves grooming other pets in the house.",
  "Polydactyl kitty with extra toes!",
  "Communicates via soft chirps and coos.",
  "Has a secret stash of stolen hair ties.",
  "Enjoys slow blinks as a sign of trust.",
  "Rolls over for belly rubs every afternoon.",
  "Sleeps in the oddest positions imaginable.",
  "Demands to share your pillow at night.",
  "Could chase laser dots for eternity.",
  "Never misses a chance to chase dust motes.",
  "Greets you at the door every time.",
  "Clumsy but very determined jumper.",
  "Snores softly during naps, incredibly cute."
];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function fetchBreedImage(breedId: string): Promise<string> {
  try {
    const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=1`;
    const resp = await fetch(url, {
      headers: { "x-api-key": CAT_API_KEY },
    });
    if (!resp.ok) {
      throw new Error(`Cat API request failed: ${resp.status}`);
    }
    const data = await resp.json();
    if (!data || data.length === 0) {
      return "https://via.placeholder.com/600x400?text=No+Image+Found";
    }
    return data[0].url;
  } catch (error) {
    console.error("Error fetching breed image:", error);
    return "https://via.placeholder.com/600x400?text=Error+Loading+Image";
  }
}

async function deleteAllCats() {
  console.log("Deleting existing cats collection...");
  const catsColl = collection(firestore, "cats");
  const snapshot = await getDocs(catsColl);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
  console.log("All existing cat docs deleted.");
}

async function createFiftyCats() {
  for (let i = 0; i < 50; i++) {
    const name = catNames[i];
    const description = catDescriptions[i];

    const breedId = pickRandom(BREED_IDS);

    const imageUrl = await fetchBreedImage(breedId);

    const catData = {
      name,
      description,
      breedId,
      imageUrl,
    };

    const ref = doc(collection(firestore, "cats"));

    await setDoc(ref, catData);

    console.log(`Created Cat #${i + 1} =>`, catData);
  }
}

(async function main() {
  try {
    await deleteAllCats();

    await createFiftyCats();

    console.log("Done populating 50 cats with unique names & descriptions!");
    process.exit(0);
  } catch (err) {
    console.error("Error populating cat docs:", err);
    process.exit(1);
  }
})();
