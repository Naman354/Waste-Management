# Smart Waste Management Backend

Backend API for a smart waste management system built with Node.js, Express, and MongoDB. It supports bin tracking, ward management, complaint logging, driver location updates, route optimization, image uploads, waste image classification, and dashboard statistics.

## Features

- Manage wards and waste bins
- Track bin fill status (`Empty`, `Filling`, `Full`)
- Submit and fetch public complaints
- Upload complaint or classification images
- Forward images to an external ML classification service
- Forward driver and bin data to an external route-optimization service
- Expose dashboard stats and trend data
- Serve uploaded files from `/uploads`

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Multer for file uploads
- Axios for external service calls
- Helmet, CORS, Morgan

## Project Structure

```text
.
|-- config/
|   `-- db.js
|-- controllers/
|-- memory/
|   `-- driverStore.js
|-- models/
|-- routes/
|-- services/
|-- uploads/
|-- utils/
|   `-- upload.js
|-- server.js
`-- package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Access to the external ML and route-optimization services if you want those features enabled

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with values like these:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
PYTHON_API_URL=https://your-route-optimizer-service
PYTHON_URL=https://your-image-classifier-service
```

Environment variable usage:

- `PORT`: Express server port. Defaults to `5000`.
- `MONGO_URI`: MongoDB connection string used by Mongoose.
- `PYTHON_API_URL`: Base URL for the route optimization service. The backend calls `POST /optimize`.
- `PYTHON_URL`: Base URL for the image classification service. The backend calls `POST /predict`.

### Run Locally

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check:

```http
GET /
```

Response:

```text
Smart Waste Management API is running
```

## API Overview

Base URL locally:

```text
http://localhost:5000
```

Postman documentation:

`https://documenter.getpostman.com/view/48451096/2sBXiknqjV`

### Wards

`POST /wards`

Create a ward.

Example body:

```json
{
  "id": 1,
  "name": "Ward 1"
}
```

`GET /wards`

Return all wards.

### Bins

`POST /bins`

Create a bin.

Example body:

```json
{
  "id": "BIN-101",
  "wardId": 1,
  "lat": 22.5726,
  "lng": 88.3639,
  "status": "Full",
  "category": "Plastic"
}
```

Required fields:

- `id`
- `wardId`
- `lat`
- `lng`
- `status`
- `category`

Allowed `status` values:

- `Empty`
- `Filling`
- `Full`

`GET /bins`

Return all bins.

Optional query:

- `ward`: filter by ward ID, for example `/bins?ward=1`

`PATCH /bins/:id`

Update bin status by bin `id`.

Example body:

```json
{
  "status": "Empty"
}
```

### Complaints

`POST /complaint`

Create a complaint.

Example body:

```json
{
  "wardId": 1,
  "lat": 22.5726,
  "lng": 88.3639,
  "message": "Garbage has not been collected.",
  "imageUrl": "http://localhost:5000/uploads/example.jpg"
}
```

`GET /complaint`

Return all complaints sorted by newest first.

`GET /complaint/ward/:wardId`

Return complaints for a ward.

### Driver Location

Driver locations are stored in memory, not MongoDB. They reset when the server restarts.

`POST /driver/location`

Update a single driver location.

Example body:

```json
{
  "driverId": "D1",
  "wardId": 1,
  "lat": 22.5726,
  "lng": 88.3639
}
```

`POST /driver/location/bulk`

Update multiple driver locations.

Example body:

```json
{
  "locations": [
    {
      "driverId": "D1",
      "wardId": 1,
      "lat": 22.5726,
      "lng": 88.3639
    },
    {
      "driverId": "D2",
      "wardId": 2,
      "lat": 22.58,
      "lng": 88.37
    }
  ]
}
```

`GET /driver`

`GET /drivers`

Both paths return the current in-memory driver list because the same router is mounted at both `/driver` and `/drivers`.

### Route Optimization

`GET /route/driver`

Returns an ordered list of `Full` bins for a ward. The backend sends driver location and bin data to the external route optimization service. If that service is unavailable, the unsorted bin list is returned as a fallback.

Required query params:

- `driverId`
- `ward`
- `lat`
- `lng`

Example:

```http
GET /route/driver?driverId=D1&ward=1&lat=22.5726&lng=88.3639
```

### File Upload

`POST /upload`

Upload an image using `multipart/form-data` with the field name `image`.

Success response includes:

- generated filename
- MIME type
- file size
- local path
- public URL

Uploaded files are served from:

```text
/uploads/<filename>
```

### Image Classification

`POST /classify`

Upload an image using `multipart/form-data` with the field name `image`.

The backend forwards the uploaded file to the external ML service at `PYTHON_URL/predict`.

If the ML service is unavailable, the API returns a safe fallback response instead of crashing.

### Stats

`GET /stats`

Returns:

- `totalBins`
- `fullBins`
- `fillingBins`
- `emptyBins`
- `activeDrivers`

`GET /stats/trends?range=24h|7d|30d`

Returns trend labels and counts based on `lastUpdated`. Trend grouping uses the `Asia/Kolkata` timezone.

`GET /stats/categories`

Returns aggregated bin counts grouped by category.

`GET /stats/wards`

Returns aggregated bin counts grouped by ward ID.

## Important Implementation Notes

- CORS is currently enabled for `http://localhost:8080` and `https://wastemanagementmc.netlify.app`.
- Uploaded files are stored on disk in the `uploads/` folder.
- Bin updates only allow changing `status`; location, ward, and category are treated as immutable after creation.
- Driver state is in-memory only.
- Optional middleware is loaded dynamically. If `helmet` or `morgan` are not installed, the server skips them with a warning.
- Route optimization and image classification both depend on external services and degrade gracefully when those services fail.

## Example cURL Requests

Create a ward:

```bash
curl -X POST http://localhost:5000/wards \
  -H "Content-Type: application/json" \
  -d "{\"id\":1,\"name\":\"Ward 1\"}"
```

Create a bin:

```bash
curl -X POST http://localhost:5000/bins \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"BIN-101\",\"wardId\":1,\"lat\":22.5726,\"lng\":88.3639,\"status\":\"Full\",\"category\":\"Plastic\"}"
```

Upload an image:

```bash
curl -X POST http://localhost:5000/upload \
  -F "image=@sample.jpg"
```

Classify an image:

```bash
curl -X POST http://localhost:5000/classify \
  -F "image=@sample.jpg"
```

## Scripts

- `npm start`: start the server
- `npm run dev`: start the server with Nodemon

## Current Gaps

- No automated tests are configured yet
- No API authentication is implemented yet
- No API versioning is implemented yet
- No persistent storage exists for driver live locations

## License

This project does not currently define a license.
