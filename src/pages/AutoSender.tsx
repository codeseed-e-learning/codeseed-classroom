import React, { useState } from 'react';
import { read, utils } from 'xlsx';

// Define TypeScript interfaces for better type safety
interface UserData {
  your_name: string;
  your_degree: string;
  your_university: string;
  experience_years: string;
  recent_project: string;
  phone_number: string;
  email_address: string;
  linkedin_profile: string;
}

interface JobData {
  company_name?: string;
  hiring_person?: string;
  skillset?: string;
  job_board?: string;
  company_values?: string;
}

interface Email {
  subject: string;
  body: string;
}

const AutoSender: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [userData, setUserData] = useState<UserData>({
    your_name: 'John Doe',
    your_degree: 'BSc Computer Science',
    your_university: 'Tech University',
    experience_years: '3',
    recent_project: 'AI-Powered Analytics Platform',
    phone_number: '(555) 123-4567',
    email_address: 'john.doe@email.com',
    linkedin_profile: 'linkedin.com/in/johndoe'
  });

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      const generatedEmails = jsonData.map((row: any) => generateEmail(row));
      setEmails(generatedEmails);
    }
  };

  // Function to generate email content
  const generateEmail = (row: any): Email => {
    return {
      subject: `Application for Software Engineer Position – ${userData.your_name}`,
      body: `Dear ${row.hiring_person || 'Hiring Manager'},

I hope this email finds you well. I am writing to express my interest in the Software Engineer position at ${row.company_name}, as advertised on ${row.job_board || 'your platform'}. With a strong background in ${row.skillset}, I am excited about the opportunity to contribute to your team.

I hold a ${userData.your_degree} from ${userData.your_university} and have ${userData.experience_years} years of experience in developing scalable applications, optimizing code efficiency, and collaborating with cross-functional teams. My recent project, ${userData.recent_project}, demonstrates my ability to solve complex problems and deliver user-friendly solutions.

I am particularly drawn to ${row.company_name} because of its commitment to ${row.company_values || 'innovation and excellence'}. I would welcome the opportunity to discuss how my skills align with your needs. Please find my resume attached for your review.

Thank you for your time and consideration. I look forward to the possibility of contributing to your team. Please feel free to contact me at ${userData.phone_number} or ${userData.email_address} at your convenience.

Best regards,  
${userData.your_name}  
${userData.linkedin_profile}  
${userData.phone_number}  
${userData.email_address}`
    };
  };

  // Sample CSV data
  const dummyCSV = `company_name,hiring_person,skillset,job_board,company_values
TechCorp,Sarah Johnson,"Python, JavaScript, React",Indeed.com,"Innovative AI solutions"
DataWorks,Michael Chen,"Java, Big Data, SQL",LinkedIn,"Data-driven decision making"
CloudNet,,AWS, Node.js,,"Cloud infrastructure excellence"`;

  // Function to trigger CSV download
  const downloadDummyCSV = () => {
    const blob = new Blob([dummyCSV], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'job_applications_sample.csv';
    link.click();
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Auto Email Sender</h2>
      
      <div className="mb-6">
        <input 
          type="file" 
          accept=".xlsx,.csv" 
          onChange={handleFileUpload} 
          className="border rounded p-2 w-full mb-4"
        />
        <button 
          onClick={downloadDummyCSV} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Download Sample CSV
        </button>
      </div>

      <div className="email-preview">
        {emails.map((email, index) => (
          <div key={index} className="email-card border rounded-lg p-4 mb-4 shadow-md bg-white">
            <h3 className="text-xl font-semibold">{email.subject}</h3>
            <pre className="whitespace-pre-wrap text-gray-700">{email.body}</pre>
            <button 
              onClick={() => navigator.clipboard.writeText(email.body)} 
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
            >
              Copy Email
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoSender;
