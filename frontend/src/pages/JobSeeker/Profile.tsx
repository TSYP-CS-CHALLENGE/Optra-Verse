import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Shield,
  Briefcase,
  Globe,
  FileText,
  Download,
  Trash2,
  Building,
  Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { updateProfile, getCurrentUser } from "@/services/auth/auth_service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/utils";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showResumeUpdate, setShowResumeUpdate] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    cin: user?.cin || "",
    company: user?.company || "",
    position: user?.position || "",
    industry: user?.industry || "",
    website: user?.website || ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        prenom: user.prenom || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        cin: user.cin || "",
        company: user.company || "",
        position: user.position || "",
        industry: user.industry || "",
        website: user.website || ""
      });
      setProfileImagePreview(user.profile_picture || "");
      setResumeFileName(user.resume || "");
    }
  }, [user]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        alert('Please upload a valid resume file (PDF, DOC, DOCX, TXT)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 2024) {
        alert('File size should be less than 5MB');
        return;
      }

      setResumeFile(file);
      setResumeFileName(file.name);
      setShowResumeUpdate(false);
    }
  };

  const removeResume = (e: React.MouseEvent<HTMLButtonElement>) => {
    setResumeFile(null);
    setResumeFileName("");
    handleSubmit(e);
  };

  const updateResume = () => {
    setShowResumeUpdate(true);
    setResumeFile(null);
  };

  const cancelResumeUpdate = () => {
    setShowResumeUpdate(false);
    setResumeFile(null);
    setResumeFileName(user?.resume || "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProfileStrength = () => {
    let strength = 0;
    const baseFields = [
      formData.name,
      formData.prenom,
      formData.email,
      formData.phone,
      formData.address,
      formData.cin,
      profileImagePreview
    ];

    // Job seekers need resume, recruiters need company info
    if (user?.role === 'jobseeker') {
      baseFields.push(resumeFileName);
    } else if (user?.role === 'recruiter') {
      baseFields.push(formData.company, formData.position);
    }

    const filledFields = baseFields.filter(field => field && field.trim() !== "").length;
    strength = Math.min((filledFields / baseFields.length) * 100, 100);
    return Math.round(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      // Append profile image if changed
      if (profileImage) {
        submitData.append('profile_picture', profileImage);
      }

      // Append resume if changed
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      } else if (resumeFileName === "" && user?.resume) {
        // If resume is removed, send empty string to delete it
        submitData.append('resume', '');
      }

      const updatedUser = await updateProfile(submitData);
      updateUser(updatedUser);

    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const profileStrength = calculateProfileStrength();
  const isJobSeeker = user?.role === 'jobseeker';
  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-orange-950/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your personal information and preferences
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    {/* Profile Image */}
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                        <AvatarImage src={getImageUrl(user?.profile_picture)} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-blue-600 text-white text-2xl">
                          {user?.prenom?.[0]}{user?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {user?.prenom} {user?.name}
                    </h2>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 capitalize">
                      {user?.role}
                    </Badge>
                  </div>

                  {isJobSeeker && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Resume
                      </h4>
                      {user.resume != null && !showResumeUpdate ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                {user.resume.split('/').pop()?.slice(0, 5).concat("..")}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(getImageUrl(user.resume), '_blank')}
                                className="h-8 w-8 text-blue-500 hover:text-blue-600"
                                title="View Resume"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(getImageUrl(user.resume), '_blank')}
                                className="h-8 w-8 text-green-500 hover:text-green-600"
                                title="Download Resume"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={updateResume}
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                            >
                              Update Resume
                            </Button>

                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Resume upload area */}
                          <label htmlFor="resume-upload" className="block">
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
                              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {user.resume != null ? 'Upload New Resume' : 'Upload Resume'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                PDF, DOC, DOCX, TXT (Max 5MB)
                              </p>
                            </div>
                            <input
                              id="resume-upload"
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleResumeChange}
                              className="hidden"
                            />
                          </label>

                          {/* Show selected file name */}
                          {resumeFileName && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-700 dark:text-blue-300 truncate">
                                  {resumeFileName}
                                </span>
                              </div>
                            
                            </div>
                          )}

                          {showResumeUpdate && (
                            <Button
                              onClick={cancelResumeUpdate}
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                            >
                              Cancel Update
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profile Strength */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Profile Strength
                      </span>
                      <span className="text-sm font-bold text-orange-500">
                        {profileStrength}%
                      </span>
                    </div>
                    <Progress value={profileStrength} className="h-2 bg-slate-200 dark:bg-slate-700" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Complete your profile to increase your chances
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-500" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Email Verified</span>
                    {
                      user?.email_verified_at ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                          Not Yet
                        </Badge>
                      )
                    }
                  </div>

                  <Button variant="outline" className="w-full rounded-xl">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white text-2xl flex items-center">
                    <User className="w-6 h-6 mr-3 text-orange-500" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Basic Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="text-sm font-medium">
                            First Name *
                          </Label>
                          <Input
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className="rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Last Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className="rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="rounded-xl"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cin" className="text-sm font-medium">
                          CIN/Identification
                        </Label>
                        <Input
                          id="cin"
                          name="cin"
                          value={formData.cin}
                          onChange={handleInputChange}
                          placeholder="Enter your CIN number"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your full address"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Professional Information Section - Only for Recruiters */}
                    {isRecruiter && (
                      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                          <Building className="w-5 h-5 mr-2 text-green-500" />
                          Company Information
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-sm font-medium">
                            Company Name *
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Enter your company name"
                            className="rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-sm font-medium">
                            Your Position *
                          </Label>
                          <Input
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            placeholder="Enter your job position"
                            className="rounded-xl"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="industry" className="text-sm font-medium">
                            Industry
                          </Label>
                          <Input
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="Enter your industry"
                            className="rounded-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-sm font-medium flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Company Website
                          </Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-8 py-3 shadow-lg transition-all duration-300 hover:shadow-xl flex-1"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="rounded-xl px-8 py-3 border-2 flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}