import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Form, Typography, DatePicker, Select, Spin, message } from 'antd';
import Password from 'antd/es/input/Password';
import { getDepartments } from '../DB/getDepartments';
import { createUser } from '../DB/createUser';
import dayjs from 'dayjs';
import {FaCalendarAlt} from 'react-icons/fa';
import { FaTransgender, FaSchool, FaIdCard } from 'react-icons/fa6';
import { MdLockOutline, MdMailOutline, MdSubject } from 'react-icons/md';
import { TiUserOutline } from 'react-icons/ti';

const { Title } = Typography;
const { Option } = Select;

const StudentRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [tempData, setTempData] = useState<any>(null);
  const [deptType, setDeptType] = useState<string>();
  const deptTypeList = ["UG Aided", "UG Self Financed", "PG Aided", "PG Self Financed"];
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Replace with your actual API endpoint to fetch departments from your database
    const fetchDepartments = async () => {
      const data = await getDepartments();
      setTempData(data);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (tempData) {
      Object.entries(tempData).forEach(([key, value]) => {
        if (deptType?.startsWith(key)) {
          if (value) {
            Object.entries(value).forEach(([key, value]) => {
              if (deptType?.endsWith(key)) {
                setDepartments(value!);
              }
            });
          }
        }
      });
    }
  }, [deptType]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const formattedData = {
      ...values,
      joinedYear: values.joinedYear ? parseInt(values.joinedYear.format('YYYY')) : null,
      dob: values.dob ? values.dob.valueOf() : null,
    };
    await createUser(formattedData, messageApi);
    console.log(formattedData);
    setLoading(false);
    form.resetFields();
  };

  return (
    <div className="flex p-5 justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {contextHolder}
      <Card className="w-full max-w-md p-6 rounded-xl shadow-xl bg-white">
        <Title level={2} className="text-center mb-6 text-indigo-600">Student Registration</Title>

        <Form
          name="student_registration"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          requiredMark={false}
        >
          <Form.Item
            name="rollNo"
            rules={[{ required: true, message: 'Please enter your roll number!' }]}
          >
            <Input 
              prefix={<FaIdCard />} 
              placeholder="Roll Number" 
              size="large" 
              onChange={(e) => {
                form.setFieldsValue({ rollNo: e.target.value.toUpperCase() });
              }}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter the password!' }]}
          >
            <Password 
              prefix={<MdLockOutline />} 
              placeholder="Password" 
              size="large" 
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input 
              onChange={(e) => {
                form.setFieldsValue({ name: e.target.value.toUpperCase() });
              }}
              prefix={<TiUserOutline />} 
              placeholder="Full Name" 
              size="large" 
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="joinedYear"
            rules={[{ required: true, message: 'Please select your joined year!' }]}
          >
            <DatePicker 
              className="w-full" 
              picker="year" 
              placeholder="Joined Year" 
              size="large"
              disabled={loading}
              disabledDate={(current) => current && current > dayjs().endOf('year')}
              prefix={<FaCalendarAlt />}
            />
          </Form.Item>

          <Form.Item
            name="departmentType"
            rules={[{ required: true, message: 'Please select your department type!' }]}
          >
            <Select 
              placeholder="Select Department Type" 
              size="large" 
              onChange={(value) => setDeptType(value)}
              disabled={loading}
              prefix={<FaSchool />}
            >
              {deptTypeList.map((dept, index) => (
                <Option key={index} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            rules={[{ required: true, message: 'Please select your department!' }]}
          >
            <Select 
              placeholder="Select Department" 
              size="large" 
              disabled={loading}
              prefix={<MdSubject />}
            >
              {departments.map((dept, index) => (
                <Option key={index} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input 
              prefix={<MdMailOutline />} 
              placeholder="Email" 
              size="large" 
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="dob"
            rules={[{ required: true, message: 'Please select your date of birth!' }]}
          >
            <DatePicker 
              className="w-full" 
              placeholder="Date of Birth" 
              size="large"
              format={"DD/MM/YYYY"}
              disabled={loading}
              prefix={<FaCalendarAlt />}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: true, message: 'Please select your gender!' }]}
          >
            <Select 
              placeholder="Select Gender" 
              size="large" 
              disabled={loading}
              prefix={<FaTransgender />}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading} 
              block
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              disabled={loading}
            >
              {loading ? <Spin /> : 'Register'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StudentRegistration;
