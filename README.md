# 🎓 UniLend: Peer-to-Peer Campus Marketplace

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

UniLend is a full-stack peer-to-peer rental marketplace designed exclusively for university students. It allows students to securely rent out textbooks, electronics, and lab equipment to their peers on campus. 

The platform features a custom **Mock Wallet & Escrow Ledger System** powered by MongoDB ACID transactions to ensure secure, concurrent financial operations.

## ✨ Key Features

- **Exclusive Campus Access:** JWT-based authentication combined with strict Regex validation (`@stu.manit.ac.in`) to restrict registration solely to verified university students.
- **Custom Escrow Ledger:** Built a robust double-entry mock payment ledger. When a booking is requested, funds are held in escrow. Payouts and deposit refunds are processed automatically upon item return.
- **ACID Transaction Compliance:** Utilized MongoDB multi-document transactions (`session.withTransaction()`) to guarantee data integrity across Wallet, Booking, and Transaction collections during concurrent state changes.
- **Premium Neumorphism UI:** Designed a responsive, tactile front-end interface using Tailwind CSS without relying on heavy third-party UI libraries.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Security:** JSON Web Tokens (JWT), bcryptjs

---
## 📸 App Walkthrough (User Journey)

Here is a step-by-step look at how students interact with the UniLend platform:

### 1. Secure Campus Registration
Students register using their exclusive university email. Upon login, they are greeted with their digital wallet balance.
*(Paste Screenshot 1 here)*
`![Registration Screen](link_to_image_1)`

### 2. Browsing the Marketplace
The homepage displays all available items (textbooks, lab coats, calculators) complete with daily rental rates and required security deposits.
*(Paste Screenshot 2 here)*
`![Marketplace Homepage](link_to_image_2)`

### 3. Listing a New Item
A student lists a spare scientific calculator, setting a custom daily fee and a refundable security deposit to ensure the item's safety.
*(Paste Screenshot 3 here)*
`![Create Item Screen](link_to_image_3)`

### 4. Viewing Item Details
Borrowers can click on an item to view details, select their rental dates, and instantly see the total calculated price (Rent + Deposit).
*(Paste Screenshot 4 here)*
`![Item Details Screen](link_to_image_4)`

### 5. Requesting a Booking (Escrow Hold)
When the borrower hits "Request", the total amount is securely deducted from their wallet and held in **Escrow** by the platform to guarantee the funds.
*(Paste Screenshot 5 here)*
`![Booking Request Screen](link_to_image_5)`

### 6. Lender Dashboard & Approval
The item owner receives the request on their personal dashboard and clicks "Approve" to accept the rental terms.
*(Paste Screenshot 6 here)*
`![Lender Dashboard](link_to_image_6)`

### 7. Active Rental Phase
The students meet on campus to hand over the item. The booking status officially transitions to `ACTIVE`.
*(Paste Screenshot 7 here)*
`![Active Rental Status](link_to_image_7)`

### 8. Return & Automated Payout
Once the item is returned safely, the booking is marked `COMPLETED`. The platform automatically releases the escrow: the lender receives the rental fee, and the borrower gets their security deposit refunded to their wallet.
*(Paste Screenshot 8 here)*
`![Automated Payout/Ledger Screen](link_to_image_8)`

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas Cluster (or a local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/UniLend.git
cd UniLend
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
MOCK_STARTING_BALANCE=2000
MOCK_CURRENCY=INR
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Starts on http://localhost:5000
node server.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
# Starts on http://localhost:5173
npm run dev
```

---


## 🏗️ Architecture & Database Models

UniLend utilizes 4 primary MongoDB collections to manage marketplace dynamics:

1. **User:** Manages authentication, campus verification, and the digital `walletBalance`.
2. **Item:** Stores rental asset metadata, pricing (`rentalFee`, `depositAmount`), and references the User owner.
3. **Booking:** The core state machine connecting Borrowers to Items. Transitions through strictly validated states: `REQUESTED` ➔ `APPROVED` ➔ `ACTIVE` ➔ `COMPLETED` / `CANCELLED`.
4. **Transaction:** An immutable audit log recording every `ESCROW_HOLD`, `PAYOUT`, and `REFUND`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## 👨‍💻 Developer
Developed with ❤️ by **Raj Kiran Kadali**  
*Full Stack Developer*  
📧 Email: [rajkirankadali06@gmail.com](mailto:rajkirankadali06@gmail.com)
