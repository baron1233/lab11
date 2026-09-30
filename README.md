# todo-th

แอปรายการงาน (Todo) ภาษาไทย — React + Vite + Tailwind CSS + lucide-react
ข้อมูลเก็บใน React state เท่านั้น (รีเฟรชแล้วข้อมูลหาย)

## เริ่มใช้งาน

```bash
npm install
npm run dev      # เปิด http://localhost:5173
npm run build    # สร้างไฟล์ใน dist/
npm run preview  # ดูผลลัพธ์ที่ build แล้ว
```

## โครงสร้าง

- `src/App.jsx` — state หลัก ฟอร์มเพิ่มงาน แท็บกรอง ตัวนับ
- `src/TodoItem.jsx` — การ์ดงาน (checkbox, แก้ไขในแถว, ลบ)
- `src/constants.js` — ระดับความสำคัญและตัวกรอง
- `src/index.css` — Tailwind + สีความสำคัญ + แอนิเมชัน
