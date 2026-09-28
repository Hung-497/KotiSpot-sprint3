import house_image from "./src/assets/house1.jpg"

export const navLinks = [
    { id: 1, href: "/rent", text: "For Rent", footerText: "Rent a house" },
    { id: 2, href: "/buy", text: "Buy", footerText: "Buy a house" },
    { id: 3, href: "/sell", text: "Sell", footerText: "Sell a house" },
    { id: 4, href: "/contact", text: "Contact us", footerText: "Contact us" },
];

export const authLinks = [
    { id: 1, href: "/login", text: "Login" },
    { id: 2, href: "/register", text: "Register" },
];

export const reviews = [
  // PROPERTY 1
  {
    id: 1,
    propertyId: 1,
    userName: "Emma",
    rating: 5,
    comment: "Great location and a very comfortable apartment",
    date: "2026-08-12"
  },
  {
    id: 2,
    propertyId: 1,
    userName: "Leo",
    rating: 4,
    comment: "Clean apartment and easy access to public transport",
    date: "2026-08-20"
  },
  {
    id: 3,
    propertyId: 1,
    userName: "Sara",
    rating: 5,
    comment: "Bright rooms and a pleasant neighborhood",
    date: "2026-09-02"
  },
  {
    id: 4,
    propertyId: 1,
    userName: "Han",
    rating: 2,
    comment: "This is an poor acommodation i've ever had",
    date: "2026-09-02"
  },

  // PROPERTY 2
  {
    id: 4,
    propertyId: 2,
    userName: "Oliver",
    rating: 5,
    comment: "Perfect studio for one person and close to many cafes",
    date: "2026-07-15"
  },
  {
    id: 5,
    propertyId: 2,
    userName: "Ella",
    rating: 4,
    comment: "Small but practical and nicely furnished",
    date: "2026-08-01"
  },

  // PROPERTY 3
  {
    id: 6,
    propertyId: 3,
    userName: "Lucas",
    rating: 5,
    comment: "Very spacious house and perfect for a family",
    date: "2026-06-11"
  },
  {
    id: 7,
    propertyId: 3,
    userName: "Olivia",
    rating: 5,
    comment: "The private yard is one of the best parts of the property",
    date: "2026-07-03"
  },
  {
    id: 8,
    propertyId: 3,
    userName: "Elias",
    rating: 4,
    comment: "Quiet residential area and plenty of space",
    date: "2026-07-29"
  },

  // PROPERTY 4
  {
    id: 9,
    propertyId: 4,
    userName: "Sophia",
    rating: 5,
    comment: "Beautiful apartment and very close to parks and shops",
    date: "2026-07-09"
  },
  {
    id: 10,
    propertyId: 4,
    userName: "Alex",
    rating: 4,
    comment: "Good size for one or two people and a great location",
    date: "2026-07-25"
  },

  // PROPERTY 5
  {
    id: 11,
    propertyId: 5,
    userName: "Isabella",
    rating: 5,
    comment: "Amazing city views and a very modern interior",
    date: "2026-06-18"
  },
  {
    id: 12,
    propertyId: 5,
    userName: "Matias",
    rating: 5,
    comment: "The terrace is spacious and the apartment feels premium",
    date: "2026-07-14"
  },
  {
    id: 13,
    propertyId: 5,
    userName: "Charlotte",
    rating: 4,
    comment: "Great apartment with lots of natural light",
    date: "2026-08-05"
  },

  // PROPERTY 6
  {
    id: 14,
    propertyId: 6,
    userName: "Amelia",
    rating: 5,
    comment: "Peaceful area and very good transport connections",
    date: "2026-07-02"
  },
  {
    id: 15,
    propertyId: 6,
    userName: "Samuel",
    rating: 4,
    comment: "Comfortable apartment with plenty of space",
    date: "2026-07-30"
  },

  // PROPERTY 7
  {
    id: 16,
    propertyId: 7,
    userName: "Emily",
    rating: 5,
    comment: "Beautiful traditional house with lots of character",
    date: "2026-06-20"
  },
  {
    id: 17,
    propertyId: 7,
    userName: "Joonas",
    rating: 5,
    comment: "The private garden and peaceful area are excellent",
    date: "2026-07-17"
  },
  {
    id: 18,
    propertyId: 7,
    userName: "Maria",
    rating: 4,
    comment: "A charming house in a very nice part of Porvoo",
    date: "2026-08-07"
  },

  // PROPERTY 8
  {
    id: 19,
    propertyId: 8,
    userName: "Ella",
    rating: 4,
    comment: "Affordable apartment with convenient transport options",
    date: "2026-07-12"
  },
  {
    id: 20,
    propertyId: 8,
    userName: "Adam",
    rating: 5,
    comment: "Clean apartment and everything needed is nearby",
    date: "2026-08-03"
  }
];

export const hosts = [
  {
    id: 1,
    name: "Mikko Laine",
    role: "Property owner",
    image: ".src/host1.jpg",
    joinedYear: 2022,
    description: "Property owner based in Helsinki with experience in long-term rentals"
  },

  {
    id: 2,
    name: "Anna Korhonen",
    role: "Property owner",
    image: "/images/hosts/host2.jpg",
    joinedYear: 2023,
    description: "Apartment owner focused on comfortable homes in central Helsinki"
  },

  {
    id: 3,
    name: "Jari Nieminen",
    role: "Property owner",
    image: "/images/hosts/host3.jpg",
    joinedYear: 2021,
    description: "Home owner based in Espoo offering family-friendly properties"
  },

  {
    id: 4,
    name: "Laura Virtanen",
    role: "Property owner",
    image: "/images/hosts/host4.jpg",
    joinedYear: 2024,
    description: "Property owner offering apartments around Helsinki"
  },

  {
    id: 5,
    name: "Antti Mäkinen",
    role: "Property owner",
    image: "/images/hosts/host5.jpg",
    joinedYear: 2020,
    description: "Private property owner with listings in Helsinki"
  },

  {
    id: 6,
    name: "Sofia Lehtonen",
    role: "Property owner",
    image: "/images/hosts/host6.jpg",
    joinedYear: 2023,
    description: "Property owner based in Espoo with a focus on modern apartments"
  },

  {
    id: 7,
    name: "Oskari Salonen",
    role: "Property owner",
    image: "/images/hosts/host7.jpg",
    joinedYear: 2021,
    description: "Home owner offering traditional and family-oriented properties"
  },

  {
    id: 8,
    name: "Emilia Hämäläinen",
    role: "Property owner",
    image: "/images/hosts/host8.jpg",
    joinedYear: 2024,
    description: "Property owner offering affordable homes in the Helsinki metropolitan area"
  }
];

export const properties = [
    {
        id: 1, ownerId: 1, title: "Modern apartment in Helsinki",
        description: "Bright two-bedroom apartment near the city centre.",
        listingType: "rent",
        propertyType: "residential",
        propertySubType: "apartment",
        price: 1250,
        currency: "EUR",
        city: "Helsinki",
        address: "Example Street 10",
        postalCode: "00100",
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        size: 55,
        features: {
            balcony: true,
            elevator: true,
            parking: true,
            furnished: true,
            petsAllowed: true,
            sauna: false,
        },
        rentalDetails: {
            availableFrom: "2026-10-01",
            deposit: 1250,
            minimumRentalPeriod: 12,
            additionalCosts: "Electricity and water are included.",
        },
        image: house_image,
        images: [
            {
                id: 1,
                url: "/images/property-001.jpg",
                description: "Living room",
                isMain: true,
            },
        ], status: "active",
    },
    // Possible values: "active", "inactive", "sold", "rented"   createdAt: "2026-09-06T12:00:00Z",   updatedAt: "2026-09-06T12:00:00Z",
    {
        id: 2,
        ownerId: 2,
        title: "Cozy studio apartment in Kallio",
        description: "Compact and stylish studio in a lively neighborhood close to cafes and public transport.",
        listingType: "rent",
        propertyType: "residential",
        propertySubType: "studio",
        price: 890,
        currency: "EUR",
        city: "Helsinki",
        address: "Fleminginkatu 22",
        postalCode: "00530",
        rooms: 1,
        bedrooms: 0,
        bathrooms: 1,
        size: 32,
        features: {
            balcony: false,
            elevator: true,
            parking: false,
            furnished: true,
            petsAllowed: false,
            sauna: false,
        },
        rentalDetails: {
            availableFrom: "2026-10-15",
            deposit: 890,
            minimumRentalPeriod: 6,
            additionalCosts: "Electricity is not included.",
        },
        image: house_image,
        images: [
            {
                id: 2,
                url: "/images/property-002.jpg",
                description: "Main living area",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T13:00:00Z",
        updatedAt: "2026-09-06T13:00:00Z",
    },

    {
        id: 3,
        ownerId: 3,
        title: "Spacious family home in Espoo",
        description: "Large family-friendly home with a private yard in a quiet residential area.",
        listingType: "sale",
        propertyType: "residential",
        propertySubType: "house",
        price: 425000,
        currency: "EUR",
        city: "Espoo",
        address: "Metsätie 15",
        postalCode: "02130",
        rooms: 5,
        bedrooms: 3,
        bathrooms: 2,
        size: 128,
        features: {
            balcony: true,
            elevator: false,
            parking: true,
            furnished: false,
            petsAllowed: true,
            sauna: true,
        },
        rentalDetails: {
            availableFrom: null,
            deposit: null,
            minimumRentalPeriod: null,
            additionalCosts: "Heating and maintenance costs apply.",
        },
        image: house_image,
        images: [
            {
                id: 3,
                url: "/images/property-003.jpg",
                description: "Exterior of the house",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T14:00:00Z",
        updatedAt: "2026-09-06T14:00:00Z",
    },

    {
        id: 4,
        ownerId: 4,
        title: "Bright one-bedroom in Töölö",
        description: "Beautifully renovated apartment within walking distance of parks, shops, and the city centre.",
        listingType: "rent",
        propertyType: "residential",
        propertySubType: "apartment",
        price: 1190,
        currency: "EUR",
        city: "Helsinki",
        address: "Runeberginkatu 40",
        postalCode: "00260",
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        size: 48,
        features: {
            balcony: true,
            elevator: true,
            parking: false,
            furnished: false,
            petsAllowed: true,
            sauna: false,
        },
        rentalDetails: {
            availableFrom: "2026-11-01",
            deposit: 1190,
            minimumRentalPeriod: 12,
            additionalCosts: "Water is included. Electricity is paid separately.",
        },
        image: house_image,
        images: [
            {
                id: 4,
                url: "/images/property-004.jpg",
                description: "Bright living room",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T15:00:00Z",
        updatedAt: "2026-09-06T15:00:00Z",
    },

    {
        id: 5,
        ownerId: 5,
        title: "Modern penthouse in Pasila",
        description: "Contemporary penthouse with panoramic city views and a large private terrace.",
        listingType: "sale",
        propertyType: "residential",
        propertySubType: "penthouse",
        price: 589000,
        currency: "EUR",
        city: "Helsinki",
        address: "Pasilankatu 8",
        postalCode: "00520",
        rooms: 4,
        bedrooms: 2,
        bathrooms: 2,
        size: 94,
        features: {
            balcony: true,
            elevator: true,
            parking: true,
            furnished: true,
            petsAllowed: true,
            sauna: true,
        },
        rentalDetails: {
            availableFrom: null,
            deposit: null,
            minimumRentalPeriod: null,
            additionalCosts: "Maintenance fee approximately 420 EUR/month.",
        },
        image: house_image,
        images: [
            {
                id: 5,
                url: "/images/property-005.jpg",
                description: "Penthouse terrace",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T16:00:00Z",
        updatedAt: "2026-09-06T16:00:00Z",
    },

    {
        id: 6,
        ownerId: 6,
        title: "Quiet apartment near Tapiola",
        description: "Comfortable two-bedroom apartment in a peaceful area with excellent transport connections.",
        listingType: "rent",
        propertyType: "residential",
        propertySubType: "apartment",
        price: 1450,
        currency: "EUR",
        city: "Espoo",
        address: "Itätuulenkuja 6",
        postalCode: "02100",
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        size: 67,
        features: {
            balcony: true,
            elevator: true,
            parking: true,
            furnished: false,
            petsAllowed: true,
            sauna: true,
        },
        rentalDetails: {
            availableFrom: "2026-10-01",
            deposit: 1450,
            minimumRentalPeriod: 12,
            additionalCosts: "Water included. Electricity paid separately.",
        },
        image: house_image,
        images: [
            {
                id: 6,
                url: "/images/property-006.jpg",
                description: "Living room",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T17:00:00Z",
        updatedAt: "2026-09-06T17:00:00Z",
    },

    {
        id: 7,
        ownerId: 7,
        title: "Traditional wooden house in Porvoo",
        description: "Charming renovated wooden house with a private garden in a peaceful historic neighborhood.",
        listingType: "sale",
        propertyType: "residential",
        propertySubType: "house",
        price: 365000,
        currency: "EUR",
        city: "Porvoo",
        address: "Jokikatu 18",
        postalCode: "06100",
        rooms: 4,
        bedrooms: 2,
        bathrooms: 1,
        size: 102,
        features: {
            balcony: false,
            elevator: false,
            parking: true,
            furnished: false,
            petsAllowed: true,
            sauna: true,
        },
        rentalDetails: {
            availableFrom: null,
            deposit: null,
            minimumRentalPeriod: null,
            additionalCosts: "Heating costs depend on consumption.",
        },
        image: house_image,

        images: [
            {
                id: 7,
                url: "/images/property-007.jpg",
                description: "Wooden house exterior",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T18:00:00Z",
        updatedAt: "2026-09-06T18:00:00Z",
    },

    {
        id: 8,
        ownerId: 8,
        title: "Affordable apartment in Vantaa",
        description: "Well-maintained apartment with convenient access to public transport and local services.",
        listingType: "rent",
        propertyType: "residential",
        propertySubType: "apartment",
        price: 980,
        currency: "EUR",
        city: "Vantaa",
        address: "Tikkurilantie 12",
        postalCode: "01300",
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        size: 45,
        features: {
            balcony: true,
            elevator: true,
            parking: true,
            furnished: false,
            petsAllowed: false,
            sauna: false,
        },
        rentalDetails: {
            availableFrom: "2026-10-10",
            deposit: 980,
            minimumRentalPeriod: 12,
            additionalCosts: "Water is included. Electricity is separate.",

        },
        image: house_image,
        images: [
            {
                id: 8,
                url: "/images/property-008.jpg",
                description: "Apartment living room",
                isMain: true,
            },
        ],
        status: "active",
        createdAt: "2026-09-06T19:00:00Z",
        updatedAt: "2026-09-06T19:00:00Z",
    },
];

