# 🚗 Fare Estimation System - Laravel + React

This is a full-fledged fare estimation system for a ride-sharing app built using **Laravel** for the backend and **React** for the frontend.

It calculates fares dynamically based on:
- Distance traveled
- Vehicle type (Economy, Standard, Luxury)
- Surge pricing (if demand is high)
- First-time user discount
- Maximum trip distance validation

---

## 🛠 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup (Laravel)

#### 📦 Install PHP Dependencies
```bash
composer install
```

#### 🔑 Create Environment File & Generate App Key
```bash
cp .env.example .env
php artisan key:generate
```

#### 🧾 Configure Database
Open `.env` and set your database details:

```
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

#### 🧱 Run Migrations
```bash
php artisan migrate
```

#### 🧪 Seed Vehicle Types (Optional if seeder available)
```bash
php artisan db:seed
```

#### 🚀 Start Laravel Server
```bash
php artisan serve
```

---

### 3. Frontend Setup (React)

```bash
npm install
npm run dev
```


---

## 🔗 API Endpoints

| Method | Endpoint              | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/calculate-fare` | Calculate estimated fare |
| POST   | `/api/trip`           | Store a trip record      |

---

## ✅ Features

- Vehicle-based fare logic
- Surge pricing based on simple demand simulation
- First-time user discount
- Max trip distance validation (500km)

---

## 🤝 Contribution

Feel free to fork the repository and contribute to improving the system. Pull requests are welcome.

---

## 🧑‍💻 Developed by

**Ilaiyaraja A**  
Phone: 6382982142
