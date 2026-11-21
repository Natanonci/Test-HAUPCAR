# Car Management System (Haupcar Test)

ระบบจัดการข้อมูลรถยนต์สำหรับองค์กร พัฒนาด้วย React.js, Node.js (Express) และ Prisma (SQLite)

## Tech Stack

- **Frontend:** React.js (Vite), Ant Design, Axios
- **Backend:** Node.js, Express.js
- **Database:** SQLite with Prisma ORM

## Features

- ดูรายการข้อมูลรถยนต์ทั้งหมดในรูปแบบตาราง
- เพิ่มข้อมูลรถยนต์ใหม่ (ทะเบียนรถ, ยี่ห้อ, รุ่น, ปี, สี, สถานะ, หมายเหตุ)
- แก้ไขข้อมูลรถยนต์ที่มีอยู่ในระบบ
- ลบข้อมูลรถยนต์พร้อมหน้าต่างยืนยัน (Confirm Dialog)

### Additional Features (ฟีเจอร์เพิ่มเติม)

- **Search:** ค้นหารถยนต์แบบ Real-time จากทะเบียนรถ, ยี่ห้อ หรือรุ่น
- **Validation:** ตรวจสอบข้อมูลก่อนบันทึก และป้องกันการกรอกทะเบียนรถซ้ำ
- **UX/UI:** แสดง Loading state, Status Tag แยกสีตามสถานะรถ, Pagination และ Toast Notification แจ้งเตือนทุกการทำรายการ

---

## Setup & Installation

### 1. Clone Repository

```bash
git clone [https://github.com/Natanonci/Test-HAUPCAR.git](https://github.com/Natanonci/Test-HAUPCAR.git)
cd Test-HAUPCAR
```

### 2. Setup Backend (`backend-server`)

```bash
cd backend-server
npm install
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend-server` และใส่ค่าดังนี้:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

สร้างตารางฐานข้อมูลและรันเซิร์ฟเวอร์:

```bash
npx prisma db push
npm run dev
```

_(Backend จะทำงานที่ `http://localhost:3000`)_

### 3. Setup Frontend (`frontend-server`)

เปิด Terminal ใหม่อีกหน้าต่าง แล้วรัน:

```bash
cd frontend-server
npm install
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `frontend-server` และใส่ค่าดังนี้:

```env
VITE_API_URL=http://localhost:3000/api/cars
```

รันหน้าเว็บ:

```bash
npm run dev
```

_(เปิดใช้งานได้ที่ `http://localhost:5173`)_

---

## API Endpoints

| Method   | Endpoint        | Description             |
| :------- | :-------------- | :---------------------- |
| `GET`    | `/api/cars`     | ดึงข้อมูลรถยนต์ทั้งหมด  |
| `POST`   | `/api/cars`     | เพิ่มข้อมูลรถยนต์ใหม่   |
| `PUT`    | `/api/cars/:id` | แก้ไขข้อมูลรถยนต์ตาม ID |
| `DELETE` | `/api/cars/:id` | ลบข้อมูลรถยนต์ตาม ID    |
