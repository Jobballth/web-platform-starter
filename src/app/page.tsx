export default function JustifyDemo() {
  return (
    <div className="p-10 space-y-8 bg-gray-100 min-h-screen">
      
      {/* 🟢 1. Navbar: ต้องใช้ justify-between */}
      {/* โลโก้จะไปซ้ายสุด - เมนูจะไปขวาสุด ทันที! */}
<nav className="flex justify-between items-center bg-red-50">
      
      {/* 🟢 ก้อนที่ 1 (ซ้าย): มัดรวม 2 ตัว (Logo + Brand Name) */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500 rounded-full">Logo</div>
        <span className="font-bold text-xl">Mongo</span>
      </div>

      {/* 🟡 ก้อนที่ 2 (กลาง): มี 1 ตัว (เช่น Search) */}
      {/* ถ้าอยากให้มันอยู่กลางเป๊ะๆ โดยไม่เอียงตามจำนวนของด้านข้าง ต้องใช้เทคนิคพิเศษเพิ่มนิดนึง */}
      <div className="text-gray-500 bg-gray-100 px-4 py-1 rounded-full">
        🔍 Search...
      </div>

      {/* 🔴 ก้อนที่ 3 (ขวา): มัดรวม 3 ตัว (Home, About, Contact) */}
      <div className="flex items-center gap-6 text-gray-600">
        <span>Home</span>
        <span>About</span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
      </div>

    </nav>

      {/* 🟡 2. ปุ่มกลางจอ: ต้องใช้ justify-center */}
      <div className="bg-blue-500 h-32 flex justify-center items-center rounded text-white font-bold text-2xl">
        ฉันอยู่ตรงกลางโลก!
      </div>

      {/* 🔴 3. ปุ่ม Save: ต้องใช้ justify-end */}
      <div className="bg-white p-4 rounded shadow flex justify-end gap-2">
        <button className="text-gray-500">Cancel</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>

    </div>
  );
}