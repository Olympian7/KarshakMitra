
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export type Activity = {
  id: string;
  date: string; // Storing as ISO string for consistency
  text: string;
};

// Starting with some mock data to make the timeline look populated.
// This will only be used if the database is empty.
const mockActivities: Omit<Activity, 'id' | 'date'>[] = [
    { text: 'Finished weeding the sugarcane field.' },
    { text: 'Applied fertilizer to the banana plantation.' },
    { text: 'Checked irrigation for the paddy fields.'},
    { text: 'Harvested turmeric from the southern plot.' },
    { text: 'Noticed some pest activity on the cotton plants. Applied a neem oil solution.' },
    { text: 'Prepared soil for the next batch of groundnuts.' },
    { text: 'Planted new paddy saplings in the main field.' },
];


async function seedInitialActivities() {
    console.log("Seeding initial activities...");
    const activitiesCollection = collection(db, 'activities');
    for (const activity of mockActivities) {
        // Add a slight delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 50));
        await addDoc(activitiesCollection, {
            ...activity,
            date: serverTimestamp(), // Use server timestamp for seeding
        });
    }
}

export async function getActivities(): Promise<Activity[]> {
  const activitiesCollection = collection(db, 'activities');
  const q = query(activitiesCollection, orderBy('date', 'desc'));
  
  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // If there are no activities, seed the database with mock data.
        await seedInitialActivities();
        // Re-fetch after seeding
        const seededSnapshot = await getDocs(q);
        const activities = seededSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                date: (data.date as Timestamp).toDate().toISOString(),
            };
        });
        return activities;
    }

    const activities = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Handle cases where date might be null temporarily during creation
        if (!data.date) {
            return {
                id: doc.id,
                text: data.text,
                date: new Date().toISOString()
            }
        }
        return {
            id: doc.id,
            text: data.text,
            // Convert Firestore Timestamp to ISO string
            date: (data.date as Timestamp).toDate().toISOString(),
        }
    });
    return activities;
  } catch (e) {
    console.error("Error fetching activities from Firestore:", e);
    // If there's any error, return mock data to prevent UI crashes
    return mockActivities.map((act, index) => ({
        id: `mock-${index}`,
        text: act.text,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
    })).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export async function addActivity(text: string): Promise<Activity> {
    const activitiesCollection = collection(db, 'activities');
    
    const newActivityData = {
        text: text,
        date: serverTimestamp(), // Use Firestore server timestamp
    };

    const docRef = await addDoc(activitiesCollection, newActivityData);

    // For the return value, we'll use the current client date as an approximation.
    // The server-generated timestamp will be correct on the next fetch.
    return {
        id: docRef.id,
        text: text,
        date: new Date().toISOString(),
    };
}
