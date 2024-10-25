import React, { useContext} from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import 'antd/dist/reset.css'; 
import 'tailwindcss/tailwind.css'; 
import { CourseContext } from '../../context/course-context';
import { languageOptions } from '../../config';

const { TextArea } = Input;
const { Option } = Select;

const CourseLandingPage = () => {
  const [form] = Form.useForm();

  const { courseLandingData ,
    setCourseLandingData } = useContext(CourseContext)

  const onFinish = (values) => {
    setCourseLandingData({...values})
    message.success("Set course image in settings")
  };

  return (
    <div className="max-w-9xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 ">Create a Course</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={courseLandingData}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <Form.Item
          label="Course Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the course title' }]}
        >
          <Input placeholder="Enter course title" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Option value="programming">Programming</Option>
            <Option value="design">Design</Option>
            <Option value="marketing">Marketing</Option>
            <Option value="business">Business</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[{ required: true, message: 'Please select the level' }]}
        >
          <Select placeholder="Select a level">
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select>
        </Form.Item>

            <Form.Item
                label="Primary Language"
                name="primaryLanguage"
                rules={[{ required: true, message: 'Please select the primary language' }]}
              >
                <Select placeholder="Select primary language">
                  {languageOptions?.map(language => (
                    <Select.Option key={language.id} value={language.id}>
                      {language.label}
                    </Select.Option>
                  ))}
                </Select>
            </Form.Item>

        <Form.Item
          label="Subtitle"
          name="subtitle"
        >
          <Input placeholder="Enter a subtitle" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Form.Item
          label="Pricing"
          name="pricing"
          rules={[{ required: true, message: 'Please enter the pricing' }]}
        >
          <Input placeholder="Enter pricing" />
        </Form.Item>

       
        <Form.Item
          label="Objectives"
          name="objectives"
        >
          <TextArea rows={3} placeholder="Enter course objectives" />
        </Form.Item>

       
        <Form.Item
          label="Welcome Message"
          name="welcomeMessage"
        >
          <TextArea rows={2} placeholder="Enter welcome message" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CourseLandingPage;
