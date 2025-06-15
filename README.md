# 📋 Bewell POS UI - Health Furniture Point of Sale System

A Point of Sale (POS) system built with Next.js for Bewell, a company specializing in ergonomic furniture and health products.

## 🚀 Project Overview

Bewell POS UI is a point of sale system designed to manage the sales of health furniture, including:
- Ergonomic adjustable desks
- Health-focused office chairs
- Back and seat cushions
- Pillows and various accessories

## ✨ Key Features

### 🛍️ Product Management
- **Product Display**: Show all products with images, prices, and stock quantities
- **Product Filtering**: Filter products by category (tables, chairs, cushions)
- **Search Function**: Search products by name or product ID
- **Pagination**: Display products with pagination for better performance

### 🛒 Shopping Cart
- **Add Products**: Easily add products to cart
- **Quantity Management**: Adjust product quantities in cart
- **Price Calculation**: Real-time total price calculation
- **Remove Products**: Remove products from cart

### 📦 Stock Management
- **Stock Checking**: Display remaining stock quantities
- **Out of Stock Alerts**: Notify when products are out of stock
- **Back Order Modal**: Manage pre-ordered products

### 💻 User Experience
- **Responsive Design**: Support for all devices
- **Real-time Updates**: Real-time data updates
- **Modern UI**: Modern and user-friendly interface

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 15.3.3** - React Framework for Full-stack development
- **React 19** - Library for building User Interfaces
- **TypeScript** - Language that adds Type Safety to JavaScript

### State Management
- **React Context** - Shopping cart state management
- **TanStack React Query** - Data Fetching and Caching management

### Styling
- **Tailwind CSS v4** - Utility-first CSS Framework
- **Styled Components** - CSS-in-JS Library
- **Lucide React** - Icon Library

### Development Tools
- **ESLint** - Code Linting
- **PostCSS** - CSS Processing
- **Turbopack** - Fast bundler for development

## 📦 Installation and Getting Started

### System Requirements
- Node.js version 18 or newer
- npm, yarn, pnpm, or bun

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd bewell-pos-ui
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open in Browser**
Open [http://localhost:3000](http://localhost:3000) to view the result

## 📁 Project Structure

```
bewell-pos-ui/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── products/          # Products page
│   ├── globals.css        # Global CSS
│   ├── layout.tsx         # Main layout
│   ├── page.tsx          # Home page
│   └── provider.tsx       # Context Providers
├── components/            # React Components
│   ├── feature/          # Feature Components
│   │   ├── BackOrderModal.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilter.tsx
│   │   └── ShoppingCart.tsx
│   ├── layout/           # Layout Components
│   └── ui/               # UI Components
├── context/              # React Context
├── data/                 # Product data
│   └── bewell-product.json
├── public/               # Static Assets
├── utils/                # Utility Functions
├── package.json          # Dependencies and Scripts
├── tsconfig.json         # TypeScript Configuration
└── README.md            # This documentation
```

## 🎯 Usage

### Home Page
- Display welcome message "Welcome to W"
- "Browse Products" button to navigate to products page

### Products Page
- **Left Section**: Complete product list with filtering and search features
- **Right Section**: Shopping cart and order summary

### Adding Products to Cart
1. Select desired products from the list
2. Click "Add to Cart" button
3. Adjust quantities in cart as needed
4. View real-time total price

## 🔧 Important Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Check code quality
npm run lint
```

## 📊 Product Data

The system uses product data from `data/bewell-product.json` which includes:

### Product Categories
- **table**: Ergonomic adjustable desks
- **chair**: Health-focused office chairs
- **cushion**: Cushions and pillows

### Product Information
- Product ID (productId)
- Product Name (productName)
- Category (category)
- Price (price)
- Image (imageUrl)
- Stock Quantity (stock)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Vercel will automatically deploy
3. Access via the URL provided by Vercel

### Other Deployment Options
Can be deployed on various platforms such as:
- Netlify
- Railway
- DigitalOcean
- AWS

## 🤝 Contributing to Development

### Adding New Products
1. Add product data to `data/bewell-product.json`
2. Verify data format is correct
3. Test display in the system

### UI Improvements
1. Main components are in `components/feature/`
2. UI components are in `components/ui/`
3. Layout components are in `components/layout/`

### Adding New Features
1. Create new components in appropriate directories
2. Add new routes in `app/` if necessary
3. Update Context if state management is needed

## 📞 Support

If you encounter issues or have questions:
1. Review this documentation again
2. Check code examples in various components
3. Check console for error messages

## 📝 Notes

- This system is frontend only, not yet connected to backend
- Product data is stored in static JSON files
- For production use, should be connected to database and API

---

**Developed by**: Bewell POS Development Team  
**Version**: 0.1.0  
**Last Updated**: 2024
