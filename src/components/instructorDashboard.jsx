import { Card, Table } from 'antd';
import { DollarSign, Users } from 'lucide-react';
import React from 'react';

const InstructorDashboard = ({ totalStudents, totalRevenue, coursesData }) => {

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${totalRevenue}`  
    },
  ];

  const studentData = coursesData.flatMap(course => 
    course.studentDetails.map(student => ({
      studentName: student.studentName,
      studentEmail: student.studentEmail,
      courseName: course.name, 
    }))
  );

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Student Email',
      dataIndex: 'studentEmail',
      key: 'studentEmail',
    },
  ];

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {config.map((item, idx) => (
          <Card key={idx}>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h1 className='font-medium text-sm'>
                {item.label}
              </h1>
              <item.icon className='h-4 w-4' />
            </div>
            <div className="text-2xl font-bold">
              {item.value}
            </div>
          </Card>
        ))}
      </div>

      <Card title="Students List">
        <div className='overflow-x-auto'>
          <Table
            className='w-full'
            dataSource={studentData}
            columns={columns}
            pagination={false}
            rowKey="key"

          />
        </div>
      </Card>
    </>
  );
};

export default InstructorDashboard;
