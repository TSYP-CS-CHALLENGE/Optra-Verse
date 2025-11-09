import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone, IdCard, Briefcase, Search, Building, AlertCircle } from "lucide-react";
import logo from "../assets/images/logo.png";
import InstallPrompt from "@/components/ui/utils/InstallPrompt";

export default function HomeScreen() {
    const [showLogin, setShowLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'recruiter' | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        prenom: '',
        email: '',
        password: '',
        cin: '',
        phone: '',
        address: '',
        company: '',
        position: '',
        resume: null as File | null,
        companyLogo: null as File | null,
        website: '',
        industry: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [backendError, setBackendError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const validateCIN = (cin: string) => {
        return cin.length >= 6;
    };

    const validateRequired = (value: string) => {
        return value.trim().length > 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (backendError) {
            setBackendError('');
        }
    };

    const handleFileChange = (field: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateLoginForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegistrationForm = () => {
        const newErrors: Record<string, string> = {};

        if (!validateRequired(formData.name)) newErrors.name = 'First name is required';
        if (!validateRequired(formData.prenom)) newErrors.prenom = 'Last name is required';
        if (!validateRequired(formData.email)) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!validateRequired(formData.password)) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!validateRequired(formData.phone)) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid 8-digit phone number';
        }

        if (selectedRole === 'jobseeker') {
            if (!validateRequired(formData.cin)) {
                newErrors.cin = 'CIN is required';
            } else if (!validateCIN(formData.cin)) {
                newErrors.cin = 'CIN must be at least 6 characters';
            }
            if (!formData.resume) {
                newErrors.resume = 'Resume is required';
            }
        }

        if (selectedRole === 'recruiter') {
            if (!validateRequired(formData.company)) newErrors.company = 'Company name is required';
            if (!validateRequired(formData.position)) newErrors.position = 'Your position is required';
            if (!validateRequired(formData.industry)) newErrors.industry = 'Industry is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');

        if (validateLoginForm()) {
            setLoading(true);
            try {
                console.log("Login logic here");
                // Add your login API call here
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.response) {
                    const errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        'Login error';
                    setBackendError(errorMessage);

                    if (error.response.data?.errors) {
                        const fieldErrors = error.response.data.errors;
                        setErrors(fieldErrors);
                    }
                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setBackendError('');

        if (validateRegistrationForm()) {
            setLoading(true);
            try {
                const userRegister = new FormData();
                userRegister.append('name', formData.name);
                userRegister.append('prenom', formData.prenom);
                userRegister.append('email', formData.email);
                userRegister.append('password', formData.password);
                userRegister.append('role', selectedRole || '');
                userRegister.append('phone', formData.phone);

                if (selectedRole === 'jobseeker') {
                    userRegister.append('cin', formData.cin);
                    if (formData.resume) {
                        userRegister.append('resume', formData.resume);
                    }
                }

                if (selectedRole === 'recruiter') {
                    userRegister.append('company', formData.company);
                    userRegister.append('position', formData.position);
                    userRegister.append('industry', formData.industry);
                    userRegister.append('website', formData.website);
                    if (formData.companyLogo) {
                        userRegister.append('company_logo', formData.companyLogo);
                    }
                }

                console.log("Registration logic here");
                // Add your registration API call here
                
            } catch (error: any) {
                console.error('Registration error:', error);
                if (error.response) {
                    const errorData = error.response.data;
                    const errorMessage = errorData?.message ||
                        errorData?.error ||
                        "Registration error";
                    setBackendError(errorMessage);

                    if (errorData.errors) {
                        const fieldErrors: Record<string, string> = {};
                        Object.keys(errorData.errors).forEach(field => {
                            const fieldName = field === 'company_logo' ? 'companyLogo' : field;
                            fieldErrors[fieldName] = errorData.errors[field][0];
                        });
                        setErrors(fieldErrors);
                    }

                    if (errorMessage.includes('email') || errorMessage.includes('Email')) {
                        setErrors(prev => ({ ...prev, email: 'This email is already used' }));
                    }
                    if (errorMessage.includes('cin') || errorMessage.includes('CIN')) {
                        setErrors(prev => ({ ...prev, cin: 'This CIN is already used' }));
                    }

                } else if (error.request) {
                    setBackendError('Network error. Please check your connection.');
                } else {
                    setBackendError("An unexpected error occurred during registration.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            prenom: '',
            email: '',
            password: '',
            cin: '',
            phone: '',
            address: '',
            company: '',
            position: '',
            resume: null,
            companyLogo: null,
            website: '',
            industry: '',
        });
        setErrors({});
        setBackendError('');
        setSelectedRole(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
           <InstallPrompt />
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-linear-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-linear-to-r from-blue-200/20 to-slate-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-indigo-100/10 to-blue-100/10 rounded-full blur-2xl" />
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <div className={`w-full max-w-md transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto bg-linear-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-105">
                                <img
                                    src={logo}
                                    alt="CareerHub Logo"
                                    className="w-20 h-20 object-contain filter brightness-0 invert"
                                />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent mb-3">
                            Career<span className="font-light">Hub</span>
                        </h1>
                        <p className="text-gray-600 text-lg font-light">
                            Find your dream job or perfect candidate
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-6">

                        {/* Toggle Switch */}
                        <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
                            <button
                                onClick={() => { setShowLogin(true); resetForm(); }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${showLogin
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setShowLogin(false); resetForm(); }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${!showLogin
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Backend Error/Success Message */}
                        {backendError && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
                                backendError.includes('success') 
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                <AlertCircle className={`w-5 h-5 shrink-0 ${
                                    backendError.includes('success') ? 'text-green-500' : 'text-red-500'
                                    }`} />
                                <p className="text-sm font-medium">{backendError}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        {showLogin ? (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className={`w-full pl-12 pr-12 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right">
                                    <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            /* Registration Flow */
                            <div className="space-y-6">
                                {/* Role Selection */}
                                {!selectedRole ? (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Choose Your Role</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <button
                                                onClick={() => setSelectedRole('jobseeker')}
                                                className="p-4 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Search className="w-8 h-8 text-green-600" />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Job Seeker</h4>
                                                        <p className="text-sm text-gray-600">Find your dream job and apply</p>
                                                    </div>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setSelectedRole('recruiter')}
                                                className="p-4 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Building className="w-8 h-8 text-blue-600" />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Recruiter</h4>
                                                        <p className="text-sm text-gray-600">Post jobs and find talent</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Registration Form */
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedRole(null)}
                                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                <ArrowRight className="w-5 h-5 transform rotate-180" />
                                            </button>
                                            <span className="text-sm font-medium text-gray-600 capitalize">{selectedRole} Registration</span>
                                        </div>

                                        {/* Common Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                        }`}
                                                />
                                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={formData.prenom}
                                                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                        errors.prenom ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                        }`}
                                                />
                                                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                    }`}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create password"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                    }`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>

                                        {/* Job Seeker Specific Fields */}
                                        {selectedRole === 'jobseeker' && (
                                            <>
                                                <div className="relative">
                                                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        placeholder="CIN"
                                                        value={formData.cin}
                                                        onChange={(e) => handleInputChange('cin', e.target.value)}
                                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                            errors.cin ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                            }`}
                                                    />
                                                    {errors.cin && <p className="text-red-500 text-sm mt-1">{errors.cin}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Resume *</label>
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={(e) => handleFileChange('resume', e.target.files?.[0] || null)}
                                                        />
                                                        <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-600">Upload your resume (PDF, DOC, DOCX)</span>
                                                        {formData.resume && (
                                                            <span className="text-xs text-indigo-600 mt-1">{formData.resume.name}</span>
                                                        )}
                                                    </label>
                                                    {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                                                </div>
                                            </>
                                        )}

                                        {/* Recruiter Specific Fields */}
                                        {selectedRole === 'recruiter' && (
                                            <>
                                                <div className="relative">
                                                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="text"
                                                        placeholder="Company Name"
                                                        value={formData.company}
                                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                            errors.company ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                            }`}
                                                    />
                                                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Your Position"
                                                            value={formData.position}
                                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                                errors.position ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                                }`}
                                                        />
                                                        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Industry"
                                                            value={formData.industry}
                                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                                            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${
                                                                errors.industry ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                                                                }`}
                                                        />
                                                        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                    <input
                                                        type="url"
                                                        placeholder="Company Website (optional)"
                                                        value={formData.website}
                                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Company Logo (optional)</label>
                                                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors">
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileChange('companyLogo', e.target.files?.[0] || null)}
                                                        />
                                                        <Building className="w-6 h-6 text-gray-400 mb-1" />
                                                        <span className="text-xs text-gray-600">Upload company logo</span>
                                                        {formData.companyLogo && (
                                                            <span className="text-xs text-indigo-600 mt-1">{formData.companyLogo.name}</span>
                                                        )}
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        {/* Terms Agreement */}
                                        <div className="text-center text-sm text-gray-600">
                                            By registering, you agree to our{" "}
                                            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                                Terms
                                            </button>{" "}
                                            and{" "}
                                            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                                Privacy Policy
                                            </button>
                                        </div>

                                        {/* Register Button */}
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    <span>Registering...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span>Create {selectedRole} Account</span>
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            {showLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setShowLogin(!showLogin); resetForm(); }}
                                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                {showLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}