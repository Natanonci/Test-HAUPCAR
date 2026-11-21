import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Popconfirm,
  Tag,
  message,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getAllCars, createCar, updateCar, deleteCar } from "./services/carApi";

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ตัวแปรคุม Modal เพิ่ม/แก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form] = Form.useForm();

  // 1. ดึงข้อมูลรถทั้งหมด
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await getAllCars();
      setCars(res.data);
    } catch {
      message.error("ดึงข้อมูลรถไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCars()
      .then((res) => setCars(res.data))
      .catch(() => message.error("ดึงข้อมูลรถไม่สำเร็จ"));
  }, []);

  // 2. เปิดหน้าต่างเพิ่มรถ
  const openAddModal = () => {
    setEditingCar(null);
    form.resetFields();
    form.setFieldsValue({ status: "Available" });
    setIsModalOpen(true);
  };

  // 3. เปิดหน้าต่างแก้ไขรถ
  const openEditModal = (car) => {
    setEditingCar(car);
    form.setFieldsValue(car);
    setIsModalOpen(true);
  };

  // 4. กดบันทึก (แยกให้เองว่าเพิ่มใหม่หรือแก้ไข)
  const handleSave = async (values) => {
    try {
      if (editingCar) {
        await updateCar(editingCar.id, values);
        message.success("แก้ไขข้อมูลสำเร็จ");
      } else {
        await createCar(values);
        message.success("เพิ่มข้อมูลสำเร็จ");
      }
      setIsModalOpen(false);
      fetchCars();
    } catch (err) {
      message.error(err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  // 5. ลบข้อมูลรถ
  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      message.success("ลบข้อมูลสำเร็จ");
      fetchCars();
    } catch {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  // กรองข้อมูลตามคำค้นหา
  const filteredCars = cars.filter((car) => {
    const text = search.toLowerCase();
    return (
      car.licensePlate?.toLowerCase().includes(text) ||
      car.brand?.toLowerCase().includes(text) ||
      car.model?.toLowerCase().includes(text)
    );
  });

  // หัวตาราง
  const columns = [
    { title: "ทะเบียนรถ", dataIndex: "licensePlate", key: "licensePlate" },
    { title: "ยี่ห้อ", dataIndex: "brand", key: "brand" },
    { title: "รุ่น", dataIndex: "model", key: "model" },
    { title: "ปี", dataIndex: "year", key: "year" },
    { title: "สี", dataIndex: "color", key: "color" },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Available"
            ? "green"
            : status === "In Use"
              ? "blue"
              : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "หมายเหตุ", dataIndex: "notes", key: "notes" },
    {
      title: "จัดการ",
      key: "action",
      render: (record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            แก้ไข
          </Button>
          <Popconfirm
            title="ยืนยันการลบข้อมูล?"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button danger icon={<DeleteOutlined />}>
              ลบ
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      <Card style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0, color: "#1f2937", fontWeight: 600 }}>
            ระบบจัดการข้อมูลรถยนต์ (Haupcar)
          </h2>

          <Space>
            <Input
              placeholder="ค้นหาทะเบียน, ยี่ห้อ, รุ่น..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              เพิ่มรถใหม่
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCars}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* หน้าต่างป๊อปอัป เพิ่ม / แก้ไข */}
      <Modal
        title={editingCar ? "แก้ไขข้อมูลรถ" : "เพิ่มข้อมูลรถใหม่"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="ทะเบียนรถ"
            name="licensePlate"
            rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ" }]}
          >
            <Input placeholder="เช่น กข 1234" />
          </Form.Item>

          <Form.Item
            label="ยี่ห้อรถ"
            name="brand"
            rules={[{ required: true, message: "กรุณากรอกยี่ห้อรถ" }]}
          >
            <Input placeholder="เช่น Toyota" />
          </Form.Item>

          <Form.Item
            label="รุ่นรถ"
            name="model"
            rules={[{ required: true, message: "กรุณากรอกรุ่นรถ" }]}
          >
            <Input placeholder="เช่น Yaris" />
          </Form.Item>

          <Space>
            <Form.Item label="ปีรถ" name="year">
              <InputNumber placeholder="2024" />
            </Form.Item>

            <Form.Item label="สีรถ" name="color">
              <Input placeholder="ขาว" />
            </Form.Item>

            <Form.Item label="สถานะ" name="status">
              <Select
                style={{ width: 130 }}
                options={[
                  { value: "Available", label: "Available" },
                  { value: "In Use", label: "In Use" },
                  { value: "Maintenance", label: "Maintenance" },
                ]}
              />
            </Form.Item>
          </Space>

          <Form.Item label="หมายเหตุ" name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
