'use server';

// This is a mock service that simulates fetching and storing farm activity data.
// In a real application, you would replace this with a call to a real database.

export type Activity = {
  id: string;
  date: string;
  text: string;
};

// Starting with some mock data to make the timeline look populated.
const mockActivities: Activity[] = [
    {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Applied organic fertilizer to the banana plantation.',
    },
    {
        id: '2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Checked the irrigation system for the vegetable patch.',
    },
    {
        id: '1',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Harvested coconuts from the northern section.',
    },
];


export async function getActivities(): Promise<Activity[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data sorted by most recent
  return mockActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addActivity(text: string): Promise<Activity> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newActivity: Activity = {
        id: (mockActivities.length + 1).toString(),
        date: new Date().toISOString(),
        text: text,
    };

    mockActivities.unshift(newActivity); // Add to the beginning of the array
    return newActivity;
}
