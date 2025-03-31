import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  college: string;
  degree: string;
  branch: string;
  studyYear: string;
  passingYear: string;
  joined: string;
}

const getProfilePictureUrl = (userId: string | undefined) => {
  if (!userId) return null; // Return null if userId is not available
  // return `https://bzidfiotgcwqyggeltei.supabase.co/storage/v1/storage/buckets/profile/${userId}/profile/_MG_2464 c.jpg`;
  return "https://bzidfiotgcwqyggeltei.supabase.co/storage/v1/object/public/profile/8a5dd0ce-e763-42de-b369-44ee75e775b4/profile_picture/unnamed.png"
  /**
   * 
   * https://bzidfiotgcwqyggeltei.supabase.co/storage/v1/object/public/profile/8a5dd0ce-e763-42de-b369-44ee75e775b4/profile_picture/unnamed.png
   */
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'courses'>('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    college: '',
    degree: '',
    branch: '',
    studyYear: '',
    passingYear: '',
    joined: '',
  });
  const [user, setUser] = useState<User | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null); // To hold fetched profile data
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  // Calculate completion percentage
  const filledFields = Object.values(personalInfo).filter((val) => val.toString().trim() !== '').length;
  const totalFields = Object.keys(personalInfo).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user);
        setPersonalInfo({
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          address: '',
          college: '',
          degree: '',
          branch: '',
          studyYear: '',
          passingYear: '',
          joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
        const profilePicUrl = getProfilePictureUrl(user.id);
        setProfilePictureUrl(profilePicUrl);
        await fetchProfileData(user.id); // Fetch profile data
      }
    };

    fetchUser();
  }, []);

  const fetchProfileData = async (userId: string) => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .single(); // Fetch single profile data

    if (error) {
      console.error('Error fetching profile data:', error);
    } else {
      setProfileData(data);
      setPersonalInfo((prev) => ({
        ...prev,
        college: data.college_name,
        degree: data.degree,
        studyYear: data.year_of_studying,
        passingYear: data.year_of_passing,
      }));
      // Update profile picture URL if it exists in the fetched data
      if (data.profile_picture) {
        setProfilePictureUrl(data.profile_picture);
      }
    }
  };

  const handleSave = async () => {
    const displayName = `${personalInfo.firstName} ${personalInfo.lastName}`;
    const userId = user?.id;

    // Prepare the data for upsert
    const profileData = {
      id: userId,
      college_name: personalInfo.college,
      year_of_studying: personalInfo.studyYear ? parseInt(personalInfo.studyYear) : null, // Convert to integer or set to null
      degree: personalInfo.degree,
      year_of_passing: personalInfo.passingYear ? parseInt(personalInfo.passingYear) : null, // Convert to integer or set to null
      profile_picture: profilePictureUrl,
      created_at: new Date().toISOString(),
      phone: personalInfo.phone,
      firstname: personalInfo.firstName,
      lastname: personalInfo.lastName,
    };

    // Insert or update user profile in the database
    const { error } = await supabase
      .from('profile')
      .upsert(profileData);

    if (error) {
      console.error('Error saving profile data:', error);
      return;
    }

    // Update user metadata in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: displayName, phone: personalInfo.phone, profile_picture: profilePictureUrl },
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return;
    }

    // Set success message
    setSuccessMessage('Profile updated successfully!');

    // Optionally, clear the message after a few seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000); // Clear message after 3 seconds

    console.log('Profile data saved successfully!');
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = `${user?.id}/profile_picture/${file.name}`;
      const { error: uploadError } = await supabase.storage.from('profile').upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return;
      }

      const { publicURL, error: urlError } = supabase.storage.from('profile').getPublicUrl(fileName);
      if (urlError) {
        console.error('Error getting public URL:', urlError);
        return;
      }

      setProfilePictureUrl(publicURL);
      console.log('Profile picture uploaded successfully!');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Display success message */}

          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-black-400 p-8 mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profilePictureUrl || "/images/notfound.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-1">
                  {user?.user_metadata?.full_name || user?.email || 'Loading...'}
                </h1>
                <p className="text-lg text-gray-600">{personalInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-2">
            <button
              className={`py-2 px-4 ${activeTab === 'personal' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'courses' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('courses')}
            >
              My Courses
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'personal' ? (
              <>
                {/* Completion Circle */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Personal Info</h2>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle
                        className="text-gray-300"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="4"
                        strokeDasharray={`${completionPercentage}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>

                {/* Personal Info Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                      <div>
                        <label className="text-gray-600 text-sm">First Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm">Last Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm">Address</label>
                        <textarea
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.address}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Academic Information</h3>
                      <div>
                        <label className="text-gray-600 text-sm">College Name</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.college}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, college: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm">Degree</label>
                        <select
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.degree}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, degree: e.target.value })}
                        >
                          <option value="">Select Degree</option>
                          <option value="B.Tech">Bachelor of Technology</option>
                          <option value="B.Sc">Bachelor of Science</option>
                          <option value="B.Com">Bachelor of Commerce</option>
                          <option value="B.A">Bachelor of Arts</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-600 text-sm">Branch/Stream</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={personalInfo.branch}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, branch: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-600 text-sm">Year of Study</label>
                          <select
                            className="w-full p-2 border rounded-lg"
                            value={personalInfo.studyYear}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, studyYear: e.target.value })}
                          >
                            <option value="">Select Year</option>
                            <option value="1">First Year</option>
                            <option value="2">Second Year</option>
                            <option value="3">Third Year</option>
                            <option value="4">Fourth Year</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm">Year of Passing</label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded-lg"
                            value={personalInfo.passingYear}
                            onChange={(e) => setPersonalInfo({ ...personalInfo, passingYear: e.target.value })}
                            min="2000"
                            max="2030"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Save Changes
                  </button>
                </form>
                {successMessage && (
                  <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
                    {successMessage}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
                <ul className="space-y-4">
                  <li className="p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">React Basics</h3>
                    <p className="text-gray-600 text-sm">Enrolled on March 5, 2024</p>
                  </li>
                  <li className="p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Advanced JavaScript</h3>
                    <p className="text-gray-600 text-sm">Enrolled on February 20, 2024</p>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;