# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
Restaurant2
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ api
│  │  ├─ acceptOrder.js
│  │  ├─ category.js
│  │  ├─ getAllOrders.js
│  │  ├─ loginApi.js
│  │  ├─ meal.js
│  │  ├─ order.js
│  │  ├─ refreshToken.js
│  │  ├─ signalR
│  │  │  └─ connection.js
│  │  └─ WaiterAddOrder.js
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ bell.svg
│  │  ├─ cart.svg
│  │  ├─ date.svg
│  │  ├─ discount.svg
│  │  ├─ edit.svg
│  │  ├─ five.avif
│  │  └─ line.svg
│  ├─ components
│  │  ├─ Aside
│  │  │  └─ index.jsx
│  │  ├─ auth
│  │  │  ├─ PublicRoute
│  │  │  │  └─ index.jsx
│  │  │  └─ RoleBasedRoute
│  │  │     └─ index.jsx
│  │  ├─ Basket
│  │  │  └─ index.jsx
│  │  ├─ Categories
│  │  │  └─ index.jsx
│  │  ├─ ErrorBoundary
│  │  │  └─ index.jsx
│  │  ├─ MealCard
│  │  │  └─ index.jsx
│  │  ├─ MealContainer
│  │  │  └─ index.jsx
│  │  ├─ MealModal
│  │  │  └─ index.jsx
│  │  ├─ Navbar
│  │  │  └─ index.jsx
│  │  ├─ OrderSummary
│  │  │  └─ index.jsx
│  │  ├─ Search
│  │  │  └─ index.jsx
│  │  ├─ Sidebar
│  │  │  └─ index.jsx
│  │  ├─ WaiterAside
│  │  │  └─ index.jsx
│  │  ├─ WaiterBasket
│  │  │  └─ index.jsx
│  │  └─ WaiterMealCard
│  │     └─ index.jsx
│  ├─ context
│  │  ├─ MealContext
│  │  │  └─ index.jsx
│  │  └─ WaiterMealContext
│  │     └─ index.jsx
│  ├─ hooks
│  │  ├─ useMealFetcher.js
│  │  └─ useSignalR.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Auth
│  │  │  └─ index.jsx
│  │  ├─ Cooker
│  │  │  ├─ CookerHub
│  │  │  │  └─ index.jsx
│  │  │  └─ index.jsx
│  │  ├─ Dashboard
│  │  │  ├─ Category
│  │  │  │  ├─ AddCategory
│  │  │  │  │  └─ index.jsx
│  │  │  │  ├─ EditCategory
│  │  │  │  │  └─ index.jsx
│  │  │  │  └─ index.jsx
│  │  │  ├─ index.jsx
│  │  │  ├─ Meal
│  │  │  │  ├─ AddMeal
│  │  │  │  │  └─ index.jsx
│  │  │  │  ├─ DeleteMeal
│  │  │  │  │  └─ index.jsx
│  │  │  │  ├─ EditMeal
│  │  │  │  │  └─ index.jsx
│  │  │  │  ├─ MealById
│  │  │  │  │  └─ index.jsx
│  │  │  │  └─ Meals
│  │  │  │     └─ index.jsx
│  │  │  ├─ SideBar
│  │  │  │  └─ index.jsx
│  │  │  └─ UserList
│  │  │     ├─ AddUser
│  │  │     │  └─ index.jsx
│  │  │     ├─ EditUser
│  │  │     │  └─ index.jsx
│  │  │     └─ index.jsx
│  │  ├─ Unauthorized
│  │  │  └─ index.jsx
│  │  ├─ User
│  │  │  └─ index.jsx
│  │  └─ Waiter
│  │     ├─ index.jsx
│  │     ├─ Menu
│  │     │  └─ index.jsx
│  │     ├─ OrderHub
│  │     │  ├─ ActiveOrders
│  │     │  │  └─ index.jsx
│  │     │  ├─ ClosedOrders
│  │     │  │  └─ index.jsx
│  │     │  ├─ index.jsx
│  │     │  └─ OrderModal
│  │     │     └─ index.jsx
│  │     └─ Settings
│  │        └─ index.jsx
│  └─ routes
│     └─ index.jsx
└─ vite.config.js

```