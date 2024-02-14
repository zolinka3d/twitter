# tokarczyk-zofia-projekt

## Project setup
1. Configure mongo database
2. Add env for backend
   ```
   FRONT_URL=https://127.0.0.1:5173
   MONGO_DATABASE=some_database
3. Add env for frontend
   ```
   VITE_API_URL = 'https://localhost:2137/'
   VITE_SOCKET_URL = 'wss://localhost:2137/'
   VITE_API_CLOUD_NAME=your_cloud_name_in_cloudinary
   ```
4. Install dependencies
```
cd backend
npm i
cd ../frontent
npm i
```

### Compiles and hot-reloads for development
```
cd backend
npm run dev

cd frontend
npm run dev
```

### Compiles and minifies for production
```
cd frontend
npm run build
```

