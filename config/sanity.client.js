// lib/sanity.client.js

import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "mshrknub",
  dataset: "production",
  apiVersion: "2024-01-01",  
  useCdn: false,              
});
