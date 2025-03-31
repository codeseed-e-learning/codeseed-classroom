import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';

const ResumeBuilder = () => {
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [experiences, setExperiences] = useState([{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }]);
    const [educations, setEducations] = useState([{ degree: '', college: '', startDate: '', endDate: '' }]);
    const [academicDetails, setAcademicDetails] = useState([{ subject: '', institution: '', year: '' }]);

    const resumeRef = useRef<HTMLDivElement>(null); // Reference to the resume preview

    const addExperience = () => {
        setExperiences([...experiences, { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }]);
    };

    const addEducation = () => {
        setEducations([...educations, { degree: '', college: '', startDate: '', endDate: '' }]);
    };

    const addAcademicDetail = () => {
        setAcademicDetails([...academicDetails, { subject: '', institution: '', year: '' }]);
    };

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const updatedExperiences = experiences.map((exp, i) =>
            i === index ? { ...exp, [field]: value } : exp
        );
        setExperiences(updatedExperiences);
    };

    const handleEducationChange = (index: number, field: string, value: string) => {
        const updatedEducations = educations.map((edu, i) =>
            i === index ? { ...edu, [field]: value } : edu
        );
        setEducations(updatedEducations);
    };

    const handleAcademicChange = (index: number, field: string, value: string) => {
        const updatedAcademics = academicDetails.map((acad, i) =>
            i === index ? { ...acad, [field]: value } : acad
        );
        setAcademicDetails(updatedAcademics);
    };

    const calculateDuration = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return '';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const years = end.getFullYear() - start.getFullYear();
        const months = end.getMonth() - start.getMonth();
        const totalMonths = years * 12 + months;

        if (totalMonths < 0) return '0 years';
        const displayYears = Math.floor(totalMonths / 12);
        const displayMonths = totalMonths % 12;

        return `${displayYears} year${displayYears !== 1 ? 's' : ''}${displayMonths > 0 ? ` and ${displayMonths} month${displayMonths !== 1 ? 's' : ''}` : ''}`;
    };



    const downloadResume = async () => {
        const element = document.getElementById("resume"); // Get the element by ID
        if (element) {
            const canvas = await html2canvas(element, {
                scale: 4, // Increase scale for higher quality
                useCORS: true // Enable cross-origin image loading if needed
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('resume.pdf');
        }
    };


    const [certifications, setCertifications] = useState('');
    const [skills, setSkills] = useState('');
    const [profileSummary, setProfileSummary] = useState('');

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row p-6 bg-gray-50">
                {/* Left Sidebar */}
                <div className="w-full md:w-1/3 p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">Resume Builder</h2>

                    {/* Personal Information */}
                    <div className="mb-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Personal Information</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 border rounded mb-2"
                            value={personalInfo.name}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border rounded mb-2"
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full p-2 border rounded mb-2"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            className="w-full p-2 border rounded mb-2"
                            value={personalInfo.address}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                        />
                    </div>

                    {/* Experience */}
                    <div className="mb-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Experience</h3>
                        {experiences.map((experience, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Job Title"
                                    className="w-full p-2 border rounded mb-1"
                                    value={experience.jobTitle}
                                    onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className="w-full p-2 border rounded mb-1"
                                    value={experience.company}
                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded mb-1"
                                    value={experience.startDate}
                                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded mb-1"
                                    value={experience.endDate}
                                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                />
                                <textarea
                                    placeholder="Description"
                                    className="w-full p-2 border rounded mb-1"
                                    value={experience.description}
                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                />
                                <p className="text-gray-600">
                                    Duration: {calculateDuration(experience.startDate, experience.endDate)}
                                </p>
                            </div>
                        ))}
                        <button type="button" onClick={addExperience} className="text-blue-500 hover:underline">Add Experience</button>
                    </div>

                    {/* Education */}
                    <div className="mb-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Education</h3>
                        {educations.map((education, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    className="w-full p-2 border rounded mb-1"
                                    value={education.degree}
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="College"
                                    className="w-full p-2 border rounded mb-1"
                                    value={education.college}
                                    onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded mb-1"
                                    value={education.startDate}
                                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded mb-1"
                                    value={education.endDate}
                                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                />
                                <p className="text-gray-600">
                                    Duration: {calculateDuration(education.startDate, education.endDate)}
                                </p>
                            </div>
                        ))}
                        <button type="button" onClick={addEducation} className="text-blue-500 hover:underline">Add Education</button>
                    </div>

                    {/* Academic Details */}
                    <div className="mb-4 p-4 border rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Academic Details</h3>
                        {academicDetails.map((academic, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full p-2 border rounded mb-1"
                                    value={academic.subject}
                                    onChange={(e) => handleAcademicChange(index, 'subject', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    className="w-full p-2 border rounded mb-1"
                                    value={academic.institution}
                                    onChange={(e) => handleAcademicChange(index, 'institution', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    className="w-full p-2 border rounded mb-1"
                                    value={academic.year}
                                    onChange={(e) => handleAcademicChange(index, 'year', e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addAcademicDetail} className="text-blue-500 hover:underline">Add Academic Detail</button>
                    </div>

                    {/* Certifications */}
                    <div className="mb-4">
                        <h3 className="font-semibold">Certifications</h3>
                        <input
                            type="text"
                            placeholder="Certifications"
                            className="w-full p-2 border rounded mb-2"
                            value={certifications}
                            onChange={(e) => setCertifications(e.target.value)}
                        />
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                        <h3 className="font-semibold">Skillset</h3>
                        <input
                            type="text"
                            placeholder="Skills (comma separated)"
                            className="w-full p-2 border rounded mb-2"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>

                    {/* Profile Summary */}
                    <div className="mb-4">
                        <h3 className="font-semibold">Profile Summary</h3>
                        <textarea
                            placeholder="Profile Summary"
                            className="w-full p-2 border rounded mb-2"
                            value={profileSummary}
                            onChange={(e) => setProfileSummary(e.target.value)}
                        />
                    </div>

                    {/* Download Button */}
                    <div className="text-center">
                        <button onClick={downloadResume} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Download Resume as PDF
                        </button>
                    </div>
                </div>

                {/* Right Side - Resume Preview */}
                <div className="w-full md:w-2/3 p-6 bg-gradient-to-br from-gray-100 to-white border-l shadow-lg rounded-lg" >
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                        Resume Preview
                    </h2>

                    <div className="border p-6 rounded-lg shadow-xl bg-white" id="resume" ref={resumeRef}>
                        {/* Personal Info */}
                        <h3 className="text-2xl font-bold text-blue-600 items-center gap-2 text-center">
                            {personalInfo.name || 'Your Name'}
                        </h3>
                        <div className="mb-6 flex justify-center items-start">
                            <p className="text-gray-600"><i className="fas fa-envelope text-gray-500"></i> {personalInfo.email || 'Your Email'}</p>
                            <p className="text-gray-600"><i className="fas fa-phone-alt text-gray-500"></i> {personalInfo.phone || 'Your Phone'}</p>
                            <p className="text-gray-600"><i className="fas fa-map-marker-alt text-gray-500"></i> {personalInfo.address || 'Your Address'}</p>
                        </div>

                        {/* Experience */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-briefcase text-yellow-500"></i> Experience
                            </h4>
                            {experiences.map((experience, index) => (
                                <div key={index}>
                                    <p className="text-gray-700">{experience.jobTitle || 'Job Title'} at {experience.company || 'Company'} ({calculateDuration(experience.startDate, experience.endDate)})</p>
                                    <p className="text-gray-600 italic">{experience.description || 'Description'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-graduation-cap text-green-500"></i> Education
                            </h4>
                            {educations.map((education, index) => (
                                <div key={index}>
                                    <p className="text-gray-700">{education.degree || 'Degree'} from {education.college || 'College'} ({calculateDuration(education.startDate, education.endDate)})</p>
                                </div>
                            ))}
                        </div>

                        {/* Academic Details */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-book text-purple-500"></i> Academic Details
                            </h4>
                            {academicDetails.map((academic, index) => (
                                <div key={index}>
                                    <p className="text-gray-700">{academic.subject || 'Subject'} at {academic.institution || 'Institution'} ({academic.year || 'Year'})</p>
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-certificate text-purple-500"></i> Certifications
                            </h4>
                            <p className="text-gray-700">{certifications || 'Your Certifications'}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-tools text-red-500"></i> Skills
                            </h4>
                            <p className="text-gray-700">{skills || 'Your Skills'}</p>
                        </div>

                        {/* Profile Summary */}
                        <div className="mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <i className="fas fa-user-tie text-indigo-500"></i> Profile Summary
                            </h4>
                            <p className="text-gray-700">{profileSummary || 'Your Profile Summary'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeBuilder;