// utils/ticketOptions.js

export const ticketOptions = [
    {
        category: "Electricity",
        subcategories: [
            { name: "Power Cut", id: 1 },
            { name: "Outage", id: 2 },
            { name: "Flickering Lights", id: 5 },
            { name: "Electrical Fire", id: 6 },
            { name: "Socket Issue", id: 9 },
        ],
    },
    {
        category: "Water Pump",
        subcategories: [
            { name: "Not Working", id: 3 },
            { name: "Leaking", id: 4 },
            { name: "Low Pressure", id: 7 },
            { name: "Water Contamination", id: 8 },
        ],
    },
    {
        category: "Plumbing",
        subcategories: [
            { name: "Clogged Drain", id: 9 },
            { name: "Burst Pipe", id: 10 },
            { name: "Toilet Leak", id: 11 },
            { name: "No Hot Water", id: 12 },
            { name: "Leaky Faucet", id: 13 },
        ],
    },
    {
        category: "Security",
        subcategories: [
            { name: "Broken Lock", id: 14 },
            { name: "Gate Malfunction", id: 15 },
            { name: "Security Camera Not Working", id: 16 },
            { name: "Suspicious Activity", id: 17 },
        ],
    },
    {
        category: "Parking",
        subcategories: [
            { name: "Blocked Parking Space", id: 18 },
            { name: "Unauthorized Vehicle", id: 19 },
            { name: "Damaged Parking Area", id: 20 },
            { name: "Parking Space Not Assigned", id: 21 },
            { name: "Parking Fee Issue", id: 22 },
        ],
    },
    {
        category: "Waste Management",
        subcategories: [
            { name: "Overflowing Bins", id: 23 },
            { name: "Missed Pickup", id: 24 },
            { name: "Waste Spillage", id: 25 },
            { name: "Recycling Issues", id: 26 },
        ],
    },
    {
        category: "Common Area Maintenance",
        subcategories: [
            { name: "Broken Elevator", id: 27 },
            { name: "Lighting Issue", id: 28 },
            { name: "Floor Damage", id: 29 },
            { name: "Furniture Repair", id: 30 },
        ],
    },
    {
        category: "Pest Control",
        subcategories: [
            { name: "Rodent Infestation", id: 31 },
            { name: "Cockroach Infestation", id: 32 },
            { name: "Mosquito Breeding", id: 33 },
            { name: "Termite Damage", id: 34 },
            { name: "Ant Infestation", id: 35 },
        ],
    },
    {
        category: "Landscape Maintenance",
        subcategories: [
            { name: "Lawn Mowing", id: 36 },
            { name: "Tree Trimming", id: 37 },
            { name: "Plant Watering", id: 38 },
            { name: "Garden Waste Removal", id: 39 },
        ],
    },
    {
        category: "HVAC (Heating, Ventilation & Air Conditioning)",
        subcategories: [
            { name: "No Cooling", id: 40 },
            { name: "No Heating", id: 41 },
            { name: "Airflow Issues", id: 42 },
            { name: "AC Leaking", id: 43 },
        ],
    },
    {
        category: "Internet & Wi-Fi",
        subcategories: [
            { name: "No Connectivity", id: 44 },
            { name: "Slow Internet", id: 45 },
            { name: "Wi-Fi Outage", id: 46 },
            { name: "Router Malfunction", id: 47 },
        ],
    },
    {
        category: "Paint & Coating",
        subcategories: [
            { name: "Peeling Paint", id: 48 },
            { name: "Wall Cracks", id: 49 },
            { name: "Color Fading", id: 50 },
            { name: "Mold Stains", id: 51 },
        ],
    },
    {
        category: "Elevator",
        subcategories: [
            { name: "Stuck Between Floors", id: 52 },
            { name: "Broken Buttons", id: 53 },
            { name: "No Power", id: 54 },
            { name: "No Emergency Lights", id: 55 },
        ],
    },
    {
        category: "Noise Complaints",
        subcategories: [
            { name: "Loud Neighbors", id: 56 },
            { name: "Construction Noise", id: 57 },
            { name: "Music/Party Noise", id: 58 },
            { name: "HVAC Noise", id: 59 },
        ],
    },
];

// Flatten the nested array into a single array
export const flattenedOptions = ticketOptions.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        category: category.category,
        subcategory: subcategory.name,
    }))
);

// Columns for announcements


// Columns for tickets


export const expenseColumns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'description', header: 'Description' },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
];