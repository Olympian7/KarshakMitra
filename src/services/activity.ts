'use server';

// This is a mock service that simulates fetching and storing farm activity data.
// In a real application, you would replace this with a call to a real database.

export type Activity = {
  id: string;
  date: string;
  text: string;
};

// Starting with some mock data to make the timeline look populated.
let mockActivities: Activity[] = [
    {
        id: '7',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Finished weeding the okra patch. Crop looks healthy.',
    },
    {
        id: '6',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Applied organic fertilizer to the banana plantation.',
    },
    {
        id: '5',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Checked the irrigation system for the vegetable patch. All sprinklers are working correctly.',
    },
    {
        id: '4',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Harvested coconuts from the northern section.',
    },
    {
        id: '3',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Noticed some minor pest activity on the lentil crops. Applied a neem oil solution.',
    },
    {
        id: '2',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Prepared soil in the new plot for ginger planting next week.',
    },
    {
        id: '1',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Planted high-yield paddy variety in the main field.',
    },
];


export async function getActivities(): Promise<Activity[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data sorted by most recent
  try {
    const activities = mockActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return JSON.parse(JSON.stringify(activities)); // Simulate a clean fetch
  } catch (e) {
    // If there's any error (e.g., in a real DB call), return an empty array
    return [];
  }
}

export async function addActivity(text: string): Promise<Activity> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newActivity: Activity = {
        id: (mockActivities.length + 1).toString() + Date.now(), // More unique ID
        date: new Date().toISOString(),
        text: text,
    };

    mockActivities.unshift(newActivity); // Add to the beginning of the array
    return newActivity;
}
