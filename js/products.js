/* ============================================================
   KAUSHAR INVESTMENT — Product Catalogue
   ============================================================
   HOW TO ADD A PRODUCT:
   Copy one of the blocks below and fill in your details.
   Each product needs:
     images  : list of image paths or URLs (first one is the main display image)
     title   : product name
     desc    : description — use \n for a new line so it stacks like:
                 "Colour: Red\nSize: Large\nWeight: 2kg"
     category: one or more of — hardware, electronics, household, outdoor, vehicle
     featured: true  → appears in the Featured section on the homepage
     special : true  → appears in the On Special section on the homepage
     price   : number only, e.g. 850  or  1299.95
     origPrice (optional): only fill this in if the product is on special
                 and you want to show a crossed-out "was" price, e.g. 1600

   SECTIONS IN THIS FILE:
   1. Hardware
   2. Electronics
   3. Household
   4. Outdoor & Camp
   5. Vehicle Accessories

   A product can belong to multiple sections — just list them all in category.
   Example: category: ['hardware', 'featured'] means it shows on the hardware
   page AND in the featured slider on the homepage.
   ============================================================ */

window.KI_PRODUCTS = [

  /* ----------------------------------------------------------
     HARDWARE
  ---------------------------------------------------------- */

  {
    images: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&q=80'
    ],
    title: 'Heavy Duty Angle Grinder 850W',
    desc: 'Professional 850W angle grinder with adjustable guard.\nErgonomic handle and high-performance motor.\nSuitable for cutting, grinding, and polishing metal and masonry surfaces.',
    category: ['hardware'],
    featured: false,
    special: false,
    price: 850
    /* origPrice: 1100 */
  },

  {
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80'
    ],
    title: 'Power Drill Set 13-Piece',
    desc: 'Complete power drill set including 13 assorted drill bits.\nCarry case included.\nVariable-speed 650W drill driver for wood and masonry.',
    category: ['hardware', 'featured'],
    featured: true,
    special: false,
    price: 620
  },

  {
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    ],
    title: 'Stanley Hammer 16oz',
    desc: 'Durable 16oz claw hammer.\nFiberglass handle with anti-vibration grip.\nComfortable for extended use.',
    category: ['hardware'],
    featured: false,
    special: true,
    price: 120,
    origPrice: 160
  },

  {
    images: [
      'https://images.unsplash.com/photo-1581092921461-7d65ca45393a?w=600&q=80'
    ],
    title: 'Marble Cutter 1200W',
    desc: 'High-powered 1200W marble and tile cutter.\n110mm diamond blade included.\nWater cooling tray and adjustable cutting depth.',
    category: ['hardware'],
    featured: false,
    special: false,
    price: 1150
  },

  {
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'
    ],
    title: 'Air Compressor 50L Tank',
    desc: 'Portable 50-litre belt-driven air compressor.\n2.5HP motor with pressure gauge.\nQuick-release fittings and rubber wheels for easy mobility.',
    category: ['hardware'],
    featured: false,
    special: false,
    price: 2400
  },

  {
    images: [
      'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=600&q=80'
    ],
    title: 'Multi-Bit Screwdriver Set',
    desc: 'Professional 32-piece magnetic screwdriver set.\nChrome-vanadium steel bits.\nErgonomic soft-grip handle and compact carry case.',
    category: ['hardware', 'featured'],
    featured: true,
    special: true,
    price: 195,
    origPrice: 260
  },

  /* ----------------------------------------------------------
     ELECTRONICS
  ---------------------------------------------------------- */

  {
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f4834d?w=600&q=80'
    ],
    title: 'LED Smart TV 43-Inch',
    desc: '43-inch Full HD LED Smart TV.\nBuilt-in WiFi, HDMI x3, USB x2.\nNetflix and YouTube apps pre-installed.\nSlim bezel design.',
    category: ['electronics', 'featured'],
    featured: true,
    special: true,
    price: 3800,
    origPrice: 4500
  },

  {
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'
    ],
    title: 'Wireless Bluetooth Speaker',
    desc: 'Portable 20W wireless Bluetooth speaker.\n12-hour battery life.\nIPX5 waterproof rating.\n360° rich stereo sound.',
    category: ['electronics'],
    featured: false,
    special: false,
    price: 480
  },

  {
    images: [
      'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'
    ],
    title: 'Security Camera System 4CH',
    desc: '4-channel HD CCTV security kit.\n4 weatherproof cameras included.\nDVR recorder with 1TB HDD.\nNight vision up to 20m and remote mobile viewing.',
    category: ['electronics'],
    featured: false,
    special: false,
    price: 2100
  },

  {
    images: [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80'
    ],
    title: 'Universal Remote Control',
    desc: 'Compatible with most TV, DSTV, DVD and sound system brands.\nEasy setup with backlit buttons.\nErgonomic design for comfortable use.',
    category: ['electronics'],
    featured: false,
    special: false,
    price: 85
  },

  /* ----------------------------------------------------------
     HOUSEHOLD
  ---------------------------------------------------------- */

  {
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'
    ],
    title: 'Stainless Steel Cookware Set 6Pc',
    desc: '6-piece stainless steel cookware set.\nIncludes saucepans, stock pot, and frying pan.\nInduction compatible and dishwasher safe.\nGlass lids included.',
    category: ['household'],
    featured: false,
    special: false,
    price: 1050
  },

  {
    images: [
      'https://images.unsplash.com/photo-1648146027039-6b6ec6feaeef?w=600&q=80'
    ],
    title: 'Digital Air Fryer 5L',
    desc: '5-litre digital air fryer.\n8 preset cooking modes with touch control panel.\nMax temp 200°C with 60-minute timer.\nUses 80% less oil than traditional frying.',
    category: ['household', 'featured'],
    featured: true,
    special: true,
    price: 1280,
    origPrice: 1600
  },

  {
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    ],
    title: 'Cordless Vacuum Cleaner',
    desc: 'Powerful cordless stick vacuum.\n25,000 Pa suction with HEPA filtration.\n45-minute runtime.\nMultiple attachments for floors, stairs, and upholstery.',
    category: ['household'],
    featured: false,
    special: false,
    price: 1900
  },

  {
    images: [
      'https://images.unsplash.com/photo-1507494924047-60b8ee826ca9?w=600&q=80'
    ],
    title: 'LED Ceiling Light 36W',
    desc: 'Modern round 36W LED ceiling light.\nWarm, cool, and daylight colour modes.\nRemote control with dimmable function.\n3600 lumens output.',
    category: ['household'],
    featured: false,
    special: false,
    price: 320
  },

  /* ----------------------------------------------------------
     OUTDOOR & CAMP
  ---------------------------------------------------------- */

  {
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'
    ],
    title: '4-Person Camping Tent',
    desc: 'Spacious 4-person waterproof dome tent.\nDouble-layer design with fibreglass poles.\nCarry bag and UV protection coating included.\nSuitable for all-weather camping.',
    category: ['outdoor'],
    featured: false,
    special: false,
    price: 1290
  },

  {
    images: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80'
    ],
    title: 'Portable Gas Braai Stove',
    desc: 'Compact 2-burner portable gas braai stove.\nFolding legs with windshield panels.\nPiezo ignition for easy starting.\nIdeal for camping and outdoor cooking.',
    category: ['outdoor', 'featured'],
    featured: true,
    special: true,
    price: 640,
    origPrice: 800
  },

  {
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80'
    ],
    title: 'Heavy Duty Cooler Box 60L',
    desc: '60-litre premium rotomoulded cooler box.\nSuperior ice retention up to 5 days.\nNon-slip feet, drain plug, and lockable lid.',
    category: ['outdoor'],
    featured: false,
    special: false,
    price: 1750
  },

  {
    images: [
      'https://images.unsplash.com/photo-1550985543-49bee3167284?w=600&q=80'
    ],
    title: 'LED Headlamp 500 Lumens',
    desc: 'Bright 500-lumen rechargeable LED headlamp.\n3 modes: high, low, and red SOS.\nIPX4 water resistance.\n10-hour run time on a full charge.',
    category: ['outdoor'],
    featured: false,
    special: false,
    price: 165
  },

  /* ----------------------------------------------------------
     VEHICLE ACCESSORIES
  ---------------------------------------------------------- */

  {
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80'
    ],
    title: 'Car Jump Starter 2000A',
    desc: '2000A peak portable car jump starter.\n20,000mAh built-in power bank.\nLED flashlight and USB-C charging.\nSmart clamps for vehicles up to 8.0L.',
    category: ['vehicle'],
    featured: false,
    special: false,
    price: 880
  },

  {
    images: [
      'https://images.unsplash.com/photo-1558618047-3c7e33c8bfde?w=600&q=80'
    ],
    title: 'Dash Camera Full HD 1080P',
    desc: 'Full HD 1080P dash camera.\n170° wide angle lens with night vision.\nLoop recording with G-sensor.\n3-inch display and 32GB SD card included.',
    category: ['vehicle', 'featured'],
    featured: true,
    special: true,
    price: 750,
    origPrice: 950
  },

  {
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80'
    ],
    title: 'Car Phone Mount 360°',
    desc: 'Universal 360° adjustable magnetic car phone mount.\nExtra-strong suction cup base.\nCompatible with all smartphones.\nEasy one-hand operation.',
    category: ['vehicle'],
    featured: false,
    special: false,
    price: 75
  },

  {
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80'
    ],
    title: 'Tyre Inflator 12V Portable',
    desc: 'Compact 12V portable digital tyre inflator.\nPreset pressure function with auto shutoff.\nBuilt-in LED light for night use.\nUniversal Presta and Schrader nozzles included.',
    category: ['vehicle'],
    featured: false,
    special: false,
    price: 420
  }

];
/* ============================================================
   END OF PRODUCT CATALOGUE
   Add more products above this line following the same format
   ============================================================ */
