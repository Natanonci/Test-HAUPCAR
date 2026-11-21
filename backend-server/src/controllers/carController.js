const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. ดึงข้อมูลรถทั้งหมด
const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' }, // เรียงจากคันที่เพิ่มล่าสุดขึ้นก่อน
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' });
  }
};

// 2. เพิ่มรถใหม่
const createCar = async (req, res) => {
  try {
    const { licensePlate, brand, model, year, color, status, notes } = req.body;

    if (!licensePlate || !brand || !model) {
      return res.status(400).json({ message: 'กรุณากรอกทะเบียน ยี่ห้อ และรุ่นรถ' });
    }

    const newCar = await prisma.car.create({
      data: {
        licensePlate,
        brand,
        model,
        year: year ? Number(year) : null,
        color,
        status: status || 'Available',
        notes,
      },
    });
    res.status(201).json(newCar);
  } catch (error) {
    // P2002 = รหัส Error ของ Prisma เวลาข้อมูลที่ตั้ง @unique (ทะเบียนรถ) ซ้ำ
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'ทะเบียนรถนี้มีในระบบแล้ว' });
    }
    res.status(500).json({ message: 'เพิ่มข้อมูลไม่สำเร็จ' });
  }
};

// 3. แก้ไขข้อมูลรถ
const updateCar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { licensePlate, brand, model, year, color, status, notes } = req.body;

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        licensePlate,
        brand,
        model,
        year: year ? Number(year) : null,
        color,
        status,
        notes,
      },
    });
    res.json(updatedCar);
  } catch (error) {
    // P2025 = รหัส Error ของ Prisma เวลาหา id ที่จะแก้ไม่เจอ
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'ไม่พบข้อมูลรถคันนี้' });
    }
    res.status(500).json({ message: 'แก้ไขข้อมูลไม่สำเร็จ' });
  }
};

// 4. ลบข้อมูลรถ
const deleteCar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.car.delete({
      where: { id },
    });
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'ไม่พบข้อมูลรถคันนี้' });
    }
    res.status(500).json({ message: 'ลบข้อมูลไม่สำเร็จ' });
  }
};

module.exports = {
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
};