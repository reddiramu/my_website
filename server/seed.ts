import { db } from "./db";
import { places } from "@shared/schema";

async function seed() {
  console.log("Seeding database with popular places...");

  const placesData = [
    {
      name: "Taj Mahal",
      location: "Agra, Uttar Pradesh",
      description: "The Taj Mahal is an ivory-white marble mausoleum on the southern bank of the river Yamuna. Commissioned in 1631 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, it stands as a testament to eternal love and is considered the jewel of Muslim art in India.",
      importance: "UNESCO World Heritage Site and one of the Seven Wonders of the World. A magnificent white marble mausoleum symbolizing eternal love and showcasing the pinnacle of Mughal architecture.",
      imageUrl: "/generated_images/Taj_Mahal_sunrise_hero_2ac0516e.png",
      category: "Historical"
    },
    {
      name: "Jaipur - Pink City",
      location: "Jaipur, Rajasthan",
      description: "Jaipur, the capital of Rajasthan, is known as the Pink City due to the distinctive color of its buildings. Founded in 1727 by Maharaja Sawai Jai Singh II, it's home to magnificent palaces, forts, and vibrant bazaars that showcase the royal heritage of Rajasthan.",
      importance: "The capital of Rajasthan known for its stunning pink-hued architecture, royal palaces like Hawa Mahal and City Palace, and vibrant culture that brings alive the grandeur of India's royal past.",
      imageUrl: "/generated_images/Jaipur_Pink_City_palace_9f7c1941.png",
      category: "Cultural"
    },
    {
      name: "Kerala Backwaters",
      location: "Kerala",
      description: "The Kerala backwaters are a chain of brackish lagoons and lakes lying parallel to the Arabian Sea coast. Known locally as Kayals, they extend over 900 kilometers and offer a unique ecosystem with coconut groves, paddy fields, and traditional village life along the waterways.",
      importance: "A network of tranquil lagoons and lakes offering unique houseboat experiences through lush tropical landscapes. Perfect for experiencing rural Kerala's serene beauty and traditional lifestyle.",
      imageUrl: "/generated_images/Kerala_backwaters_houseboat_scene_afc0f9db.png",
      category: "Nature"
    },
    {
      name: "Varanasi",
      location: "Varanasi, Uttar Pradesh",
      description: "Varanasi, also known as Benares or Kashi, is one of the oldest continuously inhabited cities in the world. Situated on the banks of the sacred Ganges River, it's a major pilgrimage site for Hindus and is believed to be the spiritual capital of India.",
      importance: "One of the oldest living cities in the world and the spiritual capital of India. The ghats along the Ganges River offer profound spiritual experiences and insight into Hindu traditions and philosophy.",
      imageUrl: "/generated_images/Varanasi_Ganges_ghats_sunset_0070a7b0.png",
      category: "Spiritual"
    },
    {
      name: "Goa Beaches",
      location: "Goa",
      description: "Goa is India's smallest state by area but one of its most popular tourist destinations. Known for its pristine beaches, Portuguese colonial architecture, vibrant nightlife, and laid-back atmosphere, Goa offers a perfect blend of relaxation and adventure along the Arabian Sea.",
      importance: "Famous for pristine beaches, Portuguese heritage, vibrant nightlife, and a perfect blend of relaxation and adventure. From water sports to beach parties, Goa caters to every type of traveler.",
      imageUrl: "/generated_images/Goa_beach_sunset_paradise_5959d8a4.png",
      category: "Beach"
    },
    {
      name: "Himalayas",
      location: "Northern India",
      description: "The Indian Himalayan Region spans across 12 states and encompasses some of the world's highest peaks. This majestic mountain range offers breathtaking landscapes, adventure sports, Buddhist monasteries, hill stations, and serves as the source of major rivers like the Ganges and Indus.",
      importance: "The world's highest mountain range offering breathtaking landscapes, trekking adventures, spiritual retreats, and serene beauty. Home to hill stations like Shimla, Manali, and Leh-Ladakh.",
      imageUrl: "/generated_images/Himalayan_mountains_pristine_peaks_67a6bf52.png",
      category: "Mountains"
    },
    {
      name: "Gateway of India",
      location: "Mumbai, Maharashtra",
      description: "The Gateway of India is an iconic monument overlooking the Arabian Sea in Mumbai. Built during the British Raj in 1924 to commemorate the visit of King George V and Queen Mary, it's now a popular tourist attraction and symbolizes Mumbai's colonial heritage.",
      importance: "An iconic monument and symbol of Mumbai, built during the British Raj, overlooking the Arabian Sea. It serves as a popular gathering spot and represents the city's rich colonial history.",
      imageUrl: "/generated_images/Gateway_of_India_Mumbai_4c82f40b.png",
      category: "Historical"
    },
    {
      name: "Rajasthan Forts",
      location: "Various locations, Rajasthan",
      description: "Rajasthan is home to numerous magnificent hill forts that showcase the architectural brilliance and warrior history of the region. Notable forts include Mehrangarh Fort in Jodhpur, Amber Fort in Jaipur, and Chittorgarh Fort, each telling tales of valor, romance, and royal grandeur.",
      importance: "Majestic hill forts showcasing the royal heritage, architectural brilliance, and warrior history of Rajasthan. These UNESCO World Heritage sites offer stunning views and insights into India's medieval past.",
      imageUrl: "/generated_images/Rajasthan_desert_fort_majestic_ad2319e2.png",
      category: "Historical"
    }
  ];

  try {
    // Check if places already exist
    const existingPlaces = await db.select().from(places);
    
    if (existingPlaces.length > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    // Insert places
    await db.insert(places).values(placesData);
    console.log(`✓ Successfully seeded ${placesData.length} places!`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
