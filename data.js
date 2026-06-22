// Kotha Bada — sample listings
// In a real app these come from a database. For now they live here + new
// owner posts are saved in the browser (localStorage).

const SAMPLE_LISTINGS = [
  {
    id: "kb1",
    title: "Sunny 2BHK Flat near Baneshwor Chowk",
    type: "Flat",
    area: "New Baneshwor",
    city: "Kathmandu",
    price: 22000,
    bedrooms: 2,
    bathrooms: 1,
    parking: true,
    furnished: "Semi-furnished",
    forWho: "Family",
    description:
      "Bright top-floor flat with balcony, 24hr water, inverter backup, walking distance to Baneshwor Chowk and bus stops.",
    owner: "Sita Shrestha",
    phone: "9801234567",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=70",
  },
  {
    id: "kb2",
    title: "Single Room for Students in Kirtipur",
    type: "Room",
    area: "Kirtipur",
    city: "Kathmandu",
    price: 6500,
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: "Furnished",
    forWho: "Students",
    description:
      "Affordable furnished room near TU campus. Shared kitchen, drinking water, quiet and safe neighborhood.",
    owner: "Ram Maharjan",
    phone: "9812345678",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=70",
  },
  {
    id: "kb3",
    title: "Modern 3BHK House with Parking in Lalitpur",
    type: "House",
    area: "Jhamsikhel, Lalitpur",
    city: "Lalitpur",
    price: 55000,
    bedrooms: 3,
    bathrooms: 3,
    parking: true,
    furnished: "Unfurnished",
    forWho: "Family",
    description:
      "Spacious independent house with garden, car + bike parking, solar water heater, in a peaceful diplomatic area.",
    owner: "Anil Tamang",
    phone: "9823456789",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=70",
  },
  {
    id: "kb4",
    title: "Cozy 1BHK for Couples in Chabahil",
    type: "Flat",
    area: "Chabahil",
    city: "Kathmandu",
    price: 14000,
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    furnished: "Semi-furnished",
    forWho: "Couple",
    description:
      "Clean 1BHK with bike parking, regular water supply, near Chabahil Chowk and supermarket.",
    owner: "Gita Karki",
    phone: "9845678901",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=70",
  },
  {
    id: "kb5",
    title: "Office Space / Flat in Putalisadak",
    type: "Office",
    area: "Putalisadak",
    city: "Kathmandu",
    price: 40000,
    bedrooms: 4,
    bathrooms: 2,
    parking: true,
    furnished: "Unfurnished",
    forWho: "Office",
    description:
      "Prime location open hall suitable for office or institute. Main road facing, lift, generator backup.",
    owner: "Bikash Thapa",
    phone: "9856789012",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=70",
  },
  {
    id: "kb6",
    title: "Peaceful Room with Balcony in Bhaktapur",
    type: "Room",
    area: "Bhaktapur",
    city: "Bhaktapur",
    price: 8000,
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    furnished: "Furnished",
    forWho: "Anyone",
    description:
      "Furnished room with private balcony and great mountain view. Near Durbar Square, friendly landlord.",
    owner: "Maya Duwal",
    phone: "9867890123",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=70",
  },
];
